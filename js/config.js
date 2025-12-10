// Configuration
const CONFIG = {
  APP_NAME: 'FlowBack',
  VERSION: '1.0.0',

  // API endpoints (заглушки)
  API: {
    BASE_URL: '/api/v1',
    SURVEYS: '/surveys',
    CLIENTS: '/clients',
    METRICS: '/metrics',
    FEEDBACK: '/feedback',
    ANALYTICS: '/analytics'
  },

  // Метрики
  METRICS: {
    NPS: 'nps',
    CSAT: 'csat',
    CES: 'ces'
  },

  // Роли клиентов
    ROLES: {
        ADMIN: 'admin',
        LPR: 'lpr',
        TECH_DEPLOY: 'tech_deploy',
        TECH_SUPPORT: 'tech_support',
        BUSINESS: 'business'
    },


  // Триггеры
  TRIGGERS: {
    AFTER_DEMO: 'after_demo',
    AFTER_RELEASE: 'after_release',
    AFTER_INCIDENT: 'after_incident',
    AFTER_SPRINT: 'after_sprint'
  },

  // Каналы отправки
  CHANNELS: {
    EMAIL: 'email',
    TELEGRAM: 'telegram',
    VK_TEAMS: 'vk_teams',
    WEB_FORM: 'web_form'
  },

  // Настройки графиков
  CHART_COLORS: {
    primary: '#667eea',
    secondary: '#764ba2',
    tertiary: '#f093fb',
    success: '#43e97b',
    warning: '#ff9800',
    error: '#f44336'
  },

  // Лимиты
  LIMITS: {
    SURVEY_FREQUENCY_DAYS: 45, // Минимальный интервал между опросами
    MAX_QUESTIONS: 10,
    MIN_RESPONSE_RATE: 30 // Минимальный процент ответов
  }
};