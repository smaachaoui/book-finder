/**
 * ModalView
 * 
 * Je gère l'affichage des modales dans l'application.
 * J'utilise des fonctions de sécurité pour prévenir les attaques XSS.
 * 
 * @class ModalView
 */

/* J'importe les fonctions de sécurité pour échapper le contenu */
import { escapeHtml, sanitizeUrl } from '../utils/security.js';

export class ModalView {

    /**
     * Je crée une instance de ModalView.
     * 
     * @constructor
     */
    constructor() {
        this.modal = null;
        this.defaultCover = 'https://via.placeholder.com/200x300?text=No+Cover';
        this.createModalContainer();
        this.bindEvents();
    }

    /**
     * Je crée le conteneur de la modale dans le DOM.
     * 
     * @returns {void}
     */
    createModalContainer() {
        /* Je vérifie si la modale existe déjà */
        if (document.querySelector('.modal-overlay')) {
            this.modal = document.querySelector('.modal-overlay');
            return;
        }

        /* Je crée le HTML de la modale */
        const modalHTML = `
            <div class="modal-overlay" aria-hidden="true">
                <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <button type="button" class="modal-close" aria-label="Fermer la modale">
                        ×
                    </button>
                    <div class="modal-content">
                        <!-- J'insère le contenu dynamique ici -->
                    </div>
                </div>
            </div>
        `;

        /* J'insère la modale dans le DOM */
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.querySelector('.modal-overlay');
    }

    /**
     * Je lie les événements de la modale.
     * 
     * @returns {void}
     */
    bindEvents() {
        /* Je vérifie que la modale existe */
        if (!this.modal) {
            return;
        }

        /* Je gère la fermeture au clic sur le fond */
        this.modal.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.close();
            }
        });

        /* Je gère la fermeture au clic sur le bouton */
        const closeBtn = this.modal.querySelector('.modal-close');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        /* Je gère la fermeture avec la touche Escape */
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    /**
     * J'affiche les détails d'un livre dans la modale de manière sécurisée.
     * J'échappe toutes les données pour prévenir les attaques XSS.
     * 
     * @param {Object} book Les données du livre
     * @param {Object} details Les détails supplémentaires du livre
     * @param {boolean} inWishlist Si le livre est dans la wishlist
     * @returns {void}
     */
    showBookDetails(book, details, inWishlist = false) {
        const content = this.modal.querySelector('.modal-content');

        /* Je vérifie que le conteneur de contenu existe */
        if (!content) {
            return;
        }

        /* Je construis l'URL de la couverture de manière sécurisée */
        const coverUrl = book.cover_i
            ? sanitizeUrl(`https://covers.openlibrary.org/b/id/${escapeHtml(book.cover_i)}-L.jpg`)
            : this.defaultCover;

        /* J'échappe le titre pour prévenir les XSS */
        const safeTitle = escapeHtml(book.title || 'Titre inconnu');

        /* J'échappe les noms des auteurs */
        const authors = book.author_name
            ? escapeHtml(book.author_name.join(', '))
            : 'Auteur inconnu';

        /* J'échappe l'année de publication */
        const year = escapeHtml(book.first_publish_year || 'Date inconnue');

        /* J'extrais et échappe les détails supplémentaires */
        const description = escapeHtml(this.extractDescription(details));
        const isbn = escapeHtml(this.extractISBN(book, details));
        const publisher = escapeHtml(this.extractPublisher(book));
        const pages = escapeHtml(this.extractPages(book));
        const languages = escapeHtml(this.extractLanguages(book));

        /* Je détermine l'état du bouton wishlist */
        const wishlistBtnText = inWishlist ? 'Retirer de la wishlist' : 'Ajouter à la wishlist';
        const wishlistBtnClass = inWishlist ? 'btn-wishlist in-wishlist' : 'btn-wishlist';

        /* J'échappe la clé du livre pour l'attribut data */
        const safeKey = escapeHtml(book.key || '');

        /* Je construis l'URL Open Library de manière sécurisée */
        const openLibraryUrl = sanitizeUrl(`https://openlibrary.org${book.key}`);

        /* Je génère le HTML avec toutes les données échappées */
        content.innerHTML = `
            <div class="modal-book">
                <div class="modal-book-cover">
                    <img src="${coverUrl}" alt="Couverture de ${safeTitle}" loading="lazy">
                </div>
                <div class="modal-book-info">
                    <h2 id="modal-title" class="modal-book-title">${safeTitle}</h2>
                    <p class="modal-book-author">Par ${authors}</p>
                    <p class="modal-book-year">Publié en ${year}</p>

                    ${description ? `
                        <div class="modal-book-description">
                            <h3>Description</h3>
                            <p>${description}</p>
                        </div>
                    ` : ''}

                    <div class="modal-book-details">
                        <h3>Informations</h3>
                        <ul>
                            ${isbn ? `<li><strong>ISBN:</strong> ${isbn}</li>` : ''}
                            ${publisher ? `<li><strong>Éditeur:</strong> ${publisher}</li>` : ''}
                            ${pages ? `<li><strong>Pages:</strong> ${pages}</li>` : ''}
                            ${languages ? `<li><strong>Langue(s):</strong> ${languages}</li>` : ''}
                        </ul>
                    </div>

                    <div class="modal-book-actions">
                        <button type="button" class="${wishlistBtnClass}" data-work-key="${safeKey}">
                            ${wishlistBtnText}
                        </button>
                        <a href="${openLibraryUrl}" target="_blank" rel="noopener noreferrer" class="btn-external">
                            Voir sur Open Library →
                        </a>
                    </div>
                </div>
            </div>
        `;

        /* J'ouvre la modale */
        this.open();
    }

    /**
     * J'extrais la description du livre.
     * 
     * @param {Object} details Les détails du livre
     * @returns {string|null} La description ou null
     */
    extractDescription(details) {
        /* Je vérifie si les détails existent */
        if (!details) {
            return null;
        }

        /* Je gère les différents formats de description */
        if (typeof details.description === 'string') {
            return details.description;
        }

        if (details.description?.value) {
            return details.description.value;
        }

        return null;
    }

    /**
     * J'extrais l'ISBN du livre.
     * 
     * @param {Object} book Les données du livre
     * @param {Object} details Les détails supplémentaires
     * @returns {string|null} L'ISBN ou null
     */
    extractISBN(book, details) {
        /* Je cherche l'ISBN dans les données du livre */
        if (book.isbn && book.isbn.length > 0) {
            return book.isbn[0];
        }

        /* Je cherche l'ISBN 13 dans les détails */
        if (details?.isbn_13 && details.isbn_13.length > 0) {
            return details.isbn_13[0];
        }

        /* Je cherche l'ISBN 10 dans les détails */
        if (details?.isbn_10 && details.isbn_10.length > 0) {
            return details.isbn_10[0];
        }

        return null;
    }

    /**
     * J'extrais l'éditeur du livre.
     * 
     * @param {Object} book Les données du livre
     * @returns {string|null} L'éditeur ou null
     */
    extractPublisher(book) {
        if (book.publisher && book.publisher.length > 0) {
            return book.publisher[0];
        }

        return null;
    }

    /**
     * J'extrais le nombre de pages du livre.
     * 
     * @param {Object} book Les données du livre
     * @returns {number|null} Le nombre de pages ou null
     */
    extractPages(book) {
        if (book.number_of_pages_median) {
            return book.number_of_pages_median;
        }

        return null;
    }

    /**
     * J'extrais les langues du livre et les traduis.
     * 
     * @param {Object} book Les données du livre
     * @returns {string|null} Les langues ou null
     */
    extractLanguages(book) {
        if (book.language && book.language.length > 0) {
            /* Je définis le mapping des codes de langue */
            const languageNames = {
                'eng': 'Anglais',
                'fre': 'Français',
                'fra': 'Français',
                'spa': 'Espagnol',
                'ger': 'Allemand',
                'deu': 'Allemand',
                'ita': 'Italien',
                'por': 'Portugais',
                'rus': 'Russe',
                'jpn': 'Japonais',
                'chi': 'Chinois',
                'ara': 'Arabe'
            };

            /* Je traduis les codes en noms de langue */
            return book.language
                .slice(0, 3)
                .map(code => languageNames[code] || code)
                .join(', ');
        }

        return null;
    }

    /**
     * J'ouvre la modale.
     * 
     * @returns {void}
     */
    open() {
        /* Je vérifie que la modale existe */
        if (!this.modal) {
            return;
        }

        /* J'active la modale et bloque le scroll */
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Je ferme la modale.
     * 
     * @returns {void}
     */
    close() {
        /* Je vérifie que la modale existe */
        if (!this.modal) {
            return;
        }

        /* Je désactive la modale et restaure le scroll */
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    }

    /**
     * Je vérifie si la modale est ouverte.
     * 
     * @returns {boolean} True si ouverte, false sinon
     */
    isOpen() {
        return this.modal?.classList.contains('active') || false;
    }

    /**
     * Je mets à jour le bouton wishlist dans la modale.
     * 
     * @param {boolean} inWishlist Si le livre est dans la wishlist
     * @returns {void}
     */
    updateWishlistButton(inWishlist) {
        const btn = this.modal?.querySelector('.btn-wishlist');

        /* Je vérifie que le bouton existe */
        if (!btn) {
            return;
        }

        /* Je mets à jour l'apparence et le texte du bouton */
        if (inWishlist) {
            btn.classList.add('in-wishlist');
            btn.textContent = 'Retirer de la wishlist';
        } else {
            btn.classList.remove('in-wishlist');
            btn.textContent = 'Ajouter à la wishlist';
        }
    }

    /**
     * J'affiche un loader dans la modale.
     * 
     * @returns {void}
     */
    showLoading() {
        const content = this.modal?.querySelector('.modal-content');

        /* Je vérifie que le conteneur existe */
        if (!content) {
            return;
        }

        /* J'affiche le spinner de chargement */
        content.innerHTML = `
            <div class="modal-loading">
                <div class="spinner"></div>
                <p>Chargement des détails...</p>
            </div>
        `;

        /* J'ouvre la modale */
        this.open();
    }

    /**
     * J'affiche une erreur dans la modale de manière sécurisée.
     * J'échappe le message pour prévenir les XSS.
     * 
     * @param {string} message Le message d'erreur
     * @returns {void}
     */
    showError(message) {
        const content = this.modal?.querySelector('.modal-content');

        /* Je vérifie que le conteneur existe */
        if (!content) {
            return;
        }

        /* J'échappe le message d'erreur pour la sécurité */
        const safeMessage = escapeHtml(message);

        /* J'affiche le message d'erreur */
        content.innerHTML = `
            <div class="modal-error">
                <p>${safeMessage}</p>
                <button type="button" class="btn-close-error">Fermer</button>
            </div>
        `;

        /* Je lie l'événement de fermeture */
        const closeBtn = content.querySelector('.btn-close-error');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
    }
}