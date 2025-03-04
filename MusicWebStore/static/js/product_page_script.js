import { fetchUserStatus } from './major_functions.js';
import { initializeSearchForm } from './minor_functions.js';

document.addEventListener("DOMContentLoaded", function () {
    fetchUserStatus();
    initializeSearchForm();

    
});
