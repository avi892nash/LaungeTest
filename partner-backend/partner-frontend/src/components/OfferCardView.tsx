import React from 'react';
import type { Offer, Amenity } from './ViewPartners'; // Import Amenity as well

interface OfferCardViewProps {
  offer: Offer | null;
}

const OfferCardView: React.FC<OfferCardViewProps> = ({ offer }) => {
  if (!offer) {
    return (
      <div className="offer-card-placeholder">
        <p>Select an offer to view its details.</p>
      </div>
    );
  }

  // Helper to construct image URLs, assuming VITE_IMAGE_BASE_URL is set in .env
  // Or use a fixed base URL if appropriate
  const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:3001';


  return (
    <div className="offer-card-view">
      <div className="offer-card-header">
        {offer.bankLogo && (
          <img 
            src={`${imageBaseUrl}/images/${offer.bankLogo.startsWith('/') ? offer.bankLogo.substring(1) : offer.bankLogo}`} 
            alt={`${offer.bankName} logo`} 
            className="offer-bank-logo" 
          />
        )}
        <h3>{offer.name}</h3>
      </div>
      
      {offer.image && (
        <img 
          src={`${imageBaseUrl}/images/${offer.image.startsWith('/') ? offer.image.substring(1) : offer.image}`} 
          alt={offer.name} 
          className="offer-main-image" 
        />
      )}

      <div className="offer-card-body">
        <p><strong>Bank:</strong> {offer.bankName}</p>
        <p><strong>Type:</strong> {offer.offerType}</p>
        <p><strong>Location:</strong> {offer.location} ({offer.airport})</p>
        <p><strong>Entitlement:</strong> {offer.entitlement}</p>
        {offer.entitlementPrice && <p><strong>Price:</strong> {offer.entitlementPrice}</p>}
        
        <details className="offer-full-details-toggle">
          <summary>View All Details</summary>
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
              <tr><td>Partner ID</td><td>{offer.partnerId}</td></tr>
              <tr>
                <td>Images</td>
                <td>
                  {offer.images && offer.images.length > 0 ? (
                    <ul>
                      {offer.images.map((img: string, index: number) => (
                        <li key={index}>
                           <img src={`${imageBaseUrl}/images/${img.startsWith('/') ? img.substring(1) : img}`} alt={`Offer image ${index + 1}`} style={{maxWidth: '100px', maxHeight: '100px', marginRight: '5px'}} />
                        </li>
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
                      {offer.amenities.map((amenity: Amenity) => (
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
      </div>
    </div>
  );
};

export default OfferCardView;
