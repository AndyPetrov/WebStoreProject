document.addEventListener("DOMContentLoaded", function () {
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
