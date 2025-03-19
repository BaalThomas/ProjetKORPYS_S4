// Fonction pour afficher les détails du projet
function chargerProjets() {
  
  console.log("Chargement des projets...");

  fetch("https://devweb.iutmetz.univ-lorraine.fr/~jantzen11u/SAE%20KORPYS/ProjetKORPYS_S4/src/adapters/api/get_projet_by_user.php"), {
    method: "POST",
    body: new URLSearchParams({
      id_user: localStorage.getItem("user_id")
    }).then(response => response.json())
    .then(data => {
      console.log("Donnée acheminée", data);
      if (data.status === "success") {
        console.log("Projet trouvé");
        window.location.href = "liste_des_projets.html";

        
        data.projects.forEach(project => {
          const projectElement = document.createElement("div");
          const titreProjetElement = document.createElement("h3");
          const statusProjetElement = document.createElement("p");
          const statusSpanElement = document.createElement("span");
          const descriptionProjetElement = document.createElement("p");
          const bouttonViewElement = document.createElement("button");
          const bouttonDeleteElement = document.createElement("button");

          titreProjetElement.textContent = project.name;
          statusSpanElement.textContent = project.status;

          descriptionProjetElement.textContent = project.description;

          bouttonViewElement.textContent = "Voir le Projet";
          bouttonDeleteElement.textContent = "Supprimer le Projet";

          bouttonViewElement.onclick = function() {
            alert("Voir le projet '" + project.name + "'");
            // Ici vous ajouteriez la logique pour afficher les détails du projet
            // Vous pouvez rediriger l'utilisateur vers une autre page ou afficher un modal
          }

          bouttonDeleteElement.onclick = function() {
            deleteProject(project.name);
          }

          statusProjetElement.textContent = "Statut: ";

          statusProjetElement.appendChild(statusSpanElement);
          projectElement.appendChild(titreProjetElement);
          projectElement.appendChild(statusProjetElement);
          projectElement.appendChild(descriptionProjetElement);
          projectElement.appendChild(bouttonViewElement);
          projectElement.appendChild(bouttonDeleteElement);

          projectElement.textContent = project.name;
          projectElement.classList.add("project-item");
          document.getElementById("project-items").appendChild(projectElement);
        });

      } else {
        console.log("Projet non trouvé", data.message);
      }
    })
    .catch(error => {
      console.error("Erreur lors de la requête:", error);
    })
  }
}

// Fonction pour supprimer un projet
function deleteProject(projectName) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
    alert("Le projet '" + projectName + "' a été supprimé.");
    // Ici vous ajouteriez la logique pour supprimer un projet dans votre base de données
    // Vous pouvez rafraîchir la page ou mettre à jour dynamiquement la liste des projets
  }
}

chargerProjets();
