function chargerProjets() {
  console.log("Chargement des projets...");

  document.getElementById("project-items").innerHTML = "<p>Aucun projet</p>";

  fetch("https://devweb.iutmetz.univ-lorraine.fr/~jantzen11u/SAE%20KORPYS/ProjetKORPYS_S4/src/adapters/api/get_projet_by_user.php", {
    method: "POST",
    body: new URLSearchParams({
      id_user: localStorage.getItem("user_id")
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Donnée acheminée", data);
    if (data.status === "success") {
      console.log("Projet trouvé");
      document.getElementById("project-items").innerHTML = ""; 

      console.log(data.data.length);

      for(let i = 0; i < data.data.length; i++){
        const project = data.data[i];
        const projectElement = document.createElement("div");
        const titreProjetElement = document.createElement("h3");
        const statusProjetElement = document.createElement("p");
        const statusSpanElement = document.createElement("span");
        const descriptionProjetElement = document.createElement("p");
        const dateProjetElement = document.createElement("p");
        const bouttonViewElement = document.createElement("button");
        const bouttonDeleteElement = document.createElement("button");


        statusSpanElement.classList.add("status");
        descriptionProjetElement.classList.add("description");
        bouttonViewElement.classList.add("btn-view");
        bouttonDeleteElement.classList.add("btn-delete");


        titreProjetElement.textContent = project.nom_projet;
        statusSpanElement.textContent = project.status_projet;
        descriptionProjetElement.textContent = project.description_projet;
        dateProjetElement.textContent = project.date_debut + " - " + project.date_max;

        bouttonViewElement.textContent = "Voir le Projet";
        bouttonDeleteElement.textContent = "Supprimer le Projet";

        bouttonViewElement.onclick = function() {
          alert("Voir le projet '" + project.nom_projet + "'");
          // Ici vous ajouteriez la logique pour afficher les détails du projet
          // Vous pouvez rediriger l'utilisateur vers une autre page ou afficher un modal
        }

        bouttonDeleteElement.onclick = function() {
          deleteProject(project.id_projet);
        }

        statusProjetElement.textContent = "Statut: ";


        statusProjetElement.appendChild(statusSpanElement);
        projectElement.appendChild(titreProjetElement);
        projectElement.appendChild(statusProjetElement);
        projectElement.appendChild(descriptionProjetElement);
        projectElement.appendChild(dateProjetElement);
        projectElement.appendChild(bouttonViewElement);
        projectElement.appendChild(bouttonDeleteElement);

        projectElement.classList.add("project-item");
        document.getElementById("project-items").appendChild(projectElement);

      }

    } else {
      console.log("Projet non trouvé", data.message);
    }
  })
  .catch(error => {
    console.error("Erreur lors de la requête:", error);
  });
}

// Fonction pour supprimer un projet
function deleteProject(idProjet) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
    alert("Le projet a été supprimé.");
    fetch("https://devweb.iutmetz.univ-lorraine.fr/~jantzen11u/SAE%20KORPYS/ProjetKORPYS_S4/src/adapters/api/delete_projet.php", {
      method: "POST",
      body: new URLSearchParams({
        id_projet: idProjet
      })
    })

    
  }
  chargerProjets();
}

chargerProjets();