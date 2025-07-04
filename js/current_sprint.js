let currentTaskId = '';

// Allow dropping by preventing the default behavior
function allowDrop(event) {
    event.preventDefault();
}

// Store the ID of the dragged element
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

// Handle dropping the task card into a new column
function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const taskCard = document.getElementById(data);

    // Make sure we're dropping the card into a valid task container
    if (event.target.classList.contains('task-container')) {
        event.target.appendChild(taskCard);
    } else if (event.target.closest('.task-container')) {
        event.target.closest('.task-container').appendChild(taskCard);
    }
}

// Function to open the task modal with relevant information
function openTaskModal(taskTitle, taskDescription, taskPoints, taskId) {
    document.getElementById('taskTitle').textContent = taskTitle;
    document.getElementById('taskDescription').textContent = taskDescription;
    document.getElementById('taskPoints').textContent = `Story Points: ${taskPoints}`;

    // Display priority, stage, and tags
    const task = findTaskById(taskId); // Find the task in your task list
    document.getElementById('taskPriority').textContent = `Priority: ${task.priority}`;
    document.getElementById('taskStage').textContent = `Stage: ${task.stage}`;
    document.getElementById('taskTags').textContent = `Tags: ${task.tags.join(', ')}`;

    // Add buttons to move task
    document.getElementById('moveTaskButtons').innerHTML = `
        <button onclick="moveTaskToInProgress('${taskId}')">Move to In Progress</button>
        <button onclick="moveTaskToCompleted('${taskId}')">Move to Completed</button>
    `;

    // Store the current task ID
    currentTaskId = taskId;

    // Open the modal
    const modal = document.getElementById('taskModal');
    modal.style.display = 'block';

    // Ensure the 'X' button can close the modal
    document.querySelector('.close').onclick = function() {
        modal.style.display = 'none';
    };

    // Close the modal if the user clicks outside the modal content
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Find the task by its ID
function findTaskById(taskId) {
    const allTasks = JSON.parse(localStorage.getItem('backlogTasks')) || [];
    return allTasks.find(task => task.id === parseInt(taskId, 10));
}
// Function to log time and notes entered by the user
/*
function logTime() {
    const weeks = document.getElementById('weeks').value;
    const days = document.getElementById('days').value;
    const hours = document.getElementById('hours').value;
    const minutes = document.getElementById('minutes').value;
    const notes = document.getElementById('notes').value;

    console.log(`Time logged for ${currentTaskId}: ${weeks} weeks, ${days} days, ${hours} hours, ${minutes} minutes`);
    console.log(`Notes for ${currentTaskId}: ${notes}`);
    alert(`Time logged successfully for ${currentTaskId}`);
}
*/
document.addEventListener('DOMContentLoaded', function () {
    // Close modal when close button is clicked
    const currentUser = localStorage.getItem('currentUser');
    document.getElementById('userName').textContent = currentUser;
    
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function () {
            document.getElementById('taskModal').style.display = 'none';
        });
    }

    // Close modal when user clicks outside the modal content
    window.addEventListener('click', function (event) {
        const modal = document.getElementById('taskModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Attach event listener to the "Log Time" button
    document.getElementById('logTimeBtn').addEventListener('click', logTime);
});
// Function to toggle between List View and Card View
document.getElementById('toggleListView').addEventListener('change', function () {
    const dashboard = document.querySelector('.dashboard');
    const table = document.getElementById('taskListTable');
    const tableBody = document.getElementById('taskTableBody');

    if (this.checked) {
        // Hide the dashboard cards and show the table
        dashboard.style.display = 'none';
        table.style.display = 'table'; // Show the table

        // Clear the table first
        tableBody.innerHTML = '';

        // Fetch tasks from all columns and append to the table
        const notStartedTasks = document.querySelectorAll('#not-started .task-card');
        const inProgressTasks = document.querySelectorAll('#in-progress .task-card');
        const completedTasks = document.querySelectorAll('#completed .task-card');

        // Add tasks from each column to the table
        addTasksToTable(notStartedTasks, 'Not Started');
        addTasksToTable(inProgressTasks, 'In Progress');
        addTasksToTable(completedTasks, 'Completed');
    } else {
        // Show the dashboard cards and hide the table
        dashboard.style.display = 'flex';
        table.style.display = 'none'; // Hide the table
    }

    function addTasksToTable(tasks, status) {
        tasks.forEach(task => {
            const taskName = task.querySelector('p').textContent;
            const storyPoints = taskName.match(/\((\d+) Story Points\)/)[1]; // Extract story points from text
            const taskDescription = task.querySelector('p:nth-of-type(4)').textContent;  // Get the task description from data attribute

            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Task Name">${taskName}</td>
                <td data-label="Task Description">${taskDescription}</td>
                <td data-label="Story Points">${storyPoints}</td>
                <td data-label="Status">${status}</td>
            `;
            tableBody.appendChild(row);
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Load tasks from backlog.json
    fetchBacklogTasks();

    const modal = document.getElementById("sprintSettingsModal");
    const btn = document.getElementById("sprintSettingsBtn");
    const span = document.getElementsByClassName("close")[0];
    const profileButton = document.querySelector('.profile');
    const dropdownContent = document.querySelector('.dropdown-content');

    btn.onclick = function () {
        modal.style.display = "block";
        dropdownContent.classList.remove('show');
    };

    span.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        } else if (!event.target.closest('.dropdown')) {
            dropdownContent.classList.remove('show');
        }
    };

    profileButton.onclick = function (event) {
        event.stopPropagation();
        dropdownContent.classList.toggle('show');
        modal.style.display = "none";
    };

    document.getElementById('applyFilters').onclick = function () {
        const isListViewChecked = document.getElementById('toggleListView').checked;
        if (isListViewChecked) {
            applyFiltersToListView();  // Apply filters to list view
        } else {
            applyFilters();  // Apply filters to card view
        }
    };
});
function fetchTasksFromLocalStorage() {
    const localStorageTasks = JSON.parse(localStorage.getItem('backlogTasks')) || [];
    return localStorageTasks;
}
// Function to fetch tasks from backlog.json and set them as "Not Started"
// Function to fetch tasks from backlog.json and set them as "Not Started"
let allTasksList = [];  // To store the original unfiltered list of tasks

// Function to fetch tasks from backlog.json and set them as "Not Started"
function fetchBacklogTasks() {
    fetch("./Database/backlog.json")
        .then(response => response.json())
        .then(jsonTasks => {
            // Fetch tasks from localStorage
            const localStorageTasks = JSON.parse(localStorage.getItem('backlogTasks')) || [];

            // Combine tasks from json and local storage, with localStorage taking precedence (if duplicate id exists)
            const combinedTasks = [...localStorageTasks, ...jsonTasks];

            // Filter out duplicates by unique 'id', with preference to the earlier tasks (from localStorage)
            const uniqueTasks = combinedTasks.reduce((acc, currentTask) => {
                const existingTask = acc.find(task => task.id === currentTask.id);
                if (!existingTask) {
                    acc.push(currentTask);
                }
                return acc;
            }, []);

            const notStartedContainer = document.getElementById('not-started');
            const inProgressContainer = document.getElementById('in-progress');
            const completedContainer = document.getElementById('completed');

            // Clear containers
            notStartedContainer.innerHTML = '';
            inProgressContainer.innerHTML = '';
            completedContainer.innerHTML = '';

            // Create task cards and append to containers based on status
            uniqueTasks.forEach(task => {
                if (!task.status) {
                    task.status = "Not Started"; // Default to "Not Started" if status is not provided
                }

                const taskCard = createTaskCard(task);

                // Append task to appropriate container based on its status
                if (task.status === "Not Started") {
                    notStartedContainer.appendChild(taskCard);
                } else if (task.status === "In Progress") {
                    inProgressContainer.appendChild(taskCard);
                } else if (task.status === "Completed") {
                    completedContainer.appendChild(taskCard);
                }

                // Ensure the task is correctly stored in the original list for future filtering
                allTasksList.push(taskCard);
            });
        })
        .catch(error => console.error('Error loading backlog tasks:', error));
}
// Function to create task cards
// Function to create task cards
function createTaskCard(task) {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
    taskCard.setAttribute('id', `task${task.id}`);

    // Add click event to open task modal for detailed information
    taskCard.addEventListener('click', function() {
        openTaskModal(task.name, task.userStory, task.storyPoints, task.id);
    });

    taskCard.innerHTML = `
        <p>${task.name} (${task.storyPoints} Story Points)</p>
        <p>Priority: ${task.priority}</p>
        <p>Stage: ${task.stage}</p>
        <p>Tags: ${task.tags.join(', ')}</p>
        <div class="task-buttons">
            <button class="move-in-progress" onclick="moveTaskToInProgress('${task.id}'); event.stopPropagation();">Move to In Progress</button>
            <button class="move-completed" onclick="moveTaskToCompleted('${task.id}'); event.stopPropagation();">Move to Completed</button>
        </div>
    `;

    return taskCard;
}
document.addEventListener('DOMContentLoaded', function () {
    const applyFiltersBtn = document.getElementById('applyFilters');
    const filterModal = document.getElementById("filterModal");
    const filterBtn = document.getElementById("openFilterModal");
    const closeFilter = document.getElementsByClassName("close-filter")[0];

    filterBtn.style.display = 'none';

    // Open filter modal
    filterBtn.onclick = function () {
        filterModal.style.display = "block";
    };

    // Close filter modal
    closeFilter.onclick = function () {
        filterModal.style.display = "none";
    };

    // Close modal if clicking outside of it
    window.onclick = function (event) {
        if (event.target === filterModal) {
            filterModal.style.display = "none";
        }
    };

    // Attach applyFilters function to the button click
    applyFiltersBtn.onclick = function () {
        const isListViewChecked = document.getElementById('toggleListView').checked;
        if (isListViewChecked) {
            applyFiltersToListView();  // Apply filters to list view
        } else {
            applyFilters();  // Apply filters to card view
        }
    };

    // Toggle between List View and Card View and hide/show the filter button
    document.getElementById('toggleListView').addEventListener('change', function () {
        const filterButton = document.getElementById('openFilterModal');

        if (this.checked) {
            // Show the filter button in List View
            filterButton.style.display = 'inline-block';
        } else {
            // Hide the filter button in Card View
            filterButton.style.display = 'none';
        }
    });
});
function displayTasks(tasks) {
    const notStartedContainer = document.getElementById('not-started');
    const inProgressContainer = document.getElementById('in-progress');
    const completedContainer = document.getElementById('completed');

    // Clear existing tasks in the containers
    notStartedContainer.innerHTML = '';
    inProgressContainer.innerHTML = '';
    completedContainer.innerHTML = '';

    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        if (task.status === 'Not Started' || task.status.toLowerCase() === 'not started') {
            notStartedContainer.appendChild(taskCard);
        } else if (task.status === 'In Progress' || task.status.toLowerCase() === 'in progress') {
            inProgressContainer.appendChild(taskCard);
        } else if (task.status === 'Completed' || task.status.toLowerCase() === 'completed') {
            completedContainer.appendChild(taskCard);
        }
    });
}
function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('backlogTasks')) || [];
    tasks.push(task);
    localStorage.setItem('backlogTasks', JSON.stringify(tasks));
}
function applyFilters() {
    const selectedPriority = document.getElementById('filterPriority').value.toLowerCase();
    const selectedStage = document.getElementById('filterStage').value.toLowerCase();
    const minStoryPoints = parseInt(document.getElementById('filterStoryPoints').value, 10) || 0;

    // Retrieve tasks from localStorage or backlogTasks
    const allTasks = JSON.parse(localStorage.getItem('backlogTasks')) || [];

    // Filter tasks based on priority, stage, and story points
    const filteredTasks = allTasks.filter(task => {
        let matches = true;

        // Filter by Priority
        if (selectedPriority && selectedPriority !== 'all') {
            matches = matches && task.priority.toLowerCase() === selectedPriority;
        }

        // Filter by Stage
        if (selectedStage && selectedStage !== 'all') {
            matches = matches && task.stage.toLowerCase() === selectedStage;
        }

        // Filter by Story Points
        if (!isNaN(minStoryPoints) && task.storyPoints < minStoryPoints) {
            matches = matches && false;
        }

        return matches;
    });

    // Now display filtered tasks
    displayTasks(filteredTasks);

    // Close the filter modal after applying the filters
    filterModal.style.display = "none";
}

function displayFilteredTasks(filteredTasks) {
    const notStartedContainer = document.getElementById('not-started');
    const inProgressContainer = document.getElementById('in-progress');
    const completedContainer = document.getElementById('completed');

    // Clear all task containers
    notStartedContainer.innerHTML = '';
    inProgressContainer.innerHTML = '';
    completedContainer.innerHTML = '';

    if (filteredTasks.length === 0) {
        notStartedContainer.innerHTML = '<p>No tasks match the filter criteria.</p>';
        inProgressContainer.innerHTML = '<p>No tasks match the filter criteria.</p>';
        completedContainer.innerHTML = '<p>No tasks match the filter criteria.</p>';
        return;
    }

    // Append the filtered tasks to the correct containers based on their status
    filteredTasks.forEach(task => {
        const status = task.dataset.status.toLowerCase();

        if (status === 'not started') {
            notStartedContainer.appendChild(task);
        } else if (status === 'in progress') {
            inProgressContainer.appendChild(task);
        } else if (status === 'completed') {
            completedContainer.appendChild(task);
        }
    });
}
/*
document.addEventListener('DOMContentLoaded', function () {
    const filterModal = document.getElementById("filterModal");
    const filterBtn = document.getElementById("openFilterModal");
    const closeFilter = document.getElementsByClassName("close-filter")[0];

    // Open the filter modal when clicking the "Filter Options" button
    filterBtn.onclick = function() {
        filterModal.style.display = "block";
    };

    // Close the filter modal when clicking the "X" button
    closeFilter.onclick = function() {
        filterModal.style.display = "none";
    };

    // Close the filter modal when clicking outside of the modal
    window.onclick = function(event) {
        if (event.target === filterModal) {
            filterModal.style.display = "none";
        }
    };
});
*/
// Function to apply filters to the list view (table)
function applyFiltersToListView() {
    const selectedPriority = document.getElementById('filterPriority').value.toLowerCase();
    const selectedStage = document.getElementById('filterStage').value.toLowerCase();
    const minStoryPoints = parseInt(document.getElementById('filterStoryPoints').value, 10) || 0;

    // Retrieve tasks from localStorage or backlogTasks
    const allTasks = JSON.parse(localStorage.getItem('backlogTasks')) || [];

    // Filter tasks based on priority, stage, and story points
    const filteredTasks = allTasks.filter(task => {
        let matches = true;

        // Filter by Priority
        if (selectedPriority && selectedPriority !== 'all') {
            matches = matches && task.priority.toLowerCase() === selectedPriority;
        }

        // Filter by Stage
        if (selectedStage && selectedStage !== 'all') {
            matches = matches && task.stage.toLowerCase() === selectedStage;
        }

        // Filter by Story Points
        if (!isNaN(minStoryPoints) && task.storyPoints < minStoryPoints) {
            matches = false;
        }

        return matches;
    });

    // Update the table with the filtered tasks
    updateTableWithTasks(filteredTasks);

    // Close the filter modal after applying the filters
    filterModal.style.display = "none";
}

// Function to update the table with filtered tasks
function updateTableWithTasks(tasks) {
    const tableBody = document.getElementById('taskTableBody');

    // Clear the table first
    tableBody.innerHTML = '';

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Task Name">${task.name}</td>
            <td data-label="Task Description">${task.userStory || ''}</td>
            <td data-label="Story Points">${task.storyPoints}</td>
            <td data-label="Stage">${task.stage}</td>
        `;
        tableBody.appendChild(row);
    });
}

function updateTaskStatus(taskId, newStatus) {
    // Retrieve tasks from localStorage
    let allTasks = JSON.parse(localStorage.getItem('backlogTasks')) || [];

    // Find the task in the localStorage tasks
    const taskIndex = allTasks.findIndex(task => `task${task.id}` === taskId);

    if (taskIndex !== -1) {
        // Update the task's status for a task from localStorage
        allTasks[taskIndex].status = newStatus;

        // Save the updated tasks back to localStorage
        localStorage.setItem('backlogTasks', JSON.stringify(allTasks));

        // Re-render the tasks to reflect the changes
        fetchBacklogTasks();
    } else {
        // Task was not found in localStorage, check if it's a JSON task
        const jsonTaskIndex = allTasksList.findIndex(task => `task${task.id}` === taskId);

        if (jsonTaskIndex !== -1) {
            // Update status for JSON task and add it to localStorage
            const jsonTask = {
                ...allTasksList[jsonTaskIndex],
                status: newStatus
            };

            // Add the JSON task to localStorage and update
            allTasks.push(jsonTask);
            localStorage.setItem('backlogTasks', JSON.stringify(allTasks));

            // Re-render the tasks
            fetchBacklogTasks();
        }
    }
}

// Handle dropping a task card into a new column
function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const taskCard = document.getElementById(data);

    if (event.target.classList.contains('task-container')) {
        event.target.appendChild(taskCard);

        if (event.target.id === 'not-started') {
            updateTaskStatus(taskCard.id, 'Not Started');
        } else if (event.target.id === 'in-progress') {
            updateTaskStatus(taskCard.id, 'In Progress');
        } else if (event.target.id === 'completed') {
            updateTaskStatus(taskCard.id, 'Completed');
        }
    }
}

// Allow task cards to be dragged
function allowDrop(event) {
    event.preventDefault();
}

// Store the ID of the dragged element
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

// Move task to In Progress
function moveTaskToInProgress(taskId) {
    updateTaskStatus(`task${taskId}`, 'In Progress');
}

// Move task to Completed
function moveTaskToCompleted(taskId) {
    updateTaskStatus(`task${taskId}`, 'Completed');
}
function moveTaskToNotStarted(taskId) {
    updateTaskStatus(taskId, 'Not Started');
}

// Initialize the tasks on page load
document.addEventListener('DOMContentLoaded', function () {
    fetchBacklogTasks();
});

function moveTaskToNotStarted(taskId) {
    let allTasks = JSON.parse(localStorage.getItem('backlogTasks')) || [];

    const task = allTasks.find(task => `task${task.id}` === taskId);

    if (task && (task.status === 'In Progress' || task.status === 'Completed')) {
        alert("This task cannot be moved back to 'Not Started'. It can only be moved when the sprint ends.");
    } else {
        updateTaskStatus(taskId, 'Not Started');
    }
}
function logTime() {
    const loggedHours = parseFloat(document.getElementById('loggedHours').value) || 0;
    const notes = document.getElementById('notes').value || '';

    // Fetch task from localStorage
    let allTasks = JSON.parse(localStorage.getItem('backlogTasks')) || [];
    const taskIndex = allTasks.findIndex(task => `task${task.id}` === `task${currentTaskId}`);

    if (taskIndex !== -1) {
        allTasks[taskIndex].loggedHours = loggedHours; // Save the logged hours directly
        allTasks[taskIndex].notes = notes;

        // Update tasks in localStorage
        localStorage.setItem('backlogTasks', JSON.stringify(allTasks));
        console.log(`Task ${currentTaskId} logged hours:`, allTasks[taskIndex].loggedHours);
        console.log(`Task ${currentTaskId} notes:`, allTasks[taskIndex].notes);

        alert('Time logged successfully');
    } else {
        console.error('Task not found for logging time.');
    }

    // Close the modal after logging time
    document.getElementById('taskModal').style.display = 'none';
}
function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
}
function saveSprintSettings() {
    // Get the values from the input fields
    const sprintGoal = document.getElementById('sprintGoal').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Check if all fields are filled in
    if (!sprintGoal || !startDate || !endDate) {
        alert('Please fill out all the fields.');
        return;
    }


    const sprintSettings = {
        sprintGoal: sprintGoal,
        startDate: startDate,
        endDate: endDate
    };

    localStorage.setItem('sprintSettings', JSON.stringify(sprintSettings));

    alert('Sprint settings saved successfully.');


    document.getElementById('sprintSettingsModal').style.display = 'none';
}
function openSprintSettingsModal() {
    document.getElementById('sprintSettingsModal').style.display = 'block';
}

function closeSprintSettingsModal() {
    document.getElementById('sprintSettingsModal').style.display = 'none';
}
function completeSprint() {

    let allTasks = JSON.parse(localStorage.getItem('backlogTasks')) || [];


    allTasks.forEach(task => {
        if (task.status === 'In Progress') {
            task.status = 'Not Started';
        }
    });
    const sprintSettings = JSON.parse(localStorage.getItem('sprintSettings'));

    const completedSprint = {
        sprintName: sprintSettings.sprintGoal,
        startDate: '2024-10-01',
        endDate: new Date().toISOString().split('T')[0],
        tasks: allTasks
    };


    let allSprints = JSON.parse(localStorage.getItem('allSprints')) || [];
    allSprints.push(completedSprint);
    localStorage.setItem('allSprints', JSON.stringify(allSprints));


    localStorage.removeItem('backlogTasks');

    alert('Sprint completed! You can view this sprint in All Sprints.');

    // Optionally redirect to the All Sprints page
    window.location.href = 'all_sprint.html';
}

document.addEventListener('DOMContentLoaded', function() {
    // Get the scrum bar and scrum content elements
    const scrumBar = document.getElementById('scrumBar');
    const scrumContent = document.getElementById('scrumContent');

    // Initially hide the scrum content
    scrumContent.style.display = 'none';

    // Add a click event listener to the scrum bar
    scrumBar.addEventListener('click', function() {
        // Toggle the display property of scrum content
        if (scrumContent.style.display === 'none' || scrumContent.style.display === '') {
            scrumContent.style.display = 'block'; // Show the scrum content
        } else {
            scrumContent.style.display = 'none'; // Hide the scrum content
        }
    });
});

// Attach event listener to the Add New Meeting button
document.getElementById('addMeetingBtn').addEventListener('click', () => {
    // Display the new meeting input row if needed
    const scrumContent = document.getElementById('scrumContent');
    scrumContent.style.display = 'block'; // Ensure it is visible
});

const filterModal = document.getElementById("filterModal");
const filterBtn = document.getElementById("openFilterModal");
const closeFilter = document.getElementsByClassName("close-filter")[0];

filterBtn.onclick = function() {
    filterModal.style.display = "block"; // Open filter modal
};

closeFilter.onclick = function() {
    filterModal.style.display = "none"; // Close filter modal
};

// Applying filters
document.getElementById('applyFilters').onclick = function() {
    const filterStoryPoints = document.getElementById('filterStoryPoints').checked;
    const filterProgress = document.getElementById('filterProgress').checked;
    const filterDate = document.getElementById('filterDate').checked;

    console.log('Filter by Story Points:', filterStoryPoints);
    console.log('Filter by Progress:', filterProgress);
    console.log('Filter by Date:', filterDate);

    filterModal.style.display = "none"; // Close modal after applying filters
    alert('Filters applied successfully!');
};
document.addEventListener('DOMContentLoaded', function() {
    // Other existing event listeners...


    // Attach event listener to the "Add New Meeting" button
    document.getElementById('addMeetingBtn').addEventListener('click', function() {
        const newRow = `
            <tr>
                <td><input type="date" class="input-field"></td>
                <td>
                    <select multiple class="input-field">
                        <option>John Doe</option>
                        <option>Jane Smith</option>
                        <option>Alice Brown</option>
                        <option>Charlie Davis</option>
                        <option>Bob Lee</option>
                    </select>
                </td>
                <td><textarea class="input-field" placeholder="Enter meeting minutes">Meeting minutes for the new meeting.</textarea></td>
            </tr>`;

        // Append the new row to the tbody of the scrum meeting table
        document.querySelector('.scrum-meeting-table tbody').innerHTML += newRow;
    });
});
var modal = document.getElementById("sprintSettingsModal");

        // Get the close button element (the 'x' span)
        var closeButton = document.getElementsByClassName("close")[0];

        // When the user clicks on the close button (x), close the modal
        closeButton.onclick = function() {
            modal.style.display = "none";
        }

        // Optional: Close the modal when the user clicks anywhere outside of the modal
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

