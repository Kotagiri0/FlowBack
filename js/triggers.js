// Triggers System - Автоматические опросы
const TriggerManager = {
    // Типы триггеров
    TRIGGER_TYPES: {
        INTEGRATION_FINISHED: 'integration_finished',
        UPDATE_RELEASED: 'update_released',
        INCIDENT_CLOSED: 'incident_closed',
        MONTH_PASSED: 'month_passed',
        SPRINT_FINISHED: 'sprint_finished',
        DEMO_COMPLETED: 'demo_completed',
        MANUAL: 'manual'
    },

    // Конфигурация триггеров
    triggerConfig: {
        integration_finished: {
            name: 'Завершение внедрения',
            roles: ['lpr', 'tech_deploy'],
            delay_hours: 24,
            icon: '🎯',
            autoSend: true
        },
        update_released: {
            name: 'Выход обновления',
            roles: ['business', 'tech_support'],
            delay_hours: 48,
            icon: '🚀',
            autoSend: true
        },
        incident_closed: {
            name: 'Закрытие инцидента',
            roles: ['tech_support', 'lpr'],
            delay_hours: 72,
            icon: '⚠️',
            autoSend: true
        },
        month_passed: {
            name: 'Ежемесячный отчет',
            roles: ['lpr'],
            delay_hours: 0,
            icon: '📅',
            autoSend: true
        },
        sprint_finished: {
            name: 'Завершение спринта',
            roles: ['tech_deploy', 'tech_support'],
            delay_hours: 0,
            icon: '📊',
            autoSend: true
        },
        demo_completed: {
            name: 'После демонстрации',
            roles: ['lpr', 'business'],
            delay_hours: 24,
            icon: '🎬',
            autoSend: true
        },
        manual: {
            name: 'Ручной запуск',
            roles: ['admin'],
            delay_hours: 0,
            icon: '✋',
            autoSend: false
        }
    },

    init() {
        // Загружаем активные триггеры
        this.loadActiveTriggers();

        // Проверяем триггеры раз в минуту
        setInterval(() => this.checkScheduledTriggers(), 60000);
    },

    // Активация триггера
    async activateTrigger(triggerType, clientId, surveyId, metadata = {}) {
        const config = this.triggerConfig[triggerType];

        if (!config) {
            console.error('Неизвестный тип триггера:', triggerType);
            return null;
        }

        const trigger = {
            id: Utils.generateId(),
            type: triggerType,
            clientId: clientId,
            surveyId: surveyId,
            roles: config.roles,
            scheduled_at: this.calculateScheduledTime(config.delay_hours),
            created_at: new Date().toISOString(),
            status: 'pending',
            metadata: metadata
        };

        // Сохраняем триггер
        this.saveTrigger(trigger);

        // Если задержка = 0, запускаем сразу
        if (config.delay_hours === 0 && config.autoSend) {
            await this.executeTrigger(trigger);
        }

        console.log('Триггер активирован:', trigger);
        return trigger;
    },

    // Расчет времени запуска триггера
    calculateScheduledTime(delayHours) {
        const now = new Date();
        now.setHours(now.getHours() + delayHours);
        return now.toISOString();
    },

    // Выполнение триггера
    async executeTrigger(trigger) {
        try {
            trigger.status = 'executing';
            this.updateTrigger(trigger);

            // Получаем пользователей нужных ролей из клиента
            const users = await this.getUsersByClientAndRoles(
                trigger.clientId,
                trigger.roles
            );

            // Отправляем уведомления
            for (const user of users) {
                await this.notifyUser(user, trigger);
            }

            // Обновляем статус
            trigger.status = 'completed';
            trigger.executed_at = new Date().toISOString();
            this.updateTrigger(trigger);

            console.log('Триггер выполнен:', trigger);

            // Уведомление админа
            if (AuthManager.isAdmin()) {
                Utils.showNotification(
                    `Триггер "${this.triggerConfig[trigger.type].name}" выполнен для клиента`
                );
            }

        } catch (error) {
            console.error('Ошибка выполнения триггера:', error);
            trigger.status = 'failed';
            trigger.error = error.message;
            this.updateTrigger(trigger);
        }
    },

    // Получение пользователей по клиенту и ролям
    async getUsersByClientAndRoles(clientId, roles) {
        // TODO: Реальный запрос к API
        // Сейчас возвращаем моковые данные

        const client = State.getClients().find(c => c.id === clientId);
        if (!client) return [];

        // Имитация пользователей клиента
        return roles.map(role => ({
            id: Utils.generateId(),
            name: client.contact,
            email: client.email,
            role: role,
            client_id: clientId
        }));
    },

    // Уведомление пользователя
    async notifyUser(user, trigger) {
        const config = this.triggerConfig[trigger.type];

        // В реальном приложении здесь будет:
        // 1. Отправка в Telegram
        // 2. Email уведомление
        // 3. Push уведомление в WebApp

        console.log('Уведомление отправлено:', {
            user: user.name,
            trigger: config.name,
            survey_id: trigger.surveyId
        });

        // Для демо - создаем запись в истории уведомлений
        this.logNotification({
            user_id: user.id,
            trigger_id: trigger.id,
            sent_at: new Date().toISOString(),
            channel: 'telegram',
            status: 'sent'
        });
    },

    // Проверка запланированных триггеров
    checkScheduledTriggers() {
        const triggers = this.getActiveTriggers();
        const now = new Date();

        triggers.forEach(trigger => {
            if (trigger.status === 'pending') {
                const scheduledTime = new Date(trigger.scheduled_at);

                if (now >= scheduledTime) {
                    this.executeTrigger(trigger);
                }
            }
        });
    },

    // Сохранение триггера
    saveTrigger(trigger) {
        const triggers = this.getActiveTriggers();
        triggers.push(trigger);
        localStorage.setItem('flowback-triggers', JSON.stringify(triggers));
    },

    // Обновление триггера
    updateTrigger(trigger) {
        const triggers = this.getActiveTriggers();
        const index = triggers.findIndex(t => t.id === trigger.id);

        if (index !== -1) {
            triggers[index] = trigger;
            localStorage.setItem('flowback-triggers', JSON.stringify(triggers));
        }
    },

    // Получение активных триггеров
    getActiveTriggers() {
        const saved = localStorage.getItem('flowback-triggers');
        return saved ? JSON.parse(saved) : [];
    },

    loadActiveTriggers() {
        return this.getActiveTriggers();
    },

    // Логирование уведомления
    logNotification(notification) {
        const logs = JSON.parse(localStorage.getItem('flowback-notifications') || '[]');
        logs.push(notification);
        localStorage.setItem('flowback-notifications', JSON.stringify(logs));
    },

    // Ручная активация триггера (для админов)
    async manualTrigger(clientId, surveyId, roles) {
        if (!AuthManager.hasPermission('manage_triggers')) {
            Utils.showNotification('Недостаточно прав', 'error');
            return;
        }

        return await this.activateTrigger('manual', clientId, surveyId, {
            triggered_by: AuthManager.getCurrentUser().name,
            roles: roles
        });
    },

    // Рендер интерфейса управления триггерами
    renderTriggerManagement() {
        const triggers = this.getActiveTriggers();

        return `
      <div class="triggers-section">
        <h3>Активные триггеры</h3>
        <div class="trigger-list">
          ${triggers.map(t => this.renderTriggerItem(t)).join('')}
        </div>
        
        ${AuthManager.isAdmin() ? `
          <button class="btn btn-primary" onclick="TriggerManager.showCreateTriggerModal()">
            ➕ Создать триггер
          </button>
        ` : ''}
      </div>
    `;
    },

    renderTriggerItem(trigger) {
        const config = this.triggerConfig[trigger.type];
        const statusColors = {
            pending: '#ff9800',
            executing: '#4facfe',
            completed: '#43e97b',
            failed: '#f44336'
        };

        return `
      <div class="trigger-item" style="border-left: 4px solid ${statusColors[trigger.status]}">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>${config.icon} ${config.name}</strong>
            <p style="color: #666; font-size: 0.9em; margin: 5px 0;">
              Статус: ${trigger.status} | 
              Запланировано: ${new Date(trigger.scheduled_at).toLocaleString('ru-RU')}
            </p>
          </div>
          ${trigger.status === 'pending' && AuthManager.isAdmin() ? `
            <button class="btn btn-secondary" onclick="TriggerManager.executeTrigger(${JSON.stringify(trigger).replace(/"/g, '&quot;')})">
              Запустить сейчас
            </button>
          ` : ''}
        </div>
      </div>
    `;
    },

    showCreateTriggerModal() {
        // TODO: Реализовать модальное окно создания триггера
        Utils.showNotification('Создание триггера (в разработке)');
    }
};