/**
 * App
 * 
 * Je suis le point d'entrée de l'application BookFinder.
 * J'initialise les controllers selon la page courante.
 * J'utilise des fonctions de sécurité pour protéger l'application.
 * 
 * @class App
 */

/* J'importe les modules nécessaires */
import { BookController } from './controllers/BookController.js';
import { BookModel } from './models/BookModel.js';
import { escapeHtml, sanitizeUrl } from './utils/security.js';

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
     * J'initialise l'application selon la page courante.
     * 
     * @returns {void}
     */
    init() {
        const page = this.getCurrentPage();

        /* Je détermine quelle page initialiser */
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
     * Je détecte la page courante à partir de l'URL.
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
     * J'initialise la page d'accueil avec les carrousels.
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
     * @returns {Promise<void>}
     */
    async initCarousels() {
        /* Je charge le carrousel des sorties récentes */
        const recentCarousel = document.querySelector('.recent-releases .carousel-content');

        if (recentCarousel) {
            await this.loadCarouselBooks(recentCarousel, 'subject:fiction first_publish_year:2024', 10);
            this.bindCarouselButtons('.recent-releases');
        }

        /* Je charge le carrousel des livres populaires */
        const popularCarousel = document.querySelector('.popular-books .carousel-content');

        if (popularCarousel) {
            await this.loadCarouselBooks(popularCarousel, 'subject:fiction', 10);
            this.bindCarouselButtons('.popular-books');
        }

        /* Je lie les filtres de la homepage */
        this.bindHomeFilters();
    }

    /**
     * Je charge les livres pour un carrousel de manière sécurisée.
     * J'échappe toutes les données pour prévenir les XSS.
     * 
     * @param {HTMLElement} container Le conteneur du carrousel
     * @param {string} query La requête de recherche
     * @param {number} limit Le nombre de livres à charger
     * @returns {Promise<void>}
     */
    async loadCarouselBooks(container, query, limit = 10) {
        try {
            /* J'affiche le loader pendant le chargement */
            container.innerHTML = `
                <div class="carousel-loading">
                    <div class="spinner"></div>
                </div>
            `;

            /* Je demande plus de résultats pour filtrer ensuite */
            const results = await this.bookModel.searchBooks(query, 1, limit * 3);

            /* Je filtre pour garder uniquement les livres avec couverture */
            const booksWithCovers = results.books.filter(book => book.cover_i);

            /* Je limite au nombre demandé */
            const books = booksWithCovers.slice(0, limit);

            /* J'affiche un message si aucun livre n'est trouvé */
            if (books.length === 0) {
                container.innerHTML = '<p class="carousel-empty">Aucun livre trouvé</p>';
                return;
            }

            /* Je génère le HTML de manière sécurisée */
            const html = books.map(book => this.renderCarouselCard(book)).join('');
            container.innerHTML = html;

        } catch (error) {
            console.error('Erreur chargement carrousel:', error);
            container.innerHTML = '<p class="carousel-error">Erreur de chargement</p>';
        }
    }

    /**
     * Je crée le HTML d'une carte pour le carrousel de manière sécurisée.
     * J'échappe toutes les données provenant de l'API.
     * 
     * @param {Object} book Les données du livre
     * @returns {string} Le HTML de la carte sécurisé
     */
    renderCarouselCard(book) {
        /* Je construis l'URL de la couverture de manière sécurisée */
        const coverUrl = book.cover_i
            ? sanitizeUrl(`https://covers.openlibrary.org/b/id/${escapeHtml(book.cover_i)}-M.jpg`)
            : 'https://via.placeholder.com/150x200?text=No+Cover';

        /* J'échappe le titre pour prévenir les XSS */
        const safeTitle = escapeHtml(book.title || 'Titre inconnu');

        /* J'échappe les noms des auteurs */
        const authors = book.author_name
            ? escapeHtml(book.author_name.slice(0, 1).join(', '))
            : 'Auteur inconnu';

        /* J'échappe l'année de publication */
        const year = escapeHtml(book.first_publish_year || '');

        /* Je valide l'identifiant du livre */
        const workId = book.key ? escapeHtml(book.key.replace('/works/', '')) : '';

        /* Je construis l'URL de la page catalogue de manière sécurisée */
        const catalogUrl = `catalog.html?q=${encodeURIComponent(book.title)}`;

        /* Je retourne le HTML avec toutes les données échappées */
        return `
            <article class="carousel-card">
                <a href="${catalogUrl}" class="carousel-card-link">
                    <div class="carousel-card-cover">
                        <img src="${coverUrl}" alt="Couverture de ${safeTitle}" loading="lazy">
                    </div>
                    <div class="carousel-card-info">
                        <h3 class="carousel-card-title">${safeTitle}</h3>
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

        /* Je vérifie que la section existe */
        if (!section) {
            return;
        }

        const carousel = section.querySelector('.carousel-content');
        const prevBtn = section.querySelector('.carousel-btn.prev');
        const nextBtn = section.querySelector('.carousel-btn.next');

        /* Je vérifie que le carrousel existe */
        if (!carousel) {
            return;
        }

        /* Je définis la quantité de scroll */
        const scrollAmount = 250;

        /* Je lie le bouton précédent */
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }

        /* Je lie le bouton suivant */
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
        /* Je lie les filtres de la section "Sorties récentes" */
        const recentSection = document.querySelector('.recent-releases');

        if (recentSection) {
            const filterButtons = recentSection.querySelectorAll('.filter-btn');
            const carousel = recentSection.querySelector('.carousel-content');

            filterButtons.forEach(btn => {
                btn.addEventListener('click', async (event) => {
                    /* Je retire la classe active de tous les boutons */
                    filterButtons.forEach(b => b.classList.remove('active'));
                    event.target.classList.add('active');

                    /* Je récupère la période sélectionnée */
                    const period = event.target.dataset.period;
                    let query;

                    /* Je construis la requête selon la période */
                    if (period === 'classics') {
                        query = 'subject:classic_literature';
                    } else {
                        query = `subject:fiction first_publish_year:${escapeHtml(period)}`;
                    }

                    /* Je recharge le carrousel */
                    if (carousel) {
                        await this.loadCarouselBooks(carousel, query, 10);
                    }
                });
            });
        }

        /* Je lie les filtres de la section "Populaires par genre" */
        const popularSection = document.querySelector('.popular-books');

        if (popularSection) {
            const filterButtons = popularSection.querySelectorAll('.filter-btn');
            const carousel = popularSection.querySelector('.carousel-content');

            filterButtons.forEach(btn => {
                btn.addEventListener('click', async (event) => {
                    /* Je retire la classe active de tous les boutons */
                    filterButtons.forEach(b => b.classList.remove('active'));
                    event.target.classList.add('active');

                    /* Je récupère le genre sélectionné */
                    const genre = event.target.dataset.genre;
                    const query = `subject:${escapeHtml(genre)}`;

                    /* Je recharge le carrousel */
                    if (carousel) {
                        await this.loadCarouselBooks(carousel, query, 10);
                    }
                });
            });
        }
    }

    /**
     * J'initialise la page catalogue.
     * 
     * @returns {void}
     */
    initCatalogPage() {
        console.log('Initialisation page catalogue');

        /* Je crée le contrôleur de livres */
        this.bookController = new BookController('.books-grid');
        this.bookController.init();

        /* Je lie les filtres de périodes prédéfinies */
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
                /* Je récupère les données de période */
                const yearFrom = event.target.dataset.from;
                const yearTo = event.target.dataset.to;

                const yearFromInput = document.querySelector('input[name="yearFrom"]');
                const yearToInput = document.querySelector('input[name="yearTo"]');

                /* Je remplis les champs d'année */
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