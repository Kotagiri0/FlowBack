// API Service
const API = {
  async request(endpoint, options = {}) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ok: true, data: null };
  },

  async getSurveys() {
    return State.getSurveys();
  },

  async getSurveyById(id) {
    return State.getSurveyById(id);
  },

  async createSurvey(surveyData) {
    State.addSurvey(surveyData);
    return { ok: true, message: 'Опрос создан' };
  },

  async updateSurvey(id, surveyData) {
    return { ok: true, message: 'Опрос обновлен' };
  },

  async deleteSurvey(id) {
    return { ok: true, message: 'Опрос удален' };
  },

  async getClients() {
    return State.getClients();
  },

  async createClient(clientData) {
    State.addClient(clientData);
    return { ok: true, message: 'Клиент добавлен' };
  },

  async updateClient(id, clientData) {
    return { ok: true, message: 'Клиент обновлен' };
  },

  async deleteClient(id) {
    return { ok: true, message: 'Клиент удален' };
  },

  async getMetrics() {
    return State.getMetrics();
  },

  async getFeedback(filters = {}) {
    return State.getFeedback();
  },

  async submitFeedback(feedbackData) {
    return { ok: true, message: 'Фидбек отправлен' };
  },

  async getAnalytics(params = {}) {
    return State.getAnalytics();
  },

  async exportData(format = 'csv', data) {
    if (format === 'csv') {
      Utils.exportToCSV(data, `flowback_export_${Date.now()}.csv`);
    }
    return { ok: true, message: 'Данные экспортированы' };
  }
};