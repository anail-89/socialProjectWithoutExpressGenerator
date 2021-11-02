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
            .then(response => {
                if (response.success === true) {
                    const token = window.localStorage.getItem('token');
                    if (token) {
                        window.location.href = '/home';
                    }

                    window.localStorage.setItem('token', response.data);
                    window.location.href = '/home';
                } else {
                    document.getElementById('error').innerHTML = response.message;

                }

            }).catch(e => {

                console.error(e);
            });
    });
});