if (typeof(Storage) !== "undefined") {
    document.addEventListener('DOMContentLoaded', async () => {
        users = await getUsersFromStorage();

        const loginForm = document.querySelector('form');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
    });
} else {
    alert("Sorry, your browser does not support Web Storage...");
}

async function getUsersFromStorage() {
    if (!localStorage.getItem('usersDB')) {
        await getUsersFromDatabase();
    }
    const storedUsers = localStorage.getItem('usersDB');
    return JSON.parse(storedUsers);
}

function getUsersFromDatabase() {
    return fetch("./Database/Users.json")
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("usersDB", JSON.stringify(data));
            return data;
        });
}

function handleLogin(event) {
    event.preventDefault();

    // Get the input values
    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    let userName = null;

    users.forEach((user, index) => {
        if (user.username.toLowerCase() === username.toLowerCase() && user.password === password) {
            userName = user.username;
            localStorage.setItem('currentUser', user.username);
        }
    });

    const modal = document.getElementById("loginModal");
    const modalMessage = document.getElementById("modalMessage");
    const closeModalBtn = document.querySelector(".close");

    if (userName) {
        modalMessage.textContent = "Login successful!";
        modal.style.display = "block";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    } else {
        modalMessage.textContent = "Invalid username or password!";
        modal.style.display = "block";
    }

    closeModalBtn.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}
document.addEventListener('DOMContentLoaded', async () => {
    try {
        users = await getUsersFromStorage();
        const loginForm = document.querySelector('form');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
    } catch (error) {
        console.error("Error loading users:", error);
    }
});