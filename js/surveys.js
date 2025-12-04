// Survey Manager
const SurveyManager = {
  selectedTriggers: [],

  async render() {
    if (typeof document === 'undefined') {
      return;
    }
    if (!API?.getSurveys) {
      return;
    }

    const surveys = await API.getSurveys();

    const surveysSection = document.getElementById('surveys');
    if (!surveysSection) {
      return;
    }

    surveysSection.innerHTML = `
      <h2 style="margin-bottom: 20px;">Управление опросами</h2>
      <div class="survey-list">
        ${surveys.map(survey => this.renderSurveyItem(survey)).join('')}
      </div>
    `;
  },

  renderSurveyItem(survey) {
    const statusEmoji = survey.status === 'active' ? '✅' : '⏸️';
    const statusText = survey.status === 'active' ? 'Активен' : 'Приостановлен';

    return `
      <div class="survey-item">
        <div class="survey-info">
          <h3>${survey.name}</h3>
          <div class="survey-meta">
            <span>🎯 ${survey.targetAudience}</span> •
            <span>📊 ${survey.metrics.join(' + ')}</span> •
            <span>${statusEmoji} ${statusText}</span> •
            <span>${survey.responses} ответов</span>
          </div>
        </div>
        <div>
          <button class="btn ${survey.status === 'active' ? 'btn-primary' : 'btn-secondary'}" 
                  onclick="SurveyManager.viewSurvey(${survey.id})">
            ${survey.status === 'active' ? 'Просмотр' : 'Редактировать'}
          </button>
        </div>
      </div>
    `;
  },

  async renderCreateForm() {
    if (typeof document === 'undefined') {
      return;
    }

    const createSection = document.getElementById('create');
    if (!createSection) {
      return;
    }

    createSection.innerHTML = `
      <h2 style="margin-bottom: 20px;">Создать новый опрос</h2>

      <div class="form-group">
        <label>Название опроса</label>
        <input type="text" id="surveyName" placeholder="Например: Оценка качества поддержки">
      </div>

      <div class="form-group">
        <label>Целевая аудитория</label>
        <select id="surveyAudience">
          <option>ЛПР (Лица, принимающие решения)</option>
          <option>Технические специалисты</option>
          <option>Бизнес-пользователи</option>
          <option>Все роли</option>
        </select>
      </div>

      <div class="form-group">
        <label>Триггер отправки</label>
        <div class="trigger-config">
          <div class="trigger-item" onclick="SurveyManager.toggleTrigger(this, 'after_demo')">
            <strong>📅 После демо</strong>
            <p style="font-size: 0.85em; color: #666; margin-top: 5px;">Через 24 часа</p>
          </div>
          <div class="trigger-item" onclick="SurveyManager.toggleTrigger(this, 'after_release')">
            <strong>🚀 После релиза</strong>
            <p style="font-size: 0.85em; color: #666; margin-top: 5px;">Через 48 часов</p>
          </div>
          <div class="trigger-item" onclick="SurveyManager.toggleTrigger(this, 'after_incident')">
            <strong>⚠️ После инцидента</strong>
            <p style="font-size: 0.85em; color: #666; margin-top: 5px;">Через 72 часа</p>
          </div>
          <div class="trigger-item" onclick="SurveyManager.toggleTrigger(this, 'after_sprint')">
            <strong>📊 После спринта</strong>
            <p style="font-size: 0.85em; color: #666; margin-top: 5px;">По завершении</p>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Тип метрики</label>
        <select id="surveyMetric">
          <option>NPS (Net Promoter Score)</option>
          <option>CSAT (Customer Satisfaction)</option>
          <option>CES (Customer Effort Score)</option>
          <option>Кастомный опрос</option>
        </select>
      </div>

      <div class="question-builder">
        <h3 style="margin-bottom: 15px;">Вопросы опроса</h3>
        <div class="question-item">
          <strong>1. Оцените вероятность рекомендации (0-10)</strong>
          <p style="color: #666; font-size: 0.9em; margin-top: 5px;">Тип: NPS шкала</p>
        </div>
        <div class="question-item">
          <strong>2. Что можно улучшить?</strong>
          <p style="color: #666; font-size: 0.9em; margin-top: 5px;">Тип: Текстовый ответ</p>
        </div>
        <button class="btn btn-secondary" style="margin-top: 10px;">➕ Добавить вопрос</button>
      </div>

      <div class="form-group">
        <label>Канал отправки</label>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <label style="display: flex; align-items: center; gap: 5px;">
            <input type="checkbox" checked> Email
          </label>
          <label style="display: flex; align-items: center; gap: 5px;">
            <input type="checkbox" checked> Telegram бот
          </label>
          <label style="display: flex; align-items: center; gap: 5px;">
            <input type="checkbox"> VK Teams
          </label>
          <label style="display: flex; align-items: center; gap: 5px;">
            <input type="checkbox"> Веб-форма
          </label>
        </div>
      </div>

      <button class="btn btn-primary" onclick="SurveyManager.createSurvey()">
        Создать опрос
      </button>
    `;
  },

  toggleTrigger(element, triggerId) {
    if (!element) {
      return;
    }

    element.classList.toggle('selected');

    const index = this.selectedTriggers.indexOf(triggerId);
    if (index > -1) {
      this.selectedTriggers.splice(index, 1);
    } else {
      this.selectedTriggers.push(triggerId);
    }
  },

  async createSurvey() {
    if (typeof document === 'undefined') {
      return;
    }
    if (!API?.createSurvey) {
      return;
    }

    const surveyData = {
      name: document.getElementById('surveyName')?.value || '',
      targetAudience: document.getElementById('surveyAudience')?.value || '',
      metric: document.getElementById('surveyMetric')?.value || '',
      triggers: this.selectedTriggers,
      status: 'active',
      responses: 0
    };

    if (!surveyData.name) {
      Utils?.showNotification?.('Введите название опроса', 'error');
      return;
    }

    const result = await API.createSurvey(surveyData);
    if (result?.ok) {
      Utils?.showNotification?.('Опрос успешно создан!');
      Navigation?.switchTab?.('surveys');
    }
  },

  viewSurvey(id) {
    Utils?.showNotification?.(`Просмотр опроса #${id}`);
    // TODO: реализовать детальный просмотр
  }
};

// Export for Jest
if (typeof module !== 'undefined') {
  module.exports = SurveyManager;
}
