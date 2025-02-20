document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab-button");
    const forms = document.querySelectorAll(".auth-form");
    const primaryButton = document.querySelector(".primary-button");
    const authContainer = document.querySelector(".auth-container");
    const closeButtons = document.querySelectorAll(".close-form");
    const loginForm = document.getElementById("login-form");

    authContainer.classList.add("show");
    document.getElementById("login-form").classList.add("show");

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            tabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");

            forms.forEach(form => form.classList.add("hidden"));
            const selectedForm = document.getElementById(this.dataset.tab + "-form");
            selectedForm.classList.remove("hidden");

            primaryButton.textContent = this.dataset.tab === "login" ? "Login" : "Create Account";

            // Smooth show effect
            setTimeout(() => selectedForm.classList.add("show"), 50);
        });
    });

    // Close form
    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            authContainer.classList.remove("show");
            setTimeout(() => authContainer.classList.add("hidden"), 300);
        });
    });
});
