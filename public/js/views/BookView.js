/**
 * BookView
 * 
 * Gère l'affichage des livres dans le DOM.
 * 
 * @class BookView
 */
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
     * J'affiche une liste de livres.
     * 
     * @param {Array} books La liste des livres à afficher
     * @returns {void}
     */
    renderBooks(books) {
        if (!this.container) {
            console.error('BookView: Conteneur non trouvé');
            return;
        }

        if (books.length === 0) {
            this.showEmpty();
            return;
        }

        const html = books.map(book => this.renderBookCard(book)).join('');
        this.container.innerHTML = html;
    }

    /**
     * Je crée le HTML d'une carte de livre.
     * 
     * @param {Object} book Les données du livre
     * @returns {string} Le HTML de la carte
     */
    renderBookCard(book) {
        const coverUrl = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : this.defaultCover;

        const authors = book.author_name
            ? book.author_name.join(', ')
            : 'Auteur inconnu';

        const year = book.first_publish_year || 'Date inconnue';

        const workId = book.key ? book.key.replace('/works/', '') : '';

        const wishlistClass = book.inWishlist ? 'btn-wishlist in-wishlist' : 'btn-wishlist';
        const wishlistText = book.inWishlist ? 'Dans la wishlist ♥' : 'Ajouter à la wishlist';

        return `
            <article class="book-card" data-work-id="${workId}">
                <div class="book-cover">
                    <img src="${coverUrl}" alt="Couverture de ${book.title}" loading="lazy">
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
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
        if (!this.container) {
            return;
        }

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
     * J'affiche un message d'erreur.
     * 
     * @param {string} message Le message d'erreur à afficher
     * @returns {void}
     */
    showError(message) {
        if (!this.container) {
            return;
        }

        this.container.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
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
        if (!this.container) {
            return;
        }

        this.container.innerHTML = `
            <div class="empty-message">
                <p>Aucun livre trouvé.</p>
                <p>Essayez avec d'autres termes de recherche.</p>
            </div>
        `;
    }

    /**
     * Je mets à jour le compteur de résultats.
     * 
     * @param {number} count Le nombre de résultats
     * @param {string} selector Le sélecteur de l'élément compteur
     * @returns {void}
     */
    updateResultsCount(count, selector = '.results-count') {
        const element = document.querySelector(selector);

        if (element) {
            element.innerHTML = `<strong>${count}</strong> livre(s) trouvé(s)`;
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