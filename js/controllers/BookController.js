import { BookModel } from '../models/BookModel.js';
import { BookView } from '../views/BookView.js';
import { WishlistModel } from '../models/WishlistModel.js';
import { ModalView } from '../views/ModalView.js';
import { debounce, showToast, getUrlParams, updateUrlParam } from '../utils/helpers.js';

/**
 * BookController
 * 
 * Gère les interactions entre le Model et le View.
 * 
 * @class BookController
 */
export class BookController {

    /**
     * Je crée une instance du BookController.
     * 
     * @constructor
     * @param {string} containerSelector Le sélecteur du conteneur des livres
     */
    constructor(containerSelector) {
        this.model = new BookModel();
        this.view = new BookView(containerSelector);
        this.wishlistModel = new WishlistModel();
        this.modalView = new ModalView();
        this.currentPage = 1;
        this.currentQuery = '';
        this.currentFilters = {};
        this.itemsPerPage = 9;
    }

    /**
     * J'initialise les écouteurs d'événements.
     * 
     * @returns {void}
     */
    init() {
        this.bindSearchForm();
        this.bindRealTimeSearch();
        this.bindFilters();
        this.bindBookActions();
        this.bindPagination();
        this.bindModalActions();
        this.checkUrlParams();
    }

    /**
     * Je vérifie les paramètres URL au chargement.
     * 
     * @returns {void}
     */
    checkUrlParams() {
        const params = getUrlParams();
        const query = params.get('q');

        if (query) {
            const searchInput = document.querySelector('#search');

            if (searchInput) {
                searchInput.value = query;
            }

            this.currentQuery = query;
            this.loadBooks(query);
        }
    }

    /**
     * Je lie le formulaire de recherche.
     * 
     * @returns {void}
     */
    bindSearchForm() {
        const form = document.querySelector('.search-form');

        if (!form) {
            return;
        }

        form.addEventListener('submit', (event) => this.handleSearch(event));
    }

    /**
     * Je lie la recherche en temps réel avec debounce.
     * 
     * @returns {void}
     */
    bindRealTimeSearch() {
        const searchInput = document.querySelector('#search');

        if (!searchInput) {
            return;
        }

        const debouncedSearch = debounce((query) => {
            if (query.length >= 3) {
                this.currentQuery = query;
                this.currentPage = 1;
                updateUrlParam('q', query);
                this.loadBooks(query);
            }
        }, 500);

        searchInput.addEventListener('input', (event) => {
            const query = event.target.value.trim();
            debouncedSearch(query);
        });
    }

    /**
     * Je lie les boutons de filtre.
     * 
     * @returns {void}
     */
    bindFilters() {
        const filterContainer = document.querySelector('.filters-sidebar');

        if (!filterContainer) {
            return;
        }

        filterContainer.addEventListener('change', () => this.handleFilter());

        const resetButton = filterContainer.querySelector('.reset-filters-btn');

        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetFilters());
        }
    }

    /**
     * Je lie les actions sur les livres (délégation d'événements).
     * 
     * @returns {void}
     */
    bindBookActions() {
        const container = this.view.container;

        if (!container) {
            return;
        }

        container.addEventListener('click', (event) => {
            const detailsBtn = event.target.closest('.btn-details');
            const wishlistBtn = event.target.closest('.btn-wishlist');

            if (detailsBtn) {
                const workId = detailsBtn.dataset.workId;
                this.handleBookClick(workId);
            }

            if (wishlistBtn) {
                const workId = wishlistBtn.dataset.workId;
                this.handleWishlistToggle(workId, wishlistBtn);
            }
        });
    }

    /**
     * Je lie les boutons de pagination.
     * 
     * @returns {void}
     */
    bindPagination() {
        const prevBtn = document.querySelector('.pagination-btn.prev');
        const nextBtn = document.querySelector('.pagination-btn.next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        }
    }

    /**
     * Je lie les actions dans la modale.
     * 
     * @returns {void}
     */
    bindModalActions() {
        const modal = document.querySelector('.modal-overlay');

        if (!modal) {
            return;
        }

        modal.addEventListener('click', (event) => {
            const wishlistBtn = event.target.closest('.btn-wishlist');

            if (wishlistBtn) {
                const workKey = wishlistBtn.dataset.workKey;
                this.handleModalWishlist(workKey);
            }
        });
    }

    /**
     * Je gère la soumission du formulaire de recherche.
     * 
     * @param {Event} event L'événement submit
     * @returns {Promise<void>}
     */
    async handleSearch(event) {
        event.preventDefault();

        const input = event.target.querySelector('input[type="search"]');
        const query = input?.value.trim();

        if (!query) {
            return;
        }

        this.currentQuery = query;
        this.currentPage = 1;
        updateUrlParam('q', query);

        await this.loadBooks(query);
    }

    /**
     * Je charge les livres depuis l'API.
     * 
     * @param {string} query Le terme de recherche
     * @param {number} page Le numéro de page
     * @returns {Promise<void>}
     */
    async loadBooks(query, page = 1) {
        this.view.showLoading();

        try {
            const results = await this.model.searchBooks(query, page, this.itemsPerPage);

            let books = results.books;

            if (Object.keys(this.currentFilters).length > 0) {
                books = this.model.filterBooks(this.currentFilters);
            }

            /* Je mets à jour l'état wishlist des livres */
            books = books.map(book => ({
                ...book,
                inWishlist: this.wishlistModel.has(book.key)
            }));

            this.view.renderBooks(books);
            this.view.updateResultsCount(results.total);
            this.updatePagination(results.total);

        } catch (error) {
            this.view.showError('Une erreur est survenue lors de la recherche.');
        }
    }

    /**
     * Je mets à jour l'affichage de la pagination.
     * 
     * @param {number} total Le nombre total de résultats
     * @returns {void}
     */
    updatePagination(total) {
        const totalPages = Math.ceil(total / this.itemsPerPage);
        const paginationInfo = document.querySelector('.pagination-info');
        const prevBtn = document.querySelector('.pagination-btn.prev');
        const nextBtn = document.querySelector('.pagination-btn.next');

        if (paginationInfo) {
            paginationInfo.textContent = `Page ${this.currentPage} sur ${totalPages || 1}`;
        }

        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= totalPages;
        }
    }

    /**
     * Je change de page.
     * 
     * @param {number} page Le numéro de page
     * @returns {void}
     */
    goToPage(page) {
        if (page < 1 || !this.currentQuery) {
            return;
        }

        this.currentPage = page;
        this.loadBooks(this.currentQuery, page);

        /* Je scroll vers le haut des résultats */
        const resultsSection = document.querySelector('.results-section');

        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Je gère l'application des filtres.
     * 
     * @returns {void}
     */
    handleFilter() {
        const filters = this.getFiltersFromForm();
        this.currentFilters = filters;

        let filteredBooks = this.model.filterBooks(filters);

        /* Je mets à jour l'état wishlist */
        filteredBooks = filteredBooks.map(book => ({
            ...book,
            inWishlist: this.wishlistModel.has(book.key)
        }));

        this.view.renderBooks(filteredBooks);
        this.view.updateResultsCount(filteredBooks.length);
    }

    /**
     * Je récupère les valeurs des filtres depuis le formulaire.
     * 
     * @returns {Object} Les filtres sélectionnés
     */
    getFiltersFromForm() {
        const filters = {};

        const languageChecked = document.querySelectorAll('input[name="language"]:checked');

        if (languageChecked.length > 0) {
            filters.language = languageChecked[0].value;
        }

        const yearFrom = document.querySelector('input[name="yearFrom"]');

        if (yearFrom?.value) {
            filters.yearFrom = parseInt(yearFrom.value);
        }

        const yearTo = document.querySelector('input[name="yearTo"]');

        if (yearTo?.value) {
            filters.yearTo = parseInt(yearTo.value);
        }

        return filters;
    }

    /**
     * Je réinitialise les filtres.
     * 
     * @returns {void}
     */
    resetFilters() {
        const filterContainer = document.querySelector('.filters-sidebar');

        if (filterContainer) {
            const inputs = filterContainer.querySelectorAll('input');

            inputs.forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });
        }

        this.currentFilters = {};

        let books = this.model.books.map(book => ({
            ...book,
            inWishlist: this.wishlistModel.has(book.key)
        }));

        this.view.renderBooks(books);
        this.view.updateResultsCount(this.model.totalResults);
    }

    /**
     * Je gère le clic sur un livre pour afficher les détails.
     * 
     * @param {string} workId L'identifiant du livre
     * @returns {Promise<void>}
     */
    async handleBookClick(workId) {
        if (!workId) {
            return;
        }

        this.modalView.showLoading();

        try {
            /* Je récupère le livre depuis les résultats */
            const book = this.model.books.find(b => b.key === `/works/${workId}`);

            if (!book) {
                this.modalView.showError('Livre non trouvé');
                return;
            }

            /* Je récupère les détails supplémentaires */
            const details = await this.model.getBookDetails(workId);
            const inWishlist = this.wishlistModel.has(book.key);

            this.modalView.showBookDetails(book, details, inWishlist);

        } catch (error) {
            console.error('Erreur lors du chargement des détails:', error);
            this.modalView.showError('Impossible de charger les détails du livre.');
        }
    }

    /**
     * Je gère le toggle wishlist depuis la liste des livres.
     * 
     * @param {string} workId L'identifiant du livre
     * @param {HTMLElement} button Le bouton cliqué
     * @returns {void}
     */
    handleWishlistToggle(workId, button) {
        if (!workId) {
            return;
        }

        const book = this.model.books.find(b => b.key === `/works/${workId}`);

        if (!book) {
            return;
        }

        const result = this.wishlistModel.toggle(book);

        /* Je mets à jour le bouton */
        if (result.inWishlist) {
            button.classList.add('in-wishlist');
            button.textContent = 'Dans la wishlist ♥';
            showToast('Livre ajouté à la wishlist', 'success');
        } else {
            button.classList.remove('in-wishlist');
            button.textContent = 'Ajouter à la wishlist';
            showToast('Livre retiré de la wishlist', 'info');
        }
    }

    /**
     * Je gère le toggle wishlist depuis la modale.
     * 
     * @param {string} workKey L'identifiant complet du livre
     * @returns {void}
     */
    handleModalWishlist(workKey) {
        if (!workKey) {
            return;
        }

        const book = this.model.books.find(b => b.key === workKey);

        if (!book) {
            return;
        }

        const result = this.wishlistModel.toggle(book);

        /* Je mets à jour le bouton dans la modale */
        this.modalView.updateWishlistButton(result.inWishlist);

        /* Je mets à jour le bouton dans la liste si visible */
        const workId = workKey.replace('/works/', '');
        const listBtn = document.querySelector(`.btn-wishlist[data-work-id="${workId}"]`);

        if (listBtn) {
            if (result.inWishlist) {
                listBtn.classList.add('in-wishlist');
                listBtn.textContent = 'Dans la wishlist ♥';
            } else {
                listBtn.classList.remove('in-wishlist');
                listBtn.textContent = 'Ajouter à la wishlist';
            }
        }

        if (result.inWishlist) {
            showToast('Livre ajouté à la wishlist', 'success');
        } else {
            showToast('Livre retiré de la wishlist', 'info');
        }
    }
}