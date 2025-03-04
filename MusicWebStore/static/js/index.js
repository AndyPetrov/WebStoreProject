import { fetchUserStatus } from './major_functions.js';
import { handleExistingSearchQuery, initializeSearchBar } from './minor_functions.js';

document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("itemMenu");
    if (!container) {
        console.error("Error: #itemMenu not found in DOM.");
        return;
    }

    fetchUserStatus();
    initializeSearchBar();
    
    handleExistingSearchQuery();
});
