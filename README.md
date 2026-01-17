# BookFinder

BookFinder est un explorateur de livres connecte a l'API Open Library. Cette application permet de rechercher, decouvrir et sauvegarder des livres dans une wishlist personnelle.

## Fonctionnalites

- Recherche de livres en temps reel
- Affichage des couvertures, descriptions, auteurs
- Informations detaillees (ISBN, annee, editeur, nombre de pages)
- Ajout a une wishlist avec persistance localStorage
- Filtres par langue et annee de publication
- Carrousels par periode de sortie et par genre

## Technologies

- HTML5
- CSS3 (mobile-first)
- JavaScript ES6+ (architecture MVC)
- API Open Library

## Structure du projet

```
book-finder/
├── index.html
├── catalog.html
├── wishlist.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── menu-burger.js
│   ├── wishlist-page.js
│   ├── controllers/
│   │   └── BookController.js
│   ├── models/
│   │   ├── BookModel.js
│   │   └── WishlistModel.js
│   ├── views/
│   │   ├── BookView.js
│   │   └── ModalView.js
│   └── utils/
│       └── helpers.js
└── img/
    └── logo.png
```

## Installation

1. Telecharger ou cloner le projet
2. Lancer un serveur local sur le dossier
3. Ouvrir index.html dans le navigateur

## API

- Service : Open Library API (gratuite, sans cle)
- Documentation : https://openlibrary.org/dev/docs/api/books

## Documentation

La documentation technique complete est disponible dans le fichier DOCUMENTATION.md

## Auteur

Seifeddine Maachaoui

## Licence

Tous droits reserves - 2026-2027