// 主要JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // ===== 初始化 =====
    console.log('Initializing Talent Strategy Analysis Report...');
    
    // ===== 1. 主题切换功能 =====
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // 初始化主题
    const currentTheme = localStorage.getItem('preferredTheme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.className = 'fas fa-sun';
        themeToggle.title = '切换到浅色模式';
    } else {
        document.body.classList.remove('dark-theme');
        themeIcon.className = 'fas fa-moon';
        themeToggle.title = '切换到深色模式';
    }
    
    // 主题切换事件监听
    themeToggle.addEventListener('click', function() {
        const isDark = document.body.classList.toggle('dark-theme');
        
        // 更新图标和提示
        if (isDark) {
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('preferredTheme', 'dark');
            themeToggle.title = '切换到浅色模式';
        } else {
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('preferredTheme', 'light');
            themeToggle.title = '切换到深色模式';
        }
    });
    
    // ===== 2. 语言切换功能 =====
    const languageSelect = document.getElementById('languageSelect');
    
    // 初始化语言
    const currentLang = localStorage.getItem('preferredLang') || 'en';
    languageSelect.value = currentLang;
    
    // 语言选择器事件监听
    languageSelect.addEventListener('change', function() {
        const selectedLang = this.value;
        localStorage.setItem('preferredLang', selectedLang);
        
        // 更新页面标题
        if (selectedLang === 'en') {
            document.title = 'Sportswear Brands Talent Strategy Analysis';
        } else {
            document.title = '运动品牌人才策略深度对标分析';
        }
        
        // 通知模块管理器切换语言
        if (window.ModuleManager) {
            window.ModuleManager.switchLanguage(selectedLang);
        }
    });
    
    // ===== 3. 加载内容 =====
    const contentContainer = document.getElementById('content-container');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // 检查模块管理器是否可用
    if (window.ModuleManager) {
        // 初始化模块管理器
        window.ModuleManager.init(contentContainer, loadingSpinner);
        
        // 加载初始语言内容
        setTimeout(() => {
            window.ModuleManager.loadContent(currentLang);
        }, 100);
    } else {
        // 如果模块管理器未加载，显示错误
        loadingSpinner.innerHTML = '<p style="color: var(--primary-color);">Error loading content. Please refresh the page.</p>';
    }
    
    // ===== 4. 模块悬停效果增强 =====
    // 这个功能将在内容加载后由模块管理器初始化
    
    console.log('Page initialized successfully.');
});

// 辅助函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}