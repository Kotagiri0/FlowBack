// Main Application Initialization
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', async () => {
        console.log('🔄 FlowBack v' + CONFIG.VERSION + ' загружается...');

        try {
            // Инициализация компонентов
            Navigation.init();
            ModalManager.init();

            // Загружаем дашборд по умолчанию
            await DashboardManager.render();

            console.log('✅ FlowBack успешно загружен');
        } catch (error) {
            console.error('❌ Ошибка инициализации:', error);
            Utils.showNotification('Ошибка загрузки приложения', 'error');
        }
    });

    // Глобальные обработчики ошибок
    window.addEventListener('error', (event) => {
        console.error('Глобальная ошибка:', event.error);
    });

    // Предотвращаем потерю данных при закрытии страницы
    window.addEventListener('beforeunload', (event) => {
        // TODO: Реализовать реальную проверку позже
        const hasUnsavedChanges = false;

        if (hasUnsavedChanges) {
            event.preventDefault();
            event.returnValue = '';
        }
    });
}

// Экспорт для Jest (не мешает браузеру)
if (typeof module !== 'undefined') {
    module.exports = {};
}
