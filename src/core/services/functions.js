import { getCookie } from "../services/cookie.js";
import { deleteCookie } from "./cookie.js";

function imprimerMenu() {
    console.log(getCookie("id_user"));

    // Définir le contenu de base du menu
    let menuHTML = `
        <h1>Gestion de Tâches</h1>
        <nav>
            <ul class="navbar">
                <li><a href="index.html">Accueil</a></li>
                <li><a href="creation_projet.html">Créer un Projet</a></li>
                <li><a href="liste_des_projets.html">Liste des Projets</a></li>
    `;

    // Ajouter un lien en fonction de la présence du cookie "id_user"
    if (getCookie("id_user")) {
        menuHTML += `
                <li><a href="index.html" id="deconnexion">Se déconnecter</a></li>
        `;
    } else {
        menuHTML += `
                <li><a href="connexion.html">Se connecter</a></li>
        `;
    }

    // Fermer la liste et le menu
    menuHTML += `
            </ul>
        </nav>
    `;

    // Injecter le contenu HTML dans l'élément avec l'ID "menu"
    document.getElementById("menu").innerHTML = menuHTML;

    return 0;
}

imprimerMenu();
document.getElementById("deconnexion").addEventListener("click", function() {
    deleteCookie("id_user");
    window.location.href = "index.html";
});
    