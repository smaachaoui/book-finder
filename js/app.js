import { BookController } from './controllers/BookController.js';

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

        // TODO: Initialiser les carrousels
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
    }
}

/**
 * Je lance l'application quand le DOM est prêt.
 */
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});