export const getCurrentUserData = async() => {
    const token = window.localStorage.getItem('token');
    if (token) {
        const response = await fetch('http://localhost:3000/users/current', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },

        });
        console.log(response);
        if (response.status === 401) {
            window.localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return response.json();
    }
};