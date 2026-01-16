'use strict';

/* GESTION DU MENU BURGER */

// Je sélectionne d'abord les éléments dont j'ai besoin
const burgerMenu = document.querySelector('.burger-menu');
const navBar = document.querySelector('.navbar');

/* FONCTION POUR OUVRIR ET FERMER LE MENU BURGER */
function toggleMenu(){
    burgerMenu.classList.toggle('active');
    navBar.classList.toggle('active');

    // Si je souhaite aussi pouvoir bloquer et débloquer le scroll lors que le menu est ouvert
    /*
        if(navBar.classList.contains('active')){
            document.body.style.overflow='hidden';
        }else{
            document.body.style.overflow = 'auto';
        }
    */
}

/* Je rajoute un écouteur d'évenement pour éxecuter ma fonction au clic */
burgerMenu.addEventListener('click', toggleMenu);

/* FONCTION POUR FERMER LE MENU BURGER LORS DU CLIC SUR UN LIEN */

// Je commence par sélectionner les liens du ma navbar 
const navLinks = document.querySelectorAll('.navbar a');

// Pour chaque lien, j'ajoute un écouteur d'évenement
navLinks.forEach(link =>{
    link.addEventListener('click', toggleMenu);
});

/* FERMER LE MENU BURGER AVEC LA TOUCHE ÉCHAP */
document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape' && navBar.classList.contains('active')){
        toggleMenu();
        console.log("Fermeture avec La touche " + e.key);
    }
});


