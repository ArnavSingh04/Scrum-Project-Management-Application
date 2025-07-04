function drawCharts() {
    const sprintData = JSON.parse(localStorage.getItem('allSprints')) || [];

    const sprintReportsContainer = document.getElementById('sprintReportsContainer');
    sprintReportsContainer.innerHTML = '';

    sprintData.forEach((sprint, index) => {
        const idealDivId = `ideal_burndown_${index}`;
        const actualDivId = `actual_burndown_${index}`;


        const sprintReportDiv = document.createElement('div');
        sprintReportDiv.classList.add('sprint-chart-container');
        sprintReportDiv.innerHTML = `
            <h3>Sprint ${index + 1}: ${sprint.sprintName}</h3>
            <div class="chart-pair" style="display: flex; justify-content: space-between; gap: 20px;">
                <div id="${idealDivId}" style="width: 600px; height: 400px;"></div>
                <div id="${actualDivId}" style="width: 600px; height: 400px;"></div>
            </div>
        `;
        sprintReportsContainer.appendChild(sprintReportDiv);


        drawBurndownChartPlotly(sprint, idealDivId, actualDivId);
    });
}
function drawBurndownChartPlotly(sprint, idealDivId, actualDivId) {
    const sprintDays = calculateSprintDays(sprint.startDate, sprint.endDate);
    const totalStoryPoints = calculateTotalStoryPoints(sprint.tasks);


    const idealData = {
        x: Array.from({ length: sprintDays + 1 }, (_, i) => i + 1),
        y: Array.from({ length: sprintDays + 1 }, (_, i) => totalStoryPoints - (i * (totalStoryPoints / sprintDays))),
        mode: 'lines',
        name: 'Ideal Burndown',
        hovertemplate: '%{y} Story Points<extra></extra>'
    };


    const actualData = {
        x: Array.from({ length: sprintDays + 1 }, (_, i) => i + 1),
        y: calculateActualBurndown(sprint.tasks, sprintDays, totalStoryPoints),
        mode: 'lines',
        name: 'Actual Burndown',
        hovertemplate: '%{y} Story Points<extra></extra>'
    };


    const layout = {
        title: 'Sprint Burndown',
        showlegend: true,
        yaxis: { title: 'Story Points Remaining' },
        xaxis: { showticklabels: false },
        hovermode: 'x unified',
    };

    Plotly.newPlot(idealDivId, [idealData], layout);
    Plotly.newPlot(actualDivId, [actualData], layout);
}

function calculateSprintDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
}

function calculateTotalStoryPoints(tasks) {
    return tasks.reduce((total, task) => total + task.storyPoints, 0);
}

function calculateActualBurndown(tasks, sprintDays, totalStoryPoints) {
    const actualBurndown = Array(sprintDays + 1).fill(totalStoryPoints);
    let remainingStoryPoints = totalStoryPoints;


    const hoursPerStoryPoint = 3;
    const dayBurns = Array(sprintDays).fill(0);

    tasks.forEach(task => {
        if (task.loggedHours) {
            const storyPointsBurned = task.loggedHours / hoursPerStoryPoint;
            const dayLogged = Math.floor(Math.random() * sprintDays);

            dayBurns[dayLogged] += storyPointsBurned;
        }
    });


    for (let i = 1; i <= sprintDays; i++) {
        remainingStoryPoints -= dayBurns[i - 1];
        actualBurndown[i] = Math.max(remainingStoryPoints, 0);
    }

    console.log("Final actual burndown array:", actualBurndown);
    return actualBurndown;
}
document.addEventListener('DOMContentLoaded', drawCharts);
