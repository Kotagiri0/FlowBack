// ============================================
// js/roleAuth.js - Новый файл для управления ролями
// ============================================

const RoleAuth = {
    currentUser: null,

    roles: {
        admin: 'Администратор',
        lpr: 'ЛПР',
        tech_impl: 'Техспец внедрения',
        tech_support: 'Техспец сопровождения',
        business_user: 'Бизнес-юзер'
    },

    // Опросы для каждой роли
    roleSurveys: {
        lpr: [
            {
                id: 'lpr_implementation',
                title: 'Оценка процесса внедрения',
                description: 'Опрос для лиц, принимающих решения',
                questions: [
                    {
                        id: 'q1',
                        type: 'rating',
                        question: 'Оцените процесс принятия решения о внедрении',
                        scale: 5
                    },
                    {
                        id: 'q2',
                        type: 'rating',
                        question: 'Насколько решение соответствует бизнес-целям?',
                        scale: 5
                    },
                    {
                        id: 'q3',
                        type: 'text',
                        question: 'Какие факторы повлияли на ваше решение?'
                    },
                    {
                        id: 'q4',
                        type: 'text',
                        question: 'Какие риски вы видите при внедрении?'
                    }
                ]
            },
            {
                id: 'lpr_strategic',
                title: 'Стратегическая оценка решения',
                description: 'Оценка стратегического соответствия',
                questions: [
                    {
                        id: 'q1',
                        type: 'rating',
                        question: 'Оцените ROI внедрения',
                        scale: 5
                    },
                    {
                        id: 'q2',
                        type: 'rating',
                        question: 'Оцените соответствие стратегии компании',
                        scale: 5
                    },
                    {
                        id: 'q3',
                        type: 'text',
                        question: 'Какие долгосрочные преимущества вы ожидаете?'
                    }
                ]
            }
        ],
        tech_impl: [
            {
                id: 'tech_impl_assessment',
                title: 'Техническая оценка внедрения',
                description: 'Оценка технических аспектов',
                questions: [
                    {
                        id: 'q1',
                        type: 'rating',
                        question: 'Оцените качество технической документации',
                        scale: 5
                    },
                    {
                        id: 'q2',
                        type: 'rating',
                        question: 'Насколько удобна архитектура системы?',
                        scale: 5
                    },
                    {
                        id: 'q3',
                        type: 'text',
                        question: 'Какие технические сложности возникли?'
                    },
                    {
                        id: 'q4',
                        type: 'text',
                        question: 'Какие улучшения вы предлагаете?'
                    }
                ]
            },
            {
                id: 'tech_impl_integration',
                title: 'Интеграция систем',
                description: 'Опрос по интеграции',
                questions: [
                    {
                        id: 'q1',
                        type: 'rating',
                        question: 'Оцените простоту интеграции',
                        scale: 5
                    },
                    {
                        id: 'q2',
                        type: 'text',
                        question: 'С какими системами проводилась интеграция?'
                    },
                    {
                        id: 'q3',
                        type: 'text',
                        question: 'Какие проблемы возникли при интеграции?'
                    }
                ]
            }
        ],
        tech_support: [
            {
                id: 'support_quality',
                title: 'Качество технической поддержки',
                description: 'Оценка качества поддержки',
                questions: [
                    {
                        id: 'q1',
                        type: 'rating',
                        question: 'Оцените скорость реакции на обращения',
                        scale: 5
                    },
                    {
                        id: 'q2',
                        type: 'rating',
                        question: 'Оцените качество решения проблем',
                        scale: 5
                    },
                    {
                        id: 'q3',
                        type: 'rating',
                        question: 'Оцените профессионализм специалистов',
                        scale: 5
                    },
                    {
                        id: 'q4',
                        type: 'text',
                        question: 'Что можно улучшить в процессе поддержки?'
                    }
                ]
            },
            {
                id: 'support_incidents',
                title: 'Работа с инцидентами',
                description: 'Опрос по инцидентам',
                questions: [
                    {
                        id: 'q1',
                        type: 'rating',
                        question: 'Оцените скорость решения критических инцидентов',
                        scale: 5
                    },
                    {
                        id: 'q2',
                        type: 'text',
                        question: 'Опишите самый сложный инцидент'
                    }
                ]
            }
        ],
        business_user: [
            {
                id: 'user_experience',
                title: 'Пользовательский опыт',
                description: 'Оценка удобства использования',
                questions: [
                    {
                        id: 'q1',
                        type: 'rating',
                        question: 'Насколько интуитивен интерфейс?',
                        scale: 5
                    },
                    {
                        id: 'q2',
                        type: 'rating',
                        question: 'Оцените скорость работы системы',
                        scale: 5
                    },
                    {
                        id: 'q3',
                        type: 'rating',
                        question: 'Насколько легко найти нужные функции?',
                        scale: 5
                    },
                    {
                        id: 'q4',
                        type: 'text',
                        question: 'Что бы вы улучшили в интерфейсе?'
                    }
                ]
            },
            {
                id: 'functionality',
                title: 'Функциональность системы',
                description: 'Оценка возможностей',
                questions: [
                    {
                        id: 'q1',
                        type: 'rating',
                        question: 'Оцените полноту функционала',
                        scale: 5
                    },
                    {
                        id: 'q2',
                        type: 'text',
                        question: 'Каких функций не хватает?'
                    },
                    {
                        id: 'q3',
                        type: 'text',
                        question: 'Какие функции используете чаще всего?'
                    }
                ]
            }
        ]
    },

    init() {
        this.checkAuth();
        this.attachEventListeners();
    },

    checkAuth() {
        const savedUser = localStorage.getItem('flowback_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showDashboard();
        } else {
            this.showLoginModal();
        }
    },

    showLoginModal() {
        const modal = document.createElement('div');
        modal.id = 'roleAuthModal';
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 450px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="font-size: 32px; margin-bottom: 10px;">🔄 FlowBack</h2>
                    <p style="color: #666;">Добро пожаловать! Войдите в систему</p>
                </div>
                <form id="roleLoginForm">
                    <div class="form-group">
                        <label>Имя пользователя</label>
                        <input type="text" id="loginUsername" placeholder="Введите ваше имя" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="loginEmail" placeholder="email@company.ru" required>
                    </div>
                    <div class="form-group">
                        <label>Выберите вашу роль</label>
                        <select id="loginRole" required>
                            <option value="">-- Выберите роль --</option>
                            <option value="admin">👨‍💼 Администратор (просмотр всех результатов)</option>
                            <option value="lpr">💼 ЛПР - Лицо принимающее решение</option>
                            <option value="tech_impl">🔧 Техспец внедрения</option>
                            <option value="tech_support">🛠️ Техспец сопровождения</option>
                            <option value="business_user">👤 Бизнес-юзер</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px;">
                        Войти в систему
                    </button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('roleLoginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });
    },

    login() {
        const username = document.getElementById('loginUsername').value;
        const email = document.getElementById('loginEmail').value;
        const role = document.getElementById('loginRole').value;

        this.currentUser = { username, email, role, loginDate: new Date().toISOString() };
        localStorage.setItem('flowback_user', JSON.stringify(this.currentUser));

        const modal = document.getElementById('roleAuthModal');
        if (modal) modal.remove();

        this.showDashboard();
    },

    showDashboard() {
        // Обновляем header
        const userInfo = document.querySelector('.user-info span:last-child');
        if (userInfo) {
            const roleDisplay = this.roles[this.currentUser.role];
            userInfo.textContent = `${roleDisplay}: ${this.currentUser.username}`;
        }

        // Показываем соответствующий контент
        if (this.currentUser.role === 'admin') {
            this.showAdminView();
        } else {
            this.showUserView();
        }
    },

    showAdminView() {
        // Администратор видит все результаты
        document.querySelectorAll('.tab').forEach(tab => {
            tab.style.display = 'block';
        });

        // Переключаемся на вкладку аналитики
        Navigation.switchTab('analytics');
        this.loadAdminResults();
    },

    showUserView() {
        // Пользователи видят только свои опросы
        document.querySelectorAll('.tab').forEach(tab => {
            const tabName = tab.dataset.tab;
            if (['surveys', 'feedback'].includes(tabName)) {
                tab.style.display = 'block';
            } else if (tabName !== 'settings') {
                tab.style.display = 'none';
            }
        });

        // Показываем опросы для роли пользователя
        Navigation.switchTab('surveys');
        this.loadUserSurveys();
    },

    loadUserSurveys() {
        const surveysSection = document.getElementById('surveys');
        const userSurveys = this.roleSurveys[this.currentUser.role] || [];
        const completedSurveys = this.getCompletedSurveys();

        surveysSection.innerHTML = `
            <div class="content-header">
                <h2>📝 Ваши опросы</h2>
                <p style="color: #666; margin-top: 10px;">
                    Роль: ${this.roles[this.currentUser.role]}
                </p>
            </div>
            <div class="grid">
                ${userSurveys.map(survey => {
            const isCompleted = completedSurveys.includes(survey.id);
            return `
                        <div class="card">
                            <div class="card-header">
                                <h3>${survey.title}</h3>
                                ${isCompleted ? '<span class="badge" style="background: #4caf50;">✓ Завершен</span>' : '<span class="badge" style="background: #ff9800;">Ожидает</span>'}
                            </div>
                            <p style="color: #666; margin: 15px 0;">${survey.description}</p>
                            <p style="color: #999; font-size: 14px; margin-bottom: 15px;">
                                Вопросов: ${survey.questions.length}
                            </p>
                            <button 
                                class="btn ${isCompleted ? 'btn-secondary' : 'btn-primary'}" 
                                onclick="RoleAuth.startSurvey('${survey.id}')"
                                ${isCompleted ? 'disabled' : ''}
                            >
                                ${isCompleted ? '✓ Опрос пройден' : '📝 Пройти опрос'}
                            </button>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    },

    startSurvey(surveyId) {
        const allSurveys = Object.values(this.roleSurveys).flat();
        const survey = allSurveys.find(s => s.id === surveyId);

        if (!survey) return;

        // Создаем модальное окно с опросом
        const modal = document.createElement('div');
        modal.id = 'surveyTakingModal';
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px; max-height: 80vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3>${survey.title}</h3>
                    <button class="close-modal" onclick="document.getElementById('surveyTakingModal').remove()">×</button>
                </div>
                <p style="color: #666; margin-bottom: 30px;">${survey.description}</p>
                
                <form id="surveyForm">
                    ${survey.questions.map((question, index) => {
            if (question.type === 'rating') {
                return `
                                <div class="form-group" style="margin-bottom: 30px;">
                                    <label style="font-weight: 600; margin-bottom: 15px; display: block;">
                                        ${index + 1}. ${question.question}
                                    </label>
                                    <div class="rating-group" data-question="${question.id}" style="display: flex; gap: 10px; flex-wrap: wrap;">
                                        ${Array.from({length: question.scale}, (_, i) => `
                                            <label class="rating-option">
                                                <input type="radio" name="q_${question.id}" value="${i + 1}" required>
                                                <span class="rating-label">${i + 1}</span>
                                            </label>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
            } else {
                return `
                                <div class="form-group" style="margin-bottom: 30px;">
                                    <label style="font-weight: 600; margin-bottom: 10px;">
                                        ${index + 1}. ${question.question}
                                    </label>
                                    <textarea 
                                        name="q_${question.id}" 
                                        rows="4" 
                                        placeholder="Введите ваш ответ..."
                                        required
                                    ></textarea>
                                </div>
                            `;
            }
        }).join('')}
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px;">
                        ✓ Отправить ответы
                    </button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Добавляем стили для рейтинга
        const style = document.createElement('style');
        style.textContent = `
            .rating-option {
                cursor: pointer;
                position: relative;
            }
            .rating-option input {
                position: absolute;
                opacity: 0;
            }
            .rating-label {
                display: inline-block;
                padding: 10px 20px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                transition: all 0.3s;
                background: white;
            }
            .rating-option input:checked + .rating-label {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-color: transparent;
            }
            .rating-label:hover {
                border-color: #667eea;
            }
        `;
        document.head.appendChild(style);

        // Обработчик отправки формы
        document.getElementById('surveyForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitSurvey(surveyId, survey, e.target);
        });
    },

    submitSurvey(surveyId, survey, form) {
        const formData = new FormData(form);
        const responses = {};

        survey.questions.forEach(question => {
            responses[question.id] = {
                question: question.question,
                answer: formData.get(`q_${question.id}`)
            };
        });

        // Сохраняем ответы
        const response = {
            surveyId,
            surveyTitle: survey.title,
            username: this.currentUser.username,
            email: this.currentUser.email,
            role: this.currentUser.role,
            responses,
            completedAt: new Date().toISOString()
        };

        const allResponses = JSON.parse(localStorage.getItem('survey_responses') || '[]');
        allResponses.push(response);
        localStorage.setItem('survey_responses', JSON.stringify(allResponses));

        // Закрываем модальное окно
        document.getElementById('surveyTakingModal').remove();

        // Показываем уведомление
        this.showNotification('Спасибо! Ваши ответы успешно сохранены.', 'success');

        // Обновляем список опросов
        this.loadUserSurveys();
    },

    getCompletedSurveys() {
        const allResponses = JSON.parse(localStorage.getItem('survey_responses') || '[]');
        return allResponses
            .filter(r => r.email === this.currentUser.email)
            .map(r => r.surveyId);
    },

    loadAdminResults() {
        const analyticsSection = document.getElementById('analytics');
        const allResponses = JSON.parse(localStorage.getItem('survey_responses') || '[]');

        // Статистика
        const totalResponses = allResponses.length;
        const uniqueUsers = [...new Set(allResponses.map(r => r.email))].length;
        const byRole = {};
        Object.keys(this.roles).forEach(role => {
            byRole[role] = allResponses.filter(r => r.role === role).length;
        });

        analyticsSection.innerHTML = `
            <div class="content-header">
                <h2>📊 Результаты опросов</h2>
            </div>

            <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 30px;">
                <div class="card">
                    <h4 style="color: #666; margin-bottom: 10px;">Всего ответов</h4>
                    <div style="font-size: 36px; font-weight: 700; color: #667eea;">${totalResponses}</div>
                </div>
                <div class="card">
                    <h4 style="color: #666; margin-bottom: 10px;">Уникальных респондентов</h4>
                    <div style="font-size: 36px; font-weight: 700; color: #4caf50;">${uniqueUsers}</div>
                </div>
                ${Object.entries(byRole).map(([role, count]) => `
                    <div class="card">
                        <h4 style="color: #666; margin-bottom: 10px;">${this.roles[role]}</h4>
                        <div style="font-size: 36px; font-weight: 700; color: #ff9800;">${count}</div>
                    </div>
                `).join('')}
            </div>

            <div class="card">
                <h3 style="margin-bottom: 20px;">Все ответы</h3>
                <div style="overflow-x: auto;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Респондент</th>
                                <th>Роль</th>
                                <th>Опрос</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${allResponses.map((response, index) => `
                                <tr>
                                    <td>${new Date(response.completedAt).toLocaleString('ru-RU')}</td>
                                    <td>${response.username}<br><small style="color: #999;">${response.email}</small></td>
                                    <td><span class="badge">${this.roles[response.role]}</span></td>
                                    <td>${response.surveyTitle}</td>
                                    <td>
                                        <button class="btn btn-sm btn-primary" onclick="RoleAuth.viewResponse(${index})">
                                            👁️ Просмотр
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    viewResponse(index) {
        const allResponses = JSON.parse(localStorage.getItem('survey_responses') || '[]');
        const response = allResponses[index];

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>📋 ${response.surveyTitle}</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">×</button>
                </div>
                
                <div style="background: #f5f7fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p><strong>Респондент:</strong> ${response.username}</p>
                    <p><strong>Email:</strong> ${response.email}</p>
                    <p><strong>Роль:</strong> ${this.roles[response.role]}</p>
                    <p><strong>Дата:</strong> ${new Date(response.completedAt).toLocaleString('ru-RU')}</p>
                </div>

                <div>
                    <h4 style="margin-bottom: 15px;">Ответы:</h4>
                    ${Object.values(response.responses).map((item, i) => `
                        <div style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
                            <p style="font-weight: 600; margin-bottom: 8px;">${i + 1}. ${item.question}</p>
                            <p style="color: #333;">${item.answer}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    logout() {
        if (confirm('Вы уверены, что хотите выйти?')) {
            localStorage.removeItem('flowback_user');
            location.reload();
        }
    },

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#4caf50' : '#2196f3'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    attachEventListeners() {
        // Добавляем кнопку выхода в header
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn btn-secondary';
        logoutBtn.innerHTML = '🚪 Выход';
        logoutBtn.style.marginLeft = '15px';
        logoutBtn.onclick = () => this.logout();

        const userInfo = document.querySelector('.user-info');
        if (userInfo) {
            userInfo.appendChild(logoutBtn);
        }
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    RoleAuth.init();
});

// ============================================
// ИНСТРУКЦИИ ПО ИНТЕГРАЦИИ:
// ============================================
//
// 1. Сохраните этот код в файл: js/roleAuth.js
//
// 2. Добавьте в index.html перед закрывающим тегом </body>:
//    <script src="js/roleAuth.js"></script>
//
// 3. Добавьте стили в css/modals.css или создайте css/roleAuth.css:
//
/*
.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table th,
.data-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
}

.data-table th {
    background: #f5f7fa;
    font-weight: 600;
    color: #333;
}

.data-table tr:hover {
    background: #f9f9f9;
}

.btn-sm {
    padding: 6px 12px;
    font-size: 13px;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
*/