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
}

interface Partners { // Renamed from Merchants
  [key: string]: Offer[]; // Key is typically bankName here
}

const ViewPartners: React.FC = () => { // Renamed from ViewMerchants
  // const [allOffers, setAllOffers] = useState<Offer[]>([]); // allOffers is not used
  const [, setAllOffers] = useState<Offer[]>([]); // Keep setAllOffers if it's used for type inference or future use
  const [partners, setPartners] = useState<Partners>({}); // Renamed from merchants, setMerchants
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null); // Renamed from selectedMerchant, setSelectedMerchant
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    setIsLoading(true);
    setError(null);
    setSelectedPartner(null); // Renamed from setSelectedMerchant
    try {
      const response = await fetch(`${API_PREFIX}/offers`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const offersData: Offer[] = await response.json();
      setAllOffers(offersData);

      if (offersData && offersData.length > 0) {
        const groupedByPartner: Partners = {}; // Renamed from groupedByMerchant
        offersData.forEach(offer => {
          // Assuming offer.bankName is the identifier for a "Partner" in this context
          if (!groupedByPartner[offer.bankName]) {
            groupedByPartner[offer.bankName] = [];
          }
          groupedByPartner[offer.bankName].push(offer);
        });
        setPartners(groupedByPartner); // Renamed from setMerchants
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
          <h3>Integrated Partners:</h3> {/* Renamed text */}
          <ul className="partner-list"> {/* Renamed class */}
            {Object.keys(partners).sort().map(partnerName => ( /* Renamed merchants to partners, merchantName to partnerName */
              <li 
                key={partnerName} /* Renamed merchantName to partnerName */
                onClick={() => setSelectedPartner(partnerName)} /* Renamed setSelectedMerchant to setSelectedPartner, merchantName to partnerName */
                style={{ 
                  cursor: 'pointer', 
                  textDecoration: selectedPartner === partnerName ? 'none' : 'underline', /* Renamed selectedMerchant to selectedPartner, merchantName to partnerName */
                  fontWeight: selectedPartner === partnerName ? 'bold' : 'normal', /* Renamed selectedMerchant to selectedPartner, merchantName to partnerName */
                  padding: '8px',
                  borderBottom: '1px solid #eee'
                }}
              >
                {partnerName} ({partners[partnerName].length} offer(s)) {/* Renamed merchantName to partnerName, merchants to partners */}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedPartner && partners[selectedPartner] && ( /* Renamed selectedMerchant to selectedPartner, merchants to partners */
        <div id="selectedPartnerOffers"> {/* Renamed id */}
          <h3>Offers from {selectedPartner}:</h3> {/* Renamed selectedMerchant to selectedPartner */}
          {partners[selectedPartner].map(offer => ( /* Renamed merchants to partners, selectedMerchant to selectedPartner */
            <div key={offer.id} className="offer-detail-item"> {/* Class for styling */}
              <h4>{offer.name} (ID: {offer.id})</h4>
              <p><strong>Offer Type:</strong> {offer.offerType}</p>
              <details>
                <summary>View Full Data</summary>
                <pre>{JSON.stringify(offer, null, 2)}</pre>
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
