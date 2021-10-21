import { register } from '../api/auth.js';
window.addEventListener('load', () => {
    document.getElementById('register').addEventListener('click', async() => {
        const error = document.getElementById('error');
        error.innerText = '';
        const username = document.querySelector('input[name="username"]').value;
        const password = document.querySelector('input[name="password"]').value;
        const name = document.querySelector('input[name="name"]').value;
        const file = document.querySelector('input[name="image"]').files['0'];
        // console.log(username, name, password, file);
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('name', name);
        formData.append('image', file);
        console.log(formData);
        register(formData).then(data => {
            if (data.success === true) {
                window.location.href = '/login';
            } else {
                error.innerText = data.message;
                console.error(data);
            }

        }).catch(e => {

            console.log(e.message);
        })
    });
});