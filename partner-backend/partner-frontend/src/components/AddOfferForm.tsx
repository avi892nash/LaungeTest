import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

const API_URL = 'http://localhost:3001/api';

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

// Minimal interface for data fetched from /api/offers, used to populate merchant list
interface FetchedLoungeOrMerchantData {
  id: string;
  name: string;
  bankName?: string; 
  isMerchant?: boolean;
}

// Props for AddOfferForm, will need selectedMerchantId
interface AddOfferFormProps {
  selectedMerchantId: string | null; // To associate offer with a merchant
}

// Mock merchant type for the sidebar list
interface Merchant {
  merchantId: string;
  merchantName: string;
}

const AddOfferForm: React.FC<AddOfferFormProps> = ({ selectedMerchantId: propSelectedMerchantId }) => {
  const [formData, setFormData] = useState<OfferFormDataState>(initialOfferFormData);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [responseMessage, setResponseMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [internalSelectedMerchantId, setInternalSelectedMerchantId] = useState<string | null>(propSelectedMerchantId);
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

    const fetchMerchants = async () => {
      try {
        // Assuming an endpoint to get all merchants for selection
        // This might be the same as /api/offers and then processed, or a new one like /api/merchants
        const response = await fetch(`${API_URL}/offers`); 
        if (!response.ok) throw new Error('Failed to fetch data for merchant list');
        const allData: FetchedLoungeOrMerchantData[] = await response.json();
        
        // Filter for actual merchant entries (where isMerchant is true)
        const actualMerchants = allData
          .filter(item => item.isMerchant === true)
          .map(merchantItem => ({
            merchantId: merchantItem.id, 
            merchantName: merchantItem.bankName || merchantItem.name, // Prefer bankName, fallback to name
          }));
        
        const uniqueMerchantDisplayList = Array.from(new Map(actualMerchants.map(m => [m.merchantId, m])).values());
        setMerchants(uniqueMerchantDisplayList);

        // Handle propSelectedMerchantId if provided
        if (propSelectedMerchantId && uniqueMerchantDisplayList.some(m => m.merchantId === propSelectedMerchantId)) {
          setInternalSelectedMerchantId(propSelectedMerchantId);
        } else if (uniqueMerchantDisplayList.length > 0 && !internalSelectedMerchantId) {
          // If no merchant is selected (e.g. on initial load without a prop)
          // and there are merchants, do not auto-select one to allow explicit user choice.
          // If propSelectedMerchantId was given but not found in the filtered list, internalSelectedMerchantId will remain null or its previous state.
        } else if (uniqueMerchantDisplayList.length === 0) {
            setInternalSelectedMerchantId(null); 
        }

      } catch (error) {
        console.error("Error fetching or processing merchants:", error);
        setMerchants([]);
      }
    };
    fetchMerchants();
  }, [propSelectedMerchantId]); // Rerun if propSelectedMerchantId changes


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
    if (!internalSelectedMerchantId) {
      setResponseMessage({ type: 'error', message: 'Please select a merchant first.' });
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
    formPayload.append('merchantId', internalSelectedMerchantId);


    try {
      // This will be a NEW API endpoint
      const response = await fetch(`${API_URL}/merchants/${internalSelectedMerchantId}/offers`, { // Example new endpoint
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

  if (merchants.length > 0 && !internalSelectedMerchantId) {
    // If merchants are loaded but none is selected, show selection UI
    return (
      <div style={{ display: 'flex' }}>
        <aside style={{ width: '200px', borderRight: '1px solid #ccc', padding: '10px', height: '100vh', overflowY: 'auto'}}>
          <h4>Select Merchant</h4>
          <ul>
            {merchants.map(merchant => (
              <li key={merchant.merchantId} onClick={() => setInternalSelectedMerchantId(merchant.merchantId)} style={{cursor: 'pointer', padding: '5px', borderBottom: '1px solid #eee'}}>
                {merchant.merchantName}
              </li>
            ))}
          </ul>
        </aside>
        <section className="content-section" style={{flexGrow: 1, marginLeft: '20px'}}>
             <h2>Add New Offer</h2>
             <p>Please select a merchant from the sidebar to add an offer.</p>
        </section>
      </div>
    );
  }


  return (
    <div style={{ display: 'flex' }}>
        {merchants.length > 0 && (
            <aside style={{ width: '200px', borderRight: '1px solid #ccc', padding: '10px', height: 'calc(100vh - 60px)', overflowY: 'auto'}}>
                <h4>Select Merchant</h4>
                <ul>
                    {merchants.map(merchant => (
                    <li 
                        key={merchant.merchantId} 
                        onClick={() => setInternalSelectedMerchantId(merchant.merchantId)} 
                        style={{
                            cursor: 'pointer', 
                            padding: '8px', 
                            borderBottom: '1px solid #eee',
                            backgroundColor: internalSelectedMerchantId === merchant.merchantId ? '#e0e0e0' : 'transparent'
                        }}
                    >
                        {merchant.merchantName}
                    </li>
                    ))}
                </ul>
            </aside>
        )}
        <section id="addOfferSection" className="content-section" style={{flexGrow: 1, marginLeft: merchants.length > 0 ? '20px' : '0'}}>
        <h2>Add New Offer {internalSelectedMerchantId ? `for ${merchants.find(m=>m.merchantId === internalSelectedMerchantId)?.merchantName}` : ''}</h2>
        {!internalSelectedMerchantId && merchants.length === 0 && <p>Loading merchants or no merchants available. Cannot add offer.</p>}
        {!internalSelectedMerchantId && merchants.length > 0 && <p>Select a merchant from the list to proceed.</p>}

        {internalSelectedMerchantId && (
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
                        id={`amenity-${amenity.id}-${internalSelectedMerchantId}`} // Ensure unique ID if multiple forms
                        name="amenities"
                        value={amenity.id}
                        checked={selectedAmenities.includes(amenity.id)}
                        onChange={() => handleAmenityChange(amenity.id)}
                    />
                    <label htmlFor={`amenity-${amenity.id}-${internalSelectedMerchantId}`}>{amenity.name}</label>
                    </div>
                ))}
                </div>
            </div>

            <button type="submit" className="submit-button">Add Offer to Merchant</button>
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
