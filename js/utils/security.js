/**
 * Security
 * 
 * J'ai créé ce module pour gérer la sécurité de l'application.
 * Je protège contre les attaques XSS et je valide les entrées utilisateur.
 * 
 * @module security
 */

/**
 * J'échappe les caractères HTML dangereux pour prévenir les attaques XSS.
 * Je convertis les caractères spéciaux en entités HTML sécurisées.
 * 
 * @param {string} text Le texte à échapper
 * @returns {string} Le texte échappé et sécurisé
 */
export function escapeHtml(text) {
    /* Je vérifie si le texte est valide */
    if (text === null || text === undefined) {
        return '';
    }

    /* Je convertis en chaîne si nécessaire */
    const str = String(text);

    /* Je crée un mapping des caractères dangereux vers leurs entités HTML */
    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    /* Je remplace chaque caractère dangereux par son entité HTML */
    return str.replace(/[&<>"'`=/]/g, char => htmlEntities[char]);
}

/**
 * Je valide et nettoie une URL pour m'assurer qu'elle est sécurisée.
 * Je bloque les protocoles dangereux comme javascript: et data:.
 * 
 * @param {string} url L'URL à valider
 * @returns {string} L'URL validée ou une chaîne vide si invalide
 */
export function sanitizeUrl(url) {
    /* Je vérifie si l'URL est valide */
    if (!url || typeof url !== 'string') {
        return '';
    }

    /* Je supprime les espaces en début et fin */
    const trimmedUrl = url.trim();

    /* Je bloque les protocoles dangereux */
    const dangerousProtocols = [
        'javascript:',
        'data:',
        'vbscript:',
        'file:'
    ];

    /* Je convertis en minuscules pour la vérification */
    const lowerUrl = trimmedUrl.toLowerCase();

    /* Je vérifie si l'URL contient un protocole dangereux */
    for (const protocol of dangerousProtocols) {
        if (lowerUrl.startsWith(protocol)) {
            console.warn('Security: URL dangereuse bloquée:', url);
            return '';
        }
    }

    /* Je retourne l'URL nettoyée */
    return trimmedUrl;
}

/**
 * Je valide une entrée de recherche pour éviter les injections.
 * Je limite la longueur et je supprime les caractères potentiellement dangereux.
 * 
 * @param {string} input L'entrée utilisateur à valider
 * @param {number} maxLength La longueur maximale autorisée
 * @returns {string} L'entrée validée et nettoyée
 */
export function sanitizeSearchInput(input, maxLength = 200) {
    /* Je vérifie si l'entrée est valide */
    if (!input || typeof input !== 'string') {
        return '';
    }

    /* Je supprime les espaces superflus */
    let sanitized = input.trim();

    /* Je limite la longueur de l'entrée */
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }

    /* Je supprime les balises HTML potentielles */
    sanitized = sanitized.replace(/<[^>]*>/g, '');

    /* Je supprime les caractères de contrôle */
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

    return sanitized;
}

/**
 * Je valide un identifiant de livre pour m'assurer qu'il est au bon format.
 * Je n'autorise que les caractères alphanumériques et certains caractères spéciaux.
 * 
 * @param {string} id L'identifiant à valider
 * @returns {string|null} L'identifiant validé ou null si invalide
 */
export function validateBookId(id) {
    /* Je vérifie si l'identifiant est valide */
    if (!id || typeof id !== 'string') {
        return null;
    }

    /* Je définis le pattern autorisé pour les identifiants */
    const validPattern = /^[a-zA-Z0-9_-]+$/;

    /* Je supprime les espaces */
    const trimmedId = id.trim();

    /* Je vérifie si l'identifiant correspond au pattern */
    if (!validPattern.test(trimmedId)) {
        console.warn('Security: Identifiant invalide détecté:', id);
        return null;
    }

    /* Je limite la longueur de l'identifiant */
    if (trimmedId.length > 50) {
        return null;
    }

    return trimmedId;
}

/**
 * Je valide une année pour m'assurer qu'elle est dans une plage raisonnable.
 * 
 * @param {number|string} year L'année à valider
 * @param {number} minYear L'année minimum autorisée
 * @param {number} maxYear L'année maximum autorisée
 * @returns {number|null} L'année validée ou null si invalide
 */
export function validateYear(year, minYear = 1000, maxYear = 2100) {
    /* Je convertis en nombre */
    const numYear = parseInt(year, 10);

    /* Je vérifie si c'est un nombre valide */
    if (isNaN(numYear)) {
        return null;
    }

    /* Je vérifie si l'année est dans la plage autorisée */
    if (numYear < minYear || numYear > maxYear) {
        return null;
    }

    return numYear;
}

/**
 * Je crée un élément DOM de manière sécurisée avec du texte échappé.
 * J'utilise textContent au lieu de innerHTML pour éviter les XSS.
 * 
 * @param {string} tag Le nom de la balise HTML
 * @param {string} text Le contenu texte de l'élément
 * @param {Object} attributes Les attributs à ajouter à l'élément
 * @returns {HTMLElement} L'élément créé de manière sécurisée
 */
export function createSafeElement(tag, text = '', attributes = {}) {
    /* Je crée l'élément */
    const element = document.createElement(tag);

    /* J'utilise textContent pour éviter les XSS */
    if (text) {
        element.textContent = text;
    }

    /* J'ajoute les attributs de manière sécurisée */
    for (const [key, value] of Object.entries(attributes)) {
        /* Je valide les attributs dangereux */
        if (key.toLowerCase().startsWith('on')) {
            console.warn('Security: Attribut événementiel bloqué:', key);
            continue;
        }

        /* Je valide les URLs pour certains attributs */
        if (['href', 'src', 'action'].includes(key.toLowerCase())) {
            const sanitizedUrl = sanitizeUrl(value);
            if (sanitizedUrl) {
                element.setAttribute(key, sanitizedUrl);
            }
        } else {
            element.setAttribute(key, escapeHtml(value));
        }
    }

    return element;
}

/**
 * Je vérifie si une chaîne contient du contenu potentiellement malveillant.
 * 
 * @param {string} content Le contenu à vérifier
 * @returns {boolean} True si le contenu semble dangereux
 */
export function containsMaliciousContent(content) {
    if (!content || typeof content !== 'string') {
        return false;
    }

    /* Je définis les patterns dangereux à détecter */
    const dangerousPatterns = [
        /<script\b[^>]*>/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe\b[^>]*>/i,
        /<object\b[^>]*>/i,
        /<embed\b[^>]*>/i,
        /expression\s*\(/i,
        /url\s*\(\s*["']?\s*javascript:/i
    ];

    /* Je vérifie chaque pattern */
    for (const pattern of dangerousPatterns) {
        if (pattern.test(content)) {
            console.warn('Security: Contenu malveillant détecté');
            return true;
        }
    }

    return false;
}

/**
 * Je génère un nonce aléatoire pour la Content Security Policy.
 * 
 * @returns {string} Un nonce aléatoire en base64
 */
export function generateNonce() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, array));
}

/**
 * Je rate limite les appels à une fonction pour éviter les abus.
 * 
 * @param {Function} func La fonction à rate limiter
 * @param {number} limit Le nombre maximum d'appels
 * @param {number} interval L'intervalle de temps en ms
 * @returns {Function} La fonction rate limitée
 */
export function rateLimit(func, limit = 10, interval = 1000) {
    let calls = 0;
    let lastReset = Date.now();

    return function (...args) {
        const now = Date.now();

        /* Je réinitialise le compteur si l'intervalle est passé */
        if (now - lastReset > interval) {
            calls = 0;
            lastReset = now;
        }

        /* Je vérifie si la limite est atteinte */
        if (calls >= limit) {
            console.warn('Security: Rate limit atteint');
            return null;
        }

        calls++;
        return func.apply(this, args);
    };
}