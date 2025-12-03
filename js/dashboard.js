// Dashboard Manager
const DashboardManager = {
  npsChart: null,

  async render() {
    const metrics = await API.getMetrics();
    const analytics = await API.getAnalytics();

    const dashboardSection = document.getElementById('dashboard');
    dashboardSection.innerHTML = `
      <h2 style="margin-bottom: 20px;">Обзор метрик</h2>
      
      <div class="dashboard-grid">
        ${this.renderMetricCard('NPS Score', metrics.nps.current, metrics.nps.change, 'primary-gradient')}
        ${this.renderMetricCard('CSAT', metrics.csat.current, metrics.csat.change, 'secondary-gradient')}
        ${this.renderMetricCard('CES', metrics.ces.current, metrics.ces.change, 'tertiary-gradient')}
        ${this.renderMetricCard('Ответов получено', metrics.responses.current, metrics.responses.period, 'success-gradient')}
      </div>

      <div class="chart-container">
        <h3 style="margin-bottom: 15px;">Динамика NPS по месяцам</h3>
        <canvas id="npsChart" style="max-height: 300px;"></canvas>
      </div>

      <div class="stats-grid">
        <div class="stat-box">
          <h4>Активных опросов</h4>
          <div class="value">${analytics.activeSurveys}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 75%"></div>
          </div>
        </div>
        <div class="stat-box">
          <h4>Процент ответов</h4>
          <div class="value">${analytics.responseRate}%</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${analytics.responseRate}%"></div>
          </div>
        </div>
        <div class="stat-box">
          <h4>Клиентов в системе</h4>
          <div class="value">${analytics.totalClients}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 90%"></div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => this.initNPSChart(metrics.nps.history), 100);
  },

  renderMetricCard(title, value, change, gradientClass) {
    const gradients = {
      'primary-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'secondary-gradient': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'tertiary-gradient': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'success-gradient': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    };

    return `
      <div class="metric-card" style="background: ${gradients[gradientClass]};">
        <h3>${title}</h3>
        <div class="metric-value">${value}</div>
        <div class="metric-change">${change.toString().includes('↑') || change.toString().includes('↓') ? change : '↑ ' + change}</div>
      </div>
    `;
  },

  initNPSChart(data) {
    const canvas = document.getElementById('npsChart');
    if (!canvas) return;

    if (this.npsChart) {
      this.npsChart.destroy();
    }

    this.npsChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ["Янв", "Фев", "Мар", "Апр", "Май", "Июнь"],
        datasets: [{
          label: "NPS",
          data: data,
          borderColor: CONFIG.CHART_COLORS.primary,
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
};