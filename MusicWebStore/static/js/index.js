document.addEventListener("DOMContentLoaded", function () {

    fetch('/api/user_status')
    .then(response => response.json())
    .then(data => {
        const profileButton = document.querySelector('.profile-button');
        if (data.logged_in) {
            profileButton.textContent = data.username;
            profileButton.onclick = () => location.href = '/profile';
        } else {
            profileButton.textContent = "Login";
            profileButton.onclick = () => location.href = '/login';
        }
        });
    });