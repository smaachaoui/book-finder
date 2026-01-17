/**
 * BookView
 * 
 * Je gère l'affichage des livres dans le DOM.
 * J'utilise des fonctions de sécurité pour prévenir les attaques XSS.
 * 
 * @class BookView
 */

/* J'importe les fonctions de sécurité pour échapper le contenu */
import { escapeHtml, sanitizeUrl } from '../utils/security.js';

export class BookView {

    /**
     * Je crée une instance du BookView.
     * 
     * @constructor
     * @param {string} containerSelector Le sélecteur du conteneur principal
     */
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.defaultCover = 'https://via.placeholder.com/150x200?text=No+Cover';
    }

    /**
     * J'affiche une liste de livres de manière sécurisée.
     * 
     * @param {Array} books La liste des livres à afficher
     * @returns {void}
     */
    renderBooks(books) {
        /* Je vérifie que le conteneur existe */
        if (!this.container) {
            console.error('BookView: Conteneur non trouvé');
            return;
        }

        /* J'affiche un message si aucun livre n'est trouvé */
        if (books.length === 0) {
            this.showEmpty();
            return;
        }

        /* Je génère le HTML de manière sécurisée */
        const html = books.map(book => this.renderBookCard(book)).join('');
        this.container.innerHTML = html;
    }

    /**
     * Je crée le HTML d'une carte de livre avec échappement XSS.
     * J'échappe toutes les données provenant de l'API pour la sécurité.
     * 
     * @param {Object} book Les données du livre
     * @returns {string} Le HTML de la carte sécurisé
     */
    renderBookCard(book) {
        /* Je construis l'URL de la couverture de manière sécurisée */
        const coverUrl = book.cover_i
            ? sanitizeUrl(`https://covers.openlibrary.org/b/id/${escapeHtml(book.cover_i)}-M.jpg`)
            : this.defaultCover;

        /* J'échappe le titre pour prévenir les XSS */
        const safeTitle = escapeHtml(book.title || 'Titre inconnu');

        /* J'échappe les noms des auteurs */
        const authors = book.author_name
            ? escapeHtml(book.author_name.join(', '))
            : 'Auteur inconnu';

        /* J'échappe l'année de publication */
        const year = escapeHtml(book.first_publish_year || 'Date inconnue');

        /* Je valide et échappe l'identifiant du livre */
        const workId = book.key ? escapeHtml(book.key.replace('/works/', '')) : '';

        /* Je détermine l'état du bouton wishlist */
        const wishlistClass = book.inWishlist ? 'btn-wishlist in-wishlist' : 'btn-wishlist';
        const wishlistText = book.inWishlist ? 'Dans la wishlist ♥' : 'Ajouter à la wishlist';

        /* Je retourne le HTML avec toutes les données échappées */
        return `
            <article class="book-card" data-work-id="${workId}">
                <div class="book-cover">
                    <img src="${coverUrl}" alt="Couverture de ${safeTitle}" loading="lazy">
                </div>
                <div class="book-info">
                    <h3 class="book-title">${safeTitle}</h3>
                    <p class="book-author">${authors}</p>
                    <p class="book-year">${year}</p>
                </div>
                <div class="book-actions">
                    <button type="button" class="btn-details" data-work-id="${workId}">
                        Voir détails
                    </button>
                    <button type="button" class="${wishlistClass}" data-work-id="${workId}">
                        ${wishlistText}
                    </button>
                </div>
            </article>
        `;
    }

    /**
     * J'affiche le loader de chargement.
     * 
     * @returns {void}
     */
    showLoading() {
        /* Je vérifie que le conteneur existe */
        if (!this.container) {
            return;
        }

        /* J'affiche le spinner de chargement */
        this.container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Chargement en cours...</p>
            </div>
        `;
    }

    /**
     * Je cache le loader de chargement.
     * 
     * @returns {void}
     */
    hideLoading() {
        const loader = this.container?.querySelector('.loading');

        if (loader) {
            loader.remove();
        }
    }

    /**
     * J'affiche un message d'erreur sécurisé.
     * J'échappe le message pour prévenir les XSS.
     * 
     * @param {string} message Le message d'erreur à afficher
     * @returns {void}
     */
    showError(message) {
        /* Je vérifie que le conteneur existe */
        if (!this.container) {
            return;
        }

        /* J'échappe le message d'erreur */
        const safeMessage = escapeHtml(message);

        /* J'affiche le message d'erreur */
        this.container.innerHTML = `
            <div class="error-message">
                <p>${safeMessage}</p>
                <button type="button" class="btn-retry">Réessayer</button>
            </div>
        `;
    }

    /**
     * J'affiche un message quand il n'y a aucun résultat.
     * 
     * @returns {void}
     */
    showEmpty() {
        /* Je vérifie que le conteneur existe */
        if (!this.container) {
            return;
        }

        /* J'affiche le message de résultat vide */
        this.container.innerHTML = `
            <div class="empty-message">
                <p>Aucun livre trouvé.</p>
                <p>Essayez avec d'autres termes de recherche.</p>
            </div>
        `;
    }

    /**
     * Je mets à jour le compteur de résultats de manière sécurisée.
     * 
     * @param {number} count Le nombre de résultats
     * @param {string} selector Le sélecteur de l'élément compteur
     * @returns {void}
     */
    updateResultsCount(count, selector = '.results-count') {
        const element = document.querySelector(selector);

        if (element) {
            /* Je m'assure que count est un nombre valide */
            const safeCount = parseInt(count, 10) || 0;
            element.innerHTML = `<strong>${safeCount}</strong> livre(s) trouvé(s)`;
        }
    }

    /**
     * Je vide le conteneur.
     * 
     * @returns {void}
     */
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}