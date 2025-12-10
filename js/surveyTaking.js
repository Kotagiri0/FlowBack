// surveyTaking.js - Модуль для прохождения опросов с ролевым доступом

const SurveyTaking = {
    currentSurvey: null,
    currentResponses: {},
    currentRespondent: null,

    // Инициализация модуля прохождения опросов
    init() {
        console.log('SurveyTaking module initialized');
    },

    // Проверка доступа роли к опросу
    checkRoleAccess(survey, userRole) {
        if (!survey.targetRoles || survey.targetRoles.length === 0) {
            return true; // Если роли не указаны, доступ всем
        }
        return survey.targetRoles.includes(userRole);
    },

    // Открыть опрос для прохождения
    openSurvey(surveyId, respondent) {
        const survey = AppState.surveys.find(s => s.id === surveyId);

        if (!survey) {
            Utils.showNotification('Опрос не найден', 'error');
            return;
        }

        // Проверка доступа по роли
        if (!this.checkRoleAccess(survey, respondent.role)) {
            Utils.showNotification('У вас нет доступа к этому опросу', 'error');
            return;
        }

        // Проверка, не проходил ли уже этот респондент опрос
        const existingResponse = AppState.surveyResponses?.find(
            r => r.surveyId === surveyId && r.respondentEmail === respondent.email
        );

        if (existingResponse) {
            Utils.showNotification('Вы уже проходили этот опрос', 'warning');
            return;
        }

        this.currentSurvey = survey;
        this.currentRespondent = respondent;
        this.currentResponses = {};

        this.renderSurveyForm();
    },

    // Отрисовка формы опроса
    renderSurveyForm() {
        const modal = document.getElementById('takeSurveyModal');
        if (!modal) {
            this.createSurveyModal();
            return this.renderSurveyForm();
        }

        const survey = this.currentSurvey;

        let questionsHTML = '';
        survey.questions.forEach((question, index) => {
            questionsHTML += this.renderQuestion(question, index);
        });

        const content = `
            <div class="modal-header">
                <h3>${survey.title}</h3>
                <button class="close-modal" onclick="SurveyTaking.closeSurvey()">×</button>
            </div>
            <div class="survey-info">
                <p><strong>Описание:</strong> ${survey.description || 'Нет описания'}</p>
                <p><strong>Респондент:</strong> ${this.currentRespondent.name} (${this.currentRespondent.role})</p>
            </div>
            <div class="survey-questions">
                ${questionsHTML}
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="SurveyTaking.closeSurvey()">Отмена</button>
                <button class="btn btn-primary" onclick="SurveyTaking.submitSurvey()">Отправить ответы</button>
            </div>
        `;

        document.querySelector('#takeSurveyModal .modal-content').innerHTML = content;
        modal.style.display = 'flex';
    },

    // Отрисовка отдельного вопроса
    renderQuestion(question, index) {
        let inputHTML = '';

        switch(question.type) {
            case 'text':
                inputHTML = `
                    <textarea 
                        id="response_${index}" 
                        class="form-control" 
                        rows="3" 
                        placeholder="Введите ваш ответ..."
                        ${question.required ? 'required' : ''}
                    ></textarea>
                `;
                break;

            case 'rating':
                const maxRating = question.scale || 5;
                inputHTML = `
                    <div class="rating-scale">
                        ${Array.from({length: maxRating}, (_, i) => i + 1).map(num => `
                            <label class="rating-option">
                                <input 
                                    type="radio" 
                                    name="response_${index}" 
                                    value="${num}"
                                    ${question.required ? 'required' : ''}
                                >
                                <span>${num}</span>
                            </label>
                        `).join('')}
                    </div>
                `;
                break;

            case 'choice':
                inputHTML = question.options.map((option, optIndex) => `
                    <label class="choice-option">
                        <input 
                            type="${question.multiple ? 'checkbox' : 'radio'}" 
                            name="response_${index}" 
                            value="${option}"
                            ${question.required && !question.multiple ? 'required' : ''}
                        >
                        <span>${option}</span>
                    </label>
                `).join('');
                break;

            case 'nps':
                inputHTML = `
                    <div class="nps-scale">
                        ${Array.from({length: 11}, (_, i) => i).map(num => `
                            <label class="nps-option ${num <= 6 ? 'detractor' : num <= 8 ? 'passive' : 'promoter'}">
                                <input 
                                    type="radio" 
                                    name="response_${index}" 
                                    value="${num}"
                                    ${question.required ? 'required' : ''}
                                >
                                <span>${num}</span>
                            </label>
                        `).join('')}
                    </div>
                    <div class="nps-labels">
                        <span>Совсем не вероятно</span>
                        <span>Очень вероятно</span>
                    </div>
                `;
                break;

            case 'csat':
                const csatOptions = ['Очень недоволен', 'Недоволен', 'Нейтрально', 'Доволен', 'Очень доволен'];
                inputHTML = `
                    <div class="csat-scale">
                        ${csatOptions.map((option, optIndex) => `
                            <label class="csat-option">
                                <input 
                                    type="radio" 
                                    name="response_${index}" 
                                    value="${optIndex + 1}"
                                    ${question.required ? 'required' : ''}
                                >
                                <span>😟😕😐🙂😊</span>
                                <small>${option}</small>
                            </label>
                        `).join('')}
                    </div>
                `;
                break;
        }

        return `
            <div class="question-block" data-question-index="${index}">
                <div class="question-header">
                    <span class="question-number">${index + 1}.</span>
                    <span class="question-text">${question.text}</span>
                    ${question.required ? '<span class="required-mark">*</span>' : ''}
                </div>
                <div class="question-input">
                    ${inputHTML}
                </div>
            </div>
        `;
    },

    // Создание модального окна для опроса
    createSurveyModal() {
        const modal = document.createElement('div');
        modal.id = 'takeSurveyModal';
        modal.className = 'modal';
        modal.innerHTML = '<div class="modal-content survey-modal-content"></div>';
        document.body.appendChild(modal);
    },

    // Сбор ответов из формы
    collectResponses() {
        const responses = {};

        this.currentSurvey.questions.forEach((question, index) => {
            let value;

            if (question.type === 'choice' && question.multiple) {
                // Множественный выбор
                const checkboxes = document.querySelectorAll(`input[name="response_${index}"]:checked`);
                value = Array.from(checkboxes).map(cb => cb.value);
            } else if (question.type === 'text') {
                // Текстовый ответ
                value = document.getElementById(`response_${index}`).value;
            } else {
                // Одиночный выбор (radio)
                const selected = document.querySelector(`input[name="response_${index}"]:checked`);
                value = selected ? selected.value : null;
            }

            responses[index] = {
                questionId: index,
                questionText: question.text,
                questionType: question.type,
                answer: value
            };
        });

        return responses;
    },

    // Валидация обязательных полей
    validateResponses(responses) {
        const errors = [];

        this.currentSurvey.questions.forEach((question, index) => {
            if (question.required) {
                const response = responses[index];
                if (!response.answer ||
                    (Array.isArray(response.answer) && response.answer.length === 0) ||
                    response.answer === '') {
                    errors.push(`Вопрос ${index + 1} обязателен для ответа`);
                }
            }
        });

        return errors;
    },

    // Отправка ответов
    async submitSurvey() {
        const responses = this.collectResponses();
        const errors = this.validateResponses(responses);

        if (errors.length > 0) {
            Utils.showNotification(errors.join('\n'), 'error');
            return;
        }

        const surveyResponse = {
            id: Date.now().toString(),
            surveyId: this.currentSurvey.id,
            surveyTitle: this.currentSurvey.title,
            respondentEmail: this.currentRespondent.email,
            respondentName: this.currentRespondent.name,
            respondentRole: this.currentRespondent.role,
            responses: responses,
            completedAt: new Date().toISOString(),
            timestamp: Date.now()
        };

        // Инициализация массива ответов если его нет
        if (!AppState.surveyResponses) {
            AppState.surveyResponses = [];
        }

        // Добавление ответа в состояние
        AppState.surveyResponses.push(surveyResponse);

        // Сохранение в localStorage
        try {
            localStorage.setItem('surveyResponses', JSON.stringify(AppState.surveyResponses));

            // Также сохраняем в файл через API
            await API.saveSurveyResponses(AppState.surveyResponses);

            Utils.showNotification('Спасибо! Ваши ответы сохранены', 'success');
            this.closeSurvey();

            // Обновляем статистику опроса
            this.updateSurveyStats(this.currentSurvey.id);

        } catch (error) {
            console.error('Error saving survey response:', error);
            Utils.showNotification('Ошибка при сохранении ответов', 'error');
        }
    },

    // Обновление статистики опроса
    updateSurveyStats(surveyId) {
        const survey = AppState.surveys.find(s => s.id === surveyId);
        if (!survey) return;

        const responses = AppState.surveyResponses.filter(r => r.surveyId === surveyId);
        survey.responsesCount = responses.length;
        survey.lastResponseDate = responses.length > 0 ?
            new Date(Math.max(...responses.map(r => r.timestamp))).toISOString() : null;

        // Сохраняем обновленные опросы
        API.saveSurveys(AppState.surveys);
    },

    // Закрытие опроса
    closeSurvey() {
        const modal = document.getElementById('takeSurveyModal');
        if (modal) {
            modal.style.display = 'none';
        }

        this.currentSurvey = null;
        this.currentResponses = {};
        this.currentRespondent = null;
    },

    // Получить результаты опроса
    getSurveyResults(surveyId) {
        return AppState.surveyResponses?.filter(r => r.surveyId === surveyId) || [];
    },

    // Экспорт результатов опроса
    exportResults(surveyId) {
        const survey = AppState.surveys.find(s => s.id === surveyId);
        const responses = this.getSurveyResults(surveyId);

        if (!survey || responses.length === 0) {
            Utils.showNotification('Нет данных для экспорта', 'warning');
            return;
        }

        const data = {
            survey: {
                title: survey.title,
                description: survey.description,
                createdAt: survey.createdAt,
                responsesCount: responses.length
            },
            responses: responses.map(r => ({
                respondent: r.respondentName,
                email: r.respondentEmail,
                role: r.respondentRole,
                completedAt: r.completedAt,
                answers: Object.values(r.responses).map(resp => ({
                    question: resp.questionText,
                    type: resp.questionType,
                    answer: resp.answer
                }))
            }))
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `survey_results_${surveyId}_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        Utils.showNotification('Результаты экспортированы', 'success');
    }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    SurveyTaking.init();
});