// Управление клиентами

const ClientManager = {
  render() {
    const section = document.getElementById('clients');

    section.innerHTML = `
      <div class="section-header">
        <div>
          <h2>👥 Клиенты</h2>
          <p style="color: #666;">Управление базой клиентов</p>
        </div>
        <button class="btn btn-primary" onclick="Modals.open('addClient')">
          ➕ Добавить клиента
        </button>
      </div>

      <!-- Поиск и фильтры -->
      <div class="card" style="margin-bottom: 20px;">
        <div style="display: flex; gap: 15px; align-items: center;">
          <input 
            type="text" 
            id="clientSearch" 
            placeholder="🔍 Поиск по названию или контакту..." 
            style="flex: 1;"
            oninput="ClientManager.handleSearch(event)"
          >
          <select id="roleFilter" onchange="ClientManager.handleFilter()" style="width: 250px;">
            <option value="">Все роли</option>
            <option value="lpr">ЛПР</option>
            <option value="tech_implementation">Техспец внедрения</option>
            <option value="tech_support">Техспец сопровождения</option>
            <option value="business_user">Бизнес-пользователь</option>
          </select>
        </div>
      </div>

      <!-- Список клиентов -->
      <div id="clientsList">
        ${this.renderClientsList()}
      </div>
    `;
  },

  renderClientsList(clients = State.clients) {
    if (clients.length === 0) {
      return `
        <div class="card" style="text-align: center; padding: 40px;">
          <div style="font-size: 48px; margin-bottom: 20px;">👥</div>
          <h3 style="color: #666;">Нет клиентов</h3>
          <p style="color: #999;">Добавьте первого клиента</p>
        </div>
      `;
    }

    return `
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Компания</th>
              <th>Контактное лицо</th>
              <th>Email</th>
              <th>Роли</th>
              <th>Статус</th>
              <th>Дата добавления</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            ${clients.map(client => this.renderClientRow(client)).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  renderClientRow(client) {
    const statusColors = {
      active: '#10b981',
      inactive: '#6b7280',
      churned: '#ef4444'
    };

    const statusNames = {
      active: 'Активен',
      inactive: 'Неактивен',
      churned: 'Ушел'
    };

    return `
      <tr>
        <td><strong>${client.company}</strong></td>
        <td>${client.contact}</td>
        <td>${client.email}</td>
        <td>
          ${client.roles.map(role => 
            `<span class="badge" style="margin-right: 5px;">${RoleAuth.getRoleName(role)}</span>`
          ).join('')}
        </td>
        <td>
          <span class="badge" style="background: ${statusColors[client.status]};">
            ${statusNames[client.status]}
          </span>
        </td>
        <td>${Utils.formatDateShort(client.createdAt)}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="ClientManager.editClient('${client.id}')">
            ✏️ Редактировать
          </button>
          <button class="btn btn-secondary btn-sm" onclick="ClientManager.deleteClient('${client.id}')" style="margin-left: 5px;">
            🗑️ Удалить
          </button>
        </td>
      </tr>
    `;
  },

  // Поиск клиентов
  handleSearch(event) {
    const searchTerm = event.target.value;
    const filtered = Utils.filterData(State.clients, searchTerm, ['company', 'contact', 'email']);
    this.updateClientsList(filtered);
  },

  // Фильтр по роли
  handleFilter() {
    const role = document.getElementById('roleFilter').value;
    const searchTerm = document.getElementById('clientSearch').value;

    let filtered = State.clients;

    if (role) {
      filtered = filtered.filter(client => client.roles.includes(role));
    }

    if (searchTerm) {
      filtered = Utils.filterData(filtered, searchTerm, ['company', 'contact', 'email']);
    }

    this.updateClientsList(filtered);
  },

  // Обновить список клиентов
  updateClientsList(clients) {
    const container = document.getElementById('clientsList');
    if (container) {
      container.innerHTML = this.renderClientsList(clients);
    }
  },

  // Добавить клиента
  addClient() {
    const company = document.getElementById('clientCompany').value.trim();
    const contact = document.getElementById('clientContact').value.trim();
    const email = document.getElementById('clientEmail').value.trim();
    const rolesSelect = document.getElementById('clientRoles');
    const roles = Array.from(rolesSelect.selectedOptions).map(opt =>
      this.getRoleValue(opt.text)
    );

    // Валидация
    if (!company || !contact || !email || roles.length === 0) {
      Utils.showNotification('❌ Заполните все обязательные поля', 'error');
      return;
    }

    if (!Utils.isValidEmail(email)) {
      Utils.showNotification('❌ Введите корректный email', 'error');
      return;
    }

    // Создать нового клиента
    const newClient = {
      id: Utils.generateId('client'),
      company,
      contact,
      email,
      roles,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // Добавить в State
    State.clients.push(newClient);

    // Закрыть модальное окно
    Modals.close('addClient');

    // Обновить список
    this.render();

    // Очистить форму
    document.getElementById('clientCompany').value = '';
    document.getElementById('clientContact').value = '';
    document.getElementById('clientEmail').value = '';
    rolesSelect.selectedIndex = -1;

    Utils.showNotification('✅ Клиент успешно добавлен', 'success');
  },

  // Получить значение роли из текста
  getRoleValue(roleText) {
    const roleMap = {
      'ЛПР': 'lpr',
      'Техспец внедрения': 'tech_implementation',
      'Техспец сопровождения': 'tech_support',
      'Бизнес-юзер': 'business_user'
    };
    return roleMap[roleText] || roleText;
  },

  // Редактировать клиента
  editClient(clientId) {
    const client = State.clients.find(c => c.id === clientId);
    if (!client) return;

    Utils.showNotification('ℹ️ Редактирование в разработке', 'info');
    console.log('Редактирование клиента:', client);
    // TODO: Реализовать редактирование
  },

  // Удалить клиента
  deleteClient(clientId) {
    if (!confirm('Вы уверены, что хотите удалить этого клиента?')) return;

    const index = State.clients.findIndex(c => c.id === clientId);
    if (index !== -1) {
      State.clients.splice(index, 1);
      this.render();
      Utils.showNotification('✅ Клиент удален', 'success');
    }
  }
};