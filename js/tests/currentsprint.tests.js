// Import the necessary functions from the module
// Assuming the functions are exported from a module named 'taskManager.js'
import { 
    applyFiltersToListView, 
    updateTaskStatus, 
    drop, 
    allowDrop, 
    drag, 
    moveTaskToInProgress, 
    moveTaskToCompleted, 
    moveTaskToNotStarted, 
    logTime, 
    saveSprintSettings, 
    completeSprint 
} from '../sprint'; // Adjust the import according to your file structure

describe('Task Manager Functions', () => {

    beforeEach(() => {
        // Setup DOM elements and mock localStorage for each test
        document.body.innerHTML = `
            <select id="filterPriority"><option value="High">High</option></select>
            <select id="filterStage"><option value="In Progress">In Progress</option></select>
            <input id="filterStoryPoints" type="number" value="0" />
            <table id="taskListTable">
                <tbody>
                    <tr><td>Task 1</td><td>Description</td><td>High</td><td>In Progress</td></tr>
                    <tr><td>Task 2</td><td>Description</td><td>Low</td><td>Completed</td></tr>
                </tbody>
            </table>
            <div id="filterModal" style="display:none;"></div>
        `;
        localStorage.clear();
    });

    test('applyFiltersToListView filters tasks based on priority, stage, and story points', () => {
        applyFiltersToListView();
        const visibleRows = Array.from(document.querySelectorAll('#taskListTable tbody tr:visible')); // Assuming a custom ':visible' selector
        expect(visibleRows.length).toBe(1); // Adjust based on the applied filters
    });

    test('updateTaskStatus updates the task status in localStorage', () => {
        localStorage.setItem('backlogTasks', JSON.stringify([{ id: 1, status: 'Not Started' }]));
        updateTaskStatus('task1', 'In Progress');
        const updatedTasks = JSON.parse(localStorage.getItem('backlogTasks'));
        expect(updatedTasks[0].status).toBe('In Progress');
    });

    test('drop moves the task to the new column and updates status', () => {
        document.body.innerHTML += '<div id="in-progress" class="task-container"></div>';
        const taskCard = document.createElement('div');
        taskCard.id = 'task1';
        taskCard.draggable = true;
        document.body.appendChild(taskCard);
        drag({ target: taskCard }); // Simulate drag
        drop({ target: document.getElementById('in-progress') }); // Simulate drop
        const updatedTasks = JSON.parse(localStorage.getItem('backlogTasks'));
        expect(updatedTasks.find(task => task.id === 1).status).toBe('In Progress');
    });

    test('logTime correctly logs hours and notes for a task', () => {
        localStorage.setItem('backlogTasks', JSON.stringify([{ id: 1 }]));
        logTime();
        const updatedTasks = JSON.parse(localStorage.getItem('backlogTasks'));
        expect(updatedTasks[0].loggedHours).toBeGreaterThan(0); // Check that hours are logged
    });

    test('saveSprintSettings saves sprint settings to localStorage', () => {
        const sprintGoal = 'Complete the project';
        const startDate = '2024-10-01';
        const endDate = '2024-10-15';
        saveSprintSettings(sprintGoal, startDate, endDate);
        const settings = JSON.parse(localStorage.getItem('sprintSettings'));
        expect(settings.sprintGoal).toBe(sprintGoal);
        expect(settings.startDate).toBe(startDate);
        expect(settings.endDate).toBe(endDate);
    });

    test('completeSprint resets tasks in progress and stores the completed sprint', () => {
        localStorage.setItem('backlogTasks', JSON.stringify([{ id: 1, status: 'In Progress' }]));
        completeSprint();
        const allSprints = JSON.parse(localStorage.getItem('allSprints'));
        expect(allSprints.length).toBe(1); // Check that sprint is saved
        expect(allSprints[0].tasks[0].status).toBe('Not Started'); // Check task status
    });
});
