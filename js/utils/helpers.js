/**
 * Utils
 * 
 * Fonctions utilitaires réutilisables dans l'application.
 * 
 * @module utils
 */

/**
 * Je crée une fonction debounce pour limiter les appels fréquents.
 * 
 * @param {Function} func La fonction à exécuter
 * @param {number} delay Le délai en millisecondes
 * @returns {Function} La fonction avec debounce
 */
export function debounce(func, delay = 300) {
    let timeoutId;

    return function (...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * Je formate une date ISO en format lisible.
 * 
 * @param {string} isoDate La date au format ISO
 * @returns {string} La date formatée
 */
export function formatDate(isoDate) {
    if (!isoDate) {
        return 'Date inconnue';
    }

    const date = new Date(isoDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };

    return date.toLocaleDateString('fr-FR', options);
}

/**
 * Je tronque un texte à une longueur maximale.
 * 
 * @param {string} text Le texte à tronquer
 * @param {number} maxLength La longueur maximale
 * @returns {string} Le texte tronqué
 */
export function truncateText(text, maxLength = 150) {
    if (!text || text.length <= maxLength) {
        return text || '';
    }

    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Je récupère les paramètres de l'URL courante.
 * 
 * @returns {URLSearchParams} Les paramètres de l'URL
 */
export function getUrlParams() {
    return new URLSearchParams(window.location.search);
}

/**
 * Je mets à jour un paramètre dans l'URL sans recharger la page.
 * 
 * @param {string} key La clé du paramètre
 * @param {string} value La valeur du paramètre
 * @returns {void}
 */
export function updateUrlParam(key, value) {
    const url = new URL(window.location);

    if (value) {
        url.searchParams.set(key, value);
    } else {
        url.searchParams.delete(key);
    }

    window.history.replaceState({}, '', url);
}

/**
 * J'affiche une notification toast à l'utilisateur.
 * 
 * @param {string} message Le message à afficher
 * @param {string} type Le type de notification (success, error, info)
 * @param {number} duration La durée d'affichage en ms
 * @returns {void}
 */
export function showToast(message, type = 'info', duration = 3000) {
    /* Je supprime les toasts existants */
    const existingToast = document.querySelector('.toast');

    if (existingToast) {
        existingToast.remove();
    }

    /* Je crée le toast */
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
        <span class="toast-message">${message}</span>
        <button type="button" class="toast-close" aria-label="Fermer">×</button>
    `;

    document.body.appendChild(toast);

    /* Animation d'entrée */
    requestAnimationFrame(() => {
        toast.classList.add('active');
    });

    /* Fermeture au clic */
    const closeBtn = toast.querySelector('.toast-close');

    closeBtn.addEventListener('click', () => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 300);
    });

    /* Fermeture automatique */
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 300);
        }
    }, duration);
}