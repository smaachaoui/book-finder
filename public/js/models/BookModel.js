/**
 * BookModel
 * 
 * Je gère les données des livres et les appels à l'API Open Library.
 * J'effectue des validations sur les réponses de l'API pour la sécurité.
 * 
 * @class BookModel
 */
export class BookModel {

    /**
     * Je crée une instance du BookModel.
     * 
     * @constructor
     */
    constructor() {
        /* Je définis les URLs de base de l'API */
        this.baseUrl = 'https://openlibrary.org';
        this.coverUrl = 'https://covers.openlibrary.org/b/id';

        /* J'initialise les données */
        this.books = [];
        this.totalResults = 0;
    }

    /**
     * Je recherche des livres via l'API Open Library.
     * Je valide les paramètres avant l'appel.
     * 
     * @async
     * @param {string} query Le terme de recherche
     * @param {number} page Le numéro de page
     * @param {number} limit Le nombre de résultats par page
     * @returns {Promise<Object>} Les résultats de recherche
     * @throws {Error} Si la requête échoue
     */
    async searchBooks(query, page = 1, limit = 20) {
        try {
            /* Je valide les paramètres */
            const safePage = Math.max(1, parseInt(page, 10) || 1);
            const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

            /* Je calcule l'offset pour la pagination */
            const offset = (safePage - 1) * safeLimit;

            /* Je construis l'URL avec encodage sécurisé */
            const url = `${this.baseUrl}/search.json?q=${encodeURIComponent(query)}&limit=${safeLimit}&offset=${offset}`;

            /* J'effectue la requête */
            const response = await fetch(url);

            /* Je vérifie que la réponse est OK */
            if (!response.ok) {
                throw new Error('Erreur lors de la recherche');
            }

            /* Je parse la réponse JSON */
            const data = await response.json();

            /* Je valide la structure de la réponse */
            this.books = Array.isArray(data.docs) ? data.docs : [];
            this.totalResults = parseInt(data.numFound, 10) || 0;

            return {
                books: this.books,
                total: this.totalResults,
                page: safePage
            };

        } catch (error) {
            console.error('BookModel.searchBooks:', error);
            throw error;
        }
    }

    /**
     * Je récupère les détails complets d'un livre.
     * Je valide l'identifiant avant l'appel.
     * 
     * @async
     * @param {string} workId L'identifiant du livre
     * @returns {Promise<Object>} Les détails du livre
     * @throws {Error} Si le livre n'est pas trouvé
     */
    async getBookDetails(workId) {
        try {
            /* Je valide l'identifiant */
            if (!workId || typeof workId !== 'string') {
                throw new Error('Identifiant de livre invalide');
            }

            /* Je nettoie l'identifiant des caractères dangereux */
            const safeWorkId = workId.replace(/[^a-zA-Z0-9_-]/g, '');

            /* Je construis l'URL */
            const url = `${this.baseUrl}/works/${safeWorkId}.json`;

            /* J'effectue la requête */
            const response = await fetch(url);

            /* Je vérifie que la réponse est OK */
            if (!response.ok) {
                throw new Error('Livre non trouvé');
            }

            /* Je retourne les détails */
            return await response.json();

        } catch (error) {
            console.error('BookModel.getBookDetails:', error);
            throw error;
        }
    }

    /**
     * Je construis l'URL de la couverture d'un livre.
     * Je valide les paramètres pour la sécurité.
     * 
     * @param {number|null} coverId L'identifiant de la couverture
     * @param {string} size La taille souhaitée (S, M ou L)
     * @returns {string|null} L'URL de la couverture ou null
     */
    getCoverUrl(coverId, size = 'M') {
        /* Je vérifie que l'identifiant est valide */
        if (!coverId) {
            return null;
        }

        /* Je valide la taille */
        const validSizes = ['S', 'M', 'L'];
        const safeSize = validSizes.includes(size) ? size : 'M';

        /* Je m'assure que l'identifiant est numérique */
        const safeCoverId = parseInt(coverId, 10);

        if (isNaN(safeCoverId)) {
            return null;
        }

        return `${this.coverUrl}/${safeCoverId}-${safeSize}.jpg`;
    }

    /**
     * Je filtre les livres selon les critères fournis.
     * Je valide les critères avant de filtrer.
     * 
     * @param {Object} filters Les filtres à appliquer
     * @param {string|null} filters.language La langue souhaitée
     * @param {number|null} filters.yearFrom L'année minimum
     * @param {number|null} filters.yearTo L'année maximum
     * @returns {Array} Les livres filtrés
     */
    filterBooks(filters) {
        /* Je crée une copie du tableau pour ne pas modifier l'original */
        let filtered = [...this.books];

        /* J'applique le filtre de langue */
        if (filters.language && typeof filters.language === 'string') {
            filtered = filtered.filter(book =>
                book.language?.includes(filters.language)
            );
        }

        /* J'applique le filtre d'année minimum */
        if (filters.yearFrom) {
            const yearFrom = parseInt(filters.yearFrom, 10);
            if (!isNaN(yearFrom)) {
                filtered = filtered.filter(book =>
                    book.first_publish_year >= yearFrom
                );
            }
        }

        /* J'applique le filtre d'année maximum */
        if (filters.yearTo) {
            const yearTo = parseInt(filters.yearTo, 10);
            if (!isNaN(yearTo)) {
                filtered = filtered.filter(book =>
                    book.first_publish_year <= yearTo
                );
            }
        }

        return filtered;
    }
}