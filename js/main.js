// Main Application Initialization
document.addEventListener('DOMContentLoaded', async() => {
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

// Глобальные обработчики
window.addEventListener('error', (event) => {
  console.error('Глобальная ошибка:', event.error);
});

// Предотвращаем потерю данных при закрытии страницы
window.addEventListener('beforeunload', (event) => {
  // Проверяем, есть ли несохраненные изменения
  const hasUnsavedChanges = false; // TODO: реализовать проверку

  if (hasUnsavedChanges) {
    event.preventDefault();
    event.returnValue = '';
  }
});