// sprintTasks.test.js
let currentSprintTasks = [];
const sprintTasks = [
    { id: 1, name: "Task 1", status: "In Progress", storyPoints: 5 },
    { id: 2, name: "Task 2", status: "In Progress", storyPoints: 3 },
    { id: 3, name: "Task 3", status: "Completed", storyPoints: 8 },
    { id: 4, name: "Task 4", status: "Completed", storyPoints: 13 },
    { id: 5, name: "Task 5", status: "Not Started", storyPoints: 2 },
    { id: 6, name: "Task 6", status: "Not Started", storyPoints: 5 }
];

// Mock localStorage
const mockLocalStorage = (() => {
    let store = {};
    return {
        getItem(key) {
            return store[key] || null;
        },
        setItem(key, value) {
            store[key] = value.toString();
        },
        clear() {
            store = {};
        }
    };
})();
Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
});

// Functions to be tested
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

// Test suite for sprint task functions
describe('Sprint Tasks Functions', () => {
    beforeEach(() => {
        // Clear localStorage and currentSprintTasks before each test
        localStorage.clear();
        currentSprintTasks = [];
    });

    test('loadSprintTasksFromStorage should load tasks from localStorage', () => {
        // Arrange
        localStorage.setItem('sprintTasks', JSON.stringify(sprintTasks));
        
        // Act
        loadSprintTasksFromStorage();

        // Assert
        expect(currentSprintTasks).toEqual(sprintTasks);
    });

    test('loadSprintTasksFromStorage should initialize tasks if none in localStorage', () => {
        // Act
        loadSprintTasksFromStorage();

        // Assert
        expect(currentSprintTasks).toEqual(sprintTasks);
    });

    test('saveSprintTasksToStorage should save current tasks to localStorage', () => {
        // Arrange
        currentSprintTasks = sprintTasks;

        // Act
        saveSprintTasksToStorage();

        // Assert
        expect(localStorage.getItem('sprintTasks')).toEqual(JSON.stringify(sprintTasks));
    });

    test('categorizeSprintTasks should categorize tasks correctly', () => {
        // Arrange
        currentSprintTasks = sprintTasks;

        // Act
        const { activeTasks, completedTasks, pendingTasks } = categorizeSprintTasks();

        // Assert
        expect(activeTasks).toEqual([
            { id: 1, name: "Task 1", status: "In Progress", storyPoints: 5 },
            { id: 2, name: "Task 2", status: "In Progress", storyPoints: 3 },
        ]);
        expect(completedTasks).toEqual([
            { id: 3, name: "Task 3", status: "Completed", storyPoints: 8 },
            { id: 4, name: "Task 4", status: "Completed", storyPoints: 13 },
        ]);
        expect(pendingTasks).toEqual([
            { id: 5, name: "Task 5", status: "Not Started", storyPoints: 2 },
            { id: 6, name: "Task 6", status: "Not Started", storyPoints: 5 },
        ]);
    });
});
