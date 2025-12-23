// 增强版内容加载器
const ContentLoader = {
    // 配置
    config: {
        contentPath: 'content/',
        contentParts: {
            en: ['en-content-part1.html', 'en-content-part2.html'],
            zh: ['zh-content-part1.html', 'zh-content-part2.html']
        }
    },
    
    // 状态
    state: {
        currentLanguage: 'en',
        isLoading: false,
        contentCache: {
            en: null,
            zh: null
        }
    },
    
    // 初始化
    init: function(container, loadingSpinner) {
        this.container = container;
        this.loadingSpinner = loadingSpinner;
        console.log('Content Loader initialized');
    },
    
    // 加载内容
    loadContent: async function(language) {
        if (!this.container || this.state.isLoading) {
            return;
        }
        
        this.state.currentLanguage = language;
        this.state.isLoading = true;
        
        // 显示加载动画
        this.showLoading();
        
        // 检查缓存
        if (this.state.contentCache[language]) {
            this.displayContent(this.state.contentCache[language]);
            this.state.isLoading = false;
            return;
        }
        
        // 加载所有部分
        try {
            const parts = this.config.contentParts[language];
            let combinedContent = '';
            
            for (const partFile of parts) {
                const response = await fetch(`${this.config.contentPath}${partFile}`);
                
                if (!response.ok) {
                    throw new Error(`Failed to load ${partFile}: ${response.status}`);
                }
                
                const content = await response.text();
                combinedContent += content;
            }
            
            // 缓存内容
            this.state.contentCache[language] = combinedContent;
            this.displayContent(combinedContent);
            
        } catch (error) {
            console.error('Error loading content:', error);
            this.showError(`Failed to load content: ${error.message}`);
        }
        
        this.state.isLoading = false;
    },
    
    // 显示内容
    displayContent: function(content) {
        // 隐藏加载动画
        this.hideLoading();
        
        // 设置容器内容
        this.container.innerHTML = content;
        
        // 初始化模块效果
        this.initModuleEffects();
        
        // 触发内容加载完成事件
        this.triggerContentLoaded();
        
        console.log(`Content loaded for language: ${this.state.currentLanguage}`);
    },
    
    // 切换语言
    switchLanguage: function(language) {
        if (language === this.state.currentLanguage || this.state.isLoading) {
            return;
        }
        
        this.loadContent(language);
    },
    
    // 显示加载动画
    showLoading: function() {
        if (this.loadingSpinner) {
            this.loadingSpinner.style.display = 'flex';
        }
    },
    
    // 隐藏加载动画
    hideLoading: function() {
        if (this.loadingSpinner) {
            this.loadingSpinner.style.display = 'none';
        }
    },
    
    // 初始化模块效果
    initModuleEffects: function() {
        const modules = this.container.querySelectorAll('.module');
        
        modules.forEach(module => {
            // 移除之前的事件监听器
            module.removeEventListener('mouseenter', this.handleMouseEnter);
            module.removeEventListener('mouseleave', this.handleMouseLeave);
            
            // 添加新的事件监听器
            module.addEventListener('mouseenter', this.handleMouseEnter);
            module.addEventListener('mouseleave', this.handleMouseLeave);
            
            // 添加点击效果
            module.addEventListener('click', this.handleModuleClick);
        });
        
        console.log(`Initialized effects for ${modules.length} modules`);
    },
    
    // 鼠标进入处理
    handleMouseEnter: function(e) {
        this.style.transform = 'translateY(-5px)';
        this.style.zIndex = '10';
    },
    
    // 鼠标离开处理
    handleMouseLeave: function(e) {
        this.style.transform = 'translateY(0)';
        this.style.zIndex = '1';
    },
    
    // 模块点击处理
    handleModuleClick: function(e) {
        // 防止点击链接或按钮时触发模块效果
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
            return;
        }
        
        // 添加点击反馈
        this.style.transform = 'translateY(-2px)';
        setTimeout(() => {
            this.style.transform = 'translateY(-5px)';
        }, 100);
        
        // 记录点击的模块
        const moduleTitle = this.querySelector('.module-title')?.textContent;
        console.log('Module clicked:', moduleTitle);
    },
    
    // 显示错误
    showError: function(message) {
        if (this.loadingSpinner) {
            this.loadingSpinner.style.display = 'flex';
            this.loadingSpinner.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div style="color: var(--primary-color); font-size: 48px; margin-bottom: 20px;">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 10px; font-size: 16px;">
                        ${message}
                    </p>
                    <button onclick="window.location.reload()" style="
                        background: var(--primary-color);
                        color: white;
                        border: none;
                        padding: 10px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        margin-top: 20px;
                        font-weight: 600;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.backgroundColor='var(--primary-dark)'" 
                     onmouseout="this.style.backgroundColor='var(--primary-color)'">
                        重新加载
                    </button>
                </div>
            `;
        }
    },
    
    // 触发内容加载完成事件
    triggerContentLoaded: function() {
        const event = new CustomEvent('contentLoaded', {
            detail: {
                language: this.state.currentLanguage,
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(event);
    },
    
    // 获取当前语言
    getCurrentLanguage: function() {
        return this.state.currentLanguage;
    },
    
    // 清空缓存
    clearCache: function() {
        this.state.contentCache = { en: null, zh: null };
        console.log('Content cache cleared');
    },
    
    // 预加载另一种语言的内容
    preloadLanguage: async function(language) {
        if (this.state.contentCache[language] || this.state.isLoading) {
            return;
        }
        
        try {
            const parts = this.config.contentParts[language];
            let combinedContent = '';
            
            for (const partFile of parts) {
                const response = await fetch(`${this.config.contentPath}${partFile}`);
                if (response.ok) {
                    const content = await response.text();
                    combinedContent += content;
                }
            }
            
            this.state.contentCache[language] = combinedContent;
            console.log(`Preloaded content for language: ${language}`);
        } catch (error) {
            console.warn(`Failed to preload language ${language}:`, error);
        }
    }
};

// 绑定事件处理器
ContentLoader.handleMouseEnter = ContentLoader.handleMouseEnter.bind(ContentLoader);
ContentLoader.handleMouseLeave = ContentLoader.handleMouseLeave.bind(ContentLoader);
ContentLoader.handleModuleClick = ContentLoader.handleModuleClick.bind(ContentLoader);

// 导出到全局作用域
window.ModuleManager = ContentLoader;