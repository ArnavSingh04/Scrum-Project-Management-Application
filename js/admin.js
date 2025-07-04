
users = JSON.parse(localStorage.getItem('usersDB'))
function handleCreateUser(event){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    users.push(
        {
            username: username,
            password: password
        }
    )
    saveUsersToStorage(users)

    alert('User created successfully!')
}

function saveUsersToStorage(users) {
    localStorage.setItem('usersDB', JSON.stringify(users));
}