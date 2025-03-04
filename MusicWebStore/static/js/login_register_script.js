import { handleLoginSubmit, handleRegisterSubmit } from './major_functions.js';

document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab-button");
    const forms = document.querySelectorAll(".auth-form");
    const primaryButton = document.querySelector(".primary-button");
    const authContainer = document.querySelector(".auth-container");
    const closeButtons = document.querySelectorAll(".close-form");
    const loginForm = document.getElementById("login-form");
    
    // Show the auth container
    authContainer.classList.add("show");
    
    // Make sure login tab is active initially
    const loginTab = document.querySelector('.tab-button[data-tab="login"]');
    if (loginTab) {
        loginTab.classList.add("active");
    }
    
    // Show login form and ensure it's not hidden
    loginForm.classList.remove("hidden");
    loginForm.classList.add("show");
    
    // Set primary button text for login
    primaryButton.textContent = "Login";
    
    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            tabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
            
            forms.forEach(form => {
                form.classList.remove("show");
                setTimeout(() => form.classList.add("hidden"), 300);
            });
            
            const selectedForm = document.getElementById(this.dataset.tab + "-form");
            selectedForm.classList.remove("hidden");
            primaryButton.textContent = this.dataset.tab === "login" ? "Login" : "Create Account";
            setTimeout(() => selectedForm.classList.add("show"), 50);
        });
    });
    
    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            authContainer.classList.remove("show");
            setTimeout(() => authContainer.classList.add("hidden"), 300);
            window.location.href = "/";
        });
    });
    
    document.getElementById("login-form").addEventListener("submit", handleLoginSubmit);
    document.getElementById("register-form").addEventListener("submit", handleRegisterSubmit);
});