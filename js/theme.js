// theme.js - Sistema de cambio de tema claro/oscuro

// Variables globales
let currentTheme = 'light';

// Función para inicializar el sistema de tema
function initThemeSystem() {
    // Crear botón de cambio de tema si no existe
    if (!document.getElementById('themeToggle')) {
        createThemeToggle();
    }

    // Cargar tema guardado o usar preferencia del sistema
    loadTheme();

    // Configurar event listeners
    setupEventListeners();

    // Configurar tecla de acceso rápido
    setupKeyboardShortcut();
}

// Función para crear el botón de cambio de tema
function createThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.id = 'themeToggle';
    themeToggle.className = 'theme-toggle-btn';
    themeToggle.setAttribute('aria-label', 'Cambiar tema');
    themeToggle.innerHTML = `
        <i class="bi bi-sun"></i>
        <i class="bi bi-moon"></i>
    `;

    // Buscar un lugar apropiado para insertar el botón
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse) {
        const nav = navbarCollapse.querySelector('.navbar-nav');
        if (nav) {
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.appendChild(themeToggle);
            nav.appendChild(li);
        }
    }
}

// Función para cargar el tema
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Usar preferencia del sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }
}

// Función para aplicar el tema
function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Actualizar el texto del tema actual si existe
    const currentThemeSpan = document.getElementById('currentTheme');
    if (currentThemeSpan) {
        currentThemeSpan.textContent = theme === 'dark' ? 'oscuro' : 'claro';
    }

    // Actualizar el estado del switch si existe
    const themeSwitch = document.getElementById('themeSwitch');
    if (themeSwitch) {
        themeSwitch.checked = theme === 'dark';
    }

    // Actualizar clases del body
    if (theme === 'dark') {
        document.body.classList.add('bg-dark', 'text-light');
        document.body.classList.remove('bg-light', 'text-dark');
    } else {
        document.body.classList.add('bg-light', 'text-dark');
        document.body.classList.remove('bg-dark', 'text-light');
    }

    // Actualizar íconos específicos si es necesario
    updateThemeIcons(theme);
}

// Función para actualizar íconos según el tema
function updateThemeIcons(theme) {
    // Ejemplo: cambiar íconos de ciertos elementos
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const icon = card.querySelector('.theme-icon');
        if (icon) {
            if (theme === 'dark') {
                icon.classList.remove('text-dark');
                icon.classList.add('text-light');
            } else {
                icon.classList.remove('text-light');
                icon.classList.add('text-dark');
            }
        }
    });
}

// Función para alternar entre temas
function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showThemeNotification(newTheme);
}

// Función para mostrar notificación de cambio de tema
function showThemeNotification(theme) {
    const themeName = theme === 'dark' ? 'oscuro' : 'claro';

    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `theme-notification position-fixed bottom-0 end-0 m-3 p-3 rounded shadow-lg ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'
        }`;
    notification.style.zIndex = '1050';
    notification.style.transition = 'all 0.3s ease';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-palette-fill me-2 fs-4"></i>
            <div>
                <strong>Tema cambiado</strong>
                <p class="mb-0">Modo ${themeName} activado</p>
            </div>
            <button class="btn-close ms-3" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;

    document.body.appendChild(notification);

    // Eliminar notificación después de 4 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// Función para configurar event listeners
function setupEventListeners() {
    // Botón de cambio de tema
    document.addEventListener('click', function (e) {
        if (e.target.closest('#themeToggle')) {
            toggleTheme();
        }
    });

    // Switch de tema en el footer
    document.addEventListener('change', function (e) {
        if (e.target && e.target.id === 'themeSwitch') {
            toggleTheme();
        }
    });

    // Escuchar cambios en la preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// Función para configurar tecla de acceso rápido
function setupKeyboardShortcut() {
    document.addEventListener('keydown', function (e) {
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initThemeSystem);

// Exportar funciones para uso global
window.themeSystem = {
    toggleTheme,
    applyTheme,
    getCurrentTheme: () => currentTheme
};