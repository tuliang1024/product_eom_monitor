---
name: data-sheet-spec-find
description: 专门用于从指定目录 (`/Users/l/L/data/dataSheet`) 的 PDF 彩页中提取特定型号设备的规格参数，支持模糊匹配、数据类型约束和本地缓存。
---

## 输入参数 (Schema)(`spec_definition.json`)

- `device_model` (string): 设备型号，如 "CloudEngine 16816"。
- `spec_definition` (object): 键值对，Key 为规格名，Value 为类型 ("数值型" 或 "字符串型")。
- `force_refresh` (boolean): 是否跳过缓存强制重新解析。

## 执行逻辑 (Core Instructions)

1. **文件检索**：在 `/Users/l/L/data/dataSheet`下检索 PDF。若无精确匹配，使用模糊匹配（如 "16816" 匹配 "CloudEngine 16800系列.pdf"）。
2. **缓存策略**：读取 `cache.jsonl`。若 `device_model` 和所有请求的 `spec_definition` 的 Key 均存在，则直接返回缓存。
3. **内容提取**：
   - 使用 PDF 解析工具读取相关内容。
   - **数值型**：必须提取数值 + 单位（如 "576 Tbps"）。
   - **字符串型**：仅识别 "支持" / "不支持" / "未提及"。
4. **位置溯源**：必须记录每个规格所在的 `page_number` 和包含该值的 `source_context`（原文摘要）。


## cache.jsonl的格式示例

`{"device_name": "CloudEngine 16816", "source_file": "华为 CloudEngine 16800 系列数据中心交换机彩页.PDF", "timestamp": "2026-03-30T10:00:00", "extractions": [{"spec_key": "整机交换容量", "spec_type": "数值型", "value": "576 Tbps", "source_context": "CloudEngine 16816支持高达576Tbps交换容量", "page_number": 5}, {"spec_key": "是否支持VXLAN", "spec_type": "字符串型", "value": "支持", "source_context": "全面支持VXLAN二层桥接及三层网关功能", "page_number": 8}]}`

## 输出约束

- 必须返回标准 JSON 结构。
- 严禁幻觉：如果 PDF 中未提及某项，`value` 必须设为 "N/A"。
