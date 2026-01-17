import { BookController } from './controllers/BookController.js';
import { BookModel } from './models/BookModel.js';

/**
 * App
 * 
 * Point d'entrée de l'application BookFinder.
 * J'initialise les controllers selon la page courante.
 * 
 * @class App
 */
class App {

    /**
     * Je crée une instance de l'application.
     * 
     * @constructor
     */
    constructor() {
        this.bookController = null;
        this.bookModel = new BookModel();
    }

    /**
     * J'initialise l'application.
     * 
     * @returns {void}
     */
    init() {
        const page = this.getCurrentPage();

        switch (page) {
            case 'index':
                this.initHomePage();
                break;
            case 'catalog':
                this.initCatalogPage();
                break;
            default:
                console.log('Page non reconnue');
        }
    }

    /**
     * Je détecte la page courante.
     * 
     * @returns {string} Le nom de la page
     */
    getCurrentPage() {
        const path = window.location.pathname;

        if (path.includes('catalog')) {
            return 'catalog';
        }

        return 'index';
    }

    /**
     * J'initialise la page d'accueil.
     * 
     * @returns {void}
     */
    initHomePage() {
        console.log('Initialisation page accueil');

        this.initCarousels();
    }

    /**
     * J'initialise les carrousels de la page d'accueil.
     * 
     * @returns {void}
     */
    async initCarousels() {
        /* Carrousel des prochaines parutions (livres récents) */
        const upcomingCarousel = document.querySelector('.upcoming-releases .carousel-content');

        if (upcomingCarousel) {
            await this.loadCarouselBooks(upcomingCarousel, 'new releases 2024', 10);
            this.bindCarouselButtons('.upcoming-releases');
        }

        /* Carrousel des nouveautés */
        const newArrivalsCarousel = document.querySelector('.new-arrivals .carousel-content');

        if (newArrivalsCarousel) {
            await this.loadCarouselBooks(newArrivalsCarousel, 'bestseller fiction', 10);
            this.bindCarouselButtons('.new-arrivals');
        }

        /* Binding des filtres de la homepage */
        this.bindHomeFilters();
    }

    /**
     * Je charge les livres pour un carrousel.
     * 
     * @param {HTMLElement} container Le conteneur du carrousel
     * @param {string} query La requête de recherche
     * @param {number} limit Le nombre de livres à charger
     * @returns {Promise<void>}
     */
    async loadCarouselBooks(container, query, limit = 10) {
        try {
            container.innerHTML = `
                <div class="carousel-loading">
                    <div class="spinner"></div>
                </div>
            `;

            const results = await this.bookModel.searchBooks(query, 1, limit);

            if (results.books.length === 0) {
                container.innerHTML = '<p class="carousel-empty">Aucun livre trouvé</p>';
                return;
            }

            const html = results.books.map(book => this.renderCarouselCard(book)).join('');
            container.innerHTML = html;

        } catch (error) {
            console.error('Erreur chargement carrousel:', error);
            container.innerHTML = '<p class="carousel-error">Erreur de chargement</p>';
        }
    }

    /**
     * Je crée le HTML d'une carte pour le carrousel.
     * 
     * @param {Object} book Les données du livre
     * @returns {string} Le HTML de la carte
     */
    renderCarouselCard(book) {
        const coverUrl = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : 'https://via.placeholder.com/150x200?text=No+Cover';

        const authors = book.author_name
            ? book.author_name.slice(0, 1).join(', ')
            : 'Auteur inconnu';

        const year = book.first_publish_year || '';

        const workId = book.key ? book.key.replace('/works/', '') : '';

        return `
            <article class="carousel-card">
                <a href="catalog.html?q=${encodeURIComponent(book.title)}" class="carousel-card-link">
                    <div class="carousel-card-cover">
                        <img src="${coverUrl}" alt="Couverture de ${book.title}" loading="lazy">
                    </div>
                    <div class="carousel-card-info">
                        <h3 class="carousel-card-title">${book.title}</h3>
                        <p class="carousel-card-author">${authors}</p>
                        ${year ? `<p class="carousel-card-year">${year}</p>` : ''}
                    </div>
                </a>
            </article>
        `;
    }

    /**
     * Je lie les boutons de navigation du carrousel.
     * 
     * @param {string} sectionSelector Le sélecteur de la section
     * @returns {void}
     */
    bindCarouselButtons(sectionSelector) {
        const section = document.querySelector(sectionSelector);

        if (!section) {
            return;
        }

        const carousel = section.querySelector('.carousel-content');
        const prevBtn = section.querySelector('.carousel-btn.prev');
        const nextBtn = section.querySelector('.carousel-btn.next');

        if (!carousel) {
            return;
        }

        const scrollAmount = 250;

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
    }

    /**
     * Je lie les filtres de la page d'accueil.
     * 
     * @returns {void}
     */
    bindHomeFilters() {
        const filterButtons = document.querySelectorAll('.book-section .filter-btn');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', (event) => {
                const section = event.target.closest('.book-section');
                const buttons = section.querySelectorAll('.filter-btn');

                /* Je retire la classe active de tous les boutons */
                buttons.forEach(b => b.classList.remove('active'));

                /* J'ajoute la classe active au bouton cliqué */
                event.target.classList.add('active');

                /* TODO: Filtrer les livres selon le genre sélectionné */
                const genre = event.target.textContent.trim().toLowerCase();
                console.log('Filtre sélectionné:', genre);
            });
        });
    }

    /**
     * J'initialise la page catalogue.
     * 
     * @returns {void}
     */
    initCatalogPage() {
        console.log('Initialisation page catalogue');

        this.bookController = new BookController('.books-grid');
        this.bookController.init();

        /* Je lie les périodes prédéfinies */
        this.bindPeriodFilters();
    }

    /**
     * Je lie les filtres de périodes prédéfinies.
     * 
     * @returns {void}
     */
    bindPeriodFilters() {
        const periodInputs = document.querySelectorAll('input[name="period"]');

        periodInputs.forEach(input => {
            input.addEventListener('change', (event) => {
                const yearFrom = event.target.dataset.from;
                const yearTo = event.target.dataset.to;

                const yearFromInput = document.querySelector('input[name="yearFrom"]');
                const yearToInput = document.querySelector('input[name="yearTo"]');

                if (yearFromInput && yearTo) {
                    yearFromInput.value = yearFrom;
                }

                if (yearToInput && yearTo) {
                    yearToInput.value = yearTo;
                }

                /* Je déclenche le changement pour appliquer les filtres */
                yearFromInput?.dispatchEvent(new Event('change', { bubbles: true }));
            });
        });
    }
}

/**
 * Je lance l'application quand le DOM est prêt.
 */
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});