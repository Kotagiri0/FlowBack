document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 FlowBack v' + CONFIG.VERSION);

  // Инициализация модулей
  try {
    ThemeManager.init();
    console.log('✅ ThemeManager initialized');

    AvatarManager.init();
    console.log('✅ AvatarManager initialized');

    RoleAuth.init();
    console.log('✅ RoleAuth initialized');

    Navigation.init();
    console.log('✅ Navigation initialized');

    Modals.init();
    console.log('✅ Modals initialized');

    console.log('🎉 Приложение успешно запущено!');
  } catch (error) {
    console.error('❌ Ошибка инициализации:', error);
  }
});