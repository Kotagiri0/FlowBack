// Модуль для прохождения опросов (для обычных пользователей)

const SurveyTaking = {
  currentSurvey: null,
  answers: {},

  startSurvey(surveyId) {
    this.currentSurvey = State.surveys.find(s => s.id === surveyId);

    if (!this.currentSurvey) {
      Utils.showNotification('❌ Опрос не найден', 'error');
      return;
    }

    this.answers = {};
    this.renderSurveyForm();
  },

  renderSurveyForm() {
    const survey = this.currentSurvey;
    const section = document.getElementById('surveys');

    section.innerHTML = `
      <div class="section-header">
        <h2>📝 ${survey.title}</h2>
        <p style="color: #666;">${survey.description || 'Пожалуйста, ответьте на вопросы опроса'}</p>
      </div>

      <div class="card" style="max-width: 800px; margin: 0 auto;">
        <form id="surveyForm" onsubmit="SurveyTaking.submitSurvey(event)">
          
          <!-- Основной вопрос метрики -->
          <div class="form-group">
            ${this.renderMetricQuestion(survey.metric)}
          </div>

          <!-- Дополнительные вопросы -->
          ${survey.questions && survey.questions.length > 0 ? `
            <div style="border-top: 2px solid #e5e7eb; margin: 30px 0; padding-top: 30px;">
              <h3 style="margin-bottom: 20px; color: #666;">Дополнительные вопросы</h3>
              ${survey.questions.map((q, index) => this.renderQuestion(q, index)).join('')}
            </div>
          ` : ''}

          <!-- Комментарий -->
          <div class="form-group">
            <label>Комментарий (опционально)</label>
            <textarea 
              id="surveyComment" 
              rows="4" 
              placeholder="Ваши пожелания, замечания или предложения..."
            ></textarea>
          </div>

          <!-- Кнопки -->
          <div style="display: flex; gap: 10px; margin-top: 30px;">
            <button type="submit" class="btn btn-primary">
              ✅ Отправить ответы
            </button>
            <button type="button" class="btn btn-secondary" onclick="Navigation.navigateTo('surveys')">
              ← Назад
            </button>
          </div>
        </form>
      </div>

      <!-- Информация о конфиденциальности -->
      <div class="card" style="max-width: 800px; margin: 30px auto 0; background: #f0f9ff; border-left: 3px solid #667eea;">
        <p style="margin: 0; color: #555; font-size: 14px;">
          <strong>🔒 Конфиденциальность:</strong> Ваши ответы используются только для улучшения продукта и качества обслуживания. Данные хранятся в защищенном виде.
        </p>
      </div>
    `;
  },

  renderMetricQuestion(metric) {
    const metricInfo = {
      nps: {
        title: 'Насколько вероятно, что вы порекомендуете наш продукт коллегам?',
        description: 'Оцените от 0 (точно не порекомендую) до 10 (обязательно порекомендую)',
        scale: 11,
        labels: ['0 - Точно нет', '10 - Обязательно']
      },
      csat: {
        title: 'Насколько вы удовлетворены нашим продуктом/услугой?',
        description: 'Оцените от 1 (очень недоволен) до 5 (очень доволен)',
        scale: 5,
        labels: ['1 - Очень недоволен', '5 - Очень доволен']
      },
      ces: {
        title: 'Насколько легко было использовать наш продукт?',
        description: 'Оцените от 1 (очень легко) до 5 (очень сложно)',
        scale: 5,
        labels: ['1 - Очень легко', '5 - Очень сложно']
      }
    };

    const info = metricInfo[metric];

    return `
      <label style="font-size: 18px; font-weight: 600; margin-bottom: 10px; display: block;">
        ${info.title} *
      </label>
      <p style="color: #666; margin-bottom: 20px; font-size: 14px;">
        ${info.description}
      </p>
      
      <div class="metric-scale">
        ${Array.from({ length: info.scale }, (_, i) => {
          const value = metric === 'nps' ? i : i + 1;
          return `
            <label class="metric-option">
              <input 
                type="radio" 
                name="metricScore" 
                value="${value}" 
                required
                onchange="SurveyTaking.highlightSelected(this)"
              >
              <span>${value}</span>
            </label>
          `;
        }).join('')}
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 12px; color: #999;">
        <span>${info.labels[0]}</span>
        <span>${info.labels[1]}</span>
      </div>
    `;
  },

  renderQuestion(question, index) {
    const questionNumber = index + 1;

    switch (question.type) {
      case 'text':
        return `
          <div class="form-group">
            <label>${questionNumber}. ${question.text}</label>
            <textarea 
              id="question_${question.id}" 
              rows="3" 
              placeholder="Ваш ответ..."
            ></textarea>
          </div>
        `;

      case 'rating':
        return `
          <div class="form-group">
            <label>${questionNumber}. ${question.text}</label>
            <div class="rating-scale">
              ${[1, 2, 3, 4, 5].map(value => `
                <label class="rating-option">
                  <input 
                    type="radio" 
                    name="question_${question.id}" 
                    value="${value}"
                  >
                  <span>${value}</span>
                </label>
              `).join('')}
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 12px; color: #999;">
              <span>Низкая оценка</span>
              <span>Высокая оценка</span>
            </div>
          </div>
        `;

      case 'yesno':
        return `
          <div class="form-group">
            <label>${questionNumber}. ${question.text}</label>
            <div style="display: flex; gap: 20px; margin-top: 10px;">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="radio" name="question_${question.id}" value="yes">
                <span>Да</span>
              </label>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="radio" name="question_${question.id}" value="no">
                <span>Нет</span>
              </label>
            </div>
          </div>
        `;

      default:
        return '';
    }
  },

  highlightSelected(radio) {
    // Убрать выделение со всех опций
    radio.closest('.metric-scale').querySelectorAll('.metric-option').forEach(opt => {
      opt.classList.remove('selected');
    });

    // Выделить выбранную опцию
    radio.closest('.metric-option').classList.add('selected');
  },

  submitSurvey(event) {
    event.preventDefault();

    const form = event.target;
    const survey = this.currentSurvey;

    // Получить основную оценку
    const metricScore = parseInt(form.metricScore.value);

    // Получить ответы на дополнительные вопросы
    const answers = [];
    if (survey.questions) {
      survey.questions.forEach(question => {
        const input = document.getElementById(`question_${question.id}`);
        const radio = form[`question_${question.id}`];

        let answer = '';
        if (input) {
          answer = input.value;
        } else if (radio) {
          answer = radio.value;
        }

        if (answer) {
          answers.push({
            questionId: question.id,
            answer: answer
          });
        }
      });
    }

    // Получить комментарий
    const comment = document.getElementById('surveyComment').value.trim();

    // Создать новый фидбек
    const feedback = {
      id: Utils.generateId('fb'),
      surveyId: survey.id,
      clientId: State.currentUser.id, // В реальном приложении это будет ID клиента
      userEmail: State.currentUser.email,
      metric: survey.metric,
      score: metricScore,
      comment: comment,
      answers: answers,
      submittedAt: new Date().toISOString()
    };

    // Сохранить фидбек
    State.feedback.push(feedback);

    // Обновить счетчик ответов в опросе
    const surveyIndex = State.surveys.findIndex(s => s.id === survey.id);
    if (surveyIndex !== -1) {
      State.surveys[surveyIndex].responses++;
    }

    // Показать сообщение об успехе
    Utils.showNotification('✅ Спасибо за ваши ответы!', 'success');

    // Вернуться к списку опросов
    setTimeout(() => {
      Navigation.navigateTo('surveys');
    }, 1500);
  }
};