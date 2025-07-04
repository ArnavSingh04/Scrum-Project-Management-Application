// Modal functionality
const modal = document.getElementById('report-modal');
const btn = document.getElementById('view-reports-btn');
const closeBtn = document.getElementsByClassName('close')[0];

btn.onclick = function() {
    const userSelect = document.getElementById('user-select');
    if (userSelect.value) {
        modal.style.display = 'block';
        loadReports(userSelect.value); // Load the reports for the selected user
    } else {
        alert('Please select a user!');
    }
}

closeBtn.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Function to load reports (Placeholder)
function loadReports(userId) {
    // Mock data fetching
    const avgTimeData = {
        range: "01/01/2023 - 31/01/2023",
        avgTime: 5.4 // Placeholder for average time logged
    };

    const timeLoggedData = [{date: '01/01/2023',time: 4},
    {date: '02/01/2023', time: 6},
    {date: '03/01/2023', time: 5},
    {date: '04/01/2023', time: 8},
    {date: '05/01/2023', time: 10},
    {date: '06/01/2023', time: 7}];

    // Populate Report 1 (Average Time)
    const avgTimeTable = document.getElementById('avg-time-logged').getElementsByTagName('tbody')[0];
    avgTimeTable.innerHTML = `
                <tr>
                    <td>${avgTimeData.range}</td>
                    <td>${avgTimeData.avgTime} hrs</td>
                </tr>
            `;

    // Populate Report 2 (Time Logged vs Day) using Chart.js
    const ctx = document.getElementById('time-logged-chart').getContext('2d');
    const labels = timeLoggedData.map(item => item.date);
    const data = timeLoggedData.map(item => item.time);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Time Logged (hrs)',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
async function getTimeLoggedFromStorage() {
    if (!localStorage.getItem('TimeLoggedDB')) {
        await getTimeLoggedFromDatabase();
    }
    const storedUsers = localStorage.getItem('usersDB');
    return JSON.parse(storedUsers);
}

function getTimeLoggedFromDatabase() {
    return fetch("./Database/Timelogged.json")
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("usersDB", JSON.stringify(data));
            return data;
        });
}

