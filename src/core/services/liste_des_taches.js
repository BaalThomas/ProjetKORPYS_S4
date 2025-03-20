
function actu_calendrier (id_projet) {
    return 3;
}

export function liste_des_taches_fn (id_projet) {
    window.location.href = "../public/planif_taches.html";
    console.log("id_projet", id_projet);

    fetch("https://devweb.iutmetz.univ-lorraine.fr/~jantzen11u/SAE%20KORPYS/ProjetKORPYS_S4/src/adapters/api/get_projet_by_user.php", {
        method: "POST",
        body: new URLSearchParams({
          id_projet: id_projet
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log("Donnée acheminée", data);
        if (data.status === "success") {
          
            //------------------------------ changer tout les hmtl nananinanana



    
        } else {
          console.log("Projet non trouvé", data.message);
        }
      })
      .catch(error => {
        console.error("Erreur lors de la requête:", error);
      });
    


    actu_calendrier(id_projet);
}

