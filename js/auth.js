// Authentication & Authorization System
const AuthManager = {
    currentUser: null,

    // Роли системы
    ROLES: {
        ADMIN: 'admin',
        LPR: 'lpr',
        TECH_DEPLOY: 'tech_deploy',
        TECH_SUPPORT: 'tech_support',
        BUSINESS: 'business'
    },

    // Права доступа по ролям
    PERMISSIONS: {
        admin: ['view_all', 'create_surveys', 'manage_clients', 'view_analytics', 'export_data', 'manage_triggers'],
        lpr: ['view_own_surveys', 'view_company_analytics', 'pass_surveys'],
        tech_deploy: ['pass_surveys', 'view_own_answers'],
        tech_support: ['pass_surveys', 'view_own_answers'],
        business: ['pass_surveys', 'view_own_answers']
    },

    init() {
        // Проверяем авторизацию
        this.loadCurrentUser();

        // Если запущено в Telegram WebApp
        if (window.Telegram && window.Telegram.WebApp) {
            this.initTelegramWebApp();
        } else {
            // Демо-режим для разработки
            this.loadDemoUser();
        }

        // Обновляем UI в зависимости от роли
        this.updateUIForRole();
    },

    // Инициализация Telegram WebApp
    initTelegramWebApp() {
        const tg = window.Telegram.WebApp;
        tg.ready();

        // Получаем данные пользователя из Telegram
        const initData = tg.initData;
        const user = tg.initDataUnsafe.user;

        if (user) {
            this.authenticateWithTelegram(user, initData);
        }
    },

    // Аутентификация через Telegram
    async authenticateWithTelegram(telegramUser, initData) {
        try {
            // Отправляем данные на backend для верификации
            const response = await fetch('/api/auth/telegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    telegram_id: telegramUser.id,
                    first_name: telegramUser.first_name,
                    last_name: telegramUser.last_name,
                    username: telegramUser.username,
                    photo_url: telegramUser.photo_url,
                    init_data: initData
                })
            });

            const userData = await response.json();
            this.setCurrentUser(userData);

        } catch (error) {
            console.error('Ошибка авторизации через Telegram:', error);
            this.loadDemoUser();
        }
    },

    // Загрузка демо-пользователя для разработки
    loadDemoUser() {
        const savedUser = localStorage.getItem('flowback-demo-user');

        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        } else {
            // Создаем демо-админа
            this.currentUser = {
                id: 1,
                telegram_id: null,
                name: 'Иван Петров',
                username: 'admin',
                role: this.ROLES.ADMIN,
                client_id: null,
                avatar_url: null,
                permissions: this.PERMISSIONS.admin
            };

            localStorage.setItem('flowback-demo-user', JSON.stringify(this.currentUser));
        }
    },

    loadCurrentUser() {
        const savedUser = localStorage.getItem('flowback-current-user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    },

    setCurrentUser(user) {
        // Добавляем права доступа
        user.permissions = this.PERMISSIONS[user.role] || [];

        this.currentUser = user;
        localStorage.setItem('flowback-current-user', JSON.stringify(user));

        // Обновляем UI
        this.updateUIForRole();
    },

    // Проверка прав доступа
    hasPermission(permission) {
        if (!this.currentUser) return false;
        return this.currentUser.permissions.includes(permission);
    },

    // Проверка роли
    hasRole(role) {
        if (!this.currentUser) return false;
        return this.currentUser.role === role;
    },

    isAdmin() {
        return this.hasRole(this.ROLES.ADMIN);
    },

    // Обновление UI в зависимости от роли
    updateUIForRole() {
        if (!this.currentUser) return;

        // Показываем/скрываем вкладки в зависимости от роли
        const tabs = {
            'dashboard': this.hasPermission('view_all') || this.hasPermission('view_company_analytics'),
            'surveys': this.hasPermission('pass_surveys'),
            'create': this.hasPermission('create_surveys'),
            'clients': this.hasPermission('manage_clients'),
            'analytics': this.hasPermission('view_analytics') || this.hasPermission('view_company_analytics'),
            'feedback': this.hasPermission('view_all'),
            'settings': this.hasPermission('view_all')
        };

        // Скрываем недоступные вкладки
        Object.keys(tabs).forEach(tabId => {
            const tabButton = document.querySelector(`[data-tab="${tabId}"]`);
            if (tabButton) {
                tabButton.style.display = tabs[tabId] ? 'block' : 'none';
            }
        });

        // Обновляем имя пользователя в header
        this.updateUserInfo();
    },

    updateUserInfo() {
        const userNameElement = document.querySelector('.user-info span:last-child');
        if (userNameElement && this.currentUser) {
            const roleNames = {
                admin: 'Админ',
                lpr: 'ЛПР',
                tech_deploy: 'Техспец внедрения',
                tech_support: 'Техспец сопровождения',
                business: 'Бизнес-юзер'
            };

            userNameElement.textContent = `${roleNames[this.currentUser.role]}: ${this.currentUser.name}`;
        }

        // Обновляем аватарку
        if (this.currentUser.avatar_url) {
            const avatarImg = document.getElementById('avatar-img');
            if (avatarImg) {
                avatarImg.src = this.currentUser.avatar_url;
                avatarImg.style.display = 'block';
                document.getElementById('avatar-placeholder').style.display = 'none';
            }
        }
    },

    // Смена роли (для демо)
    switchRole(role) {
        if (!this.PERMISSIONS[role]) {
            console.error('Неизвестная роль:', role);
            return;
        }

        this.currentUser.role = role;
        this.currentUser.permissions = this.PERMISSIONS[role];

        localStorage.setItem('flowback-current-user', JSON.stringify(this.currentUser));
        localStorage.setItem('flowback-demo-user', JSON.stringify(this.currentUser));

        // Обновляем UI
        this.updateUIForRole();

        // Перезагружаем текущую секцию
        Navigation.loadTabContent(State.currentTab);

        Utils.showNotification(`Роль изменена на: ${role}`);
    },

    // Выход из системы
    logout() {
        localStorage.removeItem('flowback-current-user');
        localStorage.removeItem('flowback-demo-user');
        this.currentUser = null;

        // Редирект на страницу входа (если есть)
        // window.location.href = '/login';

        Utils.showNotification('Вы вышли из системы');
    },

    // Получить текущего пользователя
    getCurrentUser() {
        return this.currentUser;
    },

    // Получить клиента текущего пользователя
    getCurrentClient() {
        if (!this.currentUser || !this.currentUser.client_id) return null;
        return State.getClients().find(c => c.id === this.currentUser.client_id);
    }
};