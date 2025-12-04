// JSON Validation Tests
const fs = require('fs');
const path = require('path');

describe('JSON Files Validation', () => {
  const dataDir = path.join(__dirname, '../../data');

  describe('surveys.json', () => {
    test('should be valid JSON', () => {
      const filePath = path.join(dataDir, 'surveys.json');
      const content = fs.readFileSync(filePath, 'utf8');

      expect(() => JSON.parse(content)).not.toThrow();
    });

    test('should have correct structure', () => {
      const filePath = path.join(dataDir, 'surveys.json');
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      expect(data.surveys).toBeDefined();
      expect(Array.isArray(data.surveys)).toBe(true);

      data.surveys.forEach(survey => {
        expect(survey.id).toBeDefined();
        expect(survey.name).toBeDefined();
        expect(survey.targetAudience).toBeDefined();
        expect(survey.status).toMatch(/active|paused|draft/);
      });
    });
  });

  describe('clients.json', () => {
    test('should be valid JSON', () => {
      const filePath = path.join(dataDir, 'clients.json');
      const content = fs.readFileSync(filePath, 'utf8');

      expect(() => JSON.parse(content)).not.toThrow();
    });

    test('should have correct structure', () => {
      const filePath = path.join(dataDir, 'clients.json');
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      expect(data.clients).toBeDefined();
      expect(Array.isArray(data.clients)).toBe(true);

      data.clients.forEach(client => {
        expect(client.id).toBeDefined();
        expect(client.company).toBeDefined();
        expect(client.email).toBeDefined();
        expect(client.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });
  });

  describe('metrics.json', () => {
    test('should be valid JSON', () => {
      const filePath = path.join(dataDir, 'metrics.json');
      const content = fs.readFileSync(filePath, 'utf8');

      expect(() => JSON.parse(content)).not.toThrow();
    });

    test('should have correct structure', () => {
      const filePath = path.join(dataDir, 'metrics.json');
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      expect(data.overview).toBeDefined();
      expect(data.overview.nps).toBeDefined();
      expect(data.overview.csat).toBeDefined();
      expect(data.overview.ces).toBeDefined();
    });
  });

  describe('feedback.json', () => {
    test('should be valid JSON', () => {
      const filePath = path.join(dataDir, 'feedback.json');
      const content = fs.readFileSync(filePath, 'utf8');

      expect(() => JSON.parse(content)).not.toThrow();
    });

    test('should have correct structure', () => {
      const filePath = path.join(dataDir, 'feedback.json');
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      expect(data.feedback).toBeDefined();
      expect(Array.isArray(data.feedback)).toBe(true);

      data.feedback.forEach(item => {
        expect(item.id).toBeDefined();
        expect(item.client).toBeDefined();
        expect(item.sentiment).toMatch(/positive|neutral|negative/);
      });
    });
  });
});