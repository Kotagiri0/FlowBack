// Feedback Manager
const FeedbackManager = {
  async render() {
    const feedback = await API.getFeedback();

    const feedbackSection = document.getElementById('feedback');
    feedbackSection.innerHTML = `
      <h2 style="margin-bottom: 20px;">Полученный фидбек</h2>
      
      <div style="margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
        <select id="feedbackFilter" onchange="FeedbackManager.filterFeedback()" 
                style="padding: 10px; border-radius: 8px; border: 2px solid #e0e0e0;">
          <option value="all">Все отзывы</option>
          <option value="positive">Позитивные</option>
          <option value="neutral">Нейтральные</option>
          <option value="negative">Негативные</option>
        </select>
        
        <input type="text" id="feedbackSearch" placeholder="Поиск по клиенту..." 
               onkeyup="FeedbackManager.searchFeedback()"
               style="padding: 10px; border-radius: 8px; border: 2px solid #e0e0e0; flex: 1; min-width: 200px;">
      </div>

      <div id="feedbackList">
        ${feedback.map(item => this.renderFeedbackItem(item)).join('')}
      </div>

      ${feedback.length === 0 ? '<p style="color: #666; text-align: center; padding: 40px;">Нет фидбека</p>' : ''}
    `;
  },

  renderFeedbackItem(item) {
    return `
      <div class="feedback-item" data-sentiment="${item.sentiment}" data-client="${item.client.toLowerCase()}">
        <div class="feedback-header">
          <div>
            <strong>${item.client}</strong> • ${item.contact}
            <span style="color: #666; margin-left: 10px;">
              ${Utils.formatRelativeTime(item.date)}
            </span>
          </div>
          <span class="sentiment ${item.sentiment}">
            ${this.getSentimentText(item.sentiment)}
          </span>
        </div>
        <p style="margin: 10px 0;">
          ${item.nps !== undefined ? `NPS: <strong>${item.nps}/10</strong>` : ''}
          ${item.ces !== undefined ? ` • CES: <strong>${item.ces}/5</strong>` : ''}
          ${item.csat !== undefined ? ` • CSAT: <strong>${item.csat}/5</strong>` : ''}
        </p>
        <p style="color:#666;">${item.comment}</p>
      </div>
    `;
  },

  getSentimentText(sentiment) {
    const texts = {
      positive: 'Позитивный',
      neutral: 'Нейтральный',
      negative: 'Негативный'
    };
    return texts[sentiment] || sentiment;
  },

  filterFeedback() {
    const filterValue = document.getElementById('feedbackFilter').value;
    const items = document.querySelectorAll('.feedback-item');

    items.forEach(item => {
      if (filterValue === 'all') {
        item.style.display = 'block';
      } else {
        const sentiment = item.dataset.sentiment;
        item.style.display = sentiment === filterValue ? 'block' : 'none';
      }
    });
  },

  searchFeedback() {
    const searchValue = document.getElementById('feedbackSearch').value.toLowerCase();
    const items = document.querySelectorAll('.feedback-item');

    items.forEach(item => {
      const client = item.dataset.client;
      item.style.display = client.includes(searchValue) ? 'block' : 'none';
    });
  }
};