---
name: hdx-doc-spec-find
description: 专门用于从华为 hdx 产品文档（解压后的 HTML 文件）中提取特定型号设备的规格参数。通过 navi.xml 导航树快速定位设备页面，从 HTML 规格表中精确提取数据，支持模糊匹配、数据类型约束和本地缓存。
---

## 数据源

- **hdx 文档目录**：`/Users/l/L/data/document`
- **HTML 解压目录**：`/Users/l/L/data/document/html`
- hdx 文件本质是 ZIP 格式，解压后包含：
  - `profile.xml` — 文档元数据（产品名、版本、日期等）
  - `resources/navi.xml` — 完整的目录导航树（设备型号 → HTML 文件映射）
  - `resources/*.html` — 约 26,000+ 个 HTML 内容文件
  - `resources/figure/` — 图片资源
  - `resources/index/` — 搜索索引

### HTML 解压规则

每个 hdx 文件解压到独立的子文件夹中：

```
/Users/l/L/data/document/html/
├── S12700, S12700E_V200R025C00_04_zh_AZP09299/
│   ├── profile.xml
│   └── resources/
│       ├── navi.xml
│       ├── dc/chassis_12700e-4.html
│       ├── dc/chassis_12700e-8.html
│       ├── figure/
│       └── ...
└── S7700_V200R025C00_04_zh_AZP0930J/
    ├── profile.xml
    └── resources/
        ├── navi.xml
        └── ...
```

**命名规则**：`html/{hdx文件名去掉.hdx扩展名}/`，保持原文件名（含逗号、空格等）。

### HTML 编码

⚠️ hdx 内的 HTML 文件编码为 **GB18030**（非 UTF-8），读取时必须指定 `encoding='gb18030'`。

### 导航树结构 (navi.xml)

每个节点有 `txt`（标题）和 `url`（HTML 路径）属性。设备规格页面的路径规律：

| 设备类型 | 导航路径 | HTML 文件命名规律 |
|----------|---------|------------------|
| 机框/机箱 | 了解产品 > 硬件描述 > 机框 > {设备型号} | `chassis_{型号小写}.html` |
| 单板 | 了解产品 > 硬件描述 > 单板 > {单板型号} | `s_{单板部件号小写}.html` |
| 光模块 | 了解产品 > 硬件描述 > 光模块 > {型号} | `s_optical_module_{部件号}.html` |
| 电源模块 | 了解产品 > 硬件描述 > 电源模块 > {型号} | `s_power_{部件号}.html` |
| 风扇模块 | 了解产品 > 硬件描述 > 风扇模块 > {型号} | `s_fan_{部件号}.html` |

⚠️ **大小写陷阱**：navi.xml 中记录的 URL 可能包含大写字母（如 `chassis_12700E-4.html`），
但 hdx 内实际文件名可能是小写的（如 `chassis_12700e-4.html`）。
匹配文件时必须做**大小写不敏感**处理。

### HTML 规格表结构

设备规格页面中，规格参数在 `<h4 class="sectiontitle">规格参数</h4>` 标题下，
以 `<table>` 形式呈现，每行格式为：
```html
<tr>
  <td>规格名称</td>
  <td>规格值</td>
</tr>
```

## 输入参数

调用时提供以下信息：

- `device_model` (string, 必填): 设备型号，如 "S12700E-4"、"CE16816"、"LST7MPUE0000"
- `spec_definition` (object, 必填): 键值对，Key 为规格名，Value 为类型
  - `"数值型"` — 提取数值+单位（如 "442mm×517.4mm×441.7mm"）
  - `"字符串型"` — 仅识别 "支持" / "不支持" / "未提及"
  - `"任意型"` — 提取原始文本
- `source_doc` (string, 可选): 指定 hdx 文件名。不指定时自动从目录中查找。
- `force_refresh` (bool, 可选): 强制刷新查询缓存（不影响 HTML 解压目录）

## 执行逻辑

### Step 0: 检查查询缓存（快速路径）

1. 读取本 Skill 目录下的 `cache.jsonl`
2. 缓存键：`device_model` + `spec_definition` 的所有 Key（排序后拼接）
3. 如果缓存命中且 `force_refresh` 不为 true，直接返回缓存结果，**跳过后续所有步骤**

### Step 1: 定位 hdx 文档并确保已解压

1. 如果指定了 `source_doc`，直接使用该文件名
2. 如果未指定，根据 `device_model` 模糊匹配：
   - 提取型号中的产品系列关键词（如 "16816" → "16800"，"12700E" → "S12700E"）
   - 扫描 `/Users/l/L/data/document/` 下所有 `.hdx` 文件的 `profile.xml`
   - 通过 `productType` 或 `libName` 匹配
3. 确定目标 hdx 文件后，计算解压目录路径：

   ```
   解压目录 = /Users/l/L/data/document/html/{hdx文件名去掉.hdx后缀}/
   ```

   例如：
   - `S12700, S12700E_V200R025C00_04_zh_AZP09299.hdx`
     → `/Users/l/L/data/document/html/S12700, S12700E_V200R025C00_04_zh_AZP09299/`
   - `S7700_V200R025C00_04_zh_AZP0930J.hdx`
     → `/Users/l/L/data/document/html/S7700_V200R025C00_04_zh_AZP0930J/`

4. **检查解压目录是否已存在**：
   - 如果 `{解压目录}/resources/navi.xml` 存在 → 已解压，跳到 Step 2
   - 如果不存在 → **执行首次全量解压**：

   ```bash
   mkdir -p "/Users/l/L/data/document/html/{hdx文件名去掉.hdx后缀}"
   unzip -o "/Users/l/L/data/document/{hdx文件名}" -d "/Users/l/L/data/document/html/{hdx文件名去掉.hdx后缀}"
   ```

   ⚠️ 全量解压约 26,000+ 文件，可能需要 10-30 秒。首次解压后，后续查询直接从本地读取，无需重复解压。

### Step 2: 解析 navi.xml 导航树

1. 从 **解压目录** 直接读取 `resources/navi.xml`（不再从 hdx 中解压）
2. 遍历导航树，同时构建：
   - **设备型号 → HTML 文件路径** 的映射表
   - **URL → 侧边栏目录路径** 的映射表（记录从根节点到当前节点的完整面包屑路径）
3. 搜索策略：
   - **精确匹配**：`txt` 完全等于 `device_model`（忽略大小写）
   - **模糊匹配**：`txt` 包含 `device_model` 的关键部分（如 "12700E-4" 匹配 "S12700E-4"）
   - **文件名匹配**：直接在解压目录的 `resources/` 下搜索 `chassis_{device_model_lower}.html` 或 `s_{part_number_lower}.html`（大小写不敏感）
4. **侧边栏目录路径格式**：用 ` > ` 连接从一级目录到叶节点的完整路径，例如：
   - `了解产品 > 硬件描述 > S12700E-4`
   - `配置指南 > 设备管理 > Web网管 > 通过Web网管登录设备`
   - `配置指南 > DHCP > DHCP Snooping配置 > 配置Option82`

⚠️ 遍历 navi.xml 时，每个有 `url` 属性的节点都必须同时记录其 `txt`（当前节点标题）和从根到该节点的完整路径。

### Step 3: 读取目标 HTML

1. 根据映射结果，从 **解压目录** 直接读取 HTML 文件（不再从 hdx 解压到临时目录）
2. 文件路径 = `{解压目录}/resources/{navi.xml中的url}`
3. ⚠️ 由于大小写不一致问题，需要做大小写不敏感的文件查找
4. 读取时使用 `encoding='gb18030'`
5. 定位 `<h4 class="sectiontitle">规格参数</h4>` 下的 `<table>`
6. 解析表格行，构建 **规格名 → 规格值** 的字典

### Step 4: 提取规格值

根据 `spec_definition` 中每个 Key 的类型：
- **数值型**：从表格中查找规格名，提取数值+单位
- **字符串型**：在整个页面文本中搜索关键词（"支持"/"不支持"），判断是否有该特性。
  如果在硬件描述页面未找到，可通过 navi.xml 导航树搜索相关功能描述页面并读取。
  ⚠️ 跨页面查找时，**必须同时记录目标页面在导航树中的侧边栏目录路径**
- **任意型**：从表格中查找规格名，提取原始文本

### Step 5: 位置溯源

每个提取结果必须记录以下字段：
- `source_file`: hdx 文件名
- `html_file`: 具体 HTML 文件路径（相对于解压目录内的 resources/ 路径）
- `navi_path`: 该页面在产品文档侧边栏目录中的完整路径（从 Step 2 的 URL→路径映射中获取）
- `source_context`: 包含该值的**原始段落全文**（不是截断片段），要求：
  - 如果值来自表格：`source_context` = `"表格行原文"`（整行内容）
  - 如果值来自段落/列表：`source_context` = 该段落的完整文本（包含上下文语义）
  - 必须足够详细，让用户能直接定位到文档中的具体段落位置

### Step 6: 写入查询缓存

- 缓存文件：本 Skill 目录下的 `cache.jsonl`
- 格式：每行一个 JSON 对象（append 模式）
- 缓存键：`device_model` + `spec_definition` 的所有 Key

## 输出约束

### JSON 结构

必须返回标准 JSON 结构（用于缓存），JSON 中保留所有详细字段：
```json
{
  "device_name": "S12700E-4",
  "source_file": "S12700, S12700E_V200R025C00_04_zh_AZP09299.hdx",
  "html_file": "resources/dc/chassis_12700e-4.html",
  "doc_version": "V200R025C00",
  "timestamp": "2026-03-30T23:11:00",
  "extractions": [
    {
      "spec_key": "业务板槽位数量",
      "spec_type": "数值型",
      "value": "4",
      "navi_path": "了解产品 > 硬件描述 > 机框 > S12700E-4",
      "source_context": "业务板槽位数量 | 4",
      "found_in_table": true
    }
  ]
}
```

### 用户展示格式

**向用户展示结果时，必须使用以下 5 列 Markdown 表格**（将 JSON 中的 `source_context` 展示在表格中，不要拆成单独的引用块）：

```markdown
| 规格项 | 类型 | 值 | 侧边栏目录路径 | 详细来源段落 |
|--------|------|-----|----------------|-------------|
| 业务板槽位数量 | 数值型 | **4** | 了解产品 > 硬件描述 > 机框 > S12700E-4 | 业务板槽位数量 \| 4 |
| 满配重量(kg) | 数值型 | **66** | 了解产品 > 硬件描述 > 机框 > S12700E-4 | 重量（空配置/满配置） \| 24.5kg/66kg |
| 通过Web进行配置和管理 | 字符串型 | **支持** | 配置 > 配置指南（命令行） > 基础配置 > 登录设备Web网管界面 > 通过Web网管登录设备简介 | Web网管是一种对设备的管理方式，它利用设备内置的Web服务器，为用户提供图形化的操作界面…… |
| DHCP Option82 | 字符串型 | **支持** | 配置 > 配置指南（命令行） > 安全配置 > DHCP Snooping配置 > DHCP Snooping原理描述 > DHCP Snooping支持的Option82功能 | 设备作为DHCP Relay时，使能或未使能DHCP Snooping功能都可支持Option82选项功能…… |
```

表格规则：
- **数值型**的值加粗显示（如 **4**、**66**）
- **字符串型**的「支持」/「不支持」加粗显示
- 「详细来源段落」列放 `source_context` 的完整原文，如果原文太长可适当省略中间部分，但首尾要保留关键信息
- 如果值来自表格（`found_in_table: true`），来源段落放表格行原文
- 如果值来自段落描述（`found_in_table: false`），来源段落放该段落的完整文本
- N/A 项的来源段落说明搜索范围和结论

- 严禁幻觉：如果文档中未提及某项，`value` 必须设为 "N/A"
- 如果 hdx 文件不存在或设备型号无法匹配，返回错误信息

## 已知 hdx 文档列表

| 文件名 | 产品系列 | 版本 |
|--------|---------|------|
| S12700, S12700E_V200R025C00_04_zh_AZP09299.hdx | S12700, S12700E | V200R025C00 |
| S7700_V200R025C00_04_zh_AZP0930J.hdx | S7700 | V200R025C00 |
