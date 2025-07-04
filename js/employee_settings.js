document.addEventListener('DOMContentLoaded', () => {
    let username = localStorage.getItem('currentUser');
    const employeeNameElement = document.getElementById('employeeName');

    if (employeeNameElement) {
        employeeNameElement.textContent = username;
    } else {
        console.error('Element with ID "employeeName" not found.');
    }

    const modal = document.getElementById('passwordModal');
    const changePasswordLink = document.getElementById('change-password');
    const closeSpan = document.querySelector('.modal .close');

    changePasswordLink.onclick = (event) => {
        event.preventDefault();
        modal.style.display = 'block';
    };

    closeSpan.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // The font size handling has been removed
});

// Function to handle password change
function handlePasswordChange(event) {
    event.preventDefault(); // Prevent the form from submitting
    const storedUsers = localStorage.getItem('usersDB');
    const users = JSON.parse(storedUsers) || []; // Ensure users is an array
    const currentUser = localStorage.getItem('currentUser');
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const userIndex = users.findIndex(user => user.username === currentUser);

    if (userIndex !== -1) { // Ensure user is found
        let user = users[userIndex];
        if (user.password === currentPassword) {
            updatePassword(users, userIndex, newPassword, confirmPassword);
        } else {
            alert('Current password is incorrect.');
        }
    } else {
        alert('User not found.');
    }
}

// Function to update the password
function updatePassword(users, userIndex, newPassword, confirmPassword) {
    if (newPassword === confirmPassword) {
        alert('Password changed successfully!');
        users[userIndex].password = newPassword;
        // Update local storage
        localStorage.setItem('usersDB', JSON.stringify(users));
    } else {
        alert('Passwords do not match!');
    }
}