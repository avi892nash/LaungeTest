import React, { useState, useEffect } from 'react';
import OfferCardView from './OfferCardView'; // Import the new component

// Construct the API path. If VITE_API_BASE_URL is defined, use it as a prefix for /api.
// Otherwise, assume /api is a relative path (e.g., for proxy or same-origin deployment).
const API_PREFIX = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

export interface Offer {
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
  image: string;
  bankLogo: string;
  images: string[];
  amenities: Amenity[];
  partnerId: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

// New interface for Partner
export interface Partner { // Exporting for potential use elsewhere, though not strictly needed by this component alone
  id: string;
  name: string;
  logo: string;
}

// interface PartnersGrouped { // Renamed for clarity -> Now unused, removing
//   [key: string]: Offer[];
// }

interface ViewPartnersProps {
  setCurrentView: (view: 'integrate' | 'view_partners' | 'add_offer') => void;
  setSelectedPartnerIdForNewOffer: (partnerId: string | null) => void;
}

const ViewPartners: React.FC<ViewPartnersProps> = ({ setCurrentView, setSelectedPartnerIdForNewOffer }) => {
  const [allOffers, setAllOffersInternal] = useState<Offer[]>([]); // Renamed internal setter
  const [actualPartners, setActualPartners] = useState<Partner[]>([]); // New state for actual partners
  // const [partners, setPartners] = useState<PartnersGrouped>({}); // Removed unused state
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null); // Changed to store Partner object
  const [selectedOfferForCardView, setSelectedOfferForCardView] = useState<Offer | null>(null);
  const imageBaseUrl = ''; // Always use relative paths for images
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Updated to handle Partner object
  const handlePartnerSelect = (partner: Partner) => {
    setSelectedPartner(partner);
    setSelectedOfferForCardView(null); 
  };

  const fetchData = async () => { // Renamed and updated
    setIsLoading(true);
    setError(null);
    setSelectedPartner(null); 
    setSelectedOfferForCardView(null);
    setSelectedPartnerIdForNewOffer(null); // This prop setter might need re-evaluation based on selectedPartner.id
    try {
      // Fetch Actual Partners
      const partnersResponse = await fetch(`${API_PREFIX}/partners`);
      if (!partnersResponse.ok) {
        throw new Error(`HTTP error! Fetching partners status: ${partnersResponse.status}`);
      }
      const partnersData: Partner[] = await partnersResponse.json();
      setActualPartners(partnersData);

      // Fetch All Offers
      const offersResponse = await fetch(`${API_PREFIX}/offers`);
      if (!offersResponse.ok) {
        throw new Error(`HTTP error! Fetching offers status: ${offersResponse.status}`);
      }
      const offersData: Offer[] = await offersResponse.json();
      setAllOffersInternal(offersData); // Corrected setter name

      // Removed logic for grouping offers into `partners` state as it's no longer used directly for rendering.
      // Offers for a selected partner are now filtered from `allOffers`.
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data.');
      setActualPartners([]);
      setAllOffersInternal([]);
      // setPartners({}); // Removed: partners state is gone
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Call renamed function
  }, []);

  return (
    <section id="viewPartnersSection" className="content-section">
      <h2>Integrated Partners & Offers</h2>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {isLoading && <p>Loading partners and offers...</p>}

      {/* Updated condition to check actualPartners */}
      {!isLoading && actualPartners.length === 0 && !error && (
        <p>No partners found. Use the 'Integrate New Partner' form to add partners.</p>
      )}

      {/* Updated to iterate over actualPartners and use selectedPartner state */}
      {actualPartners.length > 0 && !selectedPartner && (
        <div id="currentOffersContainer">
          <h3>Integrated Partners:</h3>
          <ul className="partner-list">
            {actualPartners.sort((a, b) => a.name.localeCompare(b.name)).map((partner: Partner) => { // Added explicit type for partner
              const offersForThisPartner = allOffers.filter(offer => offer.partnerId === partner.id);
              const offerCount = offersForThisPartner.length;
              const currentPartnerId = partner.id; // Assign to a const for clarity

              // Since this block is rendered when !selectedPartner (i.e., selectedPartner is null),
              // an item in this list cannot be the "selected" one.
              // The 'selected' class logic is removed here.
              const classNames = ['partner-list-item'];
              // if (selectedPartner && selectedPartner.id === currentPartnerId) { // This logic is always false here
              //   classNames.push('selected');
              // }

              return (
                <li
                  key={currentPartnerId} 
                  className={classNames.join(' ')} // Will always be 'partner-list-item'
                  onClick={() => handlePartnerSelect(partner)} // Pass Partner object
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {partner.logo && ( // Use partner.logo
                      <img
                        src={`${imageBaseUrl}/images/${partner.logo.startsWith('images/') ? partner.logo.substring('images/'.length) : partner.logo}`}
                        alt={`${partner.name} logo`}
                        className="partner-list-logo"
                      />
                    )}
                    <span className="partner-name" style={{ marginLeft: partner.logo ? '10px' : '0' }}>
                      {partner.name} ({offerCount} offer(s))
                    </span>
                  </div>
                  <button
                    className="btn-modern btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPartnerIdForNewOffer(currentPartnerId); 
                      setCurrentView('add_offer');
                    }}
                  >
                    Add Offer
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Updated to use selectedPartner state and derive offers from allOffers */}
      {selectedPartner && (
        <div>
          {/* Button to go back to the main partner list */}
          <button 
            className="btn-modern" 
            onClick={() => {
              setSelectedPartner(null); // Use setSelectedPartner
              setSelectedOfferForCardView(null);
            }} 
            style={{ marginBottom: '20px' }}
          >
            &larr; Back to All Partners
          </button>

          <div className="view-partners-layout">
            <div className="view-partners-list-column">
              {/* Use selectedPartner.name for the header */}
              <h3>Offers from {selectedPartner.name}:</h3>
              <button
                className="btn-modern btn-primary"
                onClick={() => {
                  setSelectedPartnerIdForNewOffer(selectedPartner.id); // Use selectedPartner.id
                  setCurrentView('add_offer');
                }}
                style={{ marginBottom: '10px', width: '100%' }}
              >
                Add New Offer to {selectedPartner.name}
              </button>
              {/* Filter allOffers for the selectedPartner.id */}
              {allOffers.filter(offer => offer.partnerId === selectedPartner.id).length > 0 ? (
                <ul className="partner-offers-list">
                  {allOffers.filter(offer => offer.partnerId === selectedPartner.id).map(offer => (
                    <li
                      key={offer.id}
                      className={`partner-offers-list-item ${selectedOfferForCardView?.id === offer.id ? 'selected' : ''}`}
                      onClick={() => setSelectedOfferForCardView(offer)}
                    >
                      <h4>{offer.name}</h4>
                      <p>Type: {offer.offerType} - Location: {offer.location}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No offers found for this partner.</p>
              )}
            </div>
            <div className="view-partners-detail-column">
              <OfferCardView offer={selectedOfferForCardView} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ViewPartners;
