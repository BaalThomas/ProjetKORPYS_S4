

const nom_element = document.getElementById("project-name");
const description_element = document.getElementById("project-description");
const date_element = document.getElementById("project-deadline");

function formatDate(date) {
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
}

//--------------------- il faut reformater la date(y-m-d) et faire les erreurs !


// const error_email_element = document.getElementById("error-email");
// const error_mdp_element = document.getElementById("error-mdp");
// const error_mdp_confirm_element = document.getElementById("error-mdp-confirm");


document.getElementById("submit-project").addEventListener("click", function() {
    event.preventDefault();

    bon = true

    // if(mdp_element.value !== mdp_confirm_element.value){
    //     error_mdp_confirm_element.textContent = "Le mot de passe ne correspond pas !";
    //     bon = false
    // }else{
    //     error_mdp_confirm_element.textContent = "";
    // }

    // if(mdp_element.value.length < 6){
    //     error_mdp_element.textContent = "Le mot de passe doit contenir au minimum 6 caractères !";
    //     bon = false
    // }else{
    //     error_mdp_element.textContent = "";
    // }


    if(bon){

        //-----------------------------------------------------------------------------erreur 404, trouve pas le php
        

        fetch("https://devweb.iutmetz.univ-lorraine.fr/~jantzen11u/SAE%20KORPYS/ProjetKORPYS_S4/src/adapters/api/ajout_projet.php",{  //ce n'est pas forcement le plus optimal de mettre l'adresse comme cela, mais nous n'avons pas trouver d'autre solution
            method : "POST",
            body : new URLSearchParams({
                id_user : sessionStorage.getItem("id_user"),
                nom_projet : nom_element.value,
                description_projet : description_element.value,
                date_fin : formatDate(date_element.value)
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Donnée acheminée");
        })

        window.alert("Votre projet a bien été créé");
        window.location.href = "connexion.html";


        console.log(email_element.value, mdp_element.value, mdp_confirm_element.value);
    }else{
        event.preventDefault();
    }


});