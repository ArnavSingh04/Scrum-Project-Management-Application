let admins = getAdminsFromStorage();
let adminName;

if (typeof(Storage) !== "undefined") {
    document.addEventListener('DOMContentLoaded', async () => {
        admins = await getAdminsFromStorage();

        const adminLoginForm = document.querySelector('form');
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', handleLogin);
        }
    });
} else {
    alert("Sorry, your browser does not support Web Storage...");
}

async function getAdminsFromStorage() {
    if (!localStorage.getItem('adminsDB')) {
        await getAdminsFromDatabase();
    }
    const storedAdmins = localStorage.getItem('adminsDB');
    return JSON.parse(storedAdmins);
}

function getAdminsFromDatabase() {
    return fetch("./Database/Admins.json")
        .then(response => response.json())
        .then(data => {
            console.log("Admins data fetched:", data);
            localStorage.setItem("adminsDB", JSON.stringify(data));
            return data;
        })
        .catch(error => {
            console.error("Error fetching Admins.json:", error);
        });
}
function handleLogin(event) {
    event.preventDefault();

    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    let adminName = null;

    admins.forEach((admin) => {
        if (admin.username.toLowerCase() === username.toLowerCase() && admin.password === password) {
            adminName = admin.username;
            localStorage.setItem('currentAdmin', admin.username);
        }
    });

    const modal = document.getElementById("loginModal");
    const modalMessage = document.getElementById("modalMessage");
    const closeModalBtn = document.querySelector(".close");

    if (adminName) {
        modalMessage.textContent = "Login successful!";
        modal.style.display = "block";

        setTimeout(() => {
            window.location.href = "admin_homepage.html";
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