/**
 * WishlistModel
 * 
 * Gère la wishlist des livres avec persistance localStorage.
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
        this.storageKey = 'bookfinder_wishlist';
        this.wishlist = this.load();
    }

    /**
     * Je charge la wishlist depuis le localStorage.
     * 
     * @returns {Array} La liste des livres sauvegardés
     */
    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];

        } catch (error) {
            console.error('WishlistModel.load:', error);
            return [];
        }
    }

    /**
     * Je sauvegarde la wishlist dans le localStorage.
     * 
     * @returns {void}
     */
    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.wishlist));

        } catch (error) {
            console.error('WishlistModel.save:', error);
        }
    }

    /**
     * J'ajoute un livre à la wishlist.
     * 
     * @param {Object} book Les données du livre à ajouter
     * @returns {boolean} True si ajouté, false si déjà présent
     */
    add(book) {
        if (this.has(book.key)) {
            return false;
        }

        const bookData = {
            key: book.key,
            title: book.title,
            author_name: book.author_name || [],
            cover_i: book.cover_i || null,
            first_publish_year: book.first_publish_year || null,
            addedAt: new Date().toISOString()
        };

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
        const index = this.wishlist.findIndex(book => book.key === workKey);

        if (index === -1) {
            return false;
        }

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
        return this.wishlist.some(book => book.key === workKey);
    }

    /**
     * Je bascule un livre dans la wishlist (ajout/retrait).
     * 
     * @param {Object} book Les données du livre
     * @returns {Object} Le résultat de l'opération
     */
    toggle(book) {
        const workKey = book.key;

        if (this.has(workKey)) {
            this.remove(workKey);
            return { action: 'removed', inWishlist: false };
        }

        this.add(book);
        return { action: 'added', inWishlist: true };
    }

    /**
     * Je récupère tous les livres de la wishlist.
     * 
     * @returns {Array} La liste des livres
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