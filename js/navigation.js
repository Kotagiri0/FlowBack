// Navigation
const Navigation = {
  init() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabId = e.target.dataset.tab;
        this.switchTab(tabId);
      });
    });
  },

  switchTab(tabId) {
    document.querySelectorAll('.content-section').forEach(section => {
      section.classList.remove('active');
    });

    const targetSection = document.getElementById(tabId);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
    });

    const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeTab) {
      activeTab.classList.add('active');
    }

    State.currentTab = tabId;
    this.loadTabContent(tabId);
  },

  async loadTabContent(tabId) {
    switch(tabId) {
      case 'dashboard':
        await DashboardManager.render();
        break;
      case 'surveys':
        await SurveyManager.render();
        break;
      case 'create':
        await SurveyManager.renderCreateForm();
        break;
      case 'clients':
        await ClientManager.render();
        break;
      case 'analytics':
        await AnalyticsManager.render();
        break;
      case 'feedback':
        await FeedbackManager.render();
        break;
      case 'settings':
        this.renderSettings();
        break;
    }
  },

  renderSettings() {
    const settingsSection = document.getElementById('settings');
    settingsSection.innerHTML = `
      <h2 style="margin-bottom: 20px;">Настройки системы</h2>
      
      <div class="form-group">
        <label>Название компании</label>
        <input type="text" placeholder="Введите название..." value="FlowBack Inc.">
      </div>

      <div class="form-group">
        <label>Email для уведомлений</label>
        <input type="email" placeholder="example@company.com" value="admin@flowback.ru">
      </div>

      <div class="form-group">
        <label>Частота опросов (дней)</label>
        <input type="number" value="45" min="1">
      </div>

      <button class="btn btn-primary" onclick="Utils.showNotification('Настройки сохранены')">
        Сохранить изменения
      </button>
    `;
  }
};