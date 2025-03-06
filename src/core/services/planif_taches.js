let currentWeek = 0; // Semaine actuelle (0 = Semaine courante)
        let selectedTask = null; // Variable pour la tâche sélectionnée
        const projectName = "Projet Test Généré"; // Nom du projet

        // Les tâches des semaines (exemple simplifié)
        const tasksForWeeks = [
            [
                { day: "Lundi", tasks: ["Tâche 1: Description, 3h", "Tâche 2: Description, 2h"] },
                { day: "Mardi", tasks: ["Tâche 3: Description, 1h"] },
                { day: "Mercredi", tasks: ["Tâche 4: Description, 4h"] },
                { day: "Jeudi", tasks: ["Tâche 5: Description, 2h"] },
                { day: "Vendredi", tasks: ["Tâche 6: Description, 3h"] },
                { day: "Samedi", tasks: ["Tâche 7: Description, 1h"] },
                { day: "Dimanche", tasks: ["Tâche 8: Description, 2h"] }
            ],
            // Semaine suivante (exemple modifié)
            [
                { day: "Lundi", tasks: ["Tâche 9: Description, 2h"] },
                { day: "Mardi", tasks: ["Tâche 10: Description, 1h"] },
                { day: "Mercredi", tasks: ["Tâche 11: Description, 3h"] },
                { day: "Jeudi", tasks: ["Tâche 12: Description, 1h"] },
                { day: "Vendredi", tasks: ["Tâche 13: Description, 4h"] },
                { day: "Samedi", tasks: ["Tâche 14: Description, 2h"] },
                { day: "Dimanche", tasks: ["Tâche 15: Description, 3h"] }
            ]
        ];

        // Fonction pour changer de semaine
        function changeWeek(direction) {
            if(currentWeek+direction >= 0 && currentWeek+direction < tasksForWeeks.length){
                currentWeek += direction;
                renderWeek(currentWeek);
            }

        }

        // Fonction pour afficher les tâches de la semaine
        function renderWeek(weekIndex) {
            const calendarGrid = document.getElementById("calendar-grid");
            calendarGrid.innerHTML = ""; // Efface la grille actuelle

            // Assurer que la semaine ne dépasse pas les limites
            if (weekIndex < 0) {
                currentWeek = 0;
                return;
            }
            if (weekIndex >= tasksForWeeks.length) {
                currentWeek = tasksForWeeks.length - 1;
                return;
            }

            const weekTasks = tasksForWeeks[weekIndex];

            // Crée la grille pour la semaine
            weekTasks.forEach((day, dayIndex) => {
                const dayElement = document.createElement("div");
                dayElement.classList.add("calendar-day");
                dayElement.innerHTML = `
                    <h3>${day.day}</h3>
                    <ul>
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
        }

        // Fonction pour sélectionner une tâche
        function selectTask(weekIndex, dayIndex, taskIndex) {
            // Désélectionner la tâche précédente
            if (selectedTask !== null) {
                const previousTaskElement = document.getElementById(selectedTask);
                previousTaskElement.classList.remove("selected");
            }

            // Sélectionner la nouvelle tâche
            selectedTask = `task-${weekIndex}-${dayIndex}-${taskIndex}`;
            const taskElement = document.getElementById(selectedTask);
            taskElement.classList.add("selected");
        }

        // Fonction pour modifier la tâche sélectionnée
        function editSelectedTask() {
            if (selectedTask === null) {
                alert("Veuillez sélectionner une tâche à modifier.");
                return;
            }

            const [weekIndex, dayIndex, taskIndex] = selectedTask.split('-').slice(1).map(Number);
            const task = tasksForWeeks[weekIndex][dayIndex].tasks[taskIndex];
            const newTaskDescription = prompt("Modifier la tâche:", task);

            if (newTaskDescription) {
                tasksForWeeks[weekIndex][dayIndex].tasks[taskIndex] = newTaskDescription;
                renderWeek(currentWeek);
            }
        }

        // Fonction pour supprimer la tâche sélectionnée
        function deleteSelectedTask() {
            if (selectedTask === null) {
                alert("Veuillez sélectionner une tâche à supprimer.");
                return;
            }

            const [weekIndex, dayIndex, taskIndex] = selectedTask.split('-').slice(1).map(Number);

            // Supprimer la tâche de la liste
            tasksForWeeks[weekIndex][dayIndex].tasks.splice(taskIndex, 1);

            // Réinitialiser la tâche sélectionnée
            selectedTask = null;

            // Réafficher la semaine après suppression
            renderWeek(currentWeek);
        }

        // Fonction pour afficher/masquer le formulaire de création de tâche
        function toggleTaskForm() {
            const taskForm = document.getElementById("task-form");
            taskForm.style.display = taskForm.style.display === "none" ? "block" : "none";
        }

        // Fonction pour ajouter une nouvelle tâche
        function addTask() {
            const day = document.getElementById("task-day").value;
            const description = document.getElementById("task-description").value;
            const duration = document.getElementById("task-duration").value;

            if (!description || !duration) {
                alert("Veuillez remplir tous les champs.");
                return;
            }

            // Ajouter la tâche à la semaine actuelle
            const task = `${description}, ${duration}h`;

            const dayIndex = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].indexOf(day);
            tasksForWeeks[currentWeek][dayIndex].tasks.push(task);

            // Réafficher la semaine avec la nouvelle tâche
            renderWeek(currentWeek);

            // Fermer le formulaire après ajout
            toggleTaskForm();
        }

        // Initialiser la première semaine
        renderWeek(currentWeek);
        
        // Mettre à jour le nom du projet
        document.getElementById('project-name').innerText = projectName;