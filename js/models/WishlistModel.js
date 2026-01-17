/**
 * WishlistModel
 * 
 * Je gère la wishlist des livres avec persistance localStorage.
 * J'effectue des validations sur les données pour garantir l'intégrité.
 * 
 * @class WishlistModel
 */
export class WishlistModel {

    /**
     * Je crée une instance du WishlistModel.
     * 
     * @constructor
     */
    constructor() {
        /* Je définis la clé de stockage */
        this.storageKey = 'bookfinder_wishlist';

        /* Je définis la taille maximale de la wishlist pour éviter les abus */
        this.maxItems = 100;

        /* Je charge les données depuis le localStorage */
        this.wishlist = this.load();
    }

    /**
     * Je charge la wishlist depuis le localStorage.
     * Je valide les données chargées pour la sécurité.
     * 
     * @returns {Array} La liste des livres sauvegardés et validés
     */
    load() {
        try {
            const data = localStorage.getItem(this.storageKey);

            /* Je vérifie si des données existent */
            if (!data) {
                return [];
            }

            /* Je parse les données JSON */
            const parsed = JSON.parse(data);

            /* Je vérifie que c'est un tableau */
            if (!Array.isArray(parsed)) {
                console.warn('WishlistModel: Données invalides, réinitialisation');
                return [];
            }

            /* Je valide chaque élément du tableau */
            const validated = parsed.filter(item => this.validateBookData(item));

            /* Je limite le nombre d'éléments */
            return validated.slice(0, this.maxItems);

        } catch (error) {
            console.error('WishlistModel.load:', error);
            return [];
        }
    }

    /**
     * Je valide les données d'un livre.
     * Je vérifie que les champs requis sont présents et valides.
     * 
     * @param {Object} book Les données du livre à valider
     * @returns {boolean} True si valide, false sinon
     */
    validateBookData(book) {
        /* Je vérifie que c'est un objet */
        if (!book || typeof book !== 'object') {
            return false;
        }

        /* Je vérifie que la clé est présente et valide */
        if (!book.key || typeof book.key !== 'string') {
            return false;
        }

        /* Je vérifie que le titre est présent */
        if (!book.title || typeof book.title !== 'string') {
            return false;
        }

        /* Je vérifie la longueur des champs pour éviter les abus */
        if (book.key.length > 100 || book.title.length > 500) {
            return false;
        }

        return true;
    }

    /**
     * Je sauvegarde la wishlist dans le localStorage.
     * 
     * @returns {void}
     */
    save() {
        try {
            /* Je limite le nombre d'éléments avant sauvegarde */
            const dataToSave = this.wishlist.slice(0, this.maxItems);
            localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));

        } catch (error) {
            console.error('WishlistModel.save:', error);

            /* Je gère le cas où le localStorage est plein */
            if (error.name === 'QuotaExceededError') {
                console.warn('WishlistModel: Espace de stockage insuffisant');
            }
        }
    }

    /**
     * J'ajoute un livre à la wishlist.
     * Je valide les données avant l'ajout.
     * 
     * @param {Object} book Les données du livre à ajouter
     * @returns {boolean} True si ajouté, false si déjà présent ou invalide
     */
    add(book) {
        /* Je vérifie que le livre est valide */
        if (!book || !book.key || !book.title) {
            console.warn('WishlistModel.add: Données du livre invalides');
            return false;
        }

        /* Je vérifie si le livre est déjà présent */
        if (this.has(book.key)) {
            return false;
        }

        /* Je vérifie la limite de la wishlist */
        if (this.wishlist.length >= this.maxItems) {
            console.warn('WishlistModel.add: Limite de wishlist atteinte');
            return false;
        }

        /* Je crée un objet avec uniquement les données nécessaires */
        const bookData = {
            key: String(book.key).substring(0, 100),
            title: String(book.title).substring(0, 500),
            author_name: Array.isArray(book.author_name) 
                ? book.author_name.slice(0, 5).map(a => String(a).substring(0, 100))
                : [],
            cover_i: book.cover_i ? parseInt(book.cover_i, 10) || null : null,
            first_publish_year: book.first_publish_year 
                ? parseInt(book.first_publish_year, 10) || null 
                : null,
            addedAt: new Date().toISOString()
        };

        /* J'ajoute le livre à la wishlist */
        this.wishlist.push(bookData);
        this.save();

        return true;
    }

    /**
     * Je retire un livre de la wishlist.
     * 
     * @param {string} workKey L'identifiant du livre
     * @returns {boolean} True si retiré, false si non trouvé
     */
    remove(workKey) {
        /* Je valide la clé */
        if (!workKey || typeof workKey !== 'string') {
            return false;
        }

        /* Je cherche l'index du livre */
        const index = this.wishlist.findIndex(book => book.key === workKey);

        /* Je vérifie si le livre existe */
        if (index === -1) {
            return false;
        }

        /* Je retire le livre */
        this.wishlist.splice(index, 1);
        this.save();

        return true;
    }

    /**
     * Je vérifie si un livre est dans la wishlist.
     * 
     * @param {string} workKey L'identifiant du livre
     * @returns {boolean} True si présent, false sinon
     */
    has(workKey) {
        /* Je valide la clé */
        if (!workKey || typeof workKey !== 'string') {
            return false;
        }

        return this.wishlist.some(book => book.key === workKey);
    }

    /**
     * Je bascule un livre dans la wishlist (ajout/retrait).
     * 
     * @param {Object} book Les données du livre
     * @returns {Object} Le résultat de l'opération
     */
    toggle(book) {
        /* Je vérifie que le livre est valide */
        if (!book || !book.key) {
            return { action: 'error', inWishlist: false };
        }

        const workKey = book.key;

        /* Je bascule l'état du livre */
        if (this.has(workKey)) {
            this.remove(workKey);
            return { action: 'removed', inWishlist: false };
        }

        const added = this.add(book);
        return { 
            action: added ? 'added' : 'error', 
            inWishlist: added 
        };
    }

    /**
     * Je récupère tous les livres de la wishlist.
     * Je retourne une copie pour éviter les modifications directes.
     * 
     * @returns {Array} La copie de la liste des livres
     */
    getAll() {
        return [...this.wishlist];
    }

    /**
     * Je récupère le nombre de livres dans la wishlist.
     * 
     * @returns {number} Le nombre de livres
     */
    getCount() {
        return this.wishlist.length;
    }

    /**
     * Je vide complètement la wishlist.
     * 
     * @returns {void}
     */
    clear() {
        this.wishlist = [];
        this.save();
    }
}