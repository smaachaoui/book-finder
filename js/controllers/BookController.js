/**
 * BookController
 * 
 * Je gère les interactions entre le Model et le View.
 * J'utilise des fonctions de sécurité pour valider les entrées utilisateur.
 * 
 * @class BookController
 */

/* J'importe les modules nécessaires */
import { BookModel } from '../models/BookModel.js';
import { BookView } from '../views/BookView.js';
import { WishlistModel } from '../models/WishlistModel.js';
import { ModalView } from '../views/ModalView.js';
import { debounce, showToast, getUrlParams, updateUrlParam } from '../utils/helpers.js';
import { sanitizeSearchInput, validateBookId, validateYear } from '../utils/security.js';

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
     * Je valide les paramètres pour la sécurité.
     * 
     * @returns {void}
     */
    checkUrlParams() {
        const params = getUrlParams();
        const query = params.get('q');

        /* Je valide le paramètre de recherche */
        if (query) {
            const sanitizedQuery = sanitizeSearchInput(query);

            /* Je vérifie que la requête est valide après nettoyage */
            if (sanitizedQuery) {
                const searchInput = document.querySelector('#search');

                if (searchInput) {
                    searchInput.value = sanitizedQuery;
                }

                this.currentQuery = sanitizedQuery;
                this.loadBooks(sanitizedQuery);
            }
        }
    }

    /**
     * Je lie le formulaire de recherche.
     * 
     * @returns {void}
     */
    bindSearchForm() {
        const form = document.querySelector('.search-form');

        /* Je vérifie que le formulaire existe */
        if (!form) {
            return;
        }

        /* J'ajoute l'écouteur d'événement */
        form.addEventListener('submit', (event) => this.handleSearch(event));
    }

    /**
     * Je lie la recherche en temps réel avec debounce.
     * 
     * @returns {void}
     */
    bindRealTimeSearch() {
        const searchInput = document.querySelector('#search');

        /* Je vérifie que le champ de recherche existe */
        if (!searchInput) {
            return;
        }

        /* Je crée une fonction debounce pour limiter les appels */
        const debouncedSearch = debounce((query) => {
            /* Je valide et nettoie la requête */
            const sanitizedQuery = sanitizeSearchInput(query);

            if (sanitizedQuery.length >= 3) {
                this.currentQuery = sanitizedQuery;
                this.currentPage = 1;
                updateUrlParam('q', sanitizedQuery);
                this.loadBooks(sanitizedQuery);
            }
        }, 500);

        /* J'écoute les saisies dans le champ de recherche */
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

        /* Je vérifie que le conteneur de filtres existe */
        if (!filterContainer) {
            return;
        }

        /* J'écoute les changements de filtres */
        filterContainer.addEventListener('change', () => this.handleFilter());

        /* Je lie le bouton de réinitialisation */
        const resetButton = filterContainer.querySelector('.reset-filters-btn');

        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetFilters());
        }
    }

    /**
     * Je lie les actions sur les livres via délégation d'événements.
     * 
     * @returns {void}
     */
    bindBookActions() {
        const container = this.view.container;

        /* Je vérifie que le conteneur existe */
        if (!container) {
            return;
        }

        /* J'utilise la délégation d'événements pour les performances */
        container.addEventListener('click', (event) => {
            const detailsBtn = event.target.closest('.btn-details');
            const wishlistBtn = event.target.closest('.btn-wishlist');

            /* Je gère le clic sur le bouton détails */
            if (detailsBtn) {
                const workId = detailsBtn.dataset.workId;
                /* Je valide l'identifiant avant de l'utiliser */
                const validWorkId = validateBookId(workId);
                if (validWorkId) {
                    this.handleBookClick(validWorkId);
                }
            }

            /* Je gère le clic sur le bouton wishlist */
            if (wishlistBtn) {
                const workId = wishlistBtn.dataset.workId;
                /* Je valide l'identifiant avant de l'utiliser */
                const validWorkId = validateBookId(workId);
                if (validWorkId) {
                    this.handleWishlistToggle(validWorkId, wishlistBtn);
                }
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

        /* Je lie le bouton précédent */
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        }

        /* Je lie le bouton suivant */
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

        /* Je vérifie que la modale existe */
        if (!modal) {
            return;
        }

        /* J'écoute les clics dans la modale */
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
     * Je valide les entrées pour la sécurité.
     * 
     * @param {Event} event L'événement submit
     * @returns {Promise<void>}
     */
    async handleSearch(event) {
        /* J'empêche la soumission par défaut */
        event.preventDefault();

        const input = event.target.querySelector('input[type="search"]');
        const query = input?.value.trim();

        /* Je vérifie que la requête n'est pas vide */
        if (!query) {
            return;
        }

        /* Je valide et nettoie la requête */
        const sanitizedQuery = sanitizeSearchInput(query);

        if (!sanitizedQuery) {
            showToast('Requête de recherche invalide', 'error');
            return;
        }

        this.currentQuery = sanitizedQuery;
        this.currentPage = 1;
        updateUrlParam('q', sanitizedQuery);

        await this.loadBooks(sanitizedQuery);
    }

    /**
     * Je charge les livres depuis l'API.
     * 
     * @param {string} query Le terme de recherche
     * @param {number} page Le numéro de page
     * @returns {Promise<void>}
     */
    async loadBooks(query, page = 1) {
        /* J'affiche le loader pendant le chargement */
        this.view.showLoading();

        try {
            const results = await this.model.searchBooks(query, page, this.itemsPerPage);

            let books = results.books;

            /* J'applique les filtres si nécessaire */
            if (Object.keys(this.currentFilters).length > 0) {
                books = this.model.filterBooks(this.currentFilters);
            }

            /* Je mets à jour l'état wishlist des livres */
            books = books.map(book => ({
                ...book,
                inWishlist: this.wishlistModel.has(book.key)
            }));

            /* J'affiche les résultats */
            this.view.renderBooks(books);
            this.view.updateResultsCount(results.total);
            this.updatePagination(results.total);

        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
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

        /* Je mets à jour le texte de pagination */
        if (paginationInfo) {
            paginationInfo.textContent = `Page ${this.currentPage} sur ${totalPages || 1}`;
        }

        /* Je gère l'état du bouton précédent */
        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
        }

        /* Je gère l'état du bouton suivant */
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
        /* Je valide le numéro de page */
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
     * Je gère l'application des filtres avec validation.
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

        /* J'affiche les livres filtrés */
        this.view.renderBooks(filteredBooks);
        this.view.updateResultsCount(filteredBooks.length);
    }

    /**
     * Je récupère et valide les valeurs des filtres depuis le formulaire.
     * 
     * @returns {Object} Les filtres sélectionnés et validés
     */
    getFiltersFromForm() {
        const filters = {};

        /* Je récupère le filtre de langue */
        const languageChecked = document.querySelectorAll('input[name="language"]:checked');

        if (languageChecked.length > 0) {
            filters.language = languageChecked[0].value;
        }

        /* Je récupère et valide l'année de début */
        const yearFrom = document.querySelector('input[name="yearFrom"]');

        if (yearFrom?.value) {
            const validYear = validateYear(yearFrom.value, 1000, new Date().getFullYear());
            if (validYear) {
                filters.yearFrom = validYear;
            }
        }

        /* Je récupère et valide l'année de fin */
        const yearTo = document.querySelector('input[name="yearTo"]');

        if (yearTo?.value) {
            const validYear = validateYear(yearTo.value, 1000, new Date().getFullYear());
            if (validYear) {
                filters.yearTo = validYear;
            }
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

        /* Je réinitialise tous les champs de filtre */
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

        /* Je réaffiche tous les livres */
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
     * @param {string} workId L'identifiant du livre validé
     * @returns {Promise<void>}
     */
    async handleBookClick(workId) {
        /* Je vérifie que l'identifiant est valide */
        if (!workId) {
            return;
        }

        /* J'affiche le loader */
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

            /* J'affiche les détails dans la modale */
            this.modalView.showBookDetails(book, details, inWishlist);

        } catch (error) {
            console.error('Erreur lors du chargement des détails:', error);
            this.modalView.showError('Impossible de charger les détails du livre.');
        }
    }

    /**
     * Je gère le toggle wishlist depuis la liste des livres.
     * 
     * @param {string} workId L'identifiant du livre validé
     * @param {HTMLElement} button Le bouton cliqué
     * @returns {void}
     */
    handleWishlistToggle(workId, button) {
        /* Je vérifie que l'identifiant est valide */
        if (!workId) {
            return;
        }

        const book = this.model.books.find(b => b.key === `/works/${workId}`);

        if (!book) {
            return;
        }

        /* Je toggle le livre dans la wishlist */
        const result = this.wishlistModel.toggle(book);

        /* Je mets à jour le bouton selon le résultat */
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
        /* Je vérifie que la clé est valide */
        if (!workKey) {
            return;
        }

        const book = this.model.books.find(b => b.key === workKey);

        if (!book) {
            return;
        }

        /* Je toggle le livre dans la wishlist */
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

        /* J'affiche une notification */
        if (result.inWishlist) {
            showToast('Livre ajouté à la wishlist', 'success');
        } else {
            showToast('Livre retiré de la wishlist', 'info');
        }
    }
}