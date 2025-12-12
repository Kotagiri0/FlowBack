const FeedbackManager = {
  render() {
    const section = document.getElementById('feedback');

    section.innerHTML = `
      <div class="section-header">
        <h2>💬 Фидбек</h2>
        <p style="color: #666;">Все ответы на опросы</p>
      </div>

      <!-- Фильтры -->
      <div class="card" style="margin-bottom: 20px;">
        <div style="display: flex; gap: 15px;">
          <select id="feedbackMetricFilter" onchange="FeedbackManager.applyFilters()" style="flex: 1;">
            <option value="">Все метрики</option>
            <option value="nps">NPS</option>
            <option value="csat">CSAT</option>
            <option value="ces">CES</option>
          </select>
          <select id="feedbackSurveyFilter" onchange="FeedbackManager.applyFilters()" style="flex: 1;">
            <option value="">Все опросы</option>
            ${State.surveys.map(s => `<option value="${s.id}">${s.title}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Список фидбека -->
      <div id="feedbackList">
        ${this.renderFeedbackList()}
      </div>
    `;
  },

  renderFeedbackList(feedback = State.feedback) {
    if (feedback.length === 0) {
      return `
        <div class="card" style="text-align: center; padding: 40px;">
          <div style="font-size: 48px; margin-bottom: 20px;">💬</div>
          <h3 style="color: #666;">Нет фидбека</h3>
          <p style="color: #999;">Ответы на опросы появятся здесь</p>
        </div>
      `;
    }

    return feedback.map(fb => this.renderFeedbackCard(fb)).join('');
  },

  renderFeedbackCard(fb) {
    const survey = State.surveys.find(s => s.id === fb.surveyId);
    const client = State.clients.find(c => c.id === fb.clientId);

    return `
      <div class="card" style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
          <div>
            <h3 style="margin: 0 0 5px 0;">${survey?.title || 'Неизвестный опрос'}</h3>
            <div style="color: #666; font-size: 14px;">
              ${client?.company || 'Неизвестный клиент'} • ${fb.userEmail}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 28px; font-weight: bold; color: ${Utils.getMetricColor(fb.metric, fb.score)};">
              ${fb.score}
            </div>
            <div style="color: #666; font-size: 12px;">
              ${fb.metric.toUpperCase()}
            </div>
          </div>
        </div>

        ${fb.comment ? `
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <strong style="color: #666; font-size: 14px;">Комментарий:</strong>
            <p style="margin: 5px 0 0 0; color: #333;">${fb.comment}</p>
          </div>
        ` : ''}

        ${fb.answers && fb.answers.length > 0 ? `
          <div style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
            <strong style="color: #666; font-size: 14px;">Дополнительные ответы:</strong>
            ${fb.answers.map(answer => {
              const question = survey?.questions?.find(q => q.id === answer.questionId);
              return `
                <div style="margin-top: 10px;">
                  <div style="color: #666; font-size: 13px;">${question?.text || 'Вопрос'}</div>
                  <div style="color: #333; margin-top: 3px;">${answer.answer}</div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}

        <div style="color: #999; font-size: 12px; margin-top: 15px;">
          ${Utils.timeAgo(fb.submittedAt)}
        </div>
      </div>
    `;
  },

  applyFilters() {
    const metricFilter = document.getElementById('feedbackMetricFilter').value;
    const surveyFilter = document.getElementById('feedbackSurveyFilter').value;

    let filtered = State.feedback;

    if (metricFilter) {
      filtered = filtered.filter(fb => fb.metric === metricFilter);
    }

    if (surveyFilter) {
      filtered = filtered.filter(fb => fb.surveyId === surveyFilter);
    }

    const container = document.getElementById('feedbackList');
    if (container) {
      container.innerHTML = this.renderFeedbackList(filtered);
    }
  }
};