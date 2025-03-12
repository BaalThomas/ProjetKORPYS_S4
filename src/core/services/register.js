"use-strict"

const email_element = document.getElementById("email");
const mdp_element = document.getElementById("password");
const mdp_confirm_element = document.getElementById("confirm-password");

const error_email_element = document.getElementById("error-email");
const error_mdp_element = document.getElementById("error-mdp");
const error_mdp_confirm_element = document.getElementById("error-mdp-confirm");


document.getElementById("submit-btn").addEventListener("click", function() {
    event.preventDefault();

    bon = true

    if(mdp_element.value !== mdp_confirm_element.value){
        error_mdp_confirm_element.textContent = "Le mot de passe ne correspond pas !";
        bon = false
    }else{
        error_mdp_confirm_element.textContent = "";
    }

    if(mdp_element.value.length < 6){
        error_mdp_element.textContent = "Le mot de passe doit contenir au minimum 6 caractères !";
        bon = false
    }else{
        error_mdp_element.textContent = "";
    }


    if(bon){
        

        fetch("https://devweb.iutmetz.univ-lorraine.fr/~jantzen11u/SAE%20KORPYS/ProjetKORPYS_S4/src/adapters/api/ajout_user.php",{  //ce n'est pas forcement le plus optimal de mettre l'adresse comme cela, mais nous n'avons pas trouver d'autre solution
            method : "POST",
            body : new URLSearchParams({
                email : email_element.value,
                mdp : mdp_element.value
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })

        window.alert("Votre compte a bien été créé");
        window.location.href = "connexion.html";






        console.log(email_element.value, mdp_element.value, mdp_confirm_element.value);
    }else{
        event.preventDefault();
    }


});