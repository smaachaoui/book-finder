/**
 * ModalView
 * 
 * Gère l'affichage des modales dans l'application.
 * 
 * @class ModalView
 */
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
        if (document.querySelector('.modal-overlay')) {
            this.modal = document.querySelector('.modal-overlay');
            return;
        }

        const modalHTML = `
            <div class="modal-overlay" aria-hidden="true">
                <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <button type="button" class="modal-close" aria-label="Fermer la modale">
                        ×
                    </button>
                    <div class="modal-content">
                        <!-- Contenu dynamique -->
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.querySelector('.modal-overlay');
    }

    /**
     * Je lie les événements de la modale.
     * 
     * @returns {void}
     */
    bindEvents() {
        if (!this.modal) {
            return;
        }

        /* Fermeture au clic sur le fond */
        this.modal.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.close();
            }
        });

        /* Fermeture au clic sur le bouton */
        const closeBtn = this.modal.querySelector('.modal-close');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        /* Fermeture avec la touche Escape */
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    /**
     * J'affiche les détails d'un livre dans la modale.
     * 
     * @param {Object} book Les données du livre
     * @param {Object} details Les détails supplémentaires du livre
     * @param {boolean} inWishlist Si le livre est dans la wishlist
     * @returns {void}
     */
    showBookDetails(book, details, inWishlist = false) {
        const content = this.modal.querySelector('.modal-content');

        if (!content) {
            return;
        }

        const coverUrl = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : this.defaultCover;

        const authors = book.author_name
            ? book.author_name.join(', ')
            : 'Auteur inconnu';

        const year = book.first_publish_year || 'Date inconnue';

        /* Extraction des détails */
        const description = this.extractDescription(details);
        const isbn = this.extractISBN(book, details);
        const publisher = this.extractPublisher(book);
        const pages = this.extractPages(book);
        const languages = this.extractLanguages(book);

        const wishlistBtnText = inWishlist ? 'Retirer de la wishlist' : 'Ajouter à la wishlist';
        const wishlistBtnClass = inWishlist ? 'btn-wishlist in-wishlist' : 'btn-wishlist';

        content.innerHTML = `
            <div class="modal-book">
                <div class="modal-book-cover">
                    <img src="${coverUrl}" alt="Couverture de ${book.title}" loading="lazy">
                </div>
                <div class="modal-book-info">
                    <h2 id="modal-title" class="modal-book-title">${book.title}</h2>
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
                        <button type="button" class="${wishlistBtnClass}" data-work-key="${book.key}">
                            ${wishlistBtnText}
                        </button>
                        <a href="https://openlibrary.org${book.key}" target="_blank" rel="noopener noreferrer" class="btn-external">
                            Voir sur Open Library →
                        </a>
                    </div>
                </div>
            </div>
        `;

        this.open();
    }

    /**
     * J'extrais la description du livre.
     * 
     * @param {Object} details Les détails du livre
     * @returns {string|null} La description ou null
     */
    extractDescription(details) {
        if (!details) {
            return null;
        }

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
        if (book.isbn && book.isbn.length > 0) {
            return book.isbn[0];
        }

        if (details?.isbn_13 && details.isbn_13.length > 0) {
            return details.isbn_13[0];
        }

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
     * J'extrais les langues du livre.
     * 
     * @param {Object} book Les données du livre
     * @returns {string|null} Les langues ou null
     */
    extractLanguages(book) {
        if (book.language && book.language.length > 0) {
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
        if (!this.modal) {
            return;
        }

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
        if (!this.modal) {
            return;
        }

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

        if (!btn) {
            return;
        }

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

        if (!content) {
            return;
        }

        content.innerHTML = `
            <div class="modal-loading">
                <div class="spinner"></div>
                <p>Chargement des détails...</p>
            </div>
        `;

        this.open();
    }

    /**
     * J'affiche une erreur dans la modale.
     * 
     * @param {string} message Le message d'erreur
     * @returns {void}
     */
    showError(message) {
        const content = this.modal?.querySelector('.modal-content');

        if (!content) {
            return;
        }

        content.innerHTML = `
            <div class="modal-error">
                <p>${message}</p>
                <button type="button" class="btn-close-error">Fermer</button>
            </div>
        `;

        const closeBtn = content.querySelector('.btn-close-error');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
    }
}