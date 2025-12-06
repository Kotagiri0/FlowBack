// State Management
const State = {
    currentTab: 'dashboard',

    surveys: [
        {
            id: 1,
            name: 'После демонстрации продукта',
            targetAudience: 'ЛПР',
            metrics: ['NPS', 'CSAT'],
            status: 'active',
            responses: 42
        },
        {
            id: 2,
            name: 'Оценка спринта (техспецы)',
            targetAudience: 'Технические специалисты',
            metrics: ['CES', 'кастомные вопросы'],
            status: 'active',
            responses: 28
        },
        {
            id: 3,
            name: 'Удовлетворенность релизом',
            targetAudience: 'Бизнес-пользователи',
            metrics: ['CSAT'],
            status: 'paused',
            responses: 15
        }
    ],

    clients: [
        {
            id: 1,
            company: 'ООО "ТехноЛаб"',
            contact: 'Алексей Иванов',
            email: 'alex@technolab.ru',
            roles: ['ЛПР'],
            lastSurvey: '2024-11-28'
        },
        {
            id: 2,
            company: 'ПАО "Мегакорп"',
            contact: 'Мария Петрова',
            email: 'maria@megacorp.ru',
            roles: ['Техспец внедрения', 'Бизнес-юзер'],
            lastSurvey: '2024-11-21'
        },
        {
            id: 3,
            company: 'ЗАО "Инновации+"',
            contact: 'Дмитрий Сидоров',
            email: 'dmitry@innov.ru',
            roles: ['ЛПР', 'Техспец сопровождения'],
            lastSurvey: '2024-12-01'
        }
    ],

    metrics: {
        nps: {
            current: 67,
            change: '+5',
            trend: 'up',
            history: [54, 58, 61, 62, 67, 70]
        },
        csat: {
            current: 4.3,
            change: '+0.2',
            trend: 'up'
        },
        ces: {
            current: 2.1,
            change: '-0.3',
            trend: 'down'
        },
        responses: {
            current: 342,
            period: 'за последние 30 дней'
        }
    },

    feedback: [
        {
            id: 1,
            client: 'ПАО "Мегакорп"',
            contact: 'Мария Петрова',
            date: '2024-11-26',
            nps: 7,
            ces: 3,
            sentiment: 'neutral',
            comment: 'Хотелось бы более подробную документацию.'
        }
    ],

    analytics: {
        activeSurveys: 12,
        responseRate: 68,
        totalClients: 45,
        topTopics: [
            {
                topic: 'Производительность системы',
                mentions: 23,
                sentiment: 'negative',
                trend: 'down'
            },
            {
                topic: 'Качество поддержки',
                mentions: 18,
                sentiment: 'positive',
                trend: 'up'
            },
            {
                topic: 'Документация API',
                mentions: 15,
                sentiment: 'neutral',
                trend: 'stable'
            }
        ]
    },

    getSurveys() {
        return this.surveys;
    },

    getSurveyById(id) {
        return this.surveys.find(s => s.id === id);
    },

    addSurvey(survey) {
        survey.id = this.surveys.length + 1;
        this.surveys.push(survey);
    },

    getClients() {
        return this.clients;
    },

    addClient(client) {
        client.id = this.clients.length + 1;
        this.clients.push(client);
    },

    getMetrics() {
        return this.metrics;
    },

    getFeedback() {
        return this.feedback;
    },

    getAnalytics() {
        return this.analytics;
    }
};