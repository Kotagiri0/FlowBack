// Avatar Manager - ИСПРАВЛЕННАЯ ВЕРСИЯ
const AvatarManager = {
    currentAvatar: null,

    init() {
        // Загружаем сохраненную аватарку из localStorage
        this.loadAvatar();

        // Обработчик клика на аватарку
        const avatar = document.getElementById('user-avatar');
        if (avatar) {
            avatar.addEventListener('click', (e) => this.toggleDropdown(e));
        }

        // Обработчик загрузки файла
        const fileInput = document.getElementById('avatar-upload-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        // Закрытие dropdown при клике вне его
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('avatar-dropdown');
            const avatar = document.getElementById('user-avatar');

            if (dropdown && avatar &&
                !dropdown.contains(e.target) &&
                !avatar.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    },

    loadAvatar() {
        // Пытаемся загрузить аватарку из localStorage
        const savedAvatar = localStorage.getItem('flowback-avatar');
        if (savedAvatar) {
            this.setAvatar(savedAvatar);
        } else {
            // Показываем плейсхолдер с инициалами
            this.setPlaceholder();
        }
    },

    setAvatar(imageData) {
        const avatarImg = document.getElementById('avatar-img');
        const avatarPlaceholder = document.getElementById('avatar-placeholder');

        if (avatarImg && imageData) {
            avatarImg.src = imageData;
            avatarImg.style.display = 'block';
            if (avatarPlaceholder) {
                avatarPlaceholder.style.display = 'none';
            }
            this.currentAvatar = imageData;
        }
    },

    setPlaceholder() {
        const avatarImg = document.getElementById('avatar-img');
        const avatarPlaceholder = document.getElementById('avatar-placeholder');

        if (avatarImg) {
            avatarImg.style.display = 'none';
        }
        if (avatarPlaceholder) {
            avatarPlaceholder.style.display = 'flex';
            // Получаем инициалы из имени пользователя
            const userName = 'Иван Петров';
            avatarPlaceholder.textContent = this.getInitials(userName);
        }
    },

    getInitials(name) {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    },

    toggleDropdown(event) {
        // Останавливаем всплытие события, чтобы document click не сработал сразу
        if (event) event.stopPropagation();

        const dropdown = document.getElementById('avatar-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    },

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Проверка типа файла
        if (!file.type.match('image.*')) {
            Utils.showNotification('Пожалуйста, выберите изображение', 'error');
            return;
        }

        // Проверка размера (максимум 2MB)
        if (file.size > 2 * 1024 * 1024) {
            Utils.showNotification('Размер изображения не должен превышать 2MB', 'error');
            return;
        }

        // Чтение файла
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;

            // Сохраняем в localStorage
            localStorage.setItem('flowback-avatar', imageData);

            // Устанавливаем аватарку
            this.setAvatar(imageData);

            // Закрываем dropdown
            const dropdown = document.getElementById('avatar-dropdown');
            if (dropdown) dropdown.classList.remove('active');

            Utils.showNotification('Аватарка обновлена!', 'success');
        };

        reader.readAsDataURL(file);
    },

    changeAvatar() {
        const fileInput = document.getElementById('avatar-upload-input');
        if (fileInput) {
            fileInput.click();
        }
        // Закрываем dropdown после выбора файла
        setTimeout(() => {
            const dropdown = document.getElementById('avatar-dropdown');
            if (dropdown) dropdown.classList.remove('active');
        }, 100);
    },

    removeAvatar() {
        // Удаляем из localStorage
        localStorage.removeItem('flowback-avatar');

        // Возвращаем плейсхолдер
        this.setPlaceholder();
        this.currentAvatar = null;

        // Закрываем dropdown
        const dropdown = document.getElementById('avatar-dropdown');
        if (dropdown) dropdown.classList.remove('active');

        Utils.showNotification('Аватарка удалена', 'success');
    },

    openProfile() {
        Utils.showNotification('Профиль пользователя (в разработке)', 'info');

        // Закрываем dropdown
        const dropdown = document.getElementById('avatar-dropdown');
        if (dropdown) dropdown.classList.remove('active');

        // Показываем временную страницу профиля
        setTimeout(() => {
            document.getElementById('settings').innerHTML = `
                <div class="section-header">
                    <h2>👤 Профиль пользователя</h2>
                    <button class="btn btn-outline" onclick="Navigation.switchTab('dashboard')">← Назад</button>
                </div>
                <div class="card">
                    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                        <div class="avatar" style="width: 80px; height: 80px;">
                            ${this.currentAvatar ?
                `<img src="${this.currentAvatar}" style="width: 100%; height: 100%; border-radius: 50%;">` :
                `<div style="width: 100%; height: 100%; background: var(--primary-color); color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 24px;">
                                    ${this.getInitials('Иван Петров')}
                                </div>`
            }
                        </div>
                        <div>
                            <h3>Иван Петров</h3>
                            <p style="color: #666;">Администратор системы</p>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Имя</label>
                        <input type="text" value="Иван" class="form-control">
                    </div>
                    
                    <div class="form-group">
                        <label>Фамилия</label>
                        <input type="text" value="Петров" class="form-control">
                    </div>
                    
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" value="admin@flowback.ru" class="form-control">
                    </div>
                    
                    <div class="form-group">
                        <label>Роль</label>
                        <input type="text" value="Администратор" class="form-control" disabled>
                    </div>
                    
                    <button class="btn btn-primary" style="margin-top: 20px;">Сохранить изменения</button>
                </div>
            `;
            Navigation.switchTab('settings');
        }, 100);
    },

    logout() {
        // Закрываем dropdown перед выходом
        const dropdown = document.getElementById('avatar-dropdown');
        if (dropdown) dropdown.classList.remove('active');

        // Показываем окно подтверждения
        setTimeout(() => {
            if (confirm('Вы уверены, что хотите выйти из системы?')) {
                Utils.showNotification('Выход из системы...', 'info');

                // Симуляция выхода
                setTimeout(() => {
                    // Очищаем данные сессии
                    localStorage.removeItem('flowback-session');
                    localStorage.removeItem('flowback-user');

                    // Показываем страницу входа (для демо)
                    document.body.innerHTML = `
                        <div class="container" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
                            <div class="card" style="width: 400px; text-align: center;">
                                <h2>🔄 FlowBack</h2>
                                <p style="color: #666; margin-bottom: 30px;">Система сбора клиентского фидбека</p>
                                
                                <div class="form-group">
                                    <label>Email</label>
                                    <input type="email" placeholder="email@company.ru" class="form-control">
                                </div>
                                
                                <div class="form-group">
                                    <label>Пароль</label>
                                    <input type="password" placeholder="••••••••" class="form-control">
                                </div>
                                
                                <button class="btn btn-primary" style="width: 100%; margin-top: 20px;" onclick="window.location.reload()">
                                    Войти в систему
                                </button>
                                
                                <p style="margin-top: 20px; color: #999;">
                                    Для демо просто обновите страницу
                                </p>
                            </div>
                        </div>
                    `;

                    Utils.showNotification('Вы успешно вышли из системы', 'success');
                }, 1000);
            }
        }, 100);
    }
};