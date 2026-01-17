/**
 * PageWishlist
 * 
 * Je gère l'affichage et les interactions de la page wishlist.
 * J'utilise des fonctions de sécurité pour protéger contre les XSS.
 * 
 * @class PageWishlist
 */

/* J'importe les modules nécessaires */
import { WishlistModel } from './models/WishlistModel.js';
import { showToast } from './utils/helpers.js';
import { escapeHtml, sanitizeUrl } from './utils/security.js';

class PageWishlist {

    /**
     * Je crée une instance de PageWishlist.
     * 
     * @constructor
     */
    constructor() {
        this.wishlistModel = new WishlistModel();
        this.gridContainer = document.querySelector('#wishlist-grid');
        this.emptyContainer = document.querySelector('#wishlist-empty');
        this.totalElement = document.querySelector('#wishlist-total');
        this.clearButton = document.querySelector('#clear-wishlist');
        this.defaultCover = 'https://via.placeholder.com/150x200?text=No+Cover';
    }

    /**
     * J'initialise la page wishlist.
     * 
     * @returns {void}
     */
    init() {
        this.render();
        this.bindEvents();
    }

    /**
     * J'affiche les livres de la wishlist de manière sécurisée.
     * 
     * @returns {void}
     */
    render() {
        const books = this.wishlistModel.getAll();

        /* Je mets à jour le compteur */
        this.updateCount(books.length);

        /* Je gère l'affichage selon le contenu de la wishlist */
        if (books.length === 0) {
            this.showEmpty();
            return;
        }

        /* J'affiche la grille de livres */
        this.hideEmpty();

        /* Je génère le HTML de manière sécurisée */
        const html = books.map(book => this.renderBookCard(book)).join('');
        this.gridContainer.innerHTML = html;
    }

    /**
     * Je crée le HTML d'une carte de livre sécurisée.
     * J'échappe toutes les données pour prévenir les XSS.
     * 
     * @param {Object} book Les données du livre
     * @returns {string} Le HTML de la carte
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

        /* J'échappe la clé du livre */
        const safeKey = escapeHtml(book.key || '');

        /* Je retourne le HTML avec toutes les données échappées */
        return `
            <article class="wishlist-card" data-key="${safeKey}">
                <div class="wishlist-card-cover">
                    <img src="${coverUrl}" alt="Couverture de ${safeTitle}" loading="lazy">
                </div>
                <div class="wishlist-card-info">
                    <h3 class="wishlist-card-title">${safeTitle}</h3>
                    <p class="wishlist-card-author">${authors}</p>
                    <p class="wishlist-card-year">${year}</p>
                </div>
                <div class="wishlist-card-actions">
                    <button type="button" class="btn-remove" data-key="${safeKey}" aria-label="Retirer de la wishlist">
                        ✕ Retirer
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
        /* Je lie les clics sur la grille via délégation */
        if (this.gridContainer) {
            this.gridContainer.addEventListener('click', (event) => {
                const removeBtn = event.target.closest('.btn-remove');

                if (removeBtn) {
                    const key = removeBtn.dataset.key;
                    this.handleRemove(key);
                }
            });
        }

        /* Je lie le bouton de vidage de la wishlist */
        if (this.clearButton) {
            this.clearButton.addEventListener('click', () => this.handleClear());
        }
    }

    /**
     * Je gère la suppression d'un livre de la wishlist.
     * 
     * @param {string} key La clé du livre à supprimer
     * @returns {void}
     */
    handleRemove(key) {
        /* Je vérifie que la clé est valide */
        if (!key) {
            return;
        }

        /* Je supprime le livre de la wishlist */
        this.wishlistModel.remove(key);

        /* Je réaffiche la liste */
        this.render();

        /* J'affiche une notification de confirmation */
        showToast('Livre retiré de la wishlist', 'info');
    }

    /**
     * Je gère le vidage complet de la wishlist.
     * 
     * @returns {void}
     */
    handleClear() {
        /* Je demande confirmation à l'utilisateur */
        if (!confirm('Voulez-vous vraiment vider votre wishlist ?')) {
            return;
        }

        /* Je vide la wishlist */
        this.wishlistModel.clear();

        /* Je réaffiche la liste */
        this.render();

        /* J'affiche une notification de confirmation */
        showToast('Wishlist vidée', 'info');
    }

    /**
     * Je mets à jour le compteur de livres.
     * 
     * @param {number} count Le nombre de livres
     * @returns {void}
     */
    updateCount(count) {
        if (this.totalElement) {
            /* Je m'assure que count est un nombre valide */
            const safeCount = parseInt(count, 10) || 0;
            this.totalElement.textContent = safeCount;
        }
    }

    /**
     * J'affiche le message de wishlist vide.
     * 
     * @returns {void}
     */
    showEmpty() {
        /* Je cache la grille */
        if (this.gridContainer) {
            this.gridContainer.style.display = 'none';
        }

        /* J'affiche le message vide */
        if (this.emptyContainer) {
            this.emptyContainer.style.display = 'block';
        }

        /* Je cache le bouton de vidage */
        if (this.clearButton) {
            this.clearButton.style.display = 'none';
        }
    }

    /**
     * Je cache le message de wishlist vide.
     * 
     * @returns {void}
     */
    hideEmpty() {
        /* J'affiche la grille */
        if (this.gridContainer) {
            this.gridContainer.style.display = 'grid';
        }

        /* Je cache le message vide */
        if (this.emptyContainer) {
            this.emptyContainer.style.display = 'none';
        }

        /* J'affiche le bouton de vidage */
        if (this.clearButton) {
            this.clearButton.style.display = 'block';
        }
    }
}

/**
 * Je lance l'application quand le DOM est prêt.
 */
document.addEventListener('DOMContentLoaded', () => {
    const page = new PageWishlist();
    page.init();
});