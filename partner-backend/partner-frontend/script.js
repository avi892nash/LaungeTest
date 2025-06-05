document.addEventListener('DOMContentLoaded', () => {
    const offerForm = document.getElementById('offerForm');
    const responseMessage = document.getElementById('responseMessage');
    const loadOffersButton = document.getElementById('loadOffersButton');
    const currentOffersContainer = document.getElementById('currentOffersContainer');
    const amenitiesContainer = document.getElementById('amenitiesContainer');
    const addAmenityButton = document.getElementById('addAmenityButton');

    const API_URL = 'http://localhost:3001/api'; // Backend server URL

    let amenityCounter = 0;

    // Function to add a new amenity input group
    addAmenityButton.addEventListener('click', () => {
        amenityCounter++;
        const amenityDiv = document.createElement('div');
        amenityDiv.classList.add('amenity-entry');
        amenityDiv.innerHTML = `
            <input type="text" name="amenityName${amenityCounter}" placeholder="Amenity Name (e.g., Wi-Fi)" required>
            <input type="text" name="amenityIcon${amenityCounter}" placeholder="Icon Path (e.g., wifi.png)" required>
            <button type="button" class="removeAmenityButton">Remove</button>
        `;
        amenitiesContainer.appendChild(amenityDiv);

        amenityDiv.querySelector('.removeAmenityButton').addEventListener('click', function() {
            this.parentElement.remove();
        });
    });
    
    // Add one amenity field by default
    addAmenityButton.click();


    offerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        responseMessage.textContent = '';
        responseMessage.className = '';

        const formData = new FormData(offerForm);
        const offerData = {};

        // Basic form data
        for (let [key, value] of formData.entries()) {
            if (!key.startsWith('amenityName') && !key.startsWith('amenityIcon')) {
                 if (key === 'images') { // Handle comma-separated images
                    offerData[key] = value.split(',').map(s => s.trim()).filter(s => s);
                } else {
                    offerData[key] = value;
                }
            }
        }
        
        // Consolidate amenities
        offerData.amenities = [];
        const amenityInputs = amenitiesContainer.querySelectorAll('.amenity-entry');
        let amenitiesCount = 0;
        amenityInputs.forEach(entry => {
            const nameInput = entry.querySelector('input[placeholder="Amenity Name (e.g., Wi-Fi)"]');
            const iconInput = entry.querySelector('input[placeholder="Icon Path (e.g., wifi.png)"]');
            if (nameInput && iconInput && nameInput.value.trim() && iconInput.value.trim()) {
                offerData.amenities.push({
                    id: `a${Date.now()}${amenitiesCount + 1}`, // Simple unique ID for amenity
                    name: nameInput.value.trim(),
                    icon: iconInput.value.trim() // Will be processed by backend
                });
                amenitiesCount++;
            }
        });
        offerData.amenitiesCount = amenitiesCount;


        // Ensure image paths are relative to src/assets/images/ for the demo
        if (offerData.image && !offerData.image.startsWith('src/assets/images/')) {
            offerData.image = `src/assets/images/${offerData.image.replace(/^src\/assets\/images\//, '')}`;
        }
        if (offerData.bankLogo && !offerData.bankLogo.startsWith('src/assets/images/')) {
            offerData.bankLogo = `src/assets/images/${offerData.bankLogo.replace(/^src\/assets\/images\//, '')}`;
        }
        if (offerData.images && Array.isArray(offerData.images)) {
            offerData.images = offerData.images.map(img => 
                img && !img.startsWith('src/assets/images/') ? `src/assets/images/${img.replace(/^src\/assets\/images\//, '')}` : img
            );
        }
        offerData.amenities = offerData.amenities.map(amenity => ({
            ...amenity,
            icon: amenity.icon && !amenity.icon.startsWith('src/assets/images/') ? `src/assets/images/${amenity.icon.replace(/^src\/assets\/images\//, '')}` : amenity.icon
        }));


        try {
            const response = await fetch(`${API_URL}/integrate-offer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(offerData),
            });

            const result = await response.json();

            if (response.ok) {
                responseMessage.textContent = result.message || 'Offer integrated successfully!';
                responseMessage.classList.add('success');
                offerForm.reset();
                // Clear and re-add one default amenity field
                amenitiesContainer.innerHTML = '';
                amenityCounter = 0;
                addAmenityButton.click();
                loadCurrentOffers(); // Refresh the list
            } else {
                responseMessage.textContent = result.message || 'Failed to integrate offer.';
                responseMessage.classList.add('error');
            }
        } catch (error) {
            console.error('Error submitting offer:', error);
            responseMessage.textContent = 'An error occurred. Please try again.';
            responseMessage.classList.add('error');
        }
    });

    async function loadCurrentOffers() {
        currentOffersContainer.innerHTML = '<p>Loading offers...</p>';
        try {
            const response = await fetch(`${API_URL}/offers`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const offers = await response.json();
            
            if (offers && offers.length > 0) {
                currentOffersContainer.innerHTML = ''; // Clear loading message
                offers.forEach(offer => {
                    const offerDiv = document.createElement('div');
                    offerDiv.innerHTML = `
                        <h4>${offer.name} (ID: ${offer.id})</h4>
                        <p><strong>Partner:</strong> ${offer.bankName}</p>
                        <p><strong>Offer Type:</strong> ${offer.offerType}</p>
                        <details>
                            <summary>View Full Data</summary>
                            <pre>${JSON.stringify(offer, null, 2)}</pre>
                        </details>
                        <hr>
                    `;
                    currentOffersContainer.appendChild(offerDiv);
                });
            } else {
                currentOffersContainer.innerHTML = '<p>No offers found or unable to load data.</p>';
            }
        } catch (error) {
            console.error('Error loading offers:', error);
            currentOffersContainer.innerHTML = `<p>Error loading offers: ${error.message}. Make sure the backend server is running.</p>`;
        }
    }

    loadOffersButton.addEventListener('click', loadCurrentOffers);
    
    // Optionally, load offers on page load
    // loadCurrentOffers(); 
});
