import React, { useState } from 'react'; // Removed useEffect

// Construct the API path. If VITE_API_BASE_URL is defined, use it as a prefix for /api.
// Otherwise, assume /api is a relative path (e.g., for proxy or same-origin deployment).
const API_PREFIX = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

interface Amenity {
  id: string;
  name: string;
  icon: string;
}

interface Offer {
  id: string;
  name: string;
  bankName: string; // This is used as the key for grouping partners
  offerType: string;
  location: string;
  fullLocation: string;
  airport: string;
  hours: string;
  directions: string;
  walkInDetails: string;
  entitlement: string;
  entitlementPrice: string;
  walkInButtonText: string;
  fairUsePolicy: string;
  description: string;
  image: string; // Assuming image path/URL
  bankLogo: string; // Assuming logo path/URL
  images: string[]; // Assuming array of paths/URLs
  amenities: Amenity[];
  partnerId: string; // Added to match backend
}

interface Partners { // Renamed from Merchants
  [key: string]: Offer[]; // Key will now be partnerId
}

interface ViewPartnersProps {
  setCurrentView: (view: 'integrate' | 'view_partners' | 'add_offer') => void;
  setSelectedPartnerIdForNewOffer: (partnerId: string | null) => void;
}

const ViewPartners: React.FC<ViewPartnersProps> = ({ setCurrentView, setSelectedPartnerIdForNewOffer }) => {
  // const [allOffers, setAllOffers] = useState<Offer[]>([]); // allOffers is not used
  const [, setAllOffers] = useState<Offer[]>([]); // Keep setAllOffers if it's used for type inference or future use
  const [partners, setPartners] = useState<Partners>({}); // Renamed from merchants, setMerchants
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null); // Stores the selected partnerId
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    setIsLoading(true);
    setError(null);
    setSelectedPartnerId(null);
    setSelectedPartnerIdForNewOffer(null); // Reset when fetching all offers
    try {
      const response = await fetch(`${API_PREFIX}/offers`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const offersData: Offer[] = await response.json();
      setAllOffers(offersData);

      if (offersData && offersData.length > 0) {
        const groupedByPartner: Partners = {}; 
        offersData.forEach(offer => {
          if (!offer.partnerId) {
            console.warn('Offer missing partnerId:', offer);
            return; // Skip offers without partnerId
          }
          if (!groupedByPartner[offer.partnerId]) {
            groupedByPartner[offer.partnerId] = [];
          }
          groupedByPartner[offer.partnerId].push(offer);
        });
        setPartners(groupedByPartner); 
      } else {
        setPartners({}); // Renamed from setMerchants
      }
    } catch (err) {
      console.error('Error loading offers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load offers.');
      setPartners({}); // Renamed from setMerchants
    } finally {
      setIsLoading(false);
    }
  };
  
  // Optionally load offers when component is first displayed (if desired)
  // useEffect(() => {
  //   fetchOffers();
  // }, []);

  return (
    <section id="viewPartnersSection" className="content-section"> {/* Renamed id */}
      <h2>Integrated Partners & Offers</h2> {/* Renamed text */}
      <button type="button" id="loadOffersButton" onClick={fetchOffers} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Load Partners & Offers'} {/* Renamed text */}
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!isLoading && Object.keys(partners).length === 0 && !error && ( /* Renamed merchants to partners */
        <p>No partners found. Click "Load Partners & Offers" or ensure offers are integrated.</p> /* Renamed text */
      )}

      {Object.keys(partners).length > 0 && ( /* Renamed merchants to partners */
        <div id="currentOffersContainer"> {/* This ID is for styling from existing CSS - kept for now */}
          <h3>Integrated Partners (by Partner ID):</h3> {/* Renamed text */}
          <ul className="partner-list"> {/* Renamed class */}
            {Object.keys(partners).sort().map(partnerId => ( 
              <li 
                key={partnerId} 
                onClick={() => setSelectedPartnerId(partnerId)} 
                style={{ 
                  cursor: 'pointer', 
                  textDecoration: selectedPartnerId === partnerId ? 'none' : 'underline', 
                  fontWeight: selectedPartnerId === partnerId ? 'bold' : 'normal', 
                  padding: '8px',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span onClick={() => setSelectedPartnerId(partnerId)}>
                  {partnerId} ({partners[partnerId].length} offer(s))
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent li's onClick from firing
                    setSelectedPartnerIdForNewOffer(partnerId);
                    setCurrentView('add_offer');
                  }}
                  style={{ marginLeft: '10px', padding: '2px 5px', fontSize: '0.8em' }}
                >
                  Add Offer
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedPartnerId && partners[selectedPartnerId] && ( 
        <div id="selectedPartnerOffers"> {/* Renamed id */}
          <h3>Offers from Partner ID: {selectedPartnerId}:</h3> 
          {/* Button to add offer to the currently viewed partner, an alternative to the list button */}
          <button
            onClick={() => {
                setSelectedPartnerIdForNewOffer(selectedPartnerId);
                setCurrentView('add_offer');
            }}
            style={{ marginBottom: '10px', padding: '5px 10px' }}
            >
            Add New Offer to {selectedPartnerId}
          </button>
          {partners[selectedPartnerId].map(offer => ( 
            <div key={offer.id} className="offer-detail-item"> {/* Class for styling */}
              <h4>{offer.name} (Offer ID: {offer.id})</h4>
              <p><strong>Bank Name:</strong> {offer.bankName}</p>
              <p><strong>Offer Type:</strong> {offer.offerType}</p>
              <details>
                <summary>View Full Data</summary>
                <table className="offer-details-table">
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Offer Name</td><td>{offer.name}</td></tr>
                    <tr><td>Offer ID</td><td>{offer.id}</td></tr>
                    <tr><td>Bank Name</td><td>{offer.bankName}</td></tr>
                    <tr><td>Offer Type</td><td>{offer.offerType}</td></tr>
                    <tr><td>Location</td><td>{offer.location}</td></tr>
                    <tr><td>Full Location</td><td>{offer.fullLocation}</td></tr>
                    <tr><td>Airport</td><td>{offer.airport}</td></tr>
                    <tr><td>Hours</td><td>{offer.hours}</td></tr>
                    <tr><td>Directions</td><td>{offer.directions}</td></tr>
                    <tr><td>Walk-in Details</td><td>{offer.walkInDetails}</td></tr>
                    <tr><td>Entitlement</td><td>{offer.entitlement}</td></tr>
                    <tr><td>Entitlement Price</td><td>{offer.entitlementPrice}</td></tr>
                    <tr><td>Walk-in Button Text</td><td>{offer.walkInButtonText}</td></tr>
                    <tr><td>Fair Use Policy</td><td>{offer.fairUsePolicy}</td></tr>
                    <tr><td>Description</td><td>{offer.description}</td></tr>
                    <tr><td>Image</td><td>{offer.image}</td></tr>
                    <tr><td>Bank Logo</td><td>{offer.bankLogo}</td></tr>
                    <tr><td>Partner ID</td><td>{offer.partnerId}</td></tr>
                    <tr>
                      <td>Images</td>
                      <td>
                        {offer.images && offer.images.length > 0 ? (
                          <ul>
                            {offer.images.map((img, index) => (
                              <li key={index}>{img}</li>
                            ))}
                          </ul>
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Amenities</td>
                      <td>
                        {offer.amenities && offer.amenities.length > 0 ? (
                          <ul>
                            {offer.amenities.map(amenity => (
                              <li key={amenity.id}>{amenity.name} (Icon: {amenity.icon})</li>
                            ))}
                          </ul>
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </details>
              <hr />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ViewPartners; // Renamed from ViewMerchants
