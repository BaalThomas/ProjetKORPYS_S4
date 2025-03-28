import { getCookie, setCookie, deleteCookie } from "../services/cookie.js";

const nom_element = document.getElementById("project-name");
const description_element = document.getElementById("project-description");
const date_element = document.getElementById("project-deadline");


document.getElementById("submit-project").addEventListener("click", function(event) {
    event.preventDefault();

    let bon = true;

    if(bon){
        const id_user = getCookie("id_user");

        if (!id_user) {
            console.error("id_user is null");
            return;
        }

        fetch("https://devweb.iutmetz.univ-lorraine.fr/~jantzen11u/SAE%20KORPYS/ProjetKORPYS_S4/src/adapters/api/ajout_projet.php", {
            method: "POST",
            body: new URLSearchParams({
                id_user: id_user,
                nom_projet: nom_element.value,
                description_projet: description_element.value,
                date_max: date_element.value
            })
        })
        .then(response => response.json())
        .then(data => {
            

            if (data.status === "success") {
                console.log("Donnée acheminée");
                window.alert("Votre projet a bien été créé");
                window.location.href = "liste_des_projets.html";
            }
            else {
                window.alert(data.message);
                console.error("Erreur lors de l'ajout du projet", data.message);
            }
        }).catch(error => {
            console.error("Erreur lors de la requête:", error);
        });

        
    } else {
        event.preventDefault();
    }
});