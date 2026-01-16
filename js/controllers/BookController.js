import { BookModel } from '../models/BookModel.js';
import { BookView } from '../views/BookView.js';

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
        this.currentPage = 1;
        this.currentQuery = '';
        this.currentFilters = {};
    }

    /**
     * J'initialise les écouteurs d'événements.
     * 
     * @returns {void}
     */
    init() {
        this.bindSearchForm();
        this.bindFilters();
        this.bindBookActions();
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
                this.handleWishlist(workId);
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
            const results = await this.model.searchBooks(query, page);

            let books = results.books;

            if (Object.keys(this.currentFilters).length > 0) {
                books = this.model.filterBooks(this.currentFilters);
            }

            this.view.renderBooks(books);
            this.view.updateResultsCount(results.total);

        } catch (error) {
            this.view.showError('Une erreur est survenue lors de la recherche.');
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

        const filteredBooks = this.model.filterBooks(filters);
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

        this.view.renderBooks(this.model.books);
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

        try {
            const details = await this.model.getBookDetails(workId);
            console.log('Détails du livre:', details);

            // TODO: Afficher les détails dans une modale ou une nouvelle page

        } catch (error) {
            console.error('Erreur lors du chargement des détails:', error);
        }
    }

    /**
     * Je gère l'ajout ou le retrait de la wishlist.
     * 
     * @param {string} workId L'identifiant du livre
     * @returns {void}
     */
    handleWishlist(workId) {
        if (!workId) {
            return;
        }

        // TODO: Implémenter avec WishlistModel
        console.log('Wishlist toggle pour:', workId);
    }
}