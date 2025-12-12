const ThemeManager = {
  currentTheme: 'light',

  init() {
    // Загрузить сохраненную тему
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);

    // Настроить переключатель
    const switcher = document.getElementById('theme-switcher');
    if (switcher) {
      switcher.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  },

  setTheme(theme) {
    this.currentTheme = theme;

    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }

    // Сохранить в localStorage
    localStorage.setItem('theme', theme);

    // Обновить состояние переключателя
    this.updateSwitcher();
  },

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  },

  updateSwitcher() {
    const switcher = document.getElementById('theme-switcher');
    if (switcher) {
      if (this.currentTheme === 'dark') {
        switcher.classList.add('active');
        switcher.setAttribute('title', 'Переключить на светлую тему');
      } else {
        switcher.classList.remove('active');
        switcher.setAttribute('title', 'Переключить на тёмную тему');
      }
    }
  }
};

// ========================================
// Settings Manager
// ========================================

const SettingsManager = {
  render() {
    const section = document.getElementById('settings');

    section.innerHTML = `
      <div class="section-header">
        <h2>⚙️ Настройки</h2>
        <p style="color: #666;">Настройка системы и уведомлений</p>
      </div>

      <div class="card">
        <h3 style="margin-bottom: 20px;">Общие настройки</h3>
        
        <div class="form-group">
          <label>Минимальная частота опросов (дней)</label>
          <input 
            type="number" 
            id="frequencyLimit" 
            value="${State.settings.surveyFrequencyLimit}"
            min="1"
            max="365"
          >
          <small style="color: #666;">Минимальный интервал между опросами для одной роли</small>
        </div>

        <h3 style="margin: 30px 0 20px 0;">Уведомления</h3>
        
        <div class="form-group">
          <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
            <input 
              type="checkbox" 
              id="emailNotif" 
              ${State.settings.notifications.email ? 'checked' : ''}
            >
            <span>Email уведомления</span>
          </label>
        </div>

        <div class="form-group">
          <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
            <input 
              type="checkbox" 
              id="telegramNotif" 
              ${State.settings.notifications.telegram ? 'checked' : ''}
            >
            <span>Telegram уведомления</span>
          </label>
        </div>

        <div class="form-group">
          <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
            <input 
              type="checkbox" 
              id="vkTeamsNotif" 
              ${State.settings.notifications.vkTeams ? 'checked' : ''}
            >
            <span>VK Teams уведомления</span>
          </label>
        </div>

        <button class="btn btn-primary" onclick="SettingsManager.saveSettings()">
          💾 Сохранить настройки
        </button>
      </div>

      <div class="card" style="margin-top: 30px;">
        <h3 style="margin-bottom: 15px;">О системе</h3>
        <div style="color: #666; line-height: 1.8;">
          <div><strong>Версия:</strong> ${CONFIG.VERSION}</div>
          <div><strong>Дата сборки:</strong> ${CONFIG.BUILD_DATE}</div>
          <div><strong>Разработчик:</strong> ZALPAD команда</div>
          <div style="margin-top: 15px;">
            <strong>Поддержка:</strong> support@flowback.ru
          </div>
        </div>
      </div>
    `;
  },

  saveSettings() {
    State.settings.surveyFrequencyLimit = parseInt(document.getElementById('frequencyLimit').value);
    State.settings.notifications.email = document.getElementById('emailNotif').checked;
    State.settings.notifications.telegram = document.getElementById('telegramNotif').checked;
    State.settings.notifications.vkTeams = document.getElementById('vkTeamsNotif').checked;

    Utils.showNotification('✅ Настройки сохранены', 'success');
  }
};