class PasswordManager {
    constructor() {
        this.password = JSON.parse(localStorage.getItem('password')) || '';
        this.$form = document.querySelector('passwordForm');
        this.$passwordList = document.querySelector('passwordList');
        this.editingId = null;

        this.init();
    }

    init() {
        this.$form.addEventListener('submit', this.handleSubmit.bind(this));
        this.render();
    }

    handleSubmit(e) {
        e.preventDefault()
    }
}