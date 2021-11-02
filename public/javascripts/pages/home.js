import { getCurrentUserData } from '../api/user.js';
window.addEventListener('load', function(event) {
    document.getElementById("log-out").addEventListener('click', (e) => {
        window.localStorage.removeItem('token');
        window.location.href = '/login';
    });
    getCurrentUserData().then((response) => {
        if (response.success === true) {
            document.getElementById('user-name').innerHTML = `Hi ${response.data.name}`;
            console.log(response);
        } else {
            console.log(response);
        }
    });


});