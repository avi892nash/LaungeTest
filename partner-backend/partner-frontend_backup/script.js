document.addEventListener('DOMContentLoaded', () => {
    // Navigation elements
    const navIntegrateOfferLink = document.getElementById('navIntegrateOffer');
    const navViewMerchantsLink = document.getElementById('navViewMerchants');
    const integrateOfferSection = document.getElementById('integrateOfferSection');
    const viewMerchantsSection = document.getElementById('viewMerchantsSection');

    // Form and offer display elements
    const offerForm = document.getElementById('offerForm');
    const responseMessage = document.getElementById('responseMessage'); // This is inside the form section
    const loadOffersButton = document.getElementById('loadOffersButton');
    const currentOffersContainer = document.getElementById('currentOffersContainer'); // For merchant list
    // const merchantListContainer = document.getElementById('merchantListContainer'); // Not used with current HTML structure
    // const offerDetailContainer = document.getElementById('offerDetailContainer'); // Not used with current HTML structure
    const amenitiesCheckboxesContainer = document.getElementById('amenitiesCheckboxesContainer'); // New container for checkboxes
    // const addAmenityButton = document.getElementById('addAmenityButton'); // To be removed

    const API_URL = 'http://localhost:3001/api'; // Backend server URL

    const PREDEFINED_AMENITIES = [
        { id: "wifi", name: "Wi-Fi", icon: "wifi.png" },
        { id: "shower", name: "Shower", icon: "shower.png" },
        { id: "food_beverage", name: "Food & Beverage", icon: "beer.png" },
        { id: "flight_info", name: "Flight Information", icon: "flight.png" },
        { id: "restrooms", name: "Restrooms", icon: "toilet.png" },
        { id: "reception", name: "Reception", icon: "receptionist_bell.png" },
        { id: "fridge", name: "Refrigerator", icon: "fridge.png" },
        { id: "ice_cream", name: "Ice Cream", icon: "ice_cream.png" }
        // Add more as needed, ensure icons exist in partner-backend/public/images/
    ];

    // Populate Amenity Checkboxes
    function populateAmenities() {
        if (!amenitiesCheckboxesContainer) return;
        amenitiesCheckboxesContainer.innerHTML = ''; // Clear any existing
        PREDEFINED_AMENITIES.forEach(amenity => {
            const checkboxDiv = document.createElement('div');
            checkboxDiv.classList.add('amenity-checkbox-item');
            checkboxDiv.innerHTML = `
                <input type="checkbox" id="amenity-${amenity.id}" name="amenities" value="${amenity.id}">
                <label for="amenity-${amenity.id}">${amenity.name}</label>
            `;
            amenitiesCheckboxesContainer.appendChild(checkboxDiv);
        });
    }
    populateAmenities();


    offerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        responseMessage.textContent = '';
        responseMessage.className = '';

        const formData = new FormData(offerForm); // FormData will handle file uploads and other fields

        // Collect selected amenities
        const amenitiesData = [];
        const selectedAmenityCheckboxes = amenitiesCheckboxesContainer.querySelectorAll('input[name="amenities"]:checked');
        
        selectedAmenityCheckboxes.forEach(checkbox => {
            const amenityId = checkbox.value;
            const amenityDetails = PREDEFINED_AMENITIES.find(a => a.id === amenityId);
            if (amenityDetails) {
                amenitiesData.push({
                    id: amenityDetails.id, // Use predefined ID
                    name: amenityDetails.name,
                    icon: amenityDetails.icon
                });
            }
        });
        
        // Append amenities array as JSON string. The count is implicit in the array length.
        formData.append('amenities', JSON.stringify(amenitiesData));
        // formData.append('amenitiesCount', amenitiesData.length.toString()); // Backend can derive from array length

        // Note: File inputs (image, bankLogo, images) are automatically handled by FormData.
        // The 'name' attribute of these input fields in HTML must match what the backend expects.
        // The old 'offerData' object and its manual construction for basic fields are no longer needed here,
        // as FormData directly takes values from form fields with 'name' attributes.
        // The logic for splitting comma-separated 'images' text is also removed as it's now a file input.

        // The old image path manipulation logic is no longer needed with file uploads.

        try {
            // When sending FormData with files, do NOT set Content-Type header.
            // The browser will set it automatically to 'multipart/form-data' with the correct boundary.
            const response = await fetch(`${API_URL}/integrate-offer`, {
                method: 'POST',
                body: formData, // Send formData directly, which includes text fields and files
            });

            const result = await response.json();

            if (response.ok) {
                responseMessage.textContent = result.message || 'Offer integrated successfully!';
                responseMessage.classList.add('success');
                offerForm.reset();
                // Clear selected amenity checkboxes
                populateAmenities(); // Re-populates and thus unchecks them
                // loadCurrentOffers(); // This function is not defined in this scope, should be loadMerchantsAndOffers if called from view section
                if (typeof loadMerchantsAndOffers === "function" && viewMerchantsSection.style.display === 'block') {
                    loadMerchantsAndOffers(); // Refresh the list if on the view merchants tab
                }
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

    loadOffersButton.addEventListener('click', loadMerchantsAndOffers); // Renamed function

    // New function to display offers for a specific merchant
    function displayOffersForMerchant(merchantName, allOffers, targetContainer) {
        targetContainer.innerHTML = ''; // Clear previous merchant's offers
        const merchantOffers = allOffers.filter(offer => offer.bankName === merchantName);

        if (merchantOffers.length > 0) {
            const offersHeader = document.createElement('h3');
            offersHeader.textContent = `Offers from ${merchantName}`;
            targetContainer.appendChild(offersHeader);

            merchantOffers.forEach(offer => {
                const offerDiv = document.createElement('div');
                offerDiv.classList.add('offer-detail-item'); // Add a class for styling if needed
                offerDiv.innerHTML = `
                    <h4>${offer.name} (ID: ${offer.id})</h4>
                    <p><strong>Offer Type:</strong> ${offer.offerType}</p>
                    <details>
                        <summary>View Full Data</summary>
                        <pre>${JSON.stringify(offer, null, 2)}</pre>
                    </details>
                    <hr>
                `;
                targetContainer.appendChild(offerDiv);
            });
        } else {
            targetContainer.innerHTML = `<p>No offers found for ${merchantName}.</p>`;
        }
    }

    async function loadMerchantsAndOffers() {
        // Use currentOffersContainer for merchants list, and a new one for offer details
        // Or dynamically switch content within currentOffersContainer
        const merchantsDisplayContainer = currentOffersContainer; // For simplicity, reuse for now
        const offersDisplayContainer = document.createElement('div'); // Create a new div for offers
        offersDisplayContainer.id = 'selectedMerchantOffers';
        
        // Clear existing content and append the new offers display area
        merchantsDisplayContainer.innerHTML = '<p>Loading merchants...</p>'; 
        
        // Ensure the offersDisplayContainer is part of the DOM if it's not already
        // For this example, we'll append it after the merchants list, or manage visibility.
        // A more robust solution might have dedicated static divs in HTML.
        if (!document.getElementById('selectedMerchantOffers')) {
            currentOffersContainer.insertAdjacentElement('afterend', offersDisplayContainer);
        } else {
            document.getElementById('selectedMerchantOffers').innerHTML = ''; // Clear it if it exists
        }


        try {
            const response = await fetch(`${API_URL}/offers`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const allOffers = await response.json();
            
            if (allOffers && allOffers.length > 0) {
                merchantsDisplayContainer.innerHTML = ''; // Clear loading message
                
                const merchants = {}; // Use an object to group offers by bankName
                allOffers.forEach(offer => {
                    if (!merchants[offer.bankName]) {
                        merchants[offer.bankName] = [];
                    }
                    merchants[offer.bankName].push(offer);
                });

                if (Object.keys(merchants).length > 0) {
                    const merchantListTitle = document.createElement('h3');
                    merchantListTitle.textContent = 'Integrated Merchants:';
                    merchantsDisplayContainer.appendChild(merchantListTitle);

                    const ul = document.createElement('ul');
                    ul.classList.add('merchant-list'); // Add class for styling

                    Object.keys(merchants).sort().forEach(merchantName => {
                        const li = document.createElement('li');
                        li.textContent = merchantName;
                        li.style.cursor = 'pointer';
                        li.style.textDecoration = 'underline';
                        li.style.marginBottom = '5px';
                        li.addEventListener('click', () => {
                             // Pass the specific offers for this merchant, or all offers and filter inside
                            displayOffersForMerchant(merchantName, allOffers, document.getElementById('selectedMerchantOffers'));
                        });
                        ul.appendChild(li);
                    });
                    merchantsDisplayContainer.appendChild(ul);
                } else {
                     merchantsDisplayContainer.innerHTML = '<p>No merchants found.</p>';
                }

            } else {
                merchantsDisplayContainer.innerHTML = '<p>No offers found to determine merchants.</p>';
            }
        } catch (error) {
            console.error('Error loading merchants/offers:', error);
            merchantsDisplayContainer.innerHTML = `<p>Error loading data: ${error.message}. Make sure the backend server is running.</p>`;
            if (document.getElementById('selectedMerchantOffers')) {
                 document.getElementById('selectedMerchantOffers').innerHTML = ''; // Clear offer details on error too
            }
        }
    }
    
    // Optionally, load merchants on page load if starting on that view
    // loadMerchantsAndOffers(); 

    // Sidebar Navigation Logic
    function showSection(sectionToShow) {
        // Hide all content sections
        integrateOfferSection.style.display = 'none';
        viewMerchantsSection.style.display = 'none';

        // Show the selected section
        sectionToShow.style.display = 'block';

        // Update active link style
        navIntegrateOfferLink.classList.remove('active');
        navViewMerchantsLink.classList.remove('active');
        if (sectionToShow === integrateOfferSection) {
            navIntegrateOfferLink.classList.add('active');
        } else if (sectionToShow === viewMerchantsSection) {
            navViewMerchantsLink.classList.add('active');
            // If merchants haven't been loaded yet in this session, or if you want to refresh, load them.
            // For simplicity, we can check if the container is empty or just always call it.
            // To avoid multiple loads if already loaded, you might add a flag or check content.
            if (currentOffersContainer.innerHTML.includes("Click \"Load Merchants\"")) { // Basic check
                 loadMerchantsAndOffers();
            }
        }
    }

    navIntegrateOfferLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(integrateOfferSection);
    });

    navViewMerchantsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(viewMerchantsSection);
    });

    // Initialize by showing the integrate offer form by default and setting active link
    showSection(integrateOfferSection);
});
