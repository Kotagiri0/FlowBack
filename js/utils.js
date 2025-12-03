// Utility Functions
const Utils = {
  formatDate(date) {
    const d = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('ru-RU', options);
  },

  formatRelativeTime(date) {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) return `${diffDays} дней назад`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} недель назад`;
    return `${Math.floor(diffDays / 30)} месяцев назад`;
  },

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  },

  calculateNPS(promoters, passives, detractors) {
    const total = promoters + passives + detractors;
    if (total === 0) return 0;
    return Math.round(((promoters - detractors) / total) * 100);
  },

  calculateCSAT(ratings) {
    if (!ratings.length) return 0;
    const sum = ratings.reduce((a, b) => a + b, 0);
    return (sum / ratings.length).toFixed(1);
  },

  getSentiment(rating, maxRating = 10) {
    const percentage = (rating / maxRating) * 100;
    if (percentage >= 70) return 'positive';
    if (percentage >= 40) return 'neutral';
    return 'negative';
  },

  exportToCSV(data, filename) {
    const csv = this.convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  },

  convertToCSV(data) {
    if (!data.length) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  showNotification(message, type = 'info') {
    alert(message);
  }
};