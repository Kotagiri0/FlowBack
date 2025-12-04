// Импорты для Unit Tests Utils
const Utils = require('../../js/utils.js');

// Unit Tests for Utils
describe('Utils', () => {
    describe('formatDate', () => {
        test('should format date correctly', () => {
            const date = '2024-01-15';
            const result = Utils.formatDate(date);
            expect(result).toMatch(/15 января 2024/i);
        });
    });

    describe('formatRelativeTime', () => {
        test('should return "Сегодня" for today', () => {
            const today = new Date().toISOString();
            expect(Utils.formatRelativeTime(today)).toBe('Сегодня');
        });

        test('should return "Вчера" for yesterday', () => {
            const yesterday = new Date(Date.now() - 86400000).toISOString();
            expect(Utils.formatRelativeTime(yesterday)).toBe('Вчера');
        });

        test('should return days for recent dates', () => {
            const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();
            expect(Utils.formatRelativeTime(threeDaysAgo)).toBe('3 дней назад');
        });
    });

    describe('validateEmail', () => {
        test('should validate correct email', () => {
            expect(Utils.validateEmail('test@example.com')).toBe(true);
            expect(Utils.validateEmail('user.name@domain.co.uk')).toBe(true);
        });

        test('should reject invalid email', () => {
            expect(Utils.validateEmail('invalid')).toBe(false);
            expect(Utils.validateEmail('test@')).toBe(false);
            expect(Utils.validateEmail('@example.com')).toBe(false);
            expect(Utils.validateEmail('')).toBe(false);
        });
    });

    describe('calculateNPS', () => {
        test('should calculate NPS correctly', () => {
            expect(Utils.calculateNPS(50, 30, 20)).toBe(30);
            expect(Utils.calculateNPS(60, 20, 20)).toBe(40);
            expect(Utils.calculateNPS(30, 40, 30)).toBe(0);
        });

        test('should return 0 for no responses', () => {
            expect(Utils.calculateNPS(0, 0, 0)).toBe(0);
        });

        test('should handle negative NPS', () => {
            expect(Utils.calculateNPS(20, 30, 50)).toBe(-30);
        });
    });

    describe('calculateCSAT', () => {
        test('should calculate average rating', () => {
            expect(Utils.calculateCSAT([5, 4, 5, 3, 4])).toBe('4.2');
            expect(Utils.calculateCSAT([5, 5, 5])).toBe('5.0');
        });

        test('should return 0 for empty array', () => {
            expect(Utils.calculateCSAT([])).toBe(0);
        });
    });

    describe('getSentiment', () => {
        test('should return positive for high ratings', () => {
            expect(Utils.getSentiment(9, 10)).toBe('positive');
            expect(Utils.getSentiment(8, 10)).toBe('positive');
        });

        test('should return neutral for medium ratings', () => {
            expect(Utils.getSentiment(6, 10)).toBe('neutral');
            expect(Utils.getSentiment(5, 10)).toBe('neutral');
        });

        test('should return negative for low ratings', () => {
            expect(Utils.getSentiment(3, 10)).toBe('negative');
            expect(Utils.getSentiment(1, 10)).toBe('negative');
        });
    });

    describe('generateId', () => {
        test('should generate unique IDs', () => {
            const id1 = Utils.generateId();
            const id2 = Utils.generateId();
            expect(id1).not.toBe(id2);
            expect(id1).toMatch(/^_[a-z0-9]+$/);
        });
    });
});
