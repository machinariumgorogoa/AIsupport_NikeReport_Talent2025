// 模块管理器
const ModuleManager = {
    // 配置
    config: {
        contentPath: 'content/',
        modules: {
            en: 'en-content.html',
            zh: 'zh-content.html'
        }
    },
    
    // 状态
    state: {
        currentLanguage: 'en',
        contentLoaded: false,
        modulesCache: {
            en: null,
            zh: null
        }
    },
    
    // 初始化
    init: function(container, loadingSpinner) {
        this.container = container;
        this.loadingSpinner = loadingSpinner;
        console.log('Module Manager initialized');
    },
    
    // 加载内容
    loadContent: async function(language) {
        if (!this.container) {
            console.error('Container not found');
            return;
        }
        
        this.state.currentLanguage = language;
        
        // 显示加载动画
        if (this.loadingSpinner) {
            this.loadingSpinner.style.display = 'flex';
        }
        
        // 检查缓存
        if (this.state.modulesCache[language]) {
            this.displayContent(this.state.modulesCache[language]);
            return;
        }
        
        // 从文件加载
        try {
            const filename = this.config.modules[language];
            const response = await fetch(`${this.config.contentPath}${filename}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const content = await response.text();
            this.state.modulesCache[language] = content;
            this.displayContent(content);
            
        } catch (error) {
            console.error('Error loading content:', error);
            this.showError(`Failed to load content: ${error.message}`);
        }
    },
    
    // 显示内容
    displayContent: function(content) {
        // 隐藏加载动画
        if (this.loadingSpinner) {
            this.loadingSpinner.style.display = 'none';
        }
        
        // 设置容器内容
        this.container.innerHTML = content;
        
        // 初始化模块效果
        this.initModuleEffects();
        
        this.state.contentLoaded = true;
        console.log(`Content loaded for language: ${this.state.currentLanguage}`);
    },
    
    // 切换语言
    switchLanguage: function(language) {
        if (language === this.state.currentLanguage && this.state.contentLoaded) {
            return;
        }
        
        this.loadContent(language);
    },
    
    // 初始化模块效果
    initModuleEffects: function() {
        const modules = this.container.querySelectorAll('.module');
        
        modules.forEach(module => {
            // 移除之前的事件监听器（如果存在）
            module.removeEventListener('mouseenter', this.handleMouseEnter);
            module.removeEventListener('mouseleave', this.handleMouseLeave);
            
            // 添加新的事件监听器
            module.addEventListener('mouseenter', this.handleMouseEnter);
            module.addEventListener('mouseleave', this.handleMouseLeave);
            
            // 添加点击效果
            module.addEventListener('click', this.handleModuleClick);
        });
    },
    
    // 鼠标进入处理
    handleMouseEnter: function(e) {
        this.style.transform = 'translateY(-5px)';
    },
    
    // 鼠标离开处理
    handleMouseLeave: function(e) {
        this.style.transform = 'translateY(0)';
    },
    
    // 模块点击处理
    handleModuleClick: function(e) {
        // 可以添加点击效果，比如展开/收起
        console.log('Module clicked:', this.querySelector('.module-title')?.textContent);
    },
    
    // 显示错误
    showError: function(message) {
        if (this.loadingSpinner) {
            this.loadingSpinner.style.display = 'flex';
            this.loadingSpinner.innerHTML = `
                <div style="text-align: center;">
                    <div style="color: var(--primary-color); font-size: 48px; margin-bottom: 20px;">⚠️</div>
                    <p style="color: var(--text-secondary); margin-bottom: 10px;">${message}</p>
                    <button onclick="location.reload()" style="
                        background: var(--primary-color);
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        margin-top: 20px;
                    ">Retry</button>
                </div>
            `;
        }
    },
    
    // 获取当前语言
    getCurrentLanguage: function() {
        return this.state.currentLanguage;
    },
    
    // 检查是否已加载
    isContentLoaded: function() {
        return this.state.contentLoaded;
    }
};

// 绑定事件处理器
ModuleManager.handleMouseEnter = ModuleManager.handleMouseEnter.bind(ModuleManager);
ModuleManager.handleMouseLeave = ModuleManager.handleMouseLeave.bind(ModuleManager);
ModuleManager.handleModuleClick = ModuleManager.handleModuleClick.bind(ModuleManager);

// 导出到全局作用域
window.ModuleManager = ModuleManager;