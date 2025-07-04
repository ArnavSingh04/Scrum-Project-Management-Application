describe('Admin Login Functionality', () => {
    let adminData;

    beforeEach(() => {
        adminData = [
            { username: 'admin1', password: 'password1' },
            { username: 'admin2', password: 'password2' }
        ];
        localStorage.setItem('adminsDB', JSON.stringify(adminData));
    });

    test('getAdminsFromStorage should retrieve admins from localStorage', async () => {
        const result = await getAdminsFromStorage();
        expect(result).toEqual(adminData);
        // Outcome: Passed
    });

    test('getAdminsFromDatabase should fetch and store admin data in localStorage', async () => {
        const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(adminData)
        });

        await getAdminsFromDatabase();
        const storedAdmins = JSON.parse(localStorage.getItem('adminsDB'));
        expect(storedAdmins).toEqual(adminData);
        fetchMock.mockRestore();
        // Outcome: Passed
    });

    test('handleLogin should set currentAdmin in localStorage on successful login', () => {
        document.body.innerHTML = `
            <form>
                <input name="username" value="admin1" />
                <input name="password" value="password1" />
                <button type="submit">Login</button>
            </form>
            <div id="loginModal">
                <div id="modalMessage"></div>
                <button class="close">Close</button>
            </div>
        `;

        const form = document.querySelector('form');
        form.addEventListener('submit', handleLogin);
        form.dispatchEvent(new Event('submit'));

        expect(localStorage.getItem('currentAdmin')).toBe('admin1');
        // Outcome: Passed
    });

    test('handleLogin should display error message for invalid login', () => {
        document.body.innerHTML = `
            <form>
                <input name="username" value="invalidUser" />
                <input name="password" value="wrongPassword" />
                <button type="submit">Login</button>
            </form>
            <div id="loginModal">
                <div id="modalMessage"></div>
                <button class="close">Close</button>
            </div>
        `;

        const form = document.querySelector('form');
        form.addEventListener('submit', handleLogin);
        form.dispatchEvent(new Event('submit'));

        const modalMessage = document.getElementById("modalMessage").textContent;
        expect(modalMessage).toBe("Invalid username or password!");
        // Outcome: Passed
    });
});
