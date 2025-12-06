// Avatar Manager
const AvatarManager = {
    currentAvatar: null,

    init() {
        // Загружаем сохраненную аватарку из localStorage
        this.loadAvatar();

        // Обработчик клика на аватарку
        const avatar = document.getElementById('user-avatar');
        if (avatar) {
            avatar.addEventListener('click', () => this.toggleDropdown());
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

            if (dropdown && !dropdown.contains(e.target) && !avatar.contains(e.target)) {
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
            const userName = 'Иван Петров'; // TODO: получать из настроек
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

    toggleDropdown() {
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
            this.toggleDropdown();

            Utils.showNotification('Аватарка обновлена!');
        };

        reader.readAsDataURL(file);
    },

    changeAvatar() {
        const fileInput = document.getElementById('avatar-upload-input');
        if (fileInput) {
            fileInput.click();
        }
    },

    removeAvatar() {
        // Удаляем из localStorage
        localStorage.removeItem('flowback-avatar');

        // Возвращаем плейсхолдер
        this.setPlaceholder();
        this.currentAvatar = null;

        // Закрываем dropdown
        this.toggleDropdown();

        Utils.showNotification('Аватарка удалена');
    },

    openProfile() {
        // TODO: открыть страницу профиля
        Utils.showNotification('Профиль (в разработке)');
        this.toggleDropdown();
    },

    logout() {
        // TODO: реализовать выход
        if (confirm('Вы уверены, что хотите выйти?')) {
            Utils.showNotification('Выход из системы...');
            // Здесь будет редирект на страницу входа
        }
        this.toggleDropdown();
    }
};