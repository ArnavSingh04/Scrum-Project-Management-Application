let project;

fetch("./Database/Projects.json")
    .then(response => response.json())
    .then(data => {
        project = data[0];
        populateProjectDetails();
    })
    .catch(error => console.error('Error loading project data:', error));

function populateProjectDetails() {
    const projectDetails = document.getElementById('projectDetails');

    if (!project) {
        projectDetails.innerHTML = '<p>No project available.</p>';
        return;
    }

    const projectCard = document.createElement('div');
    projectCard.classList.add('project-card');

    const projectTitle = document.createElement('h3');
    projectTitle.textContent = project.name;

    const projectStatus = document.createElement('p');
    projectStatus.textContent = `Status: ${project.status}`;

    const projectClient = document.createElement('p');
    projectClient.innerHTML = `<strong>Client:</strong> ${project.client}`;

    const projectDeadline = document.createElement('p');
    projectDeadline.innerHTML = `<strong>Deadline:</strong> ${project.deadline}`;

    const projectTeam = document.createElement('p');
    projectTeam.innerHTML = `<strong>Team Members:</strong> ${project.team}`;

    const projectLink = document.createElement('a');
    projectLink.href = '#';
    projectLink.textContent = 'View Project Details';

    projectLink.addEventListener('click', (e) => {
        e.preventDefault();
        viewProjectDetails();
    });

    projectCard.appendChild(projectTitle);
    projectCard.appendChild(projectStatus);
    projectCard.appendChild(projectClient);
    projectCard.appendChild(projectDeadline);
    projectCard.appendChild(projectTeam);
    projectCard.appendChild(projectLink);

    projectDetails.appendChild(projectCard);
}

function viewProjectDetails() {
    document.getElementById('viewProjectTitle').textContent = project.name || 'N/A';
    document.getElementById('viewProjectDescription').textContent = project.description || 'No description available';
    document.getElementById('viewProjectClient').textContent = project.client || 'Unknown client';
    document.getElementById('viewProjectDeadline').textContent = project.deadline || 'No deadline';
    document.getElementById('viewProjectTeam').textContent = project.team || 'No team members assigned';

    document.getElementById('viewProjectModal').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gotoSprint').onclick = function () {
        window.location.href = 'index.html';
    };

    document.getElementById('gotoBacklog').onclick = function () {
        window.location.href = 'backlog.html';
    };

    document.querySelector('.close').onclick = function() {
        document.getElementById('viewProjectModal').style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == document.getElementById('viewProjectModal')) {
            document.getElementById('viewProjectModal').style.display = 'none';
        }
    };
});
document.querySelector('.close').onclick = function() {
    document.getElementById('viewProjectModal').style.display = 'none';
};

window.onclick = function(event) {
    if (event.target == document.getElementById('viewProjectModal')) {
        document.getElementById('viewProjectModal').style.display = 'none';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    populateProjects();

    const filterInput = document.getElementById('projectFilter');
    filterInput.addEventListener('input', filterProjects);

    const createProjectModal = document.getElementById('createProjectModal');
    const createProjectBtn = document.getElementById('createProjectBtn');
    const closeSpan = createProjectModal.querySelector('.close');
    const closeViewModalSpan = document.getElementById('viewProjectModal').querySelector('.close');

    createProjectBtn.onclick = () => {
        createProjectModal.style.display = 'block';
    }

    closeSpan.onclick = () => {
        createProjectModal.style.display = 'none';
    }

    closeViewModalSpan.onclick = () => {
        document.getElementById('viewProjectModal').style.display = 'none';
    }

    window.onclick = (event) => {
        if (event.target === createProjectModal) {
            createProjectModal.style.display = 'none';
        }
        if (event.target === document.getElementById('viewProjectModal')) {
            document.getElementById('viewProjectModal').style.display = 'none';
        }
    }
});