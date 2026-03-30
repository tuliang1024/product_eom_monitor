    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        /* 状态样式定义 */
        .config-changed { background-color: #fffbeb; border-left: 4px solid #f59e0b; } /* 橙色条：已修改 */
        .config-stable { border-left: 4px solid #e2e8f0; } /* 灰色条：未修改 */
        
        /* 模态框动画 */
        #configModal .modal-overlay {
            transition: opacity 0.3s ease;
            opacity: 0;
        }
        
        #configModal .modal-content {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform: scale(0.95);
            opacity: 0;
        }
        
        #configModal .modal-overlay.show {
            opacity: 1;
        }
        
        #configModal .modal-content.show {
            transform: scale(1);
            opacity: 1;
        }
        
        /* 自定义滚动条 */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    </style>
</head>
<body class="bg-[#f1f5f9] text-slate-800 antialiased">

    <nav class="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 shadow-sm">
        <div class="max-w-[1600px] mx-auto flex justify-between items-center">
            <div class="flex items-center gap-4">
                <div class="bg-indigo-600 p-2.5 rounded-xl shadow-lg">
                    <i class="fas fa-cog text-white text-xl"></i>
                </div>
                <div>
                    <h1 class="text-xl font-bold tracking-tight text-slate-900">配置管理中心</h1>
                    <p class="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Configuration Management Center</p>
                </div>
            </div>

            <div class="flex items-center gap-8">
                <div class="text-right border-r pr-6 border-slate-100">
                    <div class="text-[10px] text-slate-400 font-bold uppercase">配置项总数</div>
                    <div class="text-xl font-black text-slate-800">24 <span class="text-xs font-normal text-slate-400">项</span></div>
                </div>
                <div class="text-right">
                    <div class="text-[10px] text-amber-500 font-bold uppercase">待更新配置</div>
                    <div class="text-xl font-black text-amber-500">3 <span class="text-xs font-normal">项</span></div>
                </div>
            </div>
        </div>
    </nav>

    <main class="max-w-[1600px] mx-auto p-6">
        
        <div class="mb-6">
            <div class="text-xs text-slate-400 font-medium mb-2">快速检索配置项 (配置键名 / 描述)</div>
            <div class="flex justify-between items-center">
                <div class="relative">
                    <i class="fas fa-search absolute left-3 top-3 text-slate-300"></i>
                    <input type="text" placeholder="全局检索配置项..." class="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm w-96 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all">
                </div>
                <div class="flex gap-4">
                    <button onclick="applyAllChanges()" class="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-all">
                        <i class="fas fa-save mr-2"></i> 应用所有变更
                    </button>
                    <button onclick="restoreDefaults()" class="px-4 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold shadow-md hover:bg-amber-600 transition-all">
                        <i class="fas fa-undo mr-2"></i> 恢复默认配置
                    </button>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <th class="px-8 py-4">配置键名</th>
                        <th class="px-6 py-4">配置值</th>
                        <th class="px-6 py-4">类型</th>
                        <th class="px-6 py-4">描述</th>
                        <th class="px-6 py-4">状态</th>
                        <th class="px-8 py-4 text-right">操作</th>
                    </tr>
                </thead>
                <tbody id="configTableBody" class="divide-y divide-slate-100">
                </tbody>
            </table>
            
            <div class="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <p id="configInfo" class="text-xs text-slate-400 font-medium">显示 1 到 24 条记录，共 24 条</p>
            </div>
        </div>
    </main>

    <div id="configModal" class="fixed inset-0 z-[60] hidden flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm modal-overlay" onclick="closeConfigPanel()"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-[500px] max-h-[90vh] flex flex-col modal-content">
            <div class="p-6 bg-slate-900 text-white flex justify-between items-center">
                <div>
                    <h2 class="text-lg font-bold">配置详情</h2>
                    <p id="configKey" class="text-[10px] font-mono text-slate-400 mt-1"></p>
                </div>
                <button onclick="closeConfigPanel()" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>

            <div class="flex-1 overflow-y-auto p-8" id="configDetailContainer">
                </div>

            <div class="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                <button onclick="restoreDefault()" class="flex-1 py-3 bg-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-300 transition-all">
                    <i class="fas fa-undo mr-2"></i> 恢复默认
                </button>
                <button onclick="saveConfig()" class="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                    <i class="fas fa-save mr-2"></i> 保存
                </button>
            </div>
        </div>
    </div>

        // 模拟配置数据
        const configData = [
            {
                id: 1,
                key: "api.timeout",
                value: "30000",
                defaultValue: "30000",
                type: "number",
                description: "API请求超时时间（毫秒）",
                isChanged: false
            },
            {
                id: 2,
                key: "database.connection.max",
                value: "10",
                defaultValue: "10",
                type: "number",
                description: "数据库最大连接数",
                isChanged: false
            },
            {
                id: 3,
                key: "cache.enabled",
                value: "true",
                defaultValue: "true",
                type: "boolean",
                description: "是否启用缓存",
                isChanged: true
            },
            {
                id: 4,
                key: "cache.ttl",
                value: "3600",
                defaultValue: "1800",
                type: "number",
                description: "缓存过期时间（秒）",
                isChanged: true
            },
            {
                id: 5,
                key: "log.level",
                value: "info",
                defaultValue: "info",
                type: "string",
                description: "日志级别",
                isChanged: false
            },
            {
                id: 6,
                key: "sync.interval",
                value: "3600",
                defaultValue: "3600",
                type: "number",
                description: "同步间隔（秒）",
                isChanged: false
            },
            {
                id: 7,
                key: "notification.email.enabled",
                value: "false",
                defaultValue: "false",
                type: "boolean",
                description: "是否启用邮件通知",
                isChanged: true
            },
            {
                id: 8,
                key: "notification.email.recipients",
                value: "admin@example.com",
                defaultValue: "admin@example.com",
                type: "string",
                description: "邮件通知接收人",
                isChanged: false
            }
        ];

        // 当前编辑的配置项
        let currentConfig = null;
        
        // 初始化页面
        document.addEventListener('DOMContentLoaded', function() {
            renderConfigList();
            
            // 搜索框事件监听
            const searchInput = document.querySelector('input[placeholder="全局检索配置项..."]');
            if (searchInput) {
                searchInput.addEventListener('input', function() {
                    const searchTerm = this.value.toLowerCase();
                    const rows = document.querySelectorAll('.config-row');
                    rows.forEach(row => {
                        const key = row.dataset.key.toLowerCase();
                        const description = row.dataset.description.toLowerCase();
                        if (key.includes(searchTerm) || description.includes(searchTerm)) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    });
                });
            }
        });
        
        // 渲染配置列表
        function renderConfigList() {
            const tableBody = document.getElementById('configTableBody');
            tableBody.innerHTML = '';
            
            configData.forEach(config => {
                const row = document.createElement('tr');
                row.className = `config-row ${config.isChanged ? 'config-changed' : 'config-stable'} group hover:bg-slate-50 transition-all cursor-default`;
                row.dataset.key = config.key;
                row.dataset.description = config.description;
                
                // 配置键名
                const keyCell = document.createElement('td');
                keyCell.className = 'px-8 py-5';
                keyCell.innerHTML = `
                    <div class="font-bold text-slate-800">${config.key}</div>
                `;
                row.appendChild(keyCell);
                
                // 配置值
                const valueCell = document.createElement('td');
                valueCell.className = 'px-6 py-5';
                valueCell.innerHTML = `
                    <div class="text-slate-700 font-mono">${config.value}</div>
                    ${config.isChanged ? `<div class="text-xs text-amber-600 mt-1">默认值: ${config.defaultValue}</div>` : ''}
                `;
                row.appendChild(valueCell);
                
                // 类型
                const typeCell = document.createElement('td');
                typeCell.className = 'px-6 py-5';
                typeCell.innerHTML = `
                    <span class="px-2.5 py-1 rounded-md ${getTypeColor(config.type)} text-[10px] font-black">${config.type}</span>
                `;
                row.appendChild(typeCell);
                
                // 描述
                const descCell = document.createElement('td');
                descCell.className = 'px-6 py-5';
                descCell.innerHTML = `
                    <div class="text-slate-600 text-sm">${config.description}</div>
                `;
                row.appendChild(descCell);
                
                // 状态
                const statusCell = document.createElement('td');
                statusCell.className = 'px-6 py-5';
                statusCell.innerHTML = `
                    <div class="flex items-center gap-2 ${config.isChanged ? 'text-amber-600' : 'text-slate-400'} text-xs font-bold">
                        <i class="fas ${config.isChanged ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
                        ${config.isChanged ? '已修改' : '未修改'}
                    </div>
                `;
                row.appendChild(statusCell);
                
                // 操作
                const actionCell = document.createElement('td');
                actionCell.className = 'px-8 py-5 text-right';
                actionCell.innerHTML = `
                    <button onclick="openConfigPanel(${config.id})" class="text-slate-300 group-hover:text-indigo-600 transition-colors">
                        <i class="fas fa-edit text-lg"></i>
                    </button>
                `;
                row.appendChild(actionCell);
                
                tableBody.appendChild(row);
            });
        }
        
        // 获取类型对应的颜色
        function getTypeColor(type) {
            switch(type) {
                case 'string': return 'bg-indigo-100 text-indigo-700';
                case 'number': return 'bg-emerald-100 text-emerald-700';
                case 'boolean': return 'bg-amber-100 text-amber-700';
                default: return 'bg-slate-100 text-slate-700';
            }
        }
        
        // 打开配置详情面板
        function openConfigPanel(configId) {
            currentConfig = configData.find(c => c.id == configId);
            if (!currentConfig) return;
            
            document.getElementById('configKey').innerText = currentConfig.key;
            const container = document.getElementById('configDetailContainer');
            
            let inputHTML = '';
            switch(currentConfig.type) {
                case 'boolean':
                    inputHTML = `
                        <div class="flex items-center gap-3">
                            <input type="radio" id="trueValue" name="configValue" value="true" ${currentConfig.value === 'true' ? 'checked' : ''} class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300">
                            <label for="trueValue" class="text-sm font-medium text-slate-700">是</label>
                            <input type="radio" id="falseValue" name="configValue" value="false" ${currentConfig.value === 'false' ? 'checked' : ''} class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300">
                            <label for="falseValue" class="text-sm font-medium text-slate-700">否</label>
                        </div>
                    `;
                    break;
                case 'number':
                    inputHTML = `
                        <input type="number" value="${currentConfig.value}" id="configValue" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all">
                    `;
                    break;
                default:
                    inputHTML = `
                        <input type="text" value="${currentConfig.value}" id="configValue" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all">
                    `;
            }
            
            container.innerHTML = `
                <div class="space-y-6">
                    <div>
                        <label class="block text-xs text-slate-400 font-medium mb-1.5">配置键名</label>
                        <div class="font-mono text-slate-800">${currentConfig.key}</div>
                    </div>
                    
                    <div>
                        <label class="block text-xs text-slate-400 font-medium mb-1.5">配置值</label>
                        ${inputHTML}
                    </div>
                    
                    <div>
                        <label class="block text-xs text-slate-400 font-medium mb-1.5">默认值</label>
                        <div class="font-mono text-slate-500">${currentConfig.defaultValue}</div>
                    </div>
                    
                    <div>
                        <label class="block text-xs text-slate-400 font-medium mb-1.5">类型</label>
                        <span class="px-2.5 py-1 rounded-md ${getTypeColor(currentConfig.type)} text-[10px] font-black">${currentConfig.type}</span>
                    </div>
                    
                    <div>
                        <label class="block text-xs text-slate-400 font-medium mb-1.5">描述</label>
                        <div class="text-slate-600 text-sm">${currentConfig.description}</div>
                    </div>
                </div>
            `;
            
            const modal = document.getElementById('configModal');
            modal.style.display = 'flex';
            // 添加淡入动画
            setTimeout(() => {
                const overlay = modal.querySelector('.modal-overlay');
                const content = modal.querySelector('.modal-content');
                if (overlay) overlay.classList.add('show');
                if (content) content.classList.add('show');
            }, 10);
        }
        
        // 关闭配置详情面板
        function closeConfigPanel() {
            const modal = document.getElementById('configModal');
            // 添加淡出动画
            const overlay = modal.querySelector('.modal-overlay');
            const content = modal.querySelector('.modal-content');
            if (overlay) overlay.classList.remove('show');
            if (content) content.classList.remove('show');
            
            setTimeout(() => {
                modal.style.display = 'none';
                currentConfig = null;
            }, 300);
        }
        
        // 保存配置
        function saveConfig() {
            if (!currentConfig) return;
            
            let newValue;
            if (currentConfig.type === 'boolean') {
                const radioTrue = document.getElementById('trueValue');
                newValue = radioTrue.checked ? 'true' : 'false';
            } else {
                const input = document.getElementById('configValue');
                newValue = input.value;
            }
            
            currentConfig.isChanged = newValue !== currentConfig.defaultValue;
            currentConfig.value = newValue;
            
            // 模拟保存操作
            setTimeout(() => {
                renderConfigList();
                closeConfigPanel();
                showNotification('配置已保存', 'success');
            }, 500);
        }
        
        // 恢复默认值
        function restoreDefault() {
            if (!currentConfig) return;
            
            currentConfig.value = currentConfig.defaultValue;
            currentConfig.isChanged = false;
            
            // 重新渲染配置详情
            openConfigPanel(currentConfig.id);
            showNotification('已恢复默认值', 'info');
        }
        
        // 应用所有变更
        function applyAllChanges() {
            const changedConfigs = configData.filter(c => c.isChanged);
            if (changedConfigs.length === 0) {
                showNotification('没有待应用的变更', 'info');
                return;
            }
            
            // 模拟应用操作
            setTimeout(() => {
                showNotification(`已应用 ${changedConfigs.length} 项配置变更`, 'success');
            }, 1000);
        }
        
        // 恢复所有默认配置
        function restoreDefaults() {
            // 确认操作
            if (confirm('确定要恢复所有默认配置吗？')) {
                configData.forEach(config => {
                    config.value = config.defaultValue;
                    config.isChanged = false;
                });
                
                renderConfigList();
                showNotification('已恢复所有默认配置', 'success');
            }
        }
        
        // 显示通知
        function showNotification(message, type = 'info') {
            // 创建通知元素
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 px-4 py-3 rounded-xl shadow-lg z-50 transition-all transform translate-x-0 opacity-100 ${type === 'success' ? 'bg-green-500 text-white' : type === 'error' ? 'bg-red-500 text-white' : 'bg-indigo-500 text-white'}`;
            notification.innerHTML = `
                <div class="flex items-center gap-2">
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                    <span>${message}</span>
                </div>
            `;
            
            // 添加到页面
            document.body.appendChild(notification);
            
            // 3秒后移除
            setTimeout(() => {
                notification.classList.add('opacity-0', 'translate-x-full');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }
