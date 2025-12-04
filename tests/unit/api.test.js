// Импорты для Unit Tests API
const API = require('../../js/api.js');

// Unit Tests for API
describe('API', () => {
    describe('getSurveys', () => {
        test('should return surveys', async () => {
            const surveys = await API.getSurveys();
            expect(surveys).toBeDefined();
            expect(Array.isArray(surveys)).toBe(true);
        });
    });

    describe('getSurveyById', () => {
        test('should return specific survey', async () => {
            const survey = await API.getSurveyById(1);
            expect(survey).toBeDefined();
            expect(survey.id).toBe(1);
        });
    });

    describe('createSurvey', () => {
        test('should create new survey', async () => {
            const surveyData = {
                name: 'Test Survey',
                targetAudience: 'ЛПР',
                status: 'active'
            };

            const result = await API.createSurvey(surveyData);
            expect(result.ok).toBe(true);
            expect(result.message).toBeDefined();
        });
    });

    describe('getClients', () => {
        test('should return clients', async () => {
            const clients = await API.getClients();
            expect(clients).toBeDefined();
            expect(Array.isArray(clients)).toBe(true);
        });
    });

    describe('createClient', () => {
        test('should create new client', async () => {
            const clientData = {
                company: 'Test Company',
                contact: 'John Doe',
                email: 'john@test.com',
                roles: ['ЛПР']
            };

            const result = await API.createClient(clientData);
            expect(result.ok).toBe(true);
        });
    });

    describe('getMetrics', () => {
        test('should return metrics', async () => {
            const metrics = await API.getMetrics();
            expect(metrics).toBeDefined();
            expect(metrics.nps).toBeDefined();
            expect(metrics.csat).toBeDefined();
        });
    });

    describe('getFeedback', () => {
        test('should return feedback', async () => {
            const feedback = await API.getFeedback();
            expect(feedback).toBeDefined();
            expect(Array.isArray(feedback)).toBe(true);
        });
    });

    describe('getAnalytics', () => {
        test('should return analytics', async () => {
            const analytics = await API.getAnalytics();
            expect(analytics).toBeDefined();
            expect(analytics.activeSurveys).toBeDefined();
        });
    });
});
