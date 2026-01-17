# Documentation Technique - BookFinder

## Table des matieres

1. [Documentation HTML](#documentation-html)
2. [Documentation JavaScript](#documentation-javascript)
3. [Documentation CSS](#documentation-css)
4. [Interactions avec l'API Open Library](#interactions-avec-lapi-open-library)

---

## Documentation HTML

### index.html - Page d'accueil

J'ai structure la page d'accueil en plusieurs sections.

#### Header

```html
<header class="header">
    <div class="logo">
        <a href="index.html">
            <img src="img/logo.png" width="50" height="50" alt="BookFinder - Retour a l'accueil">
        </a>
    </div>
    <nav class="navbar" aria-label="Navigation principale">
        <a href="index.html">Accueil</a>
        <a href="catalog.html">Catalogue</a>
        <a href="wishlist.html">Ma Wishlist</a>
    </nav>
    <button class="burger-menu" type="button" aria-label="Menu de navigation" aria-expanded="false">
        <span class="burger-line"></span>
        <span class="burger-line"></span>
        <span class="burger-line"></span>
    </button>
</header>
```

Le header contient le logo, la navigation principale et le bouton du menu burger pour mobile. J'ai utilise l'attribut `aria-label` pour l'accessibilite.

#### Banniere

```html
<section class="banner">
    <h1>Bienvenue dans l'explorateur de livres !</h1>
</section>
```

J'ai cree une banniere simple avec un titre principal.

#### Section Sorties recentes

```html
<section class="book-section recent-releases">
    <header class="section-header">
        <h2>Sorties recentes</h2>
        <div class="filters" role="group" aria-label="Filtrer par periode">
            <button type="button" class="filter-btn active" data-period="2024">2024</button>
            <button type="button" class="filter-btn" data-period="2023">2023</button>
            <button type="button" class="filter-btn" data-period="2022">2022</button>
            <button type="button" class="filter-btn" data-period="classics">Classiques</button>
        </div>
        <a href="catalog.html?q=fiction" class="view-all-link">Voir tout</a>
    </header>
    <div class="carousel">
        <button class="carousel-btn prev" type="button" aria-label="Livres precedents"></button>
        <div class="carousel-content"></div>
        <button class="carousel-btn next" type="button" aria-label="Livres suivants"></button>
    </div>
</section>
```

J'ai utilise des attributs `data-period` sur les boutons de filtre pour stocker l'annee de publication. Le contenu du carrousel est genere dynamiquement en JavaScript.

#### Section Populaires par genre

```html
<section class="book-section popular-books">
    <header class="section-header">
        <h2>Populaires par genre</h2>
        <div class="filters" role="group" aria-label="Filtrer par genre">
            <button type="button" class="filter-btn active" data-genre="fiction">Fiction</button>
            <button type="button" class="filter-btn" data-genre="fantasy">Fantasy</button>
            <button type="button" class="filter-btn" data-genre="science_fiction">Science-fiction</button>
            <button type="button" class="filter-btn" data-genre="thriller">Thriller</button>
            <button type="button" class="filter-btn" data-genre="romance">Romance</button>
        </div>
        <a href="catalog.html" class="view-all-link">Voir le catalogue</a>
    </header>
    <div class="carousel">...</div>
</section>
```

J'ai utilise des attributs `data-genre` pour stocker le genre litteraire de chaque filtre.

---

### catalog.html - Page catalogue

#### Section de recherche

```html
<section class="search-section">
    <h1>Vous cherchez un livre ?</h1>
    <form class="search-form" action="catalog.html" method="get" role="search">
        <label for="search" class="visually-hidden">Rechercher un livre</label>
        <input type="search" id="search" name="q" placeholder="Titre, auteur, ISBN..." autocomplete="off">
        <button type="submit" aria-label="Lancer la recherche">Rechercher</button>
    </form>
</section>
```

J'ai configure le formulaire avec `method="get"` pour que la recherche soit reflettee dans l'URL via le parametre `q`. Le label est masque visuellement mais reste accessible aux lecteurs d'ecran.

#### Sidebar des filtres

```html
<aside class="filters-sidebar">
    <h2>Filtres</h2>

    <fieldset class="filter-group">
        <legend>Langue</legend>
        <label>
            <input type="radio" name="language" value="fre">
            Francais
        </label>
        <label>
            <input type="radio" name="language" value="eng">
            Anglais
        </label>
        <label>
            <input type="radio" name="language" value="spa">
            Espagnol
        </label>
        <label>
            <input type="radio" name="language" value="ger">
            Allemand
        </label>
        <label>
            <input type="radio" name="language" value="">
            Toutes les langues
        </label>
    </fieldset>

    <fieldset class="filter-group">
        <legend>Annee de publication</legend>
        <div class="year-inputs">
            <label>
                <span>De</span>
                <input type="number" name="yearFrom" min="1800" max="2025" placeholder="1900">
            </label>
            <label>
                <span>A</span>
                <input type="number" name="yearTo" min="1800" max="2025" placeholder="2025">
            </label>
        </div>
    </fieldset>

    <fieldset class="filter-group">
        <legend>Periodes</legend>
        <label>
            <input type="radio" name="period" value="2020-2025" data-from="2020" data-to="2025">
            2020 - Aujourd'hui
        </label>
        <label>
            <input type="radio" name="period" value="2010-2019" data-from="2010" data-to="2019">
            2010 - 2019
        </label>
        <label>
            <input type="radio" name="period" value="2000-2009" data-from="2000" data-to="2009">
            2000 - 2009
        </label>
        <label>
            <input type="radio" name="period" value="classic" data-from="1800" data-to="1999">
            Classiques (avant 2000)
        </label>
    </fieldset>

    <button type="button" class="reset-filters-btn">Reinitialiser les filtres</button>
</aside>
```

J'ai utilise des `fieldset` et `legend` pour regrouper les filtres de maniere semantique. Les periodes predefinies utilisent des attributs `data-from` et `data-to` pour pre-remplir les champs d'annee.

#### Grille des resultats et pagination

```html
<div class="results-content">
    <header class="results-header">
        <p class="results-count"><strong>124</strong> livres trouves</p>
        <div class="sort-options">
            <label for="sort">Trier par :</label>
            <select id="sort" name="sort">
                <option value="relevance">Pertinence</option>
                <option value="date-desc">Plus recents</option>
                <option value="date-asc">Plus anciens</option>
            </select>
        </div>
    </header>

    <div class="books-grid"></div>

    <nav class="pagination" aria-label="Pagination des resultats">
        <button type="button" class="pagination-btn prev" disabled aria-label="Page precedente">Precedent</button>
        <span class="pagination-info">Page 1 sur 13</span>
        <button type="button" class="pagination-btn next" aria-label="Page suivante">Suivant</button>
    </nav>
</div>
```

J'ai cree une structure pour accueillir les resultats de recherche avec un compteur, une grille et une pagination. Le contenu de la grille est genere dynamiquement.

---

### wishlist.html - Page wishlist

```html
<section class="wishlist-header">
    <h1>Ma Wishlist</h1>
    <p class="wishlist-count">
        <span id="wishlist-total">0</span> livre(s) dans ma liste
    </p>
</section>

<section class="wishlist-section">
    <div class="wishlist-container">
        <div class="wishlist-actions">
            <button type="button" class="btn-clear-wishlist" id="clear-wishlist">
                Vider la wishlist
            </button>
        </div>

        <div class="wishlist-grid" id="wishlist-grid"></div>

        <div class="wishlist-empty" id="wishlist-empty" style="display: none;">
            <p>Votre wishlist est vide.</p>
            <p>Explorez notre catalogue pour trouver des livres qui vous plaisent !</p>
            <a href="catalog.html" class="btn-explore">Explorer le catalogue</a>
        </div>
    </div>
</section>
```

J'ai cree deux conteneurs : un pour la grille des livres et un pour le message quand la wishlist est vide. L'affichage de l'un ou l'autre est gere en JavaScript selon le nombre de livres.

---

## Documentation JavaScript

### app.js - Point d'entree

J'ai cree une classe `App` qui detecte la page courante et initialise les fonctionnalites appropriees.

```javascript
class App {
    constructor() {
        this.bookController = null;
        this.bookModel = new BookModel();
    }

    init() {
        const page = this.getCurrentPage();
        switch (page) {
            case 'index':
                this.initHomePage();
                break;
            case 'catalog':
                this.initCatalogPage();
                break;
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('catalog')) return 'catalog';
        return 'index';
    }
}
```

#### Methode initHomePage()

J'initialise les carrousels et lie les filtres. Je charge les livres de 2024 pour la section "Sorties recentes" et les livres de fiction pour la section "Populaires par genre". Je lie ensuite les evenements de clic sur les boutons de filtre.

#### Methode initCarousels()

```javascript
async initCarousels() {
    const recentCarousel = document.querySelector('.recent-releases .carousel-content');
    if (recentCarousel) {
        await this.loadCarouselBooks(recentCarousel, 'subject:fiction first_publish_year:2024', 10);
        this.bindCarouselButtons('.recent-releases');
    }

    const popularCarousel = document.querySelector('.popular-books .carousel-content');
    if (popularCarousel) {
        await this.loadCarouselBooks(popularCarousel, 'subject:fiction', 10);
        this.bindCarouselButtons('.popular-books');
    }

    this.bindHomeFilters();
}
```

#### Methode loadCarouselBooks()

J'ai implemente un chargement intelligent des livres. J'affiche d'abord un spinner de chargement, puis je demande 3 fois plus de resultats que necessaire a l'API. Je filtre ensuite pour garder uniquement les livres avec couverture, je limite au nombre demande, et je genere le HTML des cartes.

```javascript
async loadCarouselBooks(container, query, limit = 10) {
    try {
        container.innerHTML = `
            <div class="carousel-loading">
                <div class="spinner"></div>
            </div>
        `;

        const results = await this.bookModel.searchBooks(query, 1, limit * 3);
        const booksWithCovers = results.books.filter(book => book.cover_i);
        const books = booksWithCovers.slice(0, limit);

        if (books.length === 0) {
            container.innerHTML = '<p class="carousel-empty">Aucun livre trouve</p>';
            return;
        }

        const html = books.map(book => this.renderCarouselCard(book)).join('');
        container.innerHTML = html;

    } catch (error) {
        console.error('Erreur chargement carrousel:', error);
        container.innerHTML = '<p class="carousel-error">Erreur de chargement</p>';
    }
}
```

#### Methode bindHomeFilters()

J'ai separe la logique des deux sections. La section "Sorties recentes" utilise `data-period` pour construire une requete par annee. La section "Populaires par genre" utilise `data-genre` pour construire une requete par sujet.

```javascript
bindHomeFilters() {
    const recentSection = document.querySelector('.recent-releases');
    if (recentSection) {
        const filterButtons = recentSection.querySelectorAll('.filter-btn');
        const carousel = recentSection.querySelector('.carousel-content');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', async (event) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                event.target.classList.add('active');

                const period = event.target.dataset.period;
                let query;

                if (period === 'classics') {
                    query = 'subject:classic_literature';
                } else {
                    query = `subject:fiction first_publish_year:${period}`;
                }

                if (carousel) {
                    await this.loadCarouselBooks(carousel, query, 10);
                }
            });
        });
    }

    const popularSection = document.querySelector('.popular-books');
    if (popularSection) {
        const filterButtons = popularSection.querySelectorAll('.filter-btn');
        const carousel = popularSection.querySelector('.carousel-content');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', async (event) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                event.target.classList.add('active');

                const genre = event.target.dataset.genre;
                const query = `subject:${genre}`;

                if (carousel) {
                    await this.loadCarouselBooks(carousel, query, 10);
                }
            });
        });
    }
}
```

---

### menu-burger.js - Menu mobile

J'ai encapsule tout le code dans un evenement `DOMContentLoaded` pour eviter les erreurs de selection d'elements inexistants.

```javascript
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.querySelector('.burger-menu');
    const navBar = document.querySelector('.navbar');

    if (!burgerMenu || !navBar) {
        return;
    }

    function toggleMenu() {
        burgerMenu.classList.toggle('active');
        navBar.classList.toggle('active');
    }

    burgerMenu.addEventListener('click', toggleMenu);

    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navBar.classList.contains('active')) {
            toggleMenu();
        }
    });
});
```

Le menu se ferme de trois manieres : au clic sur le bouton burger, au clic sur un lien de navigation, ou en appuyant sur la touche Escape.

---

### controllers/BookController.js

J'ai cree le controleur principal qui orchestre les interactions entre le modele et la vue.

#### Proprietes

```javascript
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
```

#### Methode init()

J'initialise tous les ecouteurs d'evenements.

```javascript
init() {
    this.bindSearchForm();
    this.bindRealTimeSearch();
    this.bindFilters();
    this.bindBookActions();
    this.bindPagination();
    this.bindModalActions();
    this.checkUrlParams();
}
```

#### Methode bindRealTimeSearch()

J'ai implemente la recherche en temps reel. La recherche se declenche apres 500ms d'inactivite et seulement si l'utilisateur a saisi au moins 3 caracteres.

```javascript
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
```

#### Methode loadBooks()

J'ai structure le chargement des livres. J'affiche le loader, j'appelle l'API via le modele, j'applique les filtres locaux si necessaires, j'ajoute l'etat wishlist a chaque livre, j'affiche les resultats via la vue, et je mets a jour la pagination.

```javascript
async loadBooks(query, page = 1) {
    this.view.showLoading();

    try {
        const results = await this.model.searchBooks(query, page, this.itemsPerPage);

        let books = results.books;

        if (Object.keys(this.currentFilters).length > 0) {
            books = this.model.filterBooks(this.currentFilters);
        }

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
```

#### Methode handleBookClick()

J'ai implemente l'ouverture de la modale de details. J'affiche un loader dans la modale, je recupere le livre depuis les resultats en memoire, je fais un appel API supplementaire pour les details complets, je verifie si le livre est dans la wishlist, et j'affiche les informations dans la modale.

```javascript
async handleBookClick(workId) {
    if (!workId) {
        return;
    }

    this.modalView.showLoading();

    try {
        const book = this.model.books.find(b => b.key === `/works/${workId}`);

        if (!book) {
            this.modalView.showError('Livre non trouve');
            return;
        }

        const details = await this.model.getBookDetails(workId);
        const inWishlist = this.wishlistModel.has(book.key);

        this.modalView.showBookDetails(book, details, inWishlist);

    } catch (error) {
        console.error('Erreur lors du chargement des details:', error);
        this.modalView.showError('Impossible de charger les details du livre.');
    }
}
```

#### Methode handleWishlistToggle()

J'ai gere le basculement wishlist. Je recupere le livre depuis les resultats, j'appelle la methode toggle du WishlistModel, je mets a jour visuellement le bouton, et j'affiche une notification toast.

```javascript
handleWishlistToggle(workId, button) {
    if (!workId) {
        return;
    }

    const book = this.model.books.find(b => b.key === `/works/${workId}`);

    if (!book) {
        return;
    }

    const result = this.wishlistModel.toggle(book);

    if (result.inWishlist) {
        button.classList.add('in-wishlist');
        button.textContent = 'Dans la wishlist';
        showToast('Livre ajoute a la wishlist', 'success');
    } else {
        button.classList.remove('in-wishlist');
        button.textContent = 'Ajouter a la wishlist';
        showToast('Livre retire de la wishlist', 'info');
    }
}
```

---

### models/BookModel.js

J'ai cree le modele pour gerer les donnees des livres et les appels API.

#### Proprietes

```javascript
constructor() {
    this.baseUrl = 'https://openlibrary.org';
    this.coverUrl = 'https://covers.openlibrary.org/b/id';
    this.books = [];
    this.totalResults = 0;
}
```

#### Methode searchBooks()

J'ai implemente la recherche avec pagination. Je calcule l'offset a partir du numero de page pour gerer la pagination cote API.

```javascript
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
```

#### Methode getBookDetails()

J'ai implemente la recuperation des details d'un livre. L'endpoint `/works/` retourne des informations complementaires comme la description complete.

```javascript
async getBookDetails(workId) {
    try {
        const url = `${this.baseUrl}/works/${workId}.json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Livre non trouve');
        }

        return await response.json();

    } catch (error) {
        console.error('BookModel.getBookDetails:', error);
        throw error;
    }
}
```

#### Methode filterBooks()

J'ai implemente le filtrage local des resultats. Les filtres sont appliques sur les donnees deja chargees pour eviter des appels API supplementaires.

```javascript
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
```

#### Methode getCoverUrl()

J'ai cree une methode utilitaire pour construire l'URL de couverture avec la taille souhaitee.

```javascript
getCoverUrl(coverId, size = 'M') {
    if (!coverId) {
        return null;
    }
    return `${this.coverUrl}/${coverId}-${size}.jpg`;
}
```

---

### models/WishlistModel.js

J'ai cree le modele pour gerer la wishlist avec persistance localStorage. J'ai choisi de sauvegarder uniquement les donnees essentielles du livre pour minimiser l'espace localStorage utilise.

#### Methode load()

```javascript
load() {
    try {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('WishlistModel.load:', error);
        return [];
    }
}
```

#### Methode save()

```javascript
save() {
    try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.wishlist));
    } catch (error) {
        console.error('WishlistModel.save:', error);
    }
}
```

#### Methode add()

```javascript
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
```

#### Methode toggle()

```javascript
toggle(book) {
    const workKey = book.key;

    if (this.has(workKey)) {
        this.remove(workKey);
        return { action: 'removed', inWishlist: false };
    }

    this.add(book);
    return { action: 'added', inWishlist: true };
}
```

#### Methode has()

```javascript
has(workKey) {
    return this.wishlist.some(book => book.key === workKey);
}
```

---

### views/BookView.js

J'ai cree la vue pour afficher les livres dans le DOM.

#### Methode renderBooks()

```javascript
renderBooks(books) {
    if (!this.container) {
        console.error('BookView: Conteneur non trouve');
        return;
    }

    if (books.length === 0) {
        this.showEmpty();
        return;
    }

    const html = books.map(book => this.renderBookCard(book)).join('');
    this.container.innerHTML = html;
}
```

#### Methode renderBookCard()

J'ai structure la carte d'un livre avec l'affichage conditionnel de l'etat wishlist.

```javascript
renderBookCard(book) {
    const coverUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : this.defaultCover;

    const authors = book.author_name
        ? book.author_name.join(', ')
        : 'Auteur inconnu';

    const year = book.first_publish_year || 'Date inconnue';

    const workId = book.key ? book.key.replace('/works/', '') : '';

    const wishlistClass = book.inWishlist ? 'btn-wishlist in-wishlist' : 'btn-wishlist';
    const wishlistText = book.inWishlist ? 'Dans la wishlist' : 'Ajouter a la wishlist';

    return `
        <article class="book-card" data-work-id="${workId}">
            <div class="book-cover">
                <img src="${coverUrl}" alt="Couverture de ${book.title}" loading="lazy">
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${authors}</p>
                <p class="book-year">${year}</p>
            </div>
            <div class="book-actions">
                <button type="button" class="btn-details" data-work-id="${workId}">
                    Voir details
                </button>
                <button type="button" class="${wishlistClass}" data-work-id="${workId}">
                    ${wishlistText}
                </button>
            </div>
        </article>
    `;
}
```

#### Methodes d'etat

```javascript
showLoading() {
    if (!this.container) {
        return;
    }
    this.container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Chargement en cours...</p>
        </div>
    `;
}

showError(message) {
    if (!this.container) {
        return;
    }
    this.container.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
            <button type="button" class="btn-retry">Reessayer</button>
        </div>
    `;
}

showEmpty() {
    if (!this.container) {
        return;
    }
    this.container.innerHTML = `
        <div class="empty-message">
            <p>Aucun livre trouve.</p>
            <p>Essayez avec d'autres termes de recherche.</p>
        </div>
    `;
}
```

---

### views/ModalView.js

J'ai cree la vue pour gerer la modale de details.

#### Methode createModalContainer()

J'injecte le HTML de la modale dans le DOM au chargement.

```javascript
createModalContainer() {
    if (document.querySelector('.modal-overlay')) {
        this.modal = document.querySelector('.modal-overlay');
        return;
    }

    const modalHTML = `
        <div class="modal-overlay" aria-hidden="true">
            <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <button type="button" class="modal-close" aria-label="Fermer la modale">x</button>
                <div class="modal-content"></div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.querySelector('.modal-overlay');
}
```

#### Methode bindEvents()

```javascript
bindEvents() {
    if (!this.modal) {
        return;
    }

    this.modal.addEventListener('click', (event) => {
        if (event.target === this.modal) {
            this.close();
        }
    });

    const closeBtn = this.modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close());
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && this.isOpen()) {
            this.close();
        }
    });
}
```

#### Methode showBookDetails()

J'extrais et affiche toutes les informations disponibles : couverture en grande taille, titre, auteur, annee, description, ISBN, editeur, nombre de pages, langues, bouton wishlist avec etat actuel, et lien vers Open Library.

#### Methodes d'extraction

J'ai cree des methodes dediees pour extraire les donnees de maniere securisee car l'API retourne des formats variables.

```javascript
extractDescription(details) {
    if (!details) {
        return null;
    }
    if (typeof details.description === 'string') {
        return details.description;
    }
    if (details.description?.value) {
        return details.description.value;
    }
    return null;
}

extractISBN(book, details) {
    if (book.isbn && book.isbn.length > 0) {
        return book.isbn[0];
    }
    if (details?.isbn_13 && details.isbn_13.length > 0) {
        return details.isbn_13[0];
    }
    if (details?.isbn_10 && details.isbn_10.length > 0) {
        return details.isbn_10[0];
    }
    return null;
}

extractPublisher(book) {
    if (book.publisher && book.publisher.length > 0) {
        return book.publisher[0];
    }
    return null;
}

extractPages(book) {
    if (book.number_of_pages_median) {
        return book.number_of_pages_median;
    }
    return null;
}

extractLanguages(book) {
    if (book.language && book.language.length > 0) {
        const languageNames = {
            'eng': 'Anglais',
            'fre': 'Francais',
            'fra': 'Francais',
            'spa': 'Espagnol',
            'ger': 'Allemand',
            'deu': 'Allemand',
            'ita': 'Italien',
            'por': 'Portugais',
            'rus': 'Russe',
            'jpn': 'Japonais',
            'chi': 'Chinois',
            'ara': 'Arabe'
        };

        return book.language
            .slice(0, 3)
            .map(code => languageNames[code] || code)
            .join(', ');
    }
    return null;
}
```

#### Methodes open() et close()

```javascript
open() {
    if (!this.modal) {
        return;
    }
    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

close() {
    if (!this.modal) {
        return;
    }
    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}
```

---

### utils/helpers.js

J'ai cree des fonctions utilitaires reutilisables.

#### debounce()

J'utilise cette fonction pour limiter les appels API lors de la frappe dans le champ de recherche.

```javascript
export function debounce(func, delay = 300) {
    let timeoutId;

    return function (...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}
```

#### formatDate()

```javascript
export function formatDate(isoDate) {
    if (!isoDate) {
        return 'Date inconnue';
    }

    const date = new Date(isoDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };

    return date.toLocaleDateString('fr-FR', options);
}
```

#### getUrlParams() et updateUrlParam()

J'utilise l'API History pour mettre a jour l'URL sans recharger la page.

```javascript
export function getUrlParams() {
    return new URLSearchParams(window.location.search);
}

export function updateUrlParam(key, value) {
    const url = new URL(window.location);

    if (value) {
        url.searchParams.set(key, value);
    } else {
        url.searchParams.delete(key);
    }

    window.history.replaceState({}, '', url);
}
```

#### showToast()

J'utilise `requestAnimationFrame` pour declencher l'animation d'entree apres l'insertion dans le DOM.

```javascript
export function showToast(message, type = 'info', duration = 3000) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
        <span class="toast-message">${message}</span>
        <button type="button" class="toast-close" aria-label="Fermer">x</button>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('active');
    });

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 300);
    });

    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 300);
        }
    }, duration);
}
```

---

### wishlist-page.js

J'ai cree un script dedie pour la page wishlist.

```javascript
class WishlistPage {
    constructor() {
        this.wishlistModel = new WishlistModel();
        this.gridContainer = document.getElementById('wishlist-grid');
        this.emptyContainer = document.getElementById('wishlist-empty');
        this.totalElement = document.getElementById('wishlist-total');
        this.defaultCover = 'https://via.placeholder.com/150x200?text=No+Cover';
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        const books = this.wishlistModel.getAll();

        this.updateCount(books.length);

        if (books.length === 0) {
            this.showEmpty();
            return;
        }

        this.hideEmpty();

        const html = books.map(book => this.renderCard(book)).join('');
        this.gridContainer.innerHTML = html;
    }

    bindEvents() {
        const clearBtn = document.getElementById('clear-wishlist');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.handleClearAll());
        }

        if (this.gridContainer) {
            this.gridContainer.addEventListener('click', (event) => {
                const removeBtn = event.target.closest('.btn-remove');
                if (removeBtn) {
                    const workKey = removeBtn.dataset.workKey;
                    this.handleRemove(workKey);
                }
            });
        }
    }

    handleRemove(workKey) {
        if (!workKey) {
            return;
        }

        const result = this.wishlistModel.remove(workKey);

        if (result) {
            const card = this.gridContainer.querySelector(`[data-work-key="${workKey}"]`);
            if (card) {
                card.classList.add('removing');
                setTimeout(() => {
                    this.render();
                    showToast('Livre retire de la wishlist', 'info');
                }, 300);
            }
        }
    }

    handleClearAll() {
        const count = this.wishlistModel.getCount();

        if (count === 0) {
            return;
        }

        const confirmed = confirm(`Voulez-vous vraiment supprimer ${count} livre(s) de votre wishlist ?`);

        if (confirmed) {
            this.wishlistModel.clear();
            this.render();
            showToast('Wishlist videe', 'info');
        }
    }
}
```

---

## Documentation CSS

### Architecture

J'ai organise le CSS selon une approche mobile-first avec les sections suivantes :

1. Variables CSS
2. Reset
3. Accessibilite
4. Header et navigation
5. Menu burger
6. Sections de la page d'accueil
7. Carrousels
8. Page catalogue (recherche, filtres, grille)
9. Cartes de livres
10. Pagination
11. Etats (loading, error, empty)
12. Modale
13. Toast notifications
14. Page wishlist
15. Footer
16. Media queries (576px, 768px, 992px, 1200px)

### Variables CSS

```css
:root {
    --color-primary: #587bb8;
    --color-primary-light: #2a4a8a;
    --color-primary-dark: #0f2340;
    --color-secondary: #e67e22;
    --color-secondary-light: #f39c12;
    --color-dark: #222;
    --color-gray: #666;
    --color-gray-light: #999;
    --color-border: #ddd;
    --color-background: #f5f5f5;
    --color-white: #fff;
    --color-success: #27ae60;
    --color-error: #e74c3c;
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
    --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.2);
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --transition: 0.3s ease;
}
```

J'ai defini des variables pour les couleurs, ombres, rayons et transitions afin de garantir la coherence visuelle et faciliter la maintenance.

### Reset et base

```css
*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    font-size: 16px;
    scroll-behavior: smooth;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    line-height: 1.6;
    color: var(--color-dark);
    background-color: var(--color-background);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
```

### Accessibilite

```css
.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

J'ai utilise cette classe pour masquer visuellement les labels tout en les gardant accessibles aux lecteurs d'ecran.

### Menu burger

```css
.burger-menu {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 32px;
    height: 24px;
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 1001;
}

.burger-line {
    display: block;
    width: 100%;
    height: 3px;
    background-color: var(--color-white);
    border-radius: 2px;
    transition: var(--transition);
    transform-origin: center;
}

.burger-menu.active .burger-line:nth-child(1) {
    transform: translateY(10.5px) rotate(45deg);
}

.burger-menu.active .burger-line:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
}

.burger-menu.active .burger-line:nth-child(3) {
    transform: translateY(-10.5px) rotate(-45deg);
}
```

J'ai anime les trois lignes du burger pour former une croix a l'ouverture. La ligne centrale disparait tandis que les deux autres pivotent.

### Navbar mobile

```css
.navbar {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    padding: 5rem 1.5rem 2rem;
    background-color: var(--color-primary-dark);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: right 0.4s ease;
    z-index: 1000;
    box-shadow: var(--shadow-lg);
}

.navbar.active {
    right: 0;
}

.navbar::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transition: var(--transition);
    z-index: -1;
}

.navbar.active::before {
    opacity: 1;
    visibility: visible;
}
```

J'ai utilise un pseudo-element pour creer l'overlay sombre qui apparait derriere le menu.

### Grille des livres

```css
.books-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

@media (min-width: 576px) {
    .books-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 768px) {
    .books-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

J'ai utilise CSS Grid avec des colonnes responsives : 1 colonne en mobile, 2 en tablette, 3 en desktop.

### Cartes de livres

```css
.book-card {
    display: flex;
    flex-direction: column;
    background-color: var(--color-white);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    transition: var(--transition);
}

.book-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
}

.book-cover {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    background-color: var(--color-background);
}

.book-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.book-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-dark);
    margin-bottom: 0.25rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
```

J'ai utilise `-webkit-line-clamp` pour limiter le titre a deux lignes avec des points de suspension.

### Modale

```css
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    z-index: 2000;
    opacity: 0;
    visibility: hidden;
    transition: var(--transition);
}

.modal-overlay.active {
    opacity: 1;
    visibility: visible;
}

.modal {
    position: relative;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    background-color: var(--color-white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    overflow-y: auto;
    transform: translateY(20px);
    transition: var(--transition);
}

.modal-overlay.active .modal {
    transform: translateY(0);
}
```

J'ai combine `opacity`, `visibility` et `transform` pour creer une animation fluide d'ouverture avec un leger glissement vers le haut.

### Toast notifications

```css
.toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background-color: var(--color-dark);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    z-index: 3000;
    opacity: 0;
    transition: var(--transition);
}

.toast.active {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
}

.toast-success {
    background-color: var(--color-success);
}

.toast-error {
    background-color: var(--color-error);
}

.toast-info {
    background-color: var(--color-primary);
}
```

J'ai positionne le toast en bas au centre de l'ecran avec une animation de glissement vers le haut.

### Etat wishlist des boutons

```css
.btn-wishlist.in-wishlist {
    background-color: var(--color-success);
    border-color: var(--color-success);
    color: var(--color-white);
}
```

### Animation de suppression

```css
.wishlist-card.removing {
    opacity: 0;
    transform: scale(0.95);
}
```

J'ai ajoute une animation de disparition lors de la suppression d'un livre de la wishlist.

---

## Interactions avec l'API Open Library

### Presentation de l'API

L'API Open Library est une API REST gratuite qui ne necessite pas de cle d'authentification. Elle donne acces a une base de donnees de millions de livres.

Documentation officielle : https://openlibrary.org/dev/docs/api/books

### Endpoints utilises

#### Recherche de livres

```
GET https://openlibrary.org/search.json?q={query}&limit={limit}&offset={offset}
```

Parametres :
- `q` : terme de recherche (titre, auteur, ISBN, sujet)
- `limit` : nombre de resultats par page (max 100)
- `offset` : decalage pour la pagination

Exemple de reponse :

```json
{
    "numFound": 12345,
    "start": 0,
    "docs": [
        {
            "key": "/works/OL12345W",
            "title": "Titre du livre",
            "author_name": ["Auteur 1", "Auteur 2"],
            "first_publish_year": 2020,
            "cover_i": 12345678,
            "language": ["eng", "fre"],
            "publisher": ["Editeur"],
            "isbn": ["9781234567890"],
            "number_of_pages_median": 350
        }
    ]
}
```

#### Details d'un livre

```
GET https://openlibrary.org/works/{workId}.json
```

Exemple de reponse :

```json
{
    "title": "Titre du livre",
    "description": "Description du livre",
    "covers": [12345678],
    "subjects": ["Fiction", "Adventure"],
    "first_publish_date": "2020"
}
```

Note : Le champ `description` peut etre une chaine de caracteres simple ou un objet avec une propriete `value`.

#### Couvertures

```
GET https://covers.openlibrary.org/b/id/{coverId}-{size}.jpg
```

Tailles disponibles :
- `S` : Small (environ 40px de large)
- `M` : Medium (environ 180px de large)
- `L` : Large (environ 500px de large)

### Requetes de recherche avancees

J'utilise des requetes structurees pour filtrer les resultats :

```
subject:fiction                          # Livres de fiction
subject:fantasy                          # Livres de fantasy
subject:science_fiction                  # Livres de science-fiction
first_publish_year:2024                  # Livres publies en 2024
subject:fiction first_publish_year:2024  # Combinaison de criteres
```

### Implementation dans le projet

#### Recherche avec pagination

```javascript
async searchBooks(query, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const url = `${this.baseUrl}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
    }
    
    const data = await response.json();
    
    return {
        books: data.docs || [],
        total: data.numFound || 0,
        page: page
    };
}
```

J'ai calcule l'offset a partir du numero de page : `offset = (page - 1) * limit`. Pour la page 1 avec 20 resultats par page, l'offset est 0. Pour la page 2, l'offset est 20.

#### Recuperation des details

```javascript
async getBookDetails(workId) {
    const url = `${this.baseUrl}/works/${workId}.json`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Livre non trouve');
    }
    
    return await response.json();
}
```

L'endpoint `/works/` retourne des informations complementaires comme la description complete qui n'est pas presente dans les resultats de recherche.

#### Construction des URL de couverture

```javascript
getCoverUrl(coverId, size = 'M') {
    if (!coverId) return null;
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}
```

### Limitations de l'API

1. Pas de donnees sur les futures parutions : l'API ne contient que les livres deja publies
2. Descriptions parfois absentes ou incompletes
3. Pas d'information sur les prix des livres
4. Pas de systeme de notation ou d'avis
5. Donnees parfois inconsistantes entre les champs (format variable de la description par exemple)
6. Certains livres n'ont pas de couverture

### Optimisations implementees

1. Debounce : J'attends 500ms apres la derniere frappe avant de lancer la recherche pour eviter les appels excessifs

2. Filtrage local : J'applique les filtres langue et annee sur les resultats deja charges pour eviter des appels API supplementaires

3. Filtrage des couvertures : Je demande plus de resultats que necessaire (3x) et filtre ceux sans couverture pour une meilleure experience visuelle

4. Cache memoire : Je garde les resultats en memoire dans `this.books` pour les reutiliser lors du filtrage ou de l'ouverture de la modale sans refaire d'appel API

5. Chargement paresseux : J'utilise l'attribut `loading="lazy"` sur les images pour differer leur chargement

---

## Auteur

Seifeddine Maachaoui

## Licence

Tous droits reserves - 2026-2027