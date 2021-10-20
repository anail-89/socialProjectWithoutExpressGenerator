import { login } from '../api/auth.js';
window.addEventListener('load', () => {
    document.getElementById('login').addEventListener('click', async() => {
        const username = document.querySelector('input[name="username"]').value;
        const password = document.querySelector('input[name="password"]').value;
        console.log(username, password);

        // const formData = new FormData();
        // formData.append('username', username);
        // formData.append('password', password);
        // console.log(formData);

        login(username, password)
            .then(data => {
                if (data.success === true) {
                    console.log(data);
                    //window.location.href = '/login.html';
                } else {
                    console.error(data);
                }

            }).catch(e => {
                console.log(e);
            });
    });
});