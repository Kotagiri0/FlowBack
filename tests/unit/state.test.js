// Unit Tests for State
describe('State', () => {
  beforeEach(() => {
    // Сброс состояния перед каждым тестом
    State.surveys = [
      { id: 1, name: 'Test Survey 1' },
      { id: 2, name: 'Test Survey 2' }
    ];
    State.clients = [
      { id: 1, company: 'Test Company 1' },
      { id: 2, company: 'Test Company 2' }
    ];
  });

  describe('getSurveys', () => {
    test('should return all surveys', () => {
      const surveys = State.getSurveys();
      expect(surveys).toHaveLength(2);
      expect(surveys[0].name).toBe('Test Survey 1');
    });
  });

  describe('getSurveyById', () => {
    test('should return correct survey', () => {
      const survey = State.getSurveyById(1);
      expect(survey).toBeDefined();
      expect(survey.name).toBe('Test Survey 1');
    });

    test('should return undefined for non-existent survey', () => {
      const survey = State.getSurveyById(999);
      expect(survey).toBeUndefined();
    });
  });

  describe('addSurvey', () => {
    test('should add new survey', () => {
      const newSurvey = { name: 'New Survey' };
      State.addSurvey(newSurvey);

      expect(State.surveys).toHaveLength(3);
      expect(newSurvey.id).toBe(3);
      expect(State.surveys[2].name).toBe('New Survey');
    });
  });

  describe('getClients', () => {
    test('should return all clients', () => {
      const clients = State.getClients();
      expect(clients).toHaveLength(2);
      expect(clients[0].company).toBe('Test Company 1');
    });
  });

  describe('addClient', () => {
    test('should add new client', () => {
      const newClient = { company: 'New Company' };
      State.addClient(newClient);

      expect(State.clients).toHaveLength(3);
      expect(newClient.id).toBe(3);
    });
  });

  describe('getMetrics', () => {
    test('should return metrics object', () => {
      const metrics = State.getMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.nps).toBeDefined();
      expect(metrics.csat).toBeDefined();
      expect(metrics.ces).toBeDefined();
    });
  });

  describe('getAnalytics', () => {
    test('should return analytics object', () => {
      const analytics = State.getAnalytics();
      expect(analytics).toBeDefined();
      expect(analytics.activeSurveys).toBeDefined();
      expect(analytics.responseRate).toBeDefined();
    });
  });
});