import { getCookie } from "./cookie.js";

function ajouterJours(date, jours) {
    const nouvelleDate = new Date(date);
    nouvelleDate.setDate(nouvelleDate.getDate() + jours);
    return nouvelleDate;
}

let currentWeek = 0; // Semaine actuelle
let selectedTask = null; // Tâche sélectionnée
let dateDebut, dateFin;
let tasksForWeeks = []; // Structure des semaines

// Récupérer les informations du projet
fetch("https://devweb.iutmetz.univ-lorraine.fr/~jantzen11u/SAE%20KORPYS/ProjetKORPYS_S4/src/adapters/api/get_projet_by_id.php", {
    method: "POST",
    body: new URLSearchParams({
        id_projet: getCookie("id_projet")
    })
}).then(response => response.json())
  .then(data => {
      if (data.status === "success") {
          console.log("Projet trouvé");
          document.getElementById("project-name").innerText = data.data[0].nom_projet;
          dateDebut = new Date(data.data[0].date_debut);
          dateFin = new Date(data.data[0].date_max);

          // Générer les semaines
          genererSemaines();

          // Charger les tâches depuis la base de données
          chargerTaches();
      } else {
          console.log("Projet non trouvé", data.message);
      }
  });

// Générer les semaines entre dateDebut et dateFin
function genererSemaines() {
    const startOfWeek = new Date(dateDebut);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Aller au lundi de la première semaine

    const endOfWeek = new Date(dateFin);
    endOfWeek.setDate(endOfWeek.getDate() - endOfWeek.getDay() + 7); // Aller au dimanche de la dernière semaine

    let currentDate = new Date(startOfWeek);

    while (currentDate <= endOfWeek) {
        const week = [
            { day: "Lundi", date: new Date(currentDate), tasks: [] },
            { day: "Mardi", date: ajouterJours(currentDate, 1), tasks: [] },
            { day: "Mercredi", date: ajouterJours(currentDate, 2), tasks: [] },
            { day: "Jeudi", date: ajouterJours(currentDate, 3), tasks: [] },
            { day: "Vendredi", date: ajouterJours(currentDate, 4), tasks: [] },
            { day: "Samedi", date: ajouterJours(currentDate, 5), tasks: [] },
            { day: "Dimanche", date: ajouterJours(currentDate, 6), tasks: [] }
        ];
        tasksForWeeks.push(week);
        currentDate = ajouterJours(currentDate, 7); // Passer à la semaine suivante
    }

    console.log("Semaines générées :", tasksForWeeks);
}

// Charger les tâches depuis la base de données
function chargerTaches() {
    fetch("https://devweb.iutmetz.univ-lorraine.fr/~jantzen11u/SAE%20KORPYS/ProjetKORPYS_S4/src/adapters/api/get_tache_by_projet.php", {
        method: "POST",
        body: new URLSearchParams({
            id_projet: getCookie("id_projet")
        })
    }).then(response => response.json())
      .then(data => {
          if (data.status === "success") {
              console.log("Tâches trouvées :", data.data);

              // Répartir les tâches dans `tasksForWeeks`
              data.data.forEach(tache => {
                  const dateTache = new Date(tache.date_tache);
                  tasksForWeeks.forEach(week => {
                      week.forEach(day => {
                          if (day.date.toDateString() === dateTache.toDateString()) {
                              // Ajouter la tâche avec son ID dans la structure
                              day.tasks.push({
                                  id: tache.id_tache, // Inclure l'ID de la tâche
                                  name: tache.nom_tache,
                                  description: tache.description_tache,
                                  duration: tache.duree_tache,
                                  date: dateTache // Ajouter la date de la tâche
                              });
                          }
                      });
                  });
              });

              console.log("Tâches organisées par semaine :", tasksForWeeks);

              // Afficher la première semaine
              renderWeek(currentWeek);
          } else {
              console.log("Aucune tâche trouvée", data.message);
          }
      });
}

// Fonction pour afficher une semaine
function renderWeek(weekIndex) {
    const calendarGrid = document.getElementById("calendar-grid");
    calendarGrid.innerHTML = ""; // Efface la grille actuelle

    const weekTasks = tasksForWeeks[weekIndex];

    // Crée la grille pour la semaine
    weekTasks.forEach((day, dayIndex) => {
        const dayElement = document.createElement("div");
        dayElement.classList.add("calendar-day");

        const formattedDate = day.date.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        dayElement.innerHTML = `
            <h3>${formattedDate}</h3>
            <ul class="task-list">
                ${day.tasks.map((task, taskIndex) => {
                    return `
                        <li id="task-${weekIndex}-${dayIndex}-${taskIndex}" 
                            class="task-item" 
                            onclick="selectTask(${weekIndex}, ${dayIndex}, ${taskIndex})">
                            <div class="task-name">${task.name}</div>
                            <div class="task-description">${task.description}</div>
                            <div class="task-duration">${task.duration}h</div>
                        </li>
                    `;
                }).join('')}
            </ul>
        `;
        calendarGrid.appendChild(dayElement);
    });

    // Mettre à jour les boutons de navigation
    document.getElementById("week-number").innerText = `Semaine ${weekIndex + 1}`;

    // Vérifier la surcharge de travail
    checkWorkload();
}

// Fonction pour changer de semaine
function changeWeek(direction) {
    if (currentWeek + direction >= 0 && currentWeek + direction < tasksForWeeks.length) {
        currentWeek += direction;
        renderWeek(currentWeek);
    }
}

// Ajouter les boutons de navigation
document.getElementById("prev-week").addEventListener("click", () => changeWeek(-1));
document.getElementById("next-week").addEventListener("click", () => changeWeek(1));

// Fonction pour ajouter une tâche
function addTask() {
    // Récupérer les valeurs du formulaire
    const taskName = document.getElementById("task-name").value;
    const taskDate = document.getElementById("task-date").value;
    const taskDescription = document.getElementById("task-description").value;
    const taskDuration = document.getElementById("task-duration").value;

    console.log(taskName, taskDate, taskDescription, taskDuration);

    // Vérifier que tous les champs sont remplis
    if (!taskName || !taskDate || !taskDescription) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    if(!taskDuration.match(/^\d+(\.\d+)?$/)){
        alert("La durée de la tâche doit être un nombre positif.");
        return;
    }

    if(taskDuration < 0 || taskDuration > 8){
        alert("La durée de la tâche doit être comprise entre 0 et 8 heures.");
        return;
    }

    // Vérifier que la date de la tâche est dans l'étendue du projet
    const taskDateObj = new Date(taskDate);
    if (taskDateObj < dateDebut || taskDateObj > dateFin) {
        alert("La date de la tâche doit être comprise entre le début et la fin du projet.");
        return;
    }

    // Préparer les données pour l'API
    const taskData = {
        id_tache: Math.floor(Math.random() * 1000000), // Générer un ID aléatoire
        id_projet: getCookie("id_projet"),
        date_tache: taskDate, // Date de la tâche
        nom_tache: taskName, // Nom de la tâche
        description_tache: taskDescription,
        duree_tache: taskDuration
    };

    // Envoyer une requête POST à l'API
    fetch("https://devweb.iutmetz.univ-lorraine.fr/~jantzen11u/SAE%20KORPYS/ProjetKORPYS_S4/src/adapters/api/ajout_tache.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(taskData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert("Tâche ajoutée avec succès !");
            // Ajouter la tâche à la structure `tasksForWeeks`
            tasksForWeeks.forEach(week => {
                week.forEach(day => {
                    if (day.date.toDateString() === taskDateObj.toDateString()) {
                        day.tasks.push({
                            id: taskData.id_tache,
                            name: taskName,
                            description: taskDescription,
                            duration: taskDuration
                        });
                    }
                });
            });
            // Réafficher la semaine actuelle
            renderWeek(currentWeek);
            console.log(data.message);
        } else {
            alert("Erreur lors de l'ajout de la tâche : " + data.message);
        }
    })
    .catch(error => {
        console.error("Erreur lors de la requête :", error);
        alert("Une erreur est survenue lors de l'ajout de la tâche.");
    });
}

document.getElementById("ajouterTache").addEventListener("click", function() {
    document.getElementById("task-form").style.display = "block";
}
);

document.getElementById("annulerAjoutTache").addEventListener("click", function() {
    document.getElementById("task-form").style.display = "none";
}
);

document.getElementById("confirmerAjoutTache").addEventListener("click", function() {
    addTask();
    document.getElementById("task-name").value = "";
    document.getElementById("task-date").value = "";
    document.getElementById("task-description").value = "";
    document.getElementById("task-duration").value = "";
}
);

document.getElementById("supprimerTache").addEventListener("click", function() {
    deleteTask();
});

document.getElementById("modifierTache").addEventListener("click", function() {
    editTask();
});

// Fonction pour supprimer une tâche
function deleteTask() {
    // Vérifier qu'une tâche est sélectionnée
    if (!selectedTask) {
        alert("Veuillez sélectionner une tâche à supprimer.");
        return;
    }

    // Récupérer l'ID de la tâche à supprimer
    const taskId = selectedTask.taskId;
    console.log("ID de la tâche à supprimer :", taskId); // Debug

    // Envoyer une requête POST à l'API pour supprimer la tâche
    fetch("https://devweb.iutmetz.univ-lorraine.fr/~jantzen11u/SAE%20KORPYS/ProjetKORPYS_S4/src/adapters/api/del_tache.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            id_tache: taskId
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Réponse de l'API :", data); // Debug
        if (data.status === "success") {
            // Supprimer la tâche de la structure `tasksForWeeks`
            const { weekIndex, dayIndex, taskIndex } = selectedTask;
            tasksForWeeks[weekIndex][dayIndex].tasks.splice(taskIndex, 1);

            // Réinitialiser la sélection
            selectedTask = null;

            // Réafficher la semaine actuelle
            renderWeek(currentWeek);

            alert("Tâche supprimée avec succès !");
        } else {
            alert("Erreur lors de la suppression de la tâche : " + data.message);
        }
    })
    .catch(error => {
        console.error("Erreur lors de la requête :", error);
        alert("Une erreur est survenue lors de la suppression de la tâche.");
    });
}

// Fonction pour modifier une tâche
function editTask() {
    // Vérifier qu'une tâche est sélectionnée
    if (!selectedTask) {
        alert("Veuillez sélectionner une tâche à modifier.");
        return;
    }

    // Afficher le formulaire de modification
    const editTaskForm = document.getElementById("edit-task-form");
    editTaskForm.style.display = "block";

    console.log("Tâche sélectionnée :", selectedTask); // Debug

    // Pré-remplir les champs du formulaire avec les informations de la tâche sélectionnée
    document.getElementById("edit-task-name").value = selectedTask.name;
    document.getElementById("edit-task-date").value = new Date(selectedTask.date).toISOString().split("T")[0]; // Format YYYY-MM-DD
    document.getElementById("edit-task-description").value = selectedTask.description;
    document.getElementById("edit-task-duration").value = selectedTask.duration;

    // Ajouter un gestionnaire pour confirmer la modification
    document.getElementById("confirmerModificationTache").onclick = function () {
        updateTask(); // Appeler la fonction pour mettre à jour la tâche
        
    };

    // Ajouter un gestionnaire pour annuler la modification
    document.getElementById("annulerModificationTache").onclick = function () {
        editTaskForm.style.display = "none"; // Masquer le formulaire
    };
}

// Fonction pour mettre à jour une tâche
function updateTask() {
    // Récupérer les nouvelles valeurs du formulaire
    const taskName = document.getElementById("edit-task-name").value;
    const taskDate = document.getElementById("edit-task-date").value;
    const taskDescription = document.getElementById("edit-task-description").value;
    const taskDuration = document.getElementById("edit-task-duration").value;

    // Vérifier que tous les champs sont remplis
    if (!taskName || !taskDate || !taskDescription) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    if (!taskDuration.match(/^\d+(\.\d+)?$/)) {
        alert("La durée de la tâche doit être un nombre positif.");
        return;
    }

    if (taskDuration < 0 || taskDuration > 8) {
        alert("La durée de la tâche doit être comprise entre 0 et 8 heures.");
        return;
    }

    // Préparer les données pour l'API
    const taskData = {
        id_tache: selectedTask.taskId, // ID de la tâche à modifier
        id_projet: getCookie("id_projet"),
        date_tache: taskDate, // Nouvelle date de la tâche
        nom_tache: taskName, // Nouveau nom de la tâche
        description_tache: taskDescription, // Nouvelle description
        duree_tache: taskDuration // Nouvelle durée
    };

    // Envoyer une requête POST à l'API pour modifier la tâche
    fetch("https://devweb.iutmetz.univ-lorraine.fr/~jantzen11u/SAE%20KORPYS/ProjetKORPYS_S4/src/adapters/api/edit_tache.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(taskData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Réponse de l'API :", data); // Debug
        if (data.status === "success") {
            const { weekIndex, dayIndex, taskIndex } = selectedTask;

            // Supprimer la tâche de son emplacement actuel
            const task = tasksForWeeks[weekIndex][dayIndex].tasks.splice(taskIndex, 1)[0];

            // Mettre à jour les informations de la tâche
            task.name = taskName;
            task.description = taskDescription;
            task.duration = taskDuration;
            task.date = new Date(taskDate);

            // Trouver la nouvelle semaine et le nouveau jour pour la tâche
            const newDate = new Date(taskDate);
            let newWeekIndex = -1;
            let newDayIndex = -1;

            tasksForWeeks.forEach((week, wIndex) => {
                week.forEach((day, dIndex) => {
                    if (day.date.toDateString() === newDate.toDateString()) {
                        newWeekIndex = wIndex;
                        newDayIndex = dIndex;
                    }
                });
            });

            if (newWeekIndex !== -1 && newDayIndex !== -1) {
                // Ajouter la tâche au nouvel emplacement
                tasksForWeeks[newWeekIndex][newDayIndex].tasks.push(task);
            }

            // Réinitialiser la sélection
            selectedTask = null;

            // Réafficher la semaine actuelle
            renderWeek(currentWeek);

            // Réinitialiser le formulaire et masquer l'interface
            document.getElementById("edit-task-form").style.display = "none";

            alert("Tâche modifiée avec succès !");
        } else {
            alert("Erreur lors de la modification de la tâche : " + data.message);
        }
    })
    .catch(error => {
        console.error("Erreur lors de la requête :", error);
        alert("Une erreur est survenue lors de la modification de la tâche.");
    });
}

// Fonction pour sélectionner une tâche
export function selectTask(weekIndex, dayIndex, taskIndex) {
    // Réinitialiser la sélection précédente
    if (selectedTask) {
        const previousSelectedTask = document.getElementById(selectedTask.id);
        if (previousSelectedTask) {
            previousSelectedTask.classList.remove("selected-task");
        }
    }

    // Identifier la tâche sélectionnée
    const taskElement = document.getElementById(`task-${weekIndex}-${dayIndex}-${taskIndex}`);
    if (taskElement) {
        taskElement.classList.add("selected-task");
    }

    // Récupérer la tâche sélectionnée
    const task = tasksForWeeks[weekIndex][dayIndex].tasks[taskIndex];
    const taskDate = tasksForWeeks[weekIndex][dayIndex].date; // Récupérer la date du jour

    // Stocker les informations de la tâche sélectionnée
    selectedTask = {
        id: `task-${weekIndex}-${dayIndex}-${taskIndex}`,
        weekIndex: weekIndex,
        dayIndex: dayIndex,
        taskIndex: taskIndex,
        taskId: task.id, // Inclure l'ID de la tâche
        name: task.name,
        description: task.description,
        duration: task.duration,
        date: taskDate // Ajouter la date de la tâche
    };

    console.log("Tâche sélectionnée :", selectedTask);
}

// Fonction pour vérifier la surcharge de travail
function checkWorkload() {
    fetch("https://devweb.iutmetz.univ-lorraine.fr/~jantzen11u/SAE%20KORPYS/ProjetKORPYS_S4/src/adapters/api/get_hours_per_day.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            id_projet: getCookie("id_projet")
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            const workloadData = data.data;

            // Parcourir les jours et ajouter une annotation si nécessaire
            workloadData.forEach(day => {
                const dayElement = Array.from(document.querySelectorAll(".calendar-day")).find(el => {
                    const dateText = new Date(day.jour).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    });
                    return el.querySelector("h3").innerText === dateText;
                });

                if (dayElement && day.total_heures > 8) {
                    const annotation = document.createElement("div");
                    annotation.classList.add("workload-warning");
                    annotation.style.color = "red";
                    annotation.innerText = "Attention à la surcharge de travail !";
                    dayElement.appendChild(annotation);
                }
            });
        } else {
            console.error("Erreur lors de la récupération des heures :", data.message);
        }
    })
    .catch(error => {
        console.error("Erreur lors de la requête :", error);
    });
}

// Attacher la fonction à l'objet global `window`
window.selectTask = selectTask;

// Initialiser la première semaine
renderWeek(currentWeek);