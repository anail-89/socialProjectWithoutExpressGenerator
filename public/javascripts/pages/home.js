window.addEventListener('load', function(event) {
    document.getElementById("log-out").addEventListener('click', (e) => {
        window.localStorage.removeItem('token');
        window.location.href = '/login';
    });
});