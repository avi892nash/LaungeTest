import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

// Construct the API path. If VITE_API_BASE_URL is defined, use it as a prefix for /api.
// Otherwise, assume /api is a relative path (e.g., for proxy or same-origin deployment).
const API_PREFIX = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

// Assuming Amenity interface is defined elsewhere or can be defined here
interface Amenity {
  id: string;
  name: string;
  icon: string; // Or path to icon
}

const PREDEFINED_AMENITIES: Amenity[] = [
    { id: "wifi", name: "Wi-Fi", icon: "wifi.png" },
    { id: "shower", name: "Shower", icon: "shower.png" },
    { id: "food_beverage", name: "Food & Beverage", icon: "beer.png" },
    { id: "flight_info", name: "Flight Information", icon: "flight.png" },
    { id: "restrooms", name: "Restrooms", icon: "toilet.png" },
    { id: "reception", name: "Reception", icon: "receptionist_bell.png" },
    { id: "fridge", name: "Refrigerator", icon: "fridge.png" },
    { id: "ice_cream", name: "Ice Cream", icon: "ice_cream.png" }
];

interface OfferFormDataState {
  offerTitle: string; // Changed from 'name'
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
  image: string; // For main list image path
  carouselImages: string[]; // For detail screen carousel image paths
}

const initialOfferFormData: OfferFormDataState = {
  offerTitle: '',
  offerType: 'Membership/Credential-Based Exclusive Access',
  location: '',
  fullLocation: '',
  airport: '',
  hours: '24 hours daily',
  directions: '',
  walkInDetails: 'Subject to availability', // Default from new list
  entitlement: '1 entry per Cardholder', // Default from new list
  entitlementPrice: '',
  walkInButtonText: 'View Details', // Default from new list
  fairUsePolicy: 'Standard Fair Use Policy applies.', // Default from new list
  description: '',
  image: '', // Will be set randomly
  carouselImages: [], // Will be set randomly
};

const PREDEFINED_TEST_IMAGES: string[] = [
  'test1.webp',
  'test2.webp',
  'test3.jpg',
  'test4.webp',
  'test5.jpg',
  'test6.jpg',
  'test7.jpg',
];

interface LoungeLocation {
  id: string;
  name: string; // For dropdown display, e.g., "Dubai T1 Intl Lounge"
  location: string; // Short location
  fullLocation: string;
  airport: string;
  hours: string;
  directions: string;
}

const PREDEFINED_LOUNGE_LOCATIONS: LoungeLocation[] = [
  {
    id: 'dxb_t1_l1',
    name: 'Dubai Airport - T1 International Lounge Alpha',
    location: 'Terminal 1 • International Departures, Concourse D',
    fullLocation: 'Dubai International Airport, Concourse D, Level 2, Opposite Gate D12',
    airport: 'Dubai International Airport (DXB)',
    hours: '24 hours daily',
    directions: 'After security, take the train to Concourse D. The lounge is on Level 2 near Gate D12.',
  },
  {
    id: 'lhr_t5_l1',
    name: 'Heathrow Airport - T5 Plaza Premium Lounge',
    location: 'Terminal 5 • Departures (Before Security)',
    fullLocation: 'London Heathrow Airport, Terminal 5, Level 0 (Arrivals), Near Zone G',
    airport: 'London Heathrow Airport (LHR)',
    hours: '05:00 - 21:00 daily',
    directions: 'Located in the Arrivals hall, before security checks. Follow signs for "Lounges".',
  },
  {
    id: 'jfk_t4_l1',
    name: 'JFK Airport - T4 Wingtips Lounge',
    location: 'Terminal 4 • Airside, Near Gate A4',
    fullLocation: 'John F. Kennedy International Airport, Terminal 4, Retail Hall, Past Security, Near Gate A4',
    airport: 'John F. Kennedy International Airport (JFK)',
    hours: '06:00 - 22:00 daily',
    directions: 'After TSA checkpoint, proceed to the Retail Hall. Lounge is located near Gate A4.',
  },
];

interface OfferSpecificsPreset {
  id: string;
  name: string; // e.g., "Standard Walk-In", "Bookable Premium"
  walkInDetails: string;
  entitlement: string;
  walkInButtonText: string;
  fairUsePolicy: string;
}

const PREDEFINED_OFFER_SPECIFICS_PRESETS: OfferSpecificsPreset[] = [
  {
    id: 'osp_standard_walkin',
    name: 'Standard Walk-In Offer',
    walkInDetails: 'Subject to availability',
    entitlement: '1 entry per Cardholder',
    walkInButtonText: 'View Details',
    fairUsePolicy: 'Standard Fair Use Policy applies.',
  },
  {
    id: 'osp_premium_bookable',
    name: 'Premium Bookable Offer',
    walkInDetails: 'Booking recommended for guaranteed entry',
    entitlement: 'Cardholder + 1 Guest',
    walkInButtonText: 'Book Now',
    fairUsePolicy: 'Maximum 3-hour stay. Refer to T&Cs.',
  },
  {
    id: 'osp_basic_access',
    name: 'Basic Access Offer',
    walkInDetails: 'No prior booking needed',
    entitlement: '1 entry per Cardholder',
    walkInButtonText: 'Access Offer',
    fairUsePolicy: 'Subject to lounge capacity.',
  },
];

// Minimal interface for data fetched from /api/offers, used to populate partner list
interface FetchedLoungeOrPartnerData {
  id: string;
  name: string;
  bankName?: string; 
  isPartner?: boolean; // Renamed from isMerchant
}

// Props for AddOfferForm, will need selectedPartnerId
interface AddOfferFormProps {
  selectedPartnerId: string | null; // To associate offer with a partner
}

// Partner type for the sidebar list
interface Partner {
  partnerId: string;
  partnerName: string;
}

const AddOfferForm: React.FC<AddOfferFormProps> = ({ selectedPartnerId: propSelectedPartnerId }) => {
  const [formData, setFormData] = useState<OfferFormDataState>(initialOfferFormData);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [responseMessage, setResponseMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [partners, setPartners] = useState<Partner[]>([]);
  const [internalSelectedPartnerId, setInternalSelectedPartnerId] = useState<string | null>(propSelectedPartnerId);
  const [selectedMasterLocationId, setSelectedMasterLocationId] = useState<string>(PREDEFINED_LOUNGE_LOCATIONS[0].id); // Default to first location
  const [selectedOfferSpecificsPresetId, setSelectedOfferSpecificsPresetId] = useState<string>(PREDEFINED_OFFER_SPECIFICS_PRESETS[0].id); // Default to first preset

  // Refs for file inputs are no longer needed for image selection itself
  // const imageInputRef = React.useRef<HTMLInputElement>(null); // No longer needed
  // const imagesInputRef = React.useRef<HTMLInputElement>(null); // No longer needed

  const getRandomImage = () => PREDEFINED_TEST_IMAGES[Math.floor(Math.random() * PREDEFINED_TEST_IMAGES.length)];

  const getRandomCarouselImages = (count = 2) => {
    const shuffled = [...PREDEFINED_TEST_IMAGES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

  // Initialize form with random images and defaults from presets
  useEffect(() => {
    const initialRandomImage = getRandomImage();
    const initialRandomCarouselImages = getRandomCarouselImages(2); // Get 2 random images for carousel

    setFormData(prev => ({
      ...prev,
      image: initialRandomImage,
      carouselImages: initialRandomCarouselImages,
    }));

    // Set initial form data based on default selected master location
    const defaultLocation = PREDEFINED_LOUNGE_LOCATIONS.find(loc => loc.id === selectedMasterLocationId);
    if (defaultLocation) {
      setFormData(prev => ({
        ...prev,
        location: defaultLocation.location,
        fullLocation: defaultLocation.fullLocation,
        airport: defaultLocation.airport,
        hours: defaultLocation.hours,
        directions: defaultLocation.directions,
      }));
    }

    const defaultOfferPreset = PREDEFINED_OFFER_SPECIFICS_PRESETS.find(p => p.id === selectedOfferSpecificsPresetId);
    if (defaultOfferPreset) {
      setFormData(prev => ({
        ...prev,
        walkInDetails: defaultOfferPreset.walkInDetails,
        entitlement: defaultOfferPreset.entitlement,
        walkInButtonText: defaultOfferPreset.walkInButtonText,
        fairUsePolicy: defaultOfferPreset.fairUsePolicy,
      }));
    }

    const fetchPartners = async () => {
      try {
        // Assuming an endpoint to get all partners for selection
        // This might be the same as /api/offers and then processed, or a new one like /api/partners
        const response = await fetch(`${API_PREFIX}/offers`); // Use API_PREFIX
        if (!response.ok) throw new Error('Failed to fetch data for partner list');
        const allData: FetchedLoungeOrPartnerData[] = await response.json();
        
        // Filter for actual partner entries (where isPartner is true)
        const actualPartners = allData
          .filter(item => item.isPartner === true) // Renamed from isMerchant
          .map(partnerItem => ({
            partnerId: partnerItem.id, 
            partnerName: partnerItem.bankName || partnerItem.name, // Prefer bankName, fallback to name
          }));
        
        const uniquePartnerDisplayList = Array.from(new Map(actualPartners.map(p => [p.partnerId, p])).values());
        setPartners(uniquePartnerDisplayList);

        // Handle propSelectedPartnerId if provided
        if (propSelectedPartnerId && uniquePartnerDisplayList.some(p => p.partnerId === propSelectedPartnerId)) {
          setInternalSelectedPartnerId(propSelectedPartnerId);
        } else if (uniquePartnerDisplayList.length > 0 && !internalSelectedPartnerId) {
          // If no partner is selected (e.g. on initial load without a prop)
          // and there are partners, do not auto-select one to allow explicit user choice.
          // If propSelectedPartnerId was given but not found in the filtered list, internalSelectedPartnerId will remain null or its previous state.
        } else if (uniquePartnerDisplayList.length === 0) {
            setInternalSelectedPartnerId(null); 
        }

      } catch (error) {
        console.error("Error fetching or processing partners:", error);
        setPartners([]);
      }
    };
    fetchPartners();
  }, [propSelectedPartnerId]); // Rerun if propSelectedPartnerId changes


  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // handleCarouselImagesChange is no longer needed as carousel images are set randomly
  // const handleCarouselImagesChange = (e: ChangeEvent<HTMLSelectElement>) => {
  //   const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
  //   setFormData(prev => ({ ...prev, carouselImages: selectedOptions }));
  // };

  const handleMasterLocationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const locationId = e.target.value;
    setSelectedMasterLocationId(locationId);
    const selectedLocation = PREDEFINED_LOUNGE_LOCATIONS.find(loc => loc.id === locationId);
    if (selectedLocation) {
      setFormData(prev => ({
        ...prev,
        location: selectedLocation.location,
        fullLocation: selectedLocation.fullLocation,
        airport: selectedLocation.airport,
        hours: selectedLocation.hours,
        directions: selectedLocation.directions,
      }));
    }
  };

  const handleOfferSpecificsPresetChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const presetId = e.target.value;
    setSelectedOfferSpecificsPresetId(presetId);
    const selectedPreset = PREDEFINED_OFFER_SPECIFICS_PRESETS.find(p => p.id === presetId);
    if (selectedPreset) {
      setFormData(prev => ({
        ...prev,
        walkInDetails: selectedPreset.walkInDetails,
        entitlement: selectedPreset.entitlement,
        walkInButtonText: selectedPreset.walkInButtonText,
        fairUsePolicy: selectedPreset.fairUsePolicy,
      }));
    }
  };

  const handleAmenityChange = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!internalSelectedPartnerId) {
      setResponseMessage({ type: 'error', message: 'Please select a partner first.' });
      return;
    }
    setResponseMessage(null);

    const formPayload = new FormData();
    // Append all formData fields except carouselImages (handled separately)
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'carouselImages') {
        formPayload.append(key, value as string); // Assuming most are strings, or will be stringified if not
      }
    });
    
    // Append carouselImages as a JSON string array
    formPayload.append('carouselImages', JSON.stringify(formData.carouselImages));

    const amenitiesToSubmit = PREDEFINED_AMENITIES.filter(amenity => selectedAmenities.includes(amenity.id));
    formPayload.append('amenities', JSON.stringify(amenitiesToSubmit));

    // File input refs are no longer used for image submission with predefined paths
    // if (imageInputRef.current?.files?.[0]) {
    //   formPayload.append('image', imageInputRef.current.files[0]);
    // }
    // if (imagesInputRef.current?.files) {
    //   Array.from(imagesInputRef.current.files).forEach(file => {
    //     formPayload.append('images', file);
    //   });
    // }
    formPayload.append('partnerId', internalSelectedPartnerId); // Changed key for consistency, backend uses URL param


    try {
      // This will be a NEW API endpoint
      const response = await fetch(`${API_PREFIX}/partners/${internalSelectedPartnerId}/offers`, { // Use API_PREFIX and renamed path
        method: 'POST',
        body: formPayload,
      });
      const result = await response.json();

      if (response.ok) {
        setResponseMessage({ type: 'success', message: result.message || 'Offer added successfully!' });
        // Reset formData, including new image fields, to initial state
        const defaultLocation = PREDEFINED_LOUNGE_LOCATIONS.find(loc => loc.id === selectedMasterLocationId);
        const defaultOfferPreset = PREDEFINED_OFFER_SPECIFICS_PRESETS.find(p => p.id === selectedOfferSpecificsPresetId);
        
        let resetFormData = { ...initialOfferFormData };
        if (defaultLocation) {
            resetFormData = {
                ...resetFormData,
                location: defaultLocation.location,
                fullLocation: defaultLocation.fullLocation,
                airport: defaultLocation.airport,
                hours: defaultLocation.hours,
                directions: defaultLocation.directions,
            };
        }
        if (defaultOfferPreset) {
            resetFormData = {
                ...resetFormData,
                walkInDetails: defaultOfferPreset.walkInDetails,
                entitlement: defaultOfferPreset.entitlement,
                walkInButtonText: defaultOfferPreset.walkInButtonText,
                fairUsePolicy: defaultOfferPreset.fairUsePolicy,
            };
        }
        // Ensure image and carouselImages are reset to new random values
        resetFormData.image = getRandomImage();
        resetFormData.carouselImages = getRandomCarouselImages(2);

        setFormData(resetFormData);
        setSelectedAmenities([]);
      } else {
        setResponseMessage({ type: 'error', message: result.message || 'Failed to add offer.' });
      }
    } catch (error) {
      console.error('Error submitting offer:', error);
      setResponseMessage({ type: 'error', message: 'An error occurred. Please try again.' });
    }
  };

  if (partners.length > 0 && !internalSelectedPartnerId) {
    // If partners are loaded but none is selected, show selection UI
    return (
      <div style={{ display: 'flex' }}>
        <aside style={{ width: '200px', borderRight: '1px solid #ccc', padding: '10px', height: '100vh', overflowY: 'auto'}}>
          <h4>Select Partner</h4>
          <ul>
            {partners.map(partner => (
              <li key={partner.partnerId} onClick={() => setInternalSelectedPartnerId(partner.partnerId)} style={{cursor: 'pointer', padding: '5px', borderBottom: '1px solid #eee'}}>
                {partner.partnerName}
              </li>
            ))}
          </ul>
        </aside>
        <section className="content-section" style={{flexGrow: 1, marginLeft: '20px'}}>
             <h2>Add New Offer</h2>
             <p>Please select a partner from the sidebar to add an offer.</p>
        </section>
      </div>
    );
  }


  return (
    <div style={{ display: 'flex' }}>
        {partners.length > 0 && (
            <aside style={{ width: '200px', borderRight: '1px solid #ccc', padding: '10px', height: 'calc(100vh - 60px)', overflowY: 'auto'}}>
                <h4>Select Partner</h4>
                <ul>
                    {partners.map(partner => (
                    <li 
                        key={partner.partnerId} 
                        onClick={() => setInternalSelectedPartnerId(partner.partnerId)} 
                        style={{
                            cursor: 'pointer', 
                            padding: '8px', 
                            borderBottom: '1px solid #eee',
                            backgroundColor: internalSelectedPartnerId === partner.partnerId ? '#e0e0e0' : 'transparent'
                        }}
                    >
                        {partner.partnerName}
                    </li>
                    ))}
                </ul>
            </aside>
        )}
        <section id="addOfferSection" className="content-section" style={{flexGrow: 1, marginLeft: partners.length > 0 ? '20px' : '0'}}>
        <h2>Add New Offer {internalSelectedPartnerId ? `for ${partners.find(p=>p.partnerId === internalSelectedPartnerId)?.partnerName}` : ''}</h2>
        {!internalSelectedPartnerId && partners.length === 0 && <p>Loading partners or no partners available. Cannot add offer.</p>}
        {!internalSelectedPartnerId && partners.length > 0 && <p>Select a partner from the list to proceed.</p>}

        {internalSelectedPartnerId && (
            <form id="newOfferForm" onSubmit={handleSubmit}>
            <div className="form-section">
                <h4>Offer Details</h4>
                <div className="form-row">
                    <div className="form-cell">
                        <label htmlFor="offerTitle">Offer Title:*</label>
                        <input type="text" id="offerTitle" name="offerTitle" value={formData.offerTitle} onChange={handleInputChange} required />
                    </div>
                    <div className="form-cell">
                        <label htmlFor="offerType">Offer Type:*</label>
                        <select id="offerType" name="offerType" value={formData.offerType} onChange={handleInputChange} required>
                        <option value="Direct Paid Access">Direct Paid Access</option>
                        <option value="Conditional/Inquiry-Based Access">Conditional/Inquiry-Based Access</option>
                        <option value="Reservation/Booking Required">Reservation/Booking Required</option>
                        <option value="Membership/Credential-Based Exclusive Access">Membership/Credential-Based Exclusive Access</option>
                        <option value="General Access (Eligibility Implied)">General Access (Eligibility Implied)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3>Location & Access</h3>
                <div className="form-row">
                    <div className="form-cell" style={{ flexBasis: '100%'}}>
                        <label htmlFor="masterLocation">Select Lounge Location:*</label>
                        <select id="masterLocation" name="masterLocation" value={selectedMasterLocationId} onChange={handleMasterLocationChange} required>
                            {PREDEFINED_LOUNGE_LOCATIONS.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* The detailed location fields are no longer displayed directly in the UI but are populated in formData */}
            </div>

            <div className="form-section">
                <h3>Offer Specifics</h3>
                <div className="form-row">
                    <div className="form-cell" style={{ flexBasis: '100%'}}>
                        <label htmlFor="offerSpecificsPreset">Select Offer Configuration:*</label>
                        <select 
                            id="offerSpecificsPreset" 
                            name="offerSpecificsPreset" 
                            value={selectedOfferSpecificsPresetId} 
                            onChange={handleOfferSpecificsPresetChange} 
                            required
                        >
                            {PREDEFINED_OFFER_SPECIFICS_PRESETS.map(preset => (
                                <option key={preset.id} value={preset.id}>{preset.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* Individual fields (walkInDetails, entitlement, walkInButtonText, fairUsePolicy) are now controlled by the preset above 
                    and their values are set in formData but not displayed as separate inputs. 
                    Entitlement Price and Description remain as direct inputs. 
                */}
                <div className="form-row">
                    <div className="form-cell">
                        <label htmlFor="entitlementPrice">Entitlement Price (if applicable):</label>
                        <input type="text" id="entitlementPrice" name="entitlementPrice" value={formData.entitlementPrice} onChange={handleInputChange} placeholder="e.g., 25 USD (if applicable)" />
                    </div>
                    <div className="form-cell">
                        {/* This cell can be left empty or used for another field if layout needs balancing */}
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-cell" style={{ flexBasis: '100%'}}>
                        <label htmlFor="description">Full Offer Description:*</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} required></textarea>
                    </div>
                </div>
            </div>
            
            <div className="form-section">
                <h3>Imagery</h3>
                {/* Imagery is selected randomly. No UI elements are shown in this section as per user request. */}
                {/* The randomly selected image paths are still part of formData and will be submitted. */}
            </div>

            <div className="form-section">
                <h3>Amenities (Select all that apply)</h3>
                <div id="amenitiesCheckboxesContainer" className="amenities-checkbox-grid">
                {PREDEFINED_AMENITIES.map(amenity => (
                    <div key={amenity.id} className="amenity-checkbox-item">
                    <input
                        type="checkbox"
                        id={`amenity-${amenity.id}-${internalSelectedPartnerId}`} // Ensure unique ID if multiple forms
                        name="amenities"
                        value={amenity.id}
                        checked={selectedAmenities.includes(amenity.id)}
                        onChange={() => handleAmenityChange(amenity.id)}
                    />
                    <label htmlFor={`amenity-${amenity.id}-${internalSelectedPartnerId}`}>{amenity.name}</label>
                    </div>
                ))}
                </div>
            </div>

            <button type="submit" className="submit-button">Add Offer to Partner</button>
            </form>
        )}
        {responseMessage && (
            <div className={`form-response-message ${responseMessage.type}`}>
            {responseMessage.message}
            </div>
        )}
        </section>
    </div>
  );
};

export default AddOfferForm;
