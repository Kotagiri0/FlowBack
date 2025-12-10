// Survey Types & Question Templates
const SurveyTypes = {
    // Шаблоны опросов для разных ролей
    templates: {
        lpr: {
            name: 'Оценка внедрения (ЛПР)',
            description: 'Опрос для лиц, принимающих решения',
            questions: [
                {
                    id: 1,
                    type: 'nps',
                    text: 'Насколько вероятно, что вы порекомендуете наш продукт коллегам?',
                    required: true,
                    scale: 10
                },
                {
                    id: 2,
                    type: 'rating',
                    text: 'Оцените качество внедрения',
                    required: true,
                    scale: 5
                },
                {
                    id: 3,
                    type: 'rating',
                    text: 'Насколько проект оправдал ваши ожидания?',
                    required: true,
                    scale: 5
                },
                {
                    id: 4,
                    type: 'multiselect',
                    text: 'Какие аспекты работы были наиболее важны?',
                    required: false,
                    options: ['Скорость внедрения', 'Качество поддержки', 'Функциональность', 'Стоимость', 'Документация']
                },
                {
                    id: 5,
                    type: 'text',
                    text: 'Какие улучшения вы бы предложили?',
                    required: false
                }
            ]
        },

        tech_deploy: {
            name: 'Техническое качество внедрения',
            description: 'Опрос для технических специалистов по внедрению',
            questions: [
                {
                    id: 1,
                    type: 'rating',
                    text: 'Оцените техническую документацию',
                    required: true,
                    scale: 5
                },
                {
                    id: 2,
                    type: 'rating',
                    text: 'Насколько легко было настроить систему?',
                    required: true,
                    scale: 5
                },
                {
                    id: 3,
                    type: 'multiselect',
                    text: 'С какими трудностями вы столкнулись?',
                    required: false,
                    options: ['Интеграция с существующими системами', 'Настройка API', 'Миграция данных', 'Производительность', 'Безопасность']
                },
                {
                    id: 4,
                    type: 'yesno',
                    text: 'Все технические требования были выполнены?',
                    required: true
                },
                {
                    id: 5,
                    type: 'text',
                    text: 'Опишите основные технические проблемы',
                    required: false
                }
            ]
        },

        tech_support: {
            name: 'Оценка эксплуатации',
            description: 'Опрос для специалистов по сопровождению',
            questions: [
                {
                    id: 1,
                    type: 'ces',
                    text: 'Насколько легко решать проблемы пользователей?',
                    required: true,
                    scale: 5
                },
                {
                    id: 2,
                    type: 'rating',
                    text: 'Оцените стабильность системы',
                    required: true,
                    scale: 5
                },
                {
                    id: 3,
                    type: 'rating',
                    text: 'Оцените качество поддержки от вендора',
                    required: true,
                    scale: 5
                },
                {
                    id: 4,
                    type: 'multiselect',
                    text: 'Какие проблемы возникают чаще всего?',
                    required: false,
                    options: ['Ошибки в системе', 'Проблемы производительности', 'Вопросы пользователей', 'Интеграции не работают', 'Нужна новая функциональность']
                },
                {
                    id: 5,
                    type: 'text',
                    text: 'Что нужно улучшить для упрощения поддержки?',
                    required: false
                }
            ]
        },

        business: {
            name: 'Удобство использования',
            description: 'Опрос для бизнес-пользователей',
            questions: [
                {
                    id: 1,
                    type: 'csat',
                    text: 'Насколько вы удовлетворены системой?',
                    required: true,
                    scale: 5
                },
                {
                    id: 2,
                    type: 'rating',
                    text: 'Насколько интуитивно понятен интерфейс?',
                    required: true,
                    scale: 5
                },
                {
                    id: 3,
                    type: 'rating',
                    text: 'Насколько быстро работает система?',
                    required: true,
                    scale: 5
                },
                {
                    id: 4,
                    type: 'multiselect',
                    text: 'Какие функции вы используете чаще всего?',
                    required: false,
                    options: ['Отчеты', 'Дашборды', 'Поиск', 'Экспорт данных', 'Настройки']
                },
                {
                    id: 5,
                    type: 'text',
                    text: 'Какие функции вам не хватает?',
                    required: false
                }
            ]
        }
    },

    // Типы вопросов
    questionTypes: {
        nps: {
            name: 'NPS (0-10)',
            component: 'NPSQuestion',
            scoreType: 'promoter'
        },
        csat: {
            name: 'CSAT (1-5)',
            component: 'RatingQuestion',
            scoreType: 'satisfaction'
        },
        ces: {
            name: 'CES (1-5)',
            component: 'CESQuestion',
            scoreType: 'effort'
        },
        rating: {
            name: 'Оценка (1-5)',
            component: 'RatingQuestion',
            scoreType: 'rating'
        },
        yesno: {
            name: 'Да/Нет',
            component: 'YesNoQuestion',
            scoreType: 'boolean'
        },
        multiselect: {
            name: 'Множественный выбор',
            component: 'MultiSelectQuestion',
            scoreType: 'options'
        },
        text: {
            name: 'Текстовый ответ',
            component: 'TextQuestion',
            scoreType: 'text'
        },
        table: {
            name: 'Табличный вопрос',
            component: 'TableQuestion',
            scoreType: 'matrix'
        }
    },

    // Получить шаблон опроса по роли
    getTemplateByRole(role) {
        return this.templates[role] || null;
    },

    // Создать опрос из шаблона
    createFromTemplate(role, clientId, triggerType) {
        const template = this.getTemplateByRole(role);

        if (!template) {
            console.error('Шаблон не найден для роли:', role);
            return null;
        }

        return {
            id: Utils.generateId(),
            title: template.name,
            description: template.description,
            role: role,
            clientId: clientId,
            trigger: triggerType,
            questions: template.questions,
            status: 'active',
            createdAt: new Date().toISOString()
        };
    },

    // Валидация ответа на вопрос
    validateAnswer(question, answer) {
        if (question.required && !answer) {
            return { valid: false, error: 'Это обязательный вопрос' };
        }

        switch (question.type) {
            case 'nps':
                if (answer < 0 || answer > 10) {
                    return { valid: false, error: 'Оценка должна быть от 0 до 10' };
                }
                break;

            case 'rating':
            case 'csat':
            case 'ces':
                if (answer < 1 || answer > (question.scale || 5)) {
                    return { valid: false, error: `Оценка должна быть от 1 до ${question.scale || 5}` };
                }
                break;

            case 'text':
                if (question.required && answer.trim().length < 3) {
                    return { valid: false, error: 'Ответ должен содержать минимум 3 символа' };
                }
                break;
        }

        return { valid: true };
    },

    // Рендер вопроса в зависимости от типа
    renderQuestion(question, value, onChange) {
        switch (question.type) {
            case 'nps':
                return this.renderNPSQuestion(question, value, onChange);
            case 'rating':
            case 'csat':
                return this.renderRatingQuestion(question, value, onChange);
            case 'ces':
                return this.renderCESQuestion(question, value, onChange);
            case 'yesno':
                return this.renderYesNoQuestion(question, value, onChange);
            case 'multiselect':
                return this.renderMultiSelectQuestion(question, value, onChange);
            case 'text':
                return this.renderTextQuestion(question, value, onChange);
            default:
                return '<p>Неизвестный тип вопроса</p>';
        }
    },

    renderNPSQuestion(question, value, onChange) {
        return `
      <div class="question-block">
        <label>${question.text} ${question.required ? '*' : ''}</label>
        <div class="nps-scale">
          ${Array.from({length: 11}, (_, i) => `
            <button 
              class="nps-btn ${value === i ? 'selected' : ''}"
              onclick="${onChange}(${i})"
            >${i}</button>
          `).join('')}
        </div>
        <div class="nps-labels">
          <span>Совсем не вероятно</span>
          <span>Очень вероятно</span>
        </div>
      </div>
    `;
    },

    renderRatingQuestion(question, value, onChange) {
        return `
      <div class="question-block">
        <label>${question.text} ${question.required ? '*' : ''}</label>
        <div class="rating-scale">
          ${Array.from({length: question.scale || 5}, (_, i) => i + 1).map(i => `
            <button 
              class="rating-btn ${value === i ? 'selected' : ''}"
              onclick="${onChange}(${i})"
            >${i}</button>
          `).join('')}
        </div>
      </div>
    `;
    },

    renderCESQuestion(question, value, onChange) {
        return `
      <div class="question-block">
        <label>${question.text} ${question.required ? '*' : ''}</label>
        <div class="ces-scale">
          ${Array.from({length: 5}, (_, i) => i + 1).map(i => `
            <button 
              class="ces-btn ${value === i ? 'selected' : ''}"
              onclick="${onChange}(${i})"
            >
              ${i}
            </button>
          `).join('')}
        </div>
        <div class="ces-labels">
          <span>Очень сложно</span>
          <span>Очень легко</span>
        </div>
      </div>
    `;
    },

    renderYesNoQuestion(question, value, onChange) {
        return `
      <div class="question-block">
        <label>${question.text} ${question.required ? '*' : ''}</label>
        <div class="yesno-buttons">
          <button 
            class="btn ${value === 'yes' ? 'btn-primary' : 'btn-secondary'}"
            onclick="${onChange}('yes')"
          >Да</button>
          <button 
            class="btn ${value === 'no' ? 'btn-primary' : 'btn-secondary'}"
            onclick="${onChange}('no')"
          >Нет</button>
        </div>
      </div>
    `;
    },

    renderMultiSelectQuestion(question, value, onChange) {
        const selected = value || [];
        return `
      <div class="question-block">
        <label>${question.text} ${question.required ? '*' : ''}</label>
        <div class="multiselect-options">
          ${question.options.map((option, idx) => `
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                value="${option}"
                ${selected.includes(option) ? 'checked' : ''}
                onchange="${onChange}(this)"
              />
              ${option}
            </label>
          `).join('')}
        </div>
      </div>
    `;
    },

    renderTextQuestion(question, value, onChange) {
        return `
      <div class="question-block">
        <label>${question.text} ${question.required ? '*' : ''}</label>
        <textarea 
          rows="4"
          placeholder="Введите ваш ответ..."
          onchange="${onChange}(this.value)"
        >${value || ''}</textarea>
      </div>
    `;
    }
};