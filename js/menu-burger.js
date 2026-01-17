'use strict';

/* GESTION DU MENU BURGER */

/* J'ATTENDS QUE TOUTE LA PAGE HTML SE CHARGE AVANT D'ÉXECUTER MON SCRIPT */
document.addEventListener('DOMContentLoaded', () => {

    /* Je sélectionne d'abord les éléments dont j'ai besoin */
    const burgerMenu = document.querySelector('.burger-menu');
    const navBar = document.querySelector('.navbar');

    /* Je vérifie que les éléments existent */
    if (!burgerMenu || !navBar) {
        return;
    }

    /* FONCTION POUR OUVRIR ET FERMER LE MENU BURGER */
    function toggleMenu() {
        burgerMenu.classList.toggle('active');
        navBar.classList.toggle('active');
    }

    /* Je rajoute un écouteur d'évenement pour éxecuter ma fonction au clic */
    burgerMenu.addEventListener('click', toggleMenu);

    /* FONCTION POUR FERMER LE MENU BURGER LORS DU CLIC SUR UN LIEN */
    const navLinks = document.querySelectorAll('.navbar a');

    navLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    /* FERMER LE MENU BURGER AVEC LA TOUCHE ÉCHAP */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navBar.classList.contains('active')) {
            toggleMenu();
        }
    });

});