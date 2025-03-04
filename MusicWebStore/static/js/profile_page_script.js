import { fetchSubscriptionStatus, fetchUserStatus } from './major_functions.js';
import { openTab } from './minor_functions.js';

document.addEventListener("DOMContentLoaded", function () {
    window.openTab = openTab;
    
    fetchUserStatus()
        .then(data => {
            if (!data.logged_in) {
                window.location.href = "/login";
                return;
            }
            return fetchUserProfile();
        })
        .catch(error => {
            console.error("Error checking login status:", error);
        });
    
    const firstTabButton = document.querySelector('.tab-button');
    if (firstTabButton) {
        const mockEvent = { currentTarget: firstTabButton };
        openTab(mockEvent, 'profile');
    }
});

function fetchUserProfile() {
    return fetch('/api/user/profile')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }
            return response.json();
        })
        .then(userData => {
            updateProfileDisplay(userData);
            return userData;
        })
        .catch(error => {
            console.error("Error loading profile data:", error);
            // Display error message in the profile info section
            const profileInfoElement = document.querySelector('.profile-info');
            if (profileInfoElement) {
                profileInfoElement.innerHTML = `
                    <p>Error loading profile data.</p>
                    <p>Please try refreshing the page.</p>
                `;
            }
        });
}

function updateProfileDisplay(userData) {
    const profileInfoElement = document.querySelector('.profile-info');
    
    fetchSubscriptionStatus()
        .then(subscriptionData => {
            if (profileInfoElement) {
                profileInfoElement.innerHTML = `
                    <p><strong>Username:</strong> ${userData.username || 'Not set'}</p>
                    <p><strong>Name:</strong> ${userData.name || 'Not set'}</p>
                    <p><strong>Surname:</strong> ${userData.surname || 'Not set'}</p>
                    <p><strong>E-mail:</strong> ${userData.email || 'Not set'}</p>
                    <p><strong>Subscription type:</strong> ${subscriptionData.type || 'Not set'}</p>
                    <p><strong>Start date:</strong> ${subscriptionData.start_date || 'Not set'}</p>
                    <p><strong>End date:</strong> ${subscriptionData.end_date || 'Not set'}</p>
                    <p><strong>Subscription status:</strong> ${subscriptionData.status || 'Not set'}</p>
                    <p><strong>Price:</strong> ${subscriptionData.price || 'Not set'}</p>
                `;
            }
        })
        .catch(error => {
            console.error("Error loading subscription data:", error);
            if (profileInfoElement) {
                profileInfoElement.innerHTML = `
                    <p><strong>Username:</strong> ${userData.username || 'Not set'}</p>
                    <p><strong>Name:</strong> ${userData.name || 'Not set'}</p>
                    <p><strong>Surname:</strong> ${userData.surname || 'Not set'}</p>
                    <p><strong>E-mail:</strong> ${userData.email || 'Not set'}</p>
                    <p><strong>Subscription:</strong> Error loading subscription data</p>
                `;
            }
        });
    
    const profileImageElement = document.querySelector('.profile-picture img');
    if (profileImageElement && userData.profile_picture) {
        profileImageElement.src = userData.profile_picture;
    }
}