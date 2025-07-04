
document.getElementById('toggleView').addEventListener('change', function () {
    const sprintContainer = document.getElementById('sprintContainer');
    sprintContainer.classList.toggle('list-view');
});


function loadSprints() {
    const sprintContainer = document.getElementById('sprintContainer');
    sprintContainer.innerHTML = '';

    const allSprints = JSON.parse(localStorage.getItem('allSprints')) || [];
    console.log("All Sprints: ", allSprints);

    if (allSprints.length === 0) {
        sprintContainer.innerHTML = "<p>No sprints available.</p>";
        return;
    }

    allSprints.forEach((sprint, index) => {
        const sprintCard = document.createElement('div');
        sprintCard.classList.add('sprint-card');


        const completedTasksCount = sprint.tasks.filter(task => task.status === 'Completed').length;

        sprintCard.innerHTML = `
            <h3>Sprint ${index + 1}</h3>
            <p><strong>Sprint Name:</strong> ${sprint.sprintName || 'Untitled'}</p>
            <p><strong>Total Story Points:</strong> ${sprint.tasks.reduce((total, task) => total + task.storyPoints, 0)}</p>
            <p><strong>Goal:</strong> ${sprint.sprintGoal || 'No goal defined'}</p>
            <p><strong>Dates:</strong> ${sprint.startDate} to ${sprint.endDate}</p>
            <p><strong>Completed Tasks:</strong> ${completedTasksCount} / ${sprint.tasks.length}</p>
            <button class="view-details-btn" data-index="${index}">View Details</button>
        `;

        sprintContainer.appendChild(sprintCard);
    });


    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function() {
            const sprintIndex = button.getAttribute('data-index');
            showSprintDetails(allSprints[sprintIndex]);
        });
    });
}

function showSprintDetails(sprint) {
    const sprintDetailModal = document.getElementById('sprintDetailModal');
    document.getElementById('sprintDetailTitle').innerText = sprint.sprintName;
    document.getElementById('sprintStartDate').innerText = sprint.startDate;
    document.getElementById('sprintEndDate').innerText = sprint.endDate;
    document.getElementById('totalStoryPoints').innerText = sprint.tasks.reduce((total, task) => total + task.storyPoints, 0);
    document.getElementById('completedTasks').innerText = sprint.tasks.filter(task => task.status === 'Completed').length;
    document.getElementById('sprintNameDetail').innerText = sprint.sprintName;

    sprintDetailModal.style.display = 'block';
}

document.querySelector('.close-detail').addEventListener('click', function () {
    document.getElementById('sprintDetailModal').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function() {
    loadSprints();
});

function showSprintDetails(sprint) {
    document.getElementById('sprintDetailTitle').innerText = sprint.sprintName;
    document.getElementById('sprintStartDate').innerText = sprint.startDate || 'Unknown';
    document.getElementById('sprintEndDate').innerText = sprint.endDate || 'Unknown';

    const totalStoryPoints = sprint.tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
    document.getElementById('totalStoryPoints').innerText = totalStoryPoints;

    const completedTasksCount = sprint.tasks.filter(task => task.status === 'Completed').length;
    document.getElementById('completedTasks').innerText = completedTasksCount;

    document.getElementById('sprintNameDetail').innerText = sprint.sprintName;

    document.getElementById('sprintDetailModal').style.display = 'block';
}

document.querySelector('.close-detail').addEventListener('click', function () {
    document.getElementById('sprintDetailModal').style.display = 'none';
});

window.onclick = function (event) {
    if (event.target == document.getElementById('sprintDetailModal')) {
        document.getElementById('sprintDetailModal').style.display = 'none';
    }
};

document.addEventListener('DOMContentLoaded', function (){ loadSprints();
});

// Get the modal element
var filterModal = document.getElementById("filterModal");

// Get the button that opens the modal
var openFilterButton = document.getElementById("openFilterModal");

// Get the close button element (the 'x' span)
var closeFilterButton = document.getElementsByClassName("close-filter")[0];

// When the user clicks the 'Open Filter Options' button, open the modal
openFilterButton.onclick = function() {
    filterModal.style.display = "block";
}

// When the user clicks on the close button (x), close the modal
closeFilterButton.onclick = function() {
    filterModal.style.display = "none";
}

// Optional: Close the modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
    if (event.target == filterModal) {
        filterModal.style.display = "none";
    }
}

