import { getCookie, setCookie, deleteCookie } from "../services/cookie.js";


const email_element = document.getElementById("email");
const mdp_element = document.getElementById("password");

const error_mdp_element = document.getElementById("error-mdp");
const error_user_element = document.getElementById("error-user");

document.getElementById("submit-btn").addEventListener("click", function(event) {
    event.preventDefault();  // Empêche le comportement par défaut du bouton de soumettre le formulaire
    
    const email_value = email_element.value;
    const mdp_value = mdp_element.value;
    
    // Envoi de la requête fetch pour obtenir l'utilisateur par email
    fetch("https://devweb.iutmetz.univ-lorraine.fr/~jantzen11u/SAE%20KORPYS/ProjetKORPYS_S4/src/adapters/api/get_user_by_mail.php", {
        method: "POST",
        body: new URLSearchParams({
            email: email_value
        })
    })
    .then(response => response.json())  // Transformation de la réponse en JSON
    .then(data => {
        // Une fois la réponse reçue, on peut manipuler `data`
        console.log("Donnée acheminée", data);

        // Vérifier le statut de la réponse
        if (data.status === "success") {
            error_user_element.textContent = "";
            // Utilisateur trouvé
            console.log("Utilisateur trouvé");

            if(mdp_value == data.data.password_hash){

            

            setCookie("id_user",data.data.id_user,1);   //---------------Récup de l'id user dans le cookie pour l'utiliser !

            console.log(getCookie("id_user"));

            window.location.href = "liste_des_projets.html";
            // Tu peux utiliser les données ici (par exemple, pour vérifier le mot de passe)
            }else{
                error_mdp_element.textContent = "Mot de passe incorrect"
            }
        } else {
            // Utilisateur non trouvé
            console.log("Utilisateur non trouvé", data.message);
            error_user_element.textContent = data.message
        }
    })
    .catch(error => {
        console.error("Erreur lors de la requête:", error);
        error_user_element.textContent = "Adresse email introuvable";
    });
});
