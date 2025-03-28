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
                              day.tasks.push(`${tache.nom_tache}: ${tache.description_tache}, ${tache.durée_tache}h`);
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
                ${day.tasks.map((task, taskIndex) => `
                    <li id="task-${weekIndex}-${dayIndex}-${taskIndex}" 
                        class="task-item" 
                        onclick="selectTask(${weekIndex}, ${dayIndex}, ${taskIndex})">
                        ${task}
                    </li>
                `).join('')}
            </ul>
        `;
        calendarGrid.appendChild(dayElement);
    });

    // Mettre à jour les boutons de navigation
    document.getElementById("week-number").innerText = `Semaine ${weekIndex + 1}`;
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

// Initialiser la première semaine
renderWeek(currentWeek);