/**
 * BookModel
 * 
 * Gère les données des livres et les appels à l'API Open Library.
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
        this.baseUrl = 'https://openlibrary.org';
        this.coverUrl = 'https://covers.openlibrary.org/b/id';
        this.books = [];
        this.totalResults = 0;
    }

    /**
     * Je recherche des livres via l'API Open Library.
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
            const offset = (page - 1) * limit;
            const url = `${this.baseUrl}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Erreur lors de la recherche');
            }

            const data = await response.json();

            this.books = data.docs || [];
            this.totalResults = data.numFound || 0;

            return {
                books: this.books,
                total: this.totalResults,
                page: page
            };

        } catch (error) {
            console.error('BookModel.searchBooks:', error);
            throw error;
        }
    }

    /**
     * Je récupère les détails complets d'un livre.
     * 
     * @async
     * @param {string} workId L'identifiant du livre
     * @returns {Promise<Object>} Les détails du livre
     * @throws {Error} Si le livre n'est pas trouvé
     */
    async getBookDetails(workId) {
        try {
            const url = `${this.baseUrl}/works/${workId}.json`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Livre non trouvé');
            }

            return await response.json();

        } catch (error) {
            console.error('BookModel.getBookDetails:', error);
            throw error;
        }
    }

    /**
     * Je construis l'URL de la couverture d'un livre.
     * 
     * @param {number|null} coverId L'identifiant de la couverture
     * @param {string} size La taille souhaitée (S, M ou L)
     * @returns {string|null} L'URL de la couverture ou null
     */
    getCoverUrl(coverId, size = 'M') {
        if (!coverId) {
            return null;
        }

        return `${this.coverUrl}/${coverId}-${size}.jpg`;
    }

    /**
     * Je filtre les livres selon les critères fournis.
     * 
     * @param {Object} filters Les filtres à appliquer
     * @param {string|null} filters.language La langue souhaitée
     * @param {number|null} filters.yearFrom L'année minimum
     * @param {number|null} filters.yearTo L'année maximum
     * @returns {Array} Les livres filtrés
     */
    filterBooks(filters) {
        let filtered = [...this.books];

        if (filters.language) {
            filtered = filtered.filter(book =>
                book.language?.includes(filters.language)
            );
        }

        if (filters.yearFrom) {
            filtered = filtered.filter(book =>
                book.first_publish_year >= filters.yearFrom
            );
        }

        if (filters.yearTo) {
            filtered = filtered.filter(book =>
                book.first_publish_year <= filters.yearTo
            );
        }

        return filtered;
    }
}