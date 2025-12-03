// Client Manager
const ClientManager = {
  async render() {
    const clients = await API.getClients();

    const clientsSection = document.getElementById('clients');
    clientsSection.innerHTML = `
      <h2 style="margin-bottom: 20px;">Управление клиентами</h2>
      <button class="btn btn-primary" style="margin-bottom: 20px;" onclick="ModalManager.open('addClient')">
        ➕ Добавить клиента
      </button>

      <div class="client-list">
        ${clients.map(client => this.renderClientCard(client)).join('')}
      </div>
    `;
  },

  renderClientCard(client) {
    return `
      <div class="client-card">
        <div class="client-info">
          <h3>${client.company}</h3>
          <p style="color: #666; margin-bottom: 5px;">
            Контакт: ${client.contact} • ${client.email}
          </p>
          <div class="role-tags">
            ${client.roles.map(role => `<span class="role-tag">${role}</span>`).join('')}
          </div>
          <p style="color: #666; font-size: 0.9em; margin-top: 10px;">
            Последний опрос: ${Utils.formatRelativeTime(client.lastSurvey)}
          </p>
        </div>
        <div>
          <button class="btn btn-secondary" onclick="ClientManager.editClient(${client.id})">
            Редактировать
          </button>
        </div>
      </div>
    `;
  },

  async addClient() {
    const clientData = {
      company: document.getElementById('clientCompany').value,
      contact: document.getElementById('clientContact').value,
      email: document.getElementById('clientEmail').value,
      roles: Array.from(document.getElementById('clientRoles').selectedOptions).map(o => o.value),
      lastSurvey: new Date().toISOString()
    };

    if (!clientData.company || !clientData.contact || !clientData.email) {
      Utils.showNotification('Заполните все обязательные поля', 'error');
      return;
    }

    if (!Utils.validateEmail(clientData.email)) {
      Utils.showNotification('Некорректный email', 'error');
      return;
    }

    if (clientData.roles.length === 0) {
      Utils.showNotification('Выберите хотя бы одну роль', 'error');
      return;
    }

    const result = await API.createClient(clientData);
    if (result.ok) {
      Utils.showNotification('Клиент успешно добавлен!');
      ModalManager.close('addClient');
      this.render();
    }
  },

  editClient(id) {
    Utils.showNotification(`Редактирование клиента #${id}`);
  }
};