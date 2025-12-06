// Theme Switcher
const ThemeManager = {
    init() {
        // Проверяем сохраненную тему из localStorage
        const savedTheme = localStorage.getItem('flowback-theme') || 'light';
        this.setTheme(savedTheme);

        // Добавляем обработчик для переключателя
        const switcher = document.getElementById('theme-switcher');
        if (switcher) {
            switcher.addEventListener('click', () => this.toggleTheme());
        }
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('flowback-theme', theme);

        // Обновляем состояние переключателя
        const switcher = document.getElementById('theme-switcher');
        if (switcher) {
            switcher.setAttribute('data-theme', theme);
        }
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    },

    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }
};