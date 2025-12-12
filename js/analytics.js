const AnalyticsManager = {
  render() {
    const section = document.getElementById('analytics');

    section.innerHTML = `
      <div class="section-header">
        <div>
          <h2>📈 Аналитика</h2>
          <p style="color: #666;">Визуализация метрик и трендов</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" onclick="AnalyticsManager.exportData('csv')">
            📄 Экспорт CSV
          </button>
          <button class="btn btn-secondary" onclick="AnalyticsManager.exportData('xlsx')">
            📊 Экспорт XLSX
          </button>
        </div>
      </div>

      <!-- Сводка метрик -->
      <div class="stats-grid">
        ${this.renderMetricCard('NPS', State.metrics.nps)}
        ${this.renderMetricCard('CSAT', State.metrics.csat)}
        ${this.renderMetricCard('CES', State.metrics.ces)}
      </div>

      <!-- Графики -->
      <div class="card" style="margin-top: 30px;">
        <h3 style="margin-bottom: 20px;">Динамика метрик</h3>
        <canvas id="metricsChart" height="100"></canvas>
      </div>

      <!-- Распределение по ролям -->
      <div class="card" style="margin-top: 30px;">
        <h3 style="margin-bottom: 20px;">Ответы по ролям</h3>
        <canvas id="rolesChart" height="100"></canvas>
      </div>
    `;

    setTimeout(() => {
      this.initCharts();
    }, 100);
  },

  renderMetricCard(name, data) {
    const trendIcon = data.trend.startsWith('+') ? '📈' : '📉';
    const trendColor = data.trend.startsWith('+') ? '#10b981' : '#ef4444';

    return `
      <div class="card" style="text-align: center;">
        <h3 style="color: #666; font-size: 16px; margin-bottom: 10px;">${name}</h3>
        <div style="font-size: 36px; font-weight: bold; color: ${Utils.getMetricColor(name.toLowerCase(), data.current)}; margin-bottom: 10px;">
          ${data.current}${name === 'NPS' ? '' : ''}
        </div>
        <div style="color: ${trendColor};">
          ${trendIcon} ${data.trend}
        </div>
      </div>
    `;
  },

  initCharts() {
    this.initMetricsChart();
    this.initRolesChart();
  },

  initMetricsChart() {
    const canvas = document.getElementById('metricsChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
        datasets: [
          {
            label: 'NPS',
            data: State.metrics.nps.history,
            borderColor: '#667eea',
            tension: 0.4
          },
          {
            label: 'CSAT',
            data: State.metrics.csat.history.map(v => v * 20),
            borderColor: '#10b981',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } }
      }
    });
  },

  initRolesChart() {
    const canvas = document.getElementById('rolesChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['ЛПР', 'Техспец внедрения', 'Техспец сопровождения', 'Бизнес-пользователь'],
        datasets: [{
          label: 'Количество ответов',
          data: [12, 19, 8, 15],
          backgroundColor: ['#667eea', '#10b981', '#f59e0b', '#3b82f6']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  },

  exportData(format) {
    const data = State.feedback.map(fb => ({
      'ID': fb.id,
      'Опрос': State.surveys.find(s => s.id === fb.surveyId)?.title || '',
      'Клиент': State.clients.find(c => c.id === fb.clientId)?.company || '',
      'Email': fb.userEmail,
      'Метрика': fb.metric.toUpperCase(),
      'Оценка': fb.score,
      'Комментарий': fb.comment,
      'Дата': Utils.formatDate(fb.submittedAt)
    }));

    const filename = `feedback_export_${new Date().toISOString().split('T')[0]}.${format}`;

    if (format === 'csv') {
      Utils.exportToCSV(data, filename);
    } else if (format === 'xlsx') {
      Utils.exportToXLSX(data, filename);
    }
  }
};