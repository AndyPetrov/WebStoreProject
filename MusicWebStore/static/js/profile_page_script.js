document.addEventListener("DOMContentLoaded", function () {

	fetch('/api/user_status')
    .then(response => response.json())
    .then(data => {
        const profileButton = document.querySelector('.profile-button');
        if (data.logged_in) {
            profileButton.textContent = data.username;
            profileButton.onclick = () => location.href = '/profile';
        } else {
            profileButton.textContent = "Login"; // Излишно но остава за всеки случай
            profileButton.onclick = () => location.href = '/login';
			window.location.href = "/login";
        }
    });

	function openTab(evt, tabName) {
		let i, tabContent, tabButtons;

		tabContent = document.querySelectorAll(".tab-content");
		tabContent.forEach((content) => content.classList.remove("active"));

		tabButtons = document.querySelectorAll(".tab-button");
		tabButtons.forEach((button) => button.classList.remove("active"));

		document.getElementById(tabName).classList.add("active");
		evt.currentTarget.classList.add("active");
	}

	window.openTab = openTab;
});
