// Telegram Bot & WebApp Integration
const TelegramManager = {
    tg: null,
    isWebApp: false,

    init() {
        // Проверяем запущено ли в Telegram WebApp
        if (window.Telegram && window.Telegram.WebApp) {
            this.tg = window.Telegram.WebApp;
            this.isWebApp = true;
            this.initWebApp();
        } else {
            console.log('Запущено вне Telegram WebApp');
        }
    },

    // Инициализация Telegram WebApp
    initWebApp() {
        this.tg.ready();
        this.tg.expand();

        // Настраиваем цвета темы
        this.setupTheme();

        // Настраиваем главную кнопку
        this.setupMainButton();

        // Настраиваем кнопку "Назад"
        this.setupBackButton();

        // Отправляем событие о готовности
        this.sendEvent('webapp_ready', {
            user_id: this.tg.initDataUnsafe?.user?.id
        });

        console.log('Telegram WebApp инициализирован');
    },

    // Настройка темы
    setupTheme() {
        const colorScheme = this.tg.colorScheme;

        if (colorScheme === 'dark') {
            ThemeManager.setTheme('dark');
        } else {
            ThemeManager.setTheme('light');
        }

        // Устанавливаем цвет header
        this.tg.setHeaderColor('secondary_bg_color');
    },

    // Настройка главной кнопки
    setupMainButton() {
        const mainButton = this.tg.MainButton;

        // Скрываем по умолчанию
        mainButton.hide();

        // Обработчик клика
        mainButton.onClick(() => {
            this.handleMainButtonClick();
        });
    },

    // Показать главную кнопку
    showMainButton(text, onClick) {
        const mainButton = this.tg.MainButton;
        mainButton.setText(text);
        mainButton.show();

        // Удаляем старый обработчик и добавляем новый
        mainButton.offClick(this.handleMainButtonClick);
        mainButton.onClick(onClick);
    },

    // Скрыть главную кнопку
    hideMainButton() {
        this.tg.MainButton.hide();
    },

    // Обработчик главной кнопки
    handleMainButtonClick() {
        console.log('Main button clicked');
    },

    // Настройка кнопки "Назад"
    setupBackButton() {
        const backButton = this.tg.BackButton;

        backButton.onClick(() => {
            // Возвращаемся на предыдущую страницу
            if (State.currentTab !== 'dashboard') {
                Navigation.switchTab('dashboard');
            } else {
                this.tg.close();
            }
        });
    },

    // Показать кнопку "Назад"
    showBackButton() {
        this.tg.BackButton.show();
    },

    // Скрыть кнопку "Назад"
    hideBackButton() {
        this.tg.BackButton.hide();
    },

    // Отправка данных боту
    sendData(data) {
        if (!this.isWebApp) {
            console.log('Не в WebApp режиме, данные:', data);
            return;
        }

        try {
            this.tg.sendData(JSON.stringify(data));
        } catch (error) {
            console.error('Ошибка отправки данных:', error);
            this.showAlert('Ошибка отправки данных');
        }
    },

    // Отправка события аналитики
    sendEvent(eventName, eventData = {}) {
        if (!this.isWebApp) return;

        // Отправляем событие в Telegram Analytics
        const event = {
            event: eventName,
            data: eventData,
            timestamp: new Date().toISOString(),
            user_id: this.tg.initDataUnsafe?.user?.id
        };

        console.log('Event:', event);

        // TODO: Отправить на backend для аналитики
        // await fetch('/api/analytics/event', { method: 'POST', body: JSON.stringify(event) });
    },

    // Показать всплывающее сообщение
    showAlert(message) {
        if (this.isWebApp) {
            this.tg.showAlert(message);
        } else {
            alert(message);
        }
    },

    // Показать подтверждение
    showConfirm(message, callback) {
        if (this.isWebApp) {
            this.tg.showConfirm(message, callback);
        } else {
            const result = confirm(message);
            callback(result);
        }
    },

    // Показать всплывающее окно
    showPopup(params) {
        if (this.isWebApp) {
            this.tg.showPopup(params);
        } else {
            alert(params.message);
        }
    },

    // Открыть ссылку
    openLink(url, options = {}) {
        if (this.isWebApp) {
            this.tg.openLink(url, options);
        } else {
            window.open(url, options.try_instant_view ? '_self' : '_blank');
        }
    },

    // Открыть Telegram ссылку
    openTelegramLink(url) {
        if (this.isWebApp) {
            this.tg.openTelegramLink(url);
        } else {
            window.open(url, '_blank');
        }
    },

    // Закрыть WebApp
    close() {
        if (this.isWebApp) {
            this.tg.close();
        }
    },

    // Получить данные пользователя
    getUserData() {
        if (!this.isWebApp) {
            return null;
        }

        return this.tg.initDataUnsafe?.user || null;
    },

    // Получить ID чата
    getChatId() {
        if (!this.isWebApp) {
            return null;
        }

        return this.tg.initDataUnsafe?.chat?.id || null;
    },

    // Проверить подписку на бота
    async checkBotSubscription() {
        // TODO: Реализовать проверку через backend
        return true;
    },

    // Запросить контакт пользователя
    requestContact() {
        if (!this.isWebApp) {
            console.log('Не поддерживается вне Telegram');
            return;
        }

        this.tg.requestContact((result) => {
            if (result) {
                console.log('Контакт получен:', result);
                // Сохраняем контакт
                // TODO: Отправить на backend
            }
        });
    },

    // Запросить разрешение на запись
    requestWriteAccess() {
        if (!this.isWebApp) {
            return Promise.resolve(false);
        }

        return new Promise((resolve) => {
            this.tg.requestWriteAccess((granted) => {
                resolve(granted);
            });
        });
    },

    // Вибрация
    hapticFeedback(type = 'medium') {
        if (!this.isWebApp) return;

        const haptic = this.tg.HapticFeedback;

        switch (type) {
            case 'light':
                haptic.impactOccurred('light');
                break;
            case 'medium':
                haptic.impactOccurred('medium');
                break;
            case 'heavy':
                haptic.impactOccurred('heavy');
                break;
            case 'success':
                haptic.notificationOccurred('success');
                break;
            case 'error':
                haptic.notificationOccurred('error');
                break;
            case 'warning':
                haptic.notificationOccurred('warning');
                break;
            default:
                haptic.selectionChanged();
        }
    },

    // Проверка запуска в Telegram
    isTelegramWebApp() {
        return this.isWebApp;
    },

    // Получить платформу
    getPlatform() {
        if (!this.isWebApp) return 'web';
        return this.tg.platform;
    },

    // Версия Telegram
    getVersion() {
        if (!this.isWebApp) return null;
        return this.tg.version;
    },

    // Получить initData для проверки на backend
    getInitData() {
        if (!this.isWebApp) return null;
        return this.tg.initData;
    },

    // Безопасная проверка initData
    isInitDataSafe() {
        if (!this.isWebApp) return false;

        // TODO: Проверка на backend
        // const response = await fetch('/api/telegram/verify', {
        //   method: 'POST',
        //   body: JSON.stringify({ initData: this.tg.initData })
        // });

        return true; // Для демо всегда true
    }
};