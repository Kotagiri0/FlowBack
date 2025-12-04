// Modal Manager
const ModalManager = {
  init() {
    if (typeof document === 'undefined') {
      return;
    } // защита для Jest

    document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = e.target.dataset.modal;
        this.close(modalId);
      });
    });

    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.close(modal.id);
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAll();
      }
    });
  },

  open(modalId) {
    if (typeof document === 'undefined') {
      return;
    } // Jest protection

    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  close(modalId) {
    if (typeof document === 'undefined') {
      return;
    }

    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      this.resetForm(modalId);
    }
  },

  closeAll() {
    if (typeof document === 'undefined') {
      return;
    }

    document.querySelectorAll('.modal.active').forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  },

  resetForm(modalId) {
    if (typeof document === 'undefined') {
      return;
    }

    const modal = document.getElementById(modalId);
    if (!modal) {
      return;
    }

    modal.querySelectorAll('input[type="text"], input[type="email"], textarea')
      .forEach(input => (input.value = ''));

    modal.querySelectorAll('select')
      .forEach(select => (select.selectedIndex = 0));

    modal.querySelectorAll('input[type="checkbox"]')
      .forEach(checkbox => (checkbox.checked = false));
  }
};

// Для Jest
if (typeof module !== 'undefined') {
  module.exports = ModalManager;
}
