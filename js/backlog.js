let tasks = [];

fetch("./Database/backlog.json")
    .then(response => response.json())
    .then(data => {
        if (!localStorage.getItem('backlogTasks')) {
            tasks = data;
            saveTasksToStorage();
        } else {
            loadTasks();
        }
        displayTasks();
    })
    .catch(error => console.error('Error loading JSON data:', error));

function loadTasks() {
    const storedTasks = localStorage.getItem('backlogTasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

function saveTasksToStorage() {
    localStorage.setItem('backlogTasks', JSON.stringify(tasks));
}

function displayTasks(filteredTasks = tasks) {
    const taskContainer = document.querySelector('.tasks-list');
    taskContainer.innerHTML = '';

    if (filteredTasks.length === 0) {
        taskContainer.innerHTML = '<p>No tasks available.</p>';
        return;
    }

    filteredTasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.setAttribute('data-task-id', task.id);
        taskCard.innerHTML = `
            <h3>${task.name}</h3>
            <p><strong>Story Points:</strong> ${task.storyPoints}</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <p><strong>Stage:</strong> ${task.stage}</p>
            <p><strong>Tags:</strong> ${task.tags.join(", ")}</p>
            <p><strong>User Story:</strong> ${task.userStory}</p>
            <button class="edit-btn" data-id="${task.id}">Edit</button>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
        `;
        taskContainer.appendChild(taskCard);
    });

    attachTaskEventListeners();
}

function addTask(event) {
    event.preventDefault();

    const taskName = document.getElementById('taskName').value;
    const storyPoints = document.getElementById('storyPoints').value;
    const priority = document.getElementById('priority').value;
    const stage = document.getElementById('stage').value;
    const tags = Array.from(document.querySelectorAll('input[name="tags"]:checked')).map(input => input.value);
    const userStory = document.getElementById('userStory').value;

    const newTask = {
        id: Date.now(),
        name: taskName,
        storyPoints: parseInt(storyPoints, 10),
        priority: priority,
        stage: stage,
        tags: tags,
        userStory: userStory
    };

    tasks.push(newTask);
    displayTasks();
    saveTasksToStorage();

    showToast('Task Created');

    document.getElementById('addtaskForm').reset();
    document.getElementById('addtaskModal').style.display = 'none';
}

function applyFilters() {
    const selectedPriority = document.getElementById('filterPriority').value;
    const selectedStage = document.getElementById('filterStage').value;
    const minStoryPoints = document.getElementById('filterStoryPoints').value;

    const filteredTasks = tasks.filter(task => {
        let matches = true;

        if (selectedPriority) {
            matches = matches && task.priority.toLowerCase() === selectedPriority.toLowerCase();
        }

        if (selectedStage) {
            matches = matches && task.stage.toLowerCase() === selectedStage.toLowerCase();
        }

        if (minStoryPoints) {
            matches = matches && task.storyPoints >= parseInt(minStoryPoints, 10);
        }

        return matches;
    });

    displayFilteredTasks(filteredTasks);
}

function displayFilteredTasks(filteredTasks) {
    const taskContainer = document.querySelector('.tasks-list');
    taskContainer.innerHTML = '';

    if (filteredTasks.length === 0) {
        taskContainer.innerHTML = '<p>No tasks match the filter criteria.</p>';
        return;
    }

    filteredTasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.setAttribute('data-task-id', task.id);
        taskCard.innerHTML = `
            <h3>${task.name}</h3>
            <p><strong>Story Points:</strong> ${task.storyPoints}</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <p><strong>Stage:</strong> ${task.stage}</p>
            <p><strong>Tags:</strong> ${task.tags.join(", ")}</p>
            <p><strong>User Story:</strong> ${task.userStory}</p>
            <button class="edit-btn" data-id="${task.id}">Edit</button>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
        `;
        taskContainer.appendChild(taskCard);
    });

    attachTaskEventListeners();
}

function attachTaskEventListeners() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function () {
            const taskId = this.getAttribute('data-id');
            openEditModal(taskId);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            const taskId = this.getAttribute('data-id');
            deleteTask(taskId);
        });
    });
}

function openEditModal(taskId) {
    const task = tasks.find(t => t.id == taskId);

    document.getElementById('editTaskName').value = task.name;
    document.getElementById('editStoryPoints').value = task.storyPoints;
    document.getElementById('editPriority').value = task.priority;
    document.getElementById('editStage').value = task.stage;
    document.getElementById('editUserStory').value = task.userStory || "";

    document.getElementById('edittaskModal').style.display = 'block';

    document.getElementById('edittaskForm').onsubmit = function (event) {
        event.preventDefault(); // Prevent form submission

        task.name = document.getElementById('editTaskName').value;
        task.storyPoints = parseInt(document.getElementById('editStoryPoints').value, 10);
        task.priority = document.getElementById('editPriority').value;
        task.stage = document.getElementById('editStage').value;
        task.userStory = document.getElementById('editUserStory').value;

        displayTasks();
        saveTasksToStorage();

        document.getElementById('edittaskModal').style.display = 'none';
        showToast('Task Updated');
    };
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id != taskId);
    displayTasks();
    saveTasksToStorage();
    showToast('Task Deleted');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';

    setTimeout(function () {
        toast.className = toast.className.replace('show', '');
    }, 3000);
}

document.getElementById('addtaskBtn').onclick = function () {
    document.getElementById('addtaskModal').style.display = 'block';
};

document.getElementById('closetaskModal').onclick = function () {
    document.getElementById('addtaskModal').style.display = 'none';
};

document.getElementById('closeEdittaskModal').onclick = function () {
    document.getElementById('edittaskModal').style.display = 'none';
};

window.onclick = function (event) {
    if (event.target == document.getElementById('addtaskModal')) {
        document.getElementById('addtaskModal').style.display = 'none';
    }
    if (event.target == document.getElementById('edittaskModal')) {
        document.getElementById('edittaskModal').style.display= 'none';
    }
    if (event.target == document.getElementById('filterModal')) {
        document.getElementById('filterModal').style.display = 'none';
    }
};

document.getElementById('openFilterModal').onclick = function () {
    document.getElementById('filterModal').style.display = 'block';
};

document.querySelector('.close-filter').onclick = function () {
    document.getElementById('filterModal').style.display = 'none';
};

document.getElementById('applyFilters').onclick = function () {
    applyFilters();
    document.getElementById('filterModal').style.display = 'none';
    document.getElementById('resetFilters').style.display = 'inline-block';
};

function applyFilters() {
    const selectedPriority = document.getElementById('filterPriority').value;
    const selectedStage = document.getElementById('filterStage').value;
    const minStoryPoints = document.getElementById('filterStoryPoints').value;

    const filteredTasks = tasks.filter(task => {
        let matches = true;

        if (selectedPriority) {
            matches = matches && task.priority.toLowerCase() === selectedPriority.toLowerCase();
        }

        if (selectedStage) {
            matches = matches && task.stage.toLowerCase() === selectedStage.toLowerCase();
        }

        if (minStoryPoints) {
            matches = matches && task.storyPoints >= parseInt(minStoryPoints, 10);
        }

        return matches;
    });

    displayFilteredTasks(filteredTasks);
}

function displayFilteredTasks(filteredTasks) {
    const taskContainer = document.querySelector('.tasks-list');
    taskContainer.innerHTML = '';

    if (filteredTasks.length === 0) {
        taskContainer.innerHTML = '<p>No tasks match the filter criteria.</p>';
        return;
    }

    filteredTasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.setAttribute('data-task-id', task.id);
        taskCard.innerHTML = `
            <h3>${task.name}</h3>
            <p><strong>Story Points:</strong> ${task.storyPoints}</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <p><strong>Stage:</strong> ${task.stage}</p>
            <p><strong>Tags:</strong> ${task.tags.join(", ")}</p>
            <p><strong>User Story:</strong> ${task.userStory}</p>
            <button class="edit-btn" data-id="${task.id}">Edit</button>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
        `;
        taskContainer.appendChild(taskCard);
    });

    attachTaskEventListeners();
}

document.getElementById('resetFilters').onclick = function () {
    displayTasks();
    document.getElementById('resetFilters').style.display = 'none';
};

window.onload = function () {
    loadTasks(); e
    displayTasks();
};
document.getElementById('addtaskForm').addEventListener('submit', addTask);
