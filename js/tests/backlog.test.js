import { loadTasks, saveTasksToStorage, displayTasks, addTask, deleteTask, applyFilters, showToast } from './taskManager';

describe('Task Management Application Tests', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('loadTasks should load tasks from local storage if available', () => {
        const sampleTasks = [{ id: 1, name: 'Test Task', storyPoints: 3, priority: 'High', stage: 'In Progress', tags: ['tag1'], userStory: 'As a user...' }];
        localStorage.setItem('backlogTasks', JSON.stringify(sampleTasks));

        loadTasks();

        expect(JSON.parse(localStorage.getItem('backlogTasks'))).toEqual(sampleTasks);
    });

    test('saveTasksToStorage should save tasks to local storage', () => {
        const tasks = [{ id: 1, name: 'Test Task', storyPoints: 3, priority: 'High', stage: 'In Progress', tags: ['tag1'], userStory: 'As a user...' }];
        
        saveTasksToStorage(tasks);

        expect(JSON.parse(localStorage.getItem('backlogTasks'))).toEqual(tasks);
    });

    test('addTask should add a new task to the tasks array', () => {
        const newTask = { id: Date.now(), name: 'New Task', storyPoints: 5, priority: 'Medium', stage: 'To Do', tags: ['tag2'], userStory: 'As a user...' };
        const tasks = [];

        addTask(newTask, tasks);

        expect(tasks).toContainEqual(newTask);
    });

    test('deleteTask should remove a task from the tasks array', () => {
        const tasks = [{ id: 1, name: 'Task to Delete', storyPoints: 3, priority: 'Low', stage: 'Done', tags: [], userStory: '' }];
        
        deleteTask(1, tasks);

        expect(tasks).not.toContainEqual({ id: 1, name: 'Task to Delete', storyPoints: 3, priority: 'Low', stage: 'Done', tags: [], userStory: '' });
    });

    test('applyFilters should filter tasks based on priority', () => {
        const tasks = [
            { id: 1, name: 'High Priority Task', storyPoints: 3, priority: 'High', stage: 'In Progress', tags: [], userStory: '' },
            { id: 2, name: 'Low Priority Task', storyPoints: 2, priority: 'Low', stage: 'Done', tags: [], userStory: '' }
        ];
        
        const filteredTasks = applyFilters(tasks, 'High', null, null);

        expect(filteredTasks).toEqual([{ id: 1, name: 'High Priority Task', storyPoints: 3, priority: 'High', stage: 'In Progress', tags: [], userStory: '' }]);
    });

    test('showToast should display the correct message', () => {
        const message = 'Task Created';
        showToast(message);

        const toast = document.getElementById('toast');
        expect(toast.textContent).toBe(message);
        expect(toast.className).toContain('show');
    });
});
