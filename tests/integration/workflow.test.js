// Integration Tests
describe('FlowBack Integration Tests', () => {
  describe('Survey Workflow', () => {
    test('should create and retrieve survey', async () => {
      const surveyData = {
        name: 'Integration Test Survey',
        targetAudience: 'ЛПР',
        metrics: ['NPS'],
        status: 'active'
      };

      // Создаем опрос
      await API.createSurvey(surveyData);

      // Получаем все опросы
      const surveys = await API.getSurveys();

      // Проверяем что новый опрос есть в списке
      const createdSurvey = surveys.find(s => s.name === surveyData.name);
      expect(createdSurvey).toBeDefined();
      expect(createdSurvey.status).toBe('active');
    });
  });

  describe('Client Workflow', () => {
    test('should create and retrieve client', async () => {
      const clientData = {
        company: 'Integration Test Company',
        contact: 'Test User',
        email: 'test@integration.com',
        roles: ['ЛПР', 'Техспец']
      };

      // Создаем клиента
      await API.createClient(clientData);

      // Получаем всех клиентов
      const clients = await API.getClients();

      // Проверяем что новый клиент есть в списке
      const createdClient = clients.find(c => c.email === clientData.email);
      expect(createdClient).toBeDefined();
      expect(createdClient.roles).toContain('ЛПР');
    });
  });

  describe('Metrics Calculation', () => {
    test('should calculate NPS correctly from feedback', async () => {
      const feedback = await API.getFeedback();

      // Считаем промоутеров (9-10), пассивных (7-8), детракторов (0-6)
      const promoters = feedback.filter(f => f.nps >= 9).length;
      const passives = feedback.filter(f => f.nps >= 7 && f.nps < 9).length;
      const detractors = feedback.filter(f => f.nps < 7 && f.nps !== undefined).length;

      const nps = Utils.calculateNPS(promoters, passives, detractors);

      expect(nps).toBeGreaterThanOrEqual(-100);
      expect(nps).toBeLessThanOrEqual(100);
    });
  });

  describe('Dashboard Data Flow', () => {
    test('should load all dashboard data', async () => {
      const metrics = await API.getMetrics();
      const analytics = await API.getAnalytics();
      const surveys = await API.getSurveys();
      const clients = await API.getClients();

      expect(metrics).toBeDefined();
      expect(analytics).toBeDefined();
      expect(surveys).toBeDefined();
      expect(clients).toBeDefined();

      expect(metrics.nps.current).toBeGreaterThan(0);
      expect(analytics.activeSurveys).toBeGreaterThan(0);
    });
  });
});