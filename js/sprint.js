let currentSprintTasks = [];
const sprintTasks = [
    { id: 1, name: "Task 1", status: "In Progress", storyPoints: 5 },
    { id: 2, name: "Task 2", status: "In Progress", storyPoints: 3 },
    { id: 3, name: "Task 3", status: "Completed", storyPoints: 8 },
    { id: 4, name: "Task 4", status: "Completed", storyPoints: 13 },
    { id: 5, name: "Task 5", status: "Not Started", storyPoints: 2 },
    { id: 6, name: "Task 6", status: "Not Started", storyPoints: 5 }
];

localStorage.setItem('sprintTasks', JSON.stringify(sprintTasks));

function loadSprintTasksFromStorage() {
    const storedSprintTasks = localStorage.getItem('sprintTasks');
    if (storedSprintTasks) {
        currentSprintTasks = JSON.parse(storedSprintTasks);
    } else {

        currentSprintTasks = sprintTasks;
        saveSprintTasksToStorage();
    }
}

function saveSprintTasksToStorage() {
    localStorage.setItem('sprintTasks', JSON.stringify(currentSprintTasks));
}

function categorizeSprintTasks() {
    const activeTasks = currentSprintTasks.filter(task => task.status === 'In Progress');
    const completedTasks = currentSprintTasks.filter(task => task.status === 'Completed');
    const pendingTasks = currentSprintTasks.filter(task => task.status === 'Not Started');

    return { activeTasks, completedTasks, pendingTasks };
}

function displaySprintTasks() {
    const { activeTasks, completedTasks, pendingTasks } = categorizeSprintTasks();

    const activeContainer = document.getElementById('activeIssues');
    activeContainer.innerHTML = '';
    activeTasks.forEach(task => {
        const taskItem = `<p>${task.name} (${task.storyPoints} SP)</p>`;
        activeContainer.innerHTML += taskItem;
    });

    const completedContainer = document.getElementById('completedIssues');
    completedContainer.innerHTML = '';
    completedTasks.forEach(task => {
        const taskItem = `<p>${task.name} (${task.storyPoints} SP)</p>`;
        completedContainer.innerHTML += taskItem;
    });

    const pendingContainer = document.getElementById('pendingIssues');
    pendingContainer.innerHTML = '';
    pendingTasks.forEach(task => {
        const taskItem = `<p>${task.name} (${task.storyPoints} SP)</p>`;
        pendingContainer.innerHTML += taskItem;
    });
}

window.onload = function() {
    loadSprintTasksFromStorage();
    displaySprintTasks();
};