// Fonction pour afficher les détails du projet
function viewProject(projectName) {
  alert("Voir les détails de: " + projectName);
  // Vous pouvez ici rediriger l'utilisateur vers la page de détail du projet
  // window.location.href = 'project-details.html';
}

// Fonction pour supprimer un projet
function deleteProject(projectName) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
    alert("Le projet '" + projectName + "' a été supprimé.");
    // Ici vous ajouteriez la logique pour supprimer un projet dans votre base de données
    // Vous pouvez rafraîchir la page ou mettre à jour dynamiquement la liste des projets
  }
}
