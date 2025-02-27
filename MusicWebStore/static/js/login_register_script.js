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
            window.location.href = "/";
        });
    });

    document.getElementById("login-form").addEventListener("submit", async function (e) {
        e.preventDefault();
    
        const username = document.querySelector("#login-form input[type='text']").value;
        const password = document.querySelector("#login-form input[type='password']").value;
    
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "login", username, password })
        });
    
        const data = await response.json();
        if (response.ok) {
            alert("Login successful!");
            window.location.href = "/";
        } else {
            alert(data.error);
        }
    });
    
    document.getElementById("register-form").addEventListener("submit", async function (e) {
        e.preventDefault();
    
        const formData = {
            action: "register",
            username: document.querySelector("#register-form input[placeholder='Username...']").value,
            name: document.querySelector("#register-form input[placeholder='Name...']").value,
            surname: document.querySelector("#register-form input[placeholder='Surname...']").value,
            email: document.querySelector("#register-form input[placeholder='E-mail...']").value,
            password: document.querySelector("#register-form input[placeholder='Password...']").value
        };
    
        const response = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
    
        const data = await response.json();
        if (response.ok) {
            alert("Registration successful! You can now log in.");
        } else {
            alert(data.error);
        }
    });
    
});
