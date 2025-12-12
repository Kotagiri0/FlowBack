// Глобальное состояние приложения

const State = {
  // Текущий пользователь (для демо)
  currentUser: {
    id: 'user_1',
    name: 'Иван Петров',
    email: 'ivan.petrov@arenadata.tech',
    role: 'admin', // admin, lpr, tech_implementation, tech_support, business_user
    avatar: null
  },

  // Список опросов
  surveys: [
    {
      id: 'survey_1',
      title: 'Оценка пилотного проекта',
      description: 'Оценка первого впечатления от внедрения',
      targetRole: 'tech_implementation',
      trigger: 'pilot_complete',
      metric: 'nps',
      clients: ['client_1', 'client_2'],
      status: 'active',
      createdAt: '2024-12-01T10:00:00Z',
      sent: 2,
      responses: 1,
      questions: [
        {
          id: 'q_1',
          text: 'Насколько гладко прошло развертывание?',
          type: 'rating'
        },
        {
          id: 'q_2',
          text: 'Какие трудности возникли?',
          type: 'text'
        }
      ]
    },
    {
      id: 'survey_2',
      title: 'Квартальный обзор проекта',
      description: 'Оценка прогресса и соответствия бизнес-целям',
      targetRole: 'lpr',
      trigger: 'quarterly_review',
      metric: 'csat',
      clients: ['client_1'],
      status: 'active',
      createdAt: '2024-12-05T14:30:00Z',
      sent: 1,
      responses: 0,
      questions: [
        {
          id: 'q_1',
          text: 'Насколько проект соответствует бизнес-целям?',
          type: 'rating'
        }
      ]
    },
    {
      id: 'survey_3',
      title: 'Оценка нового дашборда',
      description: 'Полезность и понятность нового отчета',
      targetRole: 'business_user',
      trigger: 'new_dashboard',
      metric: 'ces',
      clients: ['client_3'],
      status: 'active',
      createdAt: '2024-12-10T09:00:00Z',
      sent: 1,
      responses: 0,
      questions: []
    }
  ],

  // Клиенты
  clients: [
    {
      id: 'client_1',
      company: 'ООО "ТехноДата"',
      contact: 'Алексей Смирнов',
      email: 'a.smirnov@technodata.ru',
      roles: ['lpr', 'tech_implementation'],
      status: 'active',
      createdAt: '2024-11-15T10:00:00Z'
    },
    {
      id: 'client_2',
      company: 'ПАО "МегаБанк"',
      contact: 'Мария Иванова',
      email: 'm.ivanova@megabank.ru',
      roles: ['tech_implementation', 'tech_support'],
      status: 'active',
      createdAt: '2024-11-20T11:30:00Z'
    },
    {
      id: 'client_3',
      company: 'АО "РосРетейл"',
      contact: 'Дмитрий Козлов',
      email: 'd.kozlov@rosretail.ru',
      roles: ['business_user'],
      status: 'active',
      createdAt: '2024-12-01T09:15:00Z'
    }
  ],

  // Фидбек (ответы на опросы)
  feedback: [
    {
      id: 'fb_1',
      surveyId: 'survey_1',
      clientId: 'client_1',
      userEmail: 'a.smirnov@technodata.ru',
      metric: 'nps',
      score: 9,
      comment: 'Отличный продукт, развертывание прошло гладко. Небольшие проблемы с документацией.',
      answers: [
        {
          questionId: 'q_1',
          answer: '4'
        },
        {
          questionId: 'q_2',
          answer: 'Не хватало примеров конфигурации для нашей инфраструктуры'
        }
      ],
      submittedAt: '2024-12-02T15:30:00Z'
    },
    {
      id: 'fb_2',
      surveyId: 'survey_1',
      clientId: 'client_2',
      userEmail: 'm.ivanova@megabank.ru',
      metric: 'nps',
      score: 7,
      comment: 'В целом неплохо, но есть куда расти',
      answers: [
        {
          questionId: 'q_1',
          answer: '3'
        },
        {
          questionId: 'q_2',
          answer: 'Долгая настройка безопасности'
        }
      ],
      submittedAt: '2024-12-03T10:15:00Z'
    }
  ],

  // Метрики (агрегированные данные)
  metrics: {
    nps: {
      current: 67