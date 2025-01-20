class PasswordManager {
    constructor() {
        this.passwords = JSON.parse(localStorage.getItem('passwords')) || [];
        this.$form = document.getElementById('passwordForm');
        this.$passwordList = document.getElementById('passwordList');
        this.$siteInput = document.getElementById('site');
        this.$usernameInput = document.getElementById('username');
        this.$passwordInput = document.getElementById('password');
        this.editingId = null;

        this.init();
    }

    init() {
        this.$form.addEventListener('submit', this.handleSubmit.bind(this));
        this.renderPasswords();
    }

    handleSubmit(e) {
        e.preventDefault();
        const $site = this.$siteInput.value;
        const $username = this.$usernameInput.value;
        const $password = this.$passwordInput.value;

        if (this.editingId !== null) {
            this.updatePassword(this.editingId, $site, $username, $password);
        } else {
            this.addPassword($site, $username, $password);
        }

        this.$form.reset();
        this.editingId = null;
        document.querySelector('button[type="submit"]').textContent = 'Guardar Contraseña';
    }

    addPassword(site, username, password) {
        const newPassword = {
            id: Date.now(),
            site,
            username,
            password
        };

        this.passwords.push(newPassword);
        this.saveToStorage();
        this.renderPasswords();
    }

    updatePassword(id, site, username, password) {
        this.passwords = this.passwords.map(pass =>
            pass.id === id ? { ...pass, site, username, password } : pass
        );
        this.saveToStorage();
        this.renderPasswords();
    }

    deletePassword(id) {
        this.passwords = this.passwords.filter(pass => pass.id !== id);
        this.saveToStorage();
        this.renderPasswords();
    }

    editPassword(password) {
        this.editingId = password.id;
        this.$siteInput.value = password.site;
        this.$usernameInput.value = password.username;
        this.$passwordInput.value = password.password;
        document.querySelector('button[type="submit"]').textContent = 'Actualizar Contraseña';
    }

    togglePasswordVisibility(cell, password) {
        const isVisible = cell.textContent !== '••••••••';
        cell.textContent = isVisible ? '••••••••' : password;
    }

    renderPasswords() {
        this.$passwordList.innerHTML = this.passwords.map(pass => {
            const safePass = {
                id: pass.id,
                site: pass.site.replace(/"/g, '&quot;'),
                username: pass.username.replace(/"/g, '&quot;'),
                password: pass.password.replace(/"/g, '&quot;')
            };
            
            return `
                <tr>
                    <td>${pass.site}</td>
                    <td>${pass.username}</td>
                    <td class="password-cell">
                        <span>••••••••</span>
                        <button class="action-button" onclick="passwordManager.togglePasswordVisibility(this.previousElementSibling, '${safePass.password}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                    <td>
                        <div class="actions">
                            <button class="action-button" 
                                    data-password='${JSON.stringify(safePass)}'
                                    onclick="passwordManager.editPassword(JSON.parse(this.dataset.password))">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-button" 
                                    onclick="passwordManager.deletePassword(${pass.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    saveToStorage() {
        localStorage.setItem('passwords', JSON.stringify(this.passwords));
    }
}

const passwordManager = new PasswordManager();

