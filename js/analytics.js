// Analytics Manager
const AnalyticsManager = {
  roleChart: null,

  async render() {
    const analytics = await API.getAnalytics();

    const analyticsSection = document.getElementById('analytics');
    analyticsSection.innerHTML = `
      <h2 style="margin-bottom: 20px;">Детальная аналитика</h2>

      <div class="export-options">
        <button class="btn btn-secondary" onclick="AnalyticsManager.exportData('csv')">
          📊 Экспорт CSV
        </button>
        <button class="btn btn-secondary" onclick="AnalyticsManager.exportData('xlsx')">
          📈 Экспорт XLSX
        </button>
      </div>

      <div class="chart-container" style="margin-top: 20px;">
        <h3 style="margin-bottom: 15px;">Сегментация по ролям</h3>
        <canvas id="roleChart" style="max-height: 300px;"></canvas>
      </div>

      <div class="stats-grid">
        <div class="stat-box">
          <h4>NPS - ЛПР</h4>
          <div class="value">72</div>
        </div>
        <div class="stat-box">
          <h4>NPS - Техспецы</h4>
          <div class="value">65</div>
        </div>
        <div class="stat-box">
          <h4>NPS - Бизнес-юзеры</h4>
          <div class="value">58</div>
        </div>
        <div class="stat-box">
          <h4>Средний CSAT</h4>
          <div class="value">4.3</div>
        </div>
      </div>

      <div style="margin-top: 30px; background: #f9f9f9; padding: 20px; border-radius: 10px;">
        <h3 style="margin-bottom: 15px;">Топ-3 темы из фидбека (NLP)</h3>
        ${analytics.topTopics.map(topic => this.renderTopicItem(topic)).join('')}
      </div>
    `;

    setTimeout(() => this.initRoleChart(), 100);
  },

  renderTopicItem(topic) {
    const trendIcons = {
      up: '↑',
      down: '↓',
      stable: '→'
    };

    const trendTexts = {
      up: 'улучшение',
      down: 'ухудшение',
      stable: 'стабильно'
    };

    return `
      <div class="feedback-item">
        <div class="feedback-header">
          <strong>${topic.topic}</strong>
          <span class="sentiment ${topic.sentiment}">${this.getSentimentText(topic.sentiment)}</span>
        </div>
        <p style="color: #666;">
          Упоминается в ${topic.mentions} отзывах • 
          Тренд: ${trendIcons[topic.trend]} ${trendTexts[topic.trend]}
        </p>
      </div>
    `;
  },

  getSentimentText(sentiment) {
    const texts = {
      positive: 'Позитивная',
      neutral: 'Нейтральная',
      negative: 'Негативная'
    };
    return texts[sentiment] || sentiment;
  },

  initRoleChart() {
    const canvas = document.getElementById('roleChart');
    if (!canvas) return;

    if (this.roleChart) {
      this.roleChart.destroy();
    }

    this.roleChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ["ЛПР", "Техспецы", "Бизнес-юзеры"],
        datasets: [{
          data: [42, 28, 30],
          backgroundColor: [
            CONFIG.CHART_COLORS.primary,
            CONFIG.CHART_COLORS.tertiary,
            CONFIG.CHART_COLORS.success
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  },

  async exportData(format) {
    const clients = await API.getClients();
    const surveys = await API.getSurveys();
    const feedback = await API.getFeedback();

    if (format === 'csv') {
      Utils.exportToCSV(clients, `flowback_clients_${Date.now()}.csv`);
      Utils.showNotification('Данные экспортированы в CSV');
    } else if (format === 'xlsx') {
      Utils.showNotification('Экспорт в XLSX (функция в разработке)');
    }
  }
};