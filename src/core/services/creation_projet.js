document.getElementById('project-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche la soumission du formulaire

    const projectName = document.getElementById('project-name').value;
    const projectDescription = document.getElementById('project-description').value;
    const projectDeadline = document.getElementById('project-deadline').value;

    // Validation des champs
    if (!projectName || !projectDescription || !projectDeadline) {
        displayMessage("Veuillez remplir tous les champs.", "error");
        return;
    }

    // Simulation de l'ajout du projet (peut être connecté à une base de données ou une API)
    displayMessage(`Le projet "${projectName}" a été créé avec succès !`, "success");

    // Réinitialisation du formulaire
    document.getElementById('project-form').reset();
});

// Fonction pour afficher un message (succès ou erreur)
function displayMessage(message, type) {
    const messageBox = document.getElementById('message');
    messageBox.textContent = message;
    messageBox.className = type === 'success' ? 'message-success' : 'message-error';
}
