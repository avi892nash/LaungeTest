import React, { useState } from 'react'; // Removed useEffect

// Use Vite environment variable for API base URL, with a fallback
const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface Amenity {
  id: string;
  name: string;
  icon: string;
}

interface Offer {
  id: string;
  name: string;
  bankName: string;
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

interface Merchants {
  [key: string]: Offer[];
}

const ViewMerchants: React.FC = () => {
  // const [allOffers, setAllOffers] = useState<Offer[]>([]); // allOffers is not used
  const [, setAllOffers] = useState<Offer[]>([]); // Keep setAllOffers if it's used for type inference or future use
  const [merchants, setMerchants] = useState<Merchants>({});
  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    setIsLoading(true);
    setError(null);
    setSelectedMerchant(null); // Reset selected merchant on new load
    try {
      const response = await fetch(`${API_URL}/offers`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const offersData: Offer[] = await response.json();
      setAllOffers(offersData);

      if (offersData && offersData.length > 0) {
        const groupedByMerchant: Merchants = {};
        offersData.forEach(offer => {
          if (!groupedByMerchant[offer.bankName]) {
            groupedByMerchant[offer.bankName] = [];
          }
          groupedByMerchant[offer.bankName].push(offer);
        });
        setMerchants(groupedByMerchant);
      } else {
        setMerchants({});
      }
    } catch (err) {
      console.error('Error loading offers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load offers.');
      setMerchants({});
    } finally {
      setIsLoading(false);
    }
  };
  
  // Optionally load offers when component is first displayed (if desired)
  // useEffect(() => {
  //   fetchOffers();
  // }, []);

  return (
    <section id="viewMerchantsSection" className="content-section">
      <h2>Integrated Merchants & Offers</h2>
      <button type="button" id="loadOffersButton" onClick={fetchOffers} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Load Merchants & Offers'}
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!isLoading && Object.keys(merchants).length === 0 && !error && (
        <p>No merchants found. Click "Load Merchants & Offers" or ensure offers are integrated.</p>
      )}

      {Object.keys(merchants).length > 0 && (
        <div id="currentOffersContainer"> {/* This ID is for styling from existing CSS */}
          <h3>Integrated Merchants:</h3>
          <ul className="merchant-list"> {/* Class for styling from existing CSS */}
            {Object.keys(merchants).sort().map(merchantName => (
              <li 
                key={merchantName}
                onClick={() => setSelectedMerchant(merchantName)}
                style={{ 
                  cursor: 'pointer', 
                  textDecoration: selectedMerchant === merchantName ? 'none' : 'underline',
                  fontWeight: selectedMerchant === merchantName ? 'bold' : 'normal',
                  padding: '8px',
                  borderBottom: '1px solid #eee'
                }}
              >
                {merchantName} ({merchants[merchantName].length} offer(s))
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedMerchant && merchants[selectedMerchant] && (
        <div id="selectedMerchantOffers"> {/* This ID is for styling from existing CSS */}
          <h3>Offers from {selectedMerchant}:</h3>
          {merchants[selectedMerchant].map(offer => (
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

export default ViewMerchants;
