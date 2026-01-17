import { WishlistModel } from './models/WishlistModel.js';
import { showToast, formatDate } from './utils/helpers.js';

/**
 * WishlistPage
 * 
 * Gère l'affichage et les interactions de la page wishlist.
 * 
 * @class WishlistPage
 */
class WishlistPage {

    /**
     * Je crée une instance de WishlistPage.
     * 
     * @constructor
     */
    constructor() {
        this.wishlistModel = new WishlistModel();
        this.gridContainer = document.getElementById('wishlist-grid');
        this.emptyContainer = document.getElementById('wishlist-empty');
        this.totalElement = document.getElementById('wishlist-total');
        this.defaultCover = 'https://via.placeholder.com/150x200?text=No+Cover';
    }

    /**
     * J'initialise la page.
     * 
     * @returns {void}
     */
    init() {
        this.render();
        this.bindEvents();
    }

    /**
     * J'affiche les livres de la wishlist.
     * 
     * @returns {void}
     */
    render() {
        const books = this.wishlistModel.getAll();

        this.updateCount(books.length);

        if (books.length === 0) {
            this.showEmpty();
            return;
        }

        this.hideEmpty();

        const html = books.map(book => this.renderCard(book)).join('');
        this.gridContainer.innerHTML = html;
    }

    /**
     * Je crée le HTML d'une carte de livre.
     * 
     * @param {Object} book Les données du livre
     * @returns {string} Le HTML de la carte
     */
    renderCard(book) {
        const coverUrl = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : this.defaultCover;

        const authors = book.author_name && book.author_name.length > 0
            ? book.author_name.join(', ')
            : 'Auteur inconnu';

        const year = book.first_publish_year || 'Date inconnue';

        const addedDate = formatDate(book.addedAt);

        return `
            <article class="wishlist-card" data-work-key="${book.key}">
                <div class="wishlist-card-cover">
                    <img src="${coverUrl}" alt="Couverture de ${book.title}" loading="lazy">
                </div>
                <div class="wishlist-card-info">
                    <h2 class="wishlist-card-title">${book.title}</h2>
                    <p class="wishlist-card-author">${authors}</p>
                    <p class="wishlist-card-year">${year}</p>
                    <p class="wishlist-card-added">Ajouté le ${addedDate}</p>
                </div>
                <div class="wishlist-card-actions">
                    <a href="catalog.html?q=${encodeURIComponent(book.title)}" class="btn-search">
                        Rechercher
                    </a>
                    <button type="button" class="btn-remove" data-work-key="${book.key}">
                        Retirer
                    </button>
                </div>
            </article>
        `;
    }

    /**
     * Je lie les événements de la page.
     * 
     * @returns {void}
     */
    bindEvents() {
        /* Bouton vider la wishlist */
        const clearBtn = document.getElementById('clear-wishlist');

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.handleClearAll());
        }

        /* Délégation pour les boutons de retrait */
        if (this.gridContainer) {
            this.gridContainer.addEventListener('click', (event) => {
                const removeBtn = event.target.closest('.btn-remove');

                if (removeBtn) {
                    const workKey = removeBtn.dataset.workKey;
                    this.handleRemove(workKey);
                }
            });
        }
    }

    /**
     * Je gère le retrait d'un livre.
     * 
     * @param {string} workKey L'identifiant du livre
     * @returns {void}
     */
    handleRemove(workKey) {
        if (!workKey) {
            return;
        }

        const result = this.wishlistModel.remove(workKey);

        if (result) {
            /* Animation de retrait */
            const card = this.gridContainer.querySelector(`[data-work-key="${workKey}"]`);

            if (card) {
                card.classList.add('removing');

                setTimeout(() => {
                    this.render();
                    showToast('Livre retiré de la wishlist', 'info');
                }, 300);
            }
        }
    }

    /**
     * Je gère la suppression de tous les livres.
     * 
     * @returns {void}
     */
    handleClearAll() {
        const count = this.wishlistModel.getCount();

        if (count === 0) {
            return;
        }

        const confirmed = confirm(`Voulez-vous vraiment supprimer ${count} livre(s) de votre wishlist ?`);

        if (confirmed) {
            this.wishlistModel.clear();
            this.render();
            showToast('Wishlist vidée', 'info');
        }
    }

    /**
     * Je mets à jour le compteur.
     * 
     * @param {number} count Le nombre de livres
     * @returns {void}
     */
    updateCount(count) {
        if (this.totalElement) {
            this.totalElement.textContent = count;
        }
    }

    /**
     * J'affiche le message wishlist vide.
     * 
     * @returns {void}
     */
    showEmpty() {
        if (this.gridContainer) {
            this.gridContainer.style.display = 'none';
        }

        if (this.emptyContainer) {
            this.emptyContainer.style.display = 'flex';
        }

        /* Cache le bouton vider */
        const clearBtn = document.getElementById('clear-wishlist');

        if (clearBtn) {
            clearBtn.style.display = 'none';
        }
    }

    /**
     * Je cache le message wishlist vide.
     * 
     * @returns {void}
     */
    hideEmpty() {
        if (this.gridContainer) {
            this.gridContainer.style.display = 'grid';
        }

        if (this.emptyContainer) {
            this.emptyContainer.style.display = 'none';
        }

        /* Affiche le bouton vider */
        const clearBtn = document.getElementById('clear-wishlist');

        if (clearBtn) {
            clearBtn.style.display = 'block';
        }
    }
}

/**
 * Je lance la page wishlist quand le DOM est prêt.
 */
document.addEventListener('DOMContentLoaded', () => {
    const wishlistPage = new WishlistPage();
    wishlistPage.init();
});