// ===============================
// Survey Manager (объединённый)
// ===============================
const SurveyManager = {
    selectedTriggers: [],

    //
    // ----------------------------------------------------
    // 1. ОСНОВНОЙ РЕНДЕР: список опросов
    // ----------------------------------------------------
    //
    async render() {
        const container = document.getElementById('surveys');
        if (!container) return;

        const surveys = State.getSurveys() || [];

        if (surveys.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>📝 Нет опросов</h3>
                    <p>Создайте первый опрос</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="section-header">
                <h2>Список опросов</h2>
                <button class="btn btn-primary" onclick="Navigation.switchTab('create')">
                    ➕ Создать новый
                </button>
            </div>

            <div class="surveys-grid">
        `;

        surveys.forEach(survey => {
            html += `
                <div class="survey-card">
                    <div class="survey-card-header">
                        <h3>${survey.name}</h3>
                        <span class="badge badge-${survey.status === 'active' ? 'success' : 'secondary'}">
                            ${survey.status === 'active' ? 'Активен' : 'Пауза'}
                        </span>
                    </div>

                    <div class="survey-card-meta">
                        <span>🎯 ${survey.targetAudience}</span>
                        <span>📊 ${survey.metrics?.join(', ') || "—"}</span>
                        <span>💬 ${survey.responses || 0} ответов</span>
                    </div>

                    <div class="survey-card-actions">
                        <button class="btn btn-sm btn-primary" onclick="SurveyManager.viewSurvey(${survey.id})">
                            Открыть
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="SurveyManager.editSurvey(${survey.id})">
                            ✏️ Изменить
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="SurveyManager.deleteSurvey(${survey.id})">
                            🗑 Удалить
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html + "</div>";
    },

    //
    // ----------------------------------------------------
    // 2. РЕНДЕРИНГ ФОРМЫ СОЗДАНИЯ ОПРОСА
    // ----------------------------------------------------
    //
    async renderCreateForm() {
        const createSection = document.getElementById('create');
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
                        <p>Через 24 часа</p>
                    </div>
                    <div class="trigger-item" onclick="SurveyManager.toggleTrigger(this, 'after_release')">
                        <strong>🚀 После релиза</strong>
                        <p>Через 48 часов</p>
                    </div>
                    <div class="trigger-item" onclick="SurveyManager.toggleTrigger(this, 'after_incident')">
                        <strong>⚠️ После инцидента</strong>
                        <p>Через 72 часа</p>
                    </div>
                    <div class="trigger-item" onclick="SurveyManager.toggleTrigger(this, 'after_sprint')">
                        <strong>📊 После спринта</strong>
                        <p>По завершении</p>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>Тип метрики</label>
                <select id="surveyMetric">
                    <option>NPS</option>
                    <option>CSAT</option>
                    <option>CES</option>
                    <option>Кастомный опрос</option>
                </select>
            </div>

            <button class="btn btn-primary" onclick="SurveyManager.createSurvey()">Создать</button>
        `;
    },

    toggleTrigger(element, id) {
        element.classList.toggle('selected');

        const pos = this.selectedTriggers.indexOf(id);
        if (pos > -1) this.selectedTriggers.splice(pos, 1);
        else this.selectedTriggers.push(id);
    },

    //
    // ----------------------------------------------------
    // 3. СОЗДАНИЕ ОПРОСА
    // ----------------------------------------------------
    //
    async createSurvey() {
        const name = document.getElementById('surveyName').value.trim();

        if (!name) {
            Utils.showNotification("Введите название опроса", "error");
            return;
        }

        const surveyData = {
            id: Date.now(),
            name,
            targetAudience: document.getElementById('surveyAudience').value,
            metrics: [document.getElementById('surveyMetric').value],
            triggers: this.selectedTriggers,
            status: "active",
            responses: 0
        };

        const result = await API.createSurvey(surveyData);
        if (result.ok) {
            State.surveys.push(surveyData);
            Utils.showNotification("Опрос успешно создан");
            Navigation.switchTab("surveys");
        }
    },

    //
    // ----------------------------------------------------
    // 4. ПРОСМОТР ОПРОСА / РЕДАКТИРОВАНИЕ
    // ----------------------------------------------------
    //
    viewSurvey(id) {
        Utils.showNotification("Функция просмотра будет подключена позже");
    },

    editSurvey(id) {
        Utils.showNotification("Редактор опросов будет добавлен позже");
    },

    deleteSurvey(id) {
        if (!confirm("Удалить опрос?")) return;

        State.surveys = State.surveys.filter(s => s.id !== id);
        this.render();
    },

    //
    // ----------------------------------------------------
    // 5. ПРОХОЖДЕНИЕ ОПРОСА
    // ----------------------------------------------------
    //
    openSurveyForTaking(surveyId) {
        this.showRespondentSelector(surveyId);
    },

    showRespondentSelector(surveyId) {
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.style.display = "flex";
        modal.id = "respondentSelectorModal";

        const clients = State.getClients();

        let options = clients
            .map(c => `<option value="${c.email}" data-name="${c.contact}">${c.contact} (${c.company})</option>`)
            .join("");

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Выберите респондента</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">×</button>
                </div>

                <div class="modal-body">
                    <select id="respondentSelect">
                        <option value="">— Выберите —</option>
                        ${options}
                    </select>

                    <input id="respondentName" placeholder="Имя">
                    <input id="respondentEmail" placeholder="Email">
                </div>

                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Отмена</button>
                    <button class="btn btn-primary" onclick="SurveyManager.startSurvey('${surveyId}')">Начать</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById("respondentSelect").addEventListener("change", function () {
            const opt = this.selectedOptions[0];
            if (!opt.value) return;
            document.getElementById("respondentName").value = opt.dataset.name;
            document.getElementById("respondentEmail").value = opt.value;
        });
    },

    startSurvey(surveyId) {
        const name = document.getElementById("respondentName").value.trim();
        const email = document.getElementById("respondentEmail").value.trim();

        if (!name || !email) {
            Utils.showNotification("Введите имя и email", "error");
            return;
        }

        if (!Utils.validateEmail(email)) {
            Utils.showNotification("Некорректный email", "error");
            return;
        }

        document.getElementById("respondentSelectorModal")?.remove();

        SurveyTaking.openSurvey(surveyId, { name, email, role: "User" });
    },

    //
    // ----------------------------------------------------
    // 6. РЕЗУЛЬТАТЫ ОПРОСОВ
    // ----------------------------------------------------
    //
    viewResults(surveyId) {
        const responses = SurveyTaking.getSurveyResults(surveyId);
        const survey = State.getSurveys().find(s => s.id == surveyId);

        if (!survey) return;

        const modal = document.createElement("div");
        modal.className = "modal";
        modal.style.display = "flex";

        let html = responses.length
            ? responses.map(r => `
                <div class="response-item">
                    <strong>${r.respondentName}</strong>
                    <small>${Utils.formatDate(r.completedAt)}</small>
                </div>
            `).join("")
            : "<p>Нет ответов</p>";

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Результаты — ${survey.name}</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    ${html}
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Закрыть</button>
                    <button class="btn btn-primary" onclick="SurveyTaking.exportResults('${surveyId}')">Экспорт</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }
};
