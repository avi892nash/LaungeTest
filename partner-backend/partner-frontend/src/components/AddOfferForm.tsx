import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

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
  offerTitle: string;
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
  carouselImages: string[];
  bankName: string; 
  bankLogo: string; 
}

const BANK_LOGO_OPTIONS: string[] = [
  "Banks/abnamro.png", "Banks/abudhabicommercialbank.png", "Banks/airtelpaymentsbank.png", 
  "Banks/americanexpress.png", "Banks/ausmallfinancebank.png", "Banks/australiaandnewzealandbankinggroup.png", 
  "Banks/axisbank.png", "Banks/bandhanbank.png", "Banks/bankmaybankindonesia.png", 
  "Banks/bankofamerica.png", "Banks/bankofbahrainandkuwait.png", "Banks/bankofbaroda.png", 
  "Banks/bankofceylon.png", "Banks/bankofchina.png", "Banks/bankofindia.png", 
  "Banks/bankofmaharastra.png", "Banks/barclaysbank.png", "Banks/bnpparibas.png", 
  "Banks/canarabank.png", "Banks/centralbankofindia.png", "Banks/citibank.png", 
  "Banks/cityunionbank.png", "Banks/creditsuisse.png", "Banks/créditagricolecorporateandinvestmentbank.png", 
  "Banks/csbbank.png", "Banks/dbsbank.png", "Banks/dcbbank.png", "Banks/deutschebank.png", 
  "Banks/dhanlaxmibank.png", "Banks/dohabank.png", "Banks/emiratesnbd.png", 
  "Banks/esafsmallfinancebankltd.png", "Banks/federalbank.png", "Banks/finopaymentsbank.png", 
  "Banks/firstabudhabibank.png", "Banks/firstrandbank.png", "Banks/handelsbanken.png", 
  "Banks/hdfcbank.png", "Banks/hsbcbank.png", "Banks/icicibank.png", "Banks/idbibank.png", 
  "Banks/idfcbank.png", "Banks/indianbank.png", "Banks/indianoverseasbank.png", 
  "Banks/indiapostpaymentsbank.png", "Banks/induslndbank.png", "Banks/industrial&commercialbankofchina.png", 
  "Banks/industrialbankofkorea.png", "Banks/jammu&kashmirbank.png", "Banks/jiopaymentsbank.png", 
  "Banks/jpmorganchase.png", "Banks/karnatakabank.png", "Banks/karurvysyabank.png", 
  "Banks/kebhanabank.png", "Banks/kookminbank.png", "Banks/kotakmahindrabank.png", 
  "Banks/krungthaibank.png", "Banks/mizuhocorporatebank.png", "Banks/mufgbank.png", 
  "Banks/natwestbank.png", "Banks/paytmpaymentsbank.png", "Banks/punjab&sindbank.png", 
  "Banks/punjabnationalbank(medium).png", "Banks/punjabnationalbank.png", "Banks/qatarnationalbank.png", 
  "Banks/rabobank.png", "Banks/rblbank.png", "Banks/saxobank.png", "Banks/sberbank.png", 
  "Banks/scotiabank.png", "Banks/shinhanbank.png", "Banks/sociétégénérale.png", 
  "Banks/southindianbank.png", "Banks/standardcharteredbank.png", "Banks/statebankofindia.png", 
  "Banks/sumitomomitsuibankingcorporation.png", "Banks/tamilnadmercantilebank.png", 
  "Banks/ucobank.png", "Banks/ujjivansmallfinancebank.png", "Banks/unionbank.png", 
  "Banks/unitedoverseasbank.png", "Banks/westpac.png", "Banks/wooribank.png", 
  "Banks/yesbank(old).png"
];

const initialOfferFormData: OfferFormDataState = {
  offerTitle: '',
  offerType: 'Membership/Credential-Based Exclusive Access',
  location: '',
  fullLocation: '',
  airport: '',
  hours: '24 hours daily',
  directions: '',
  walkInDetails: 'Subject to availability',
  entitlement: '1 entry per Cardholder',
  entitlementPrice: '',
  walkInButtonText: 'View Details',
  fairUsePolicy: 'Standard Fair Use Policy applies.',
  description: '',
  image: '', 
  carouselImages: [], 
  bankName: '',
  bankLogo: '',
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
  name: string;
  location: string;
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
  name: string;
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

interface AddOfferFormProps {
  selectedPartnerId: string | null; 
}

const AddOfferForm: React.FC<AddOfferFormProps> = ({ selectedPartnerId }) => {
  const [formData, setFormData] = useState<OfferFormDataState>(initialOfferFormData);
  // selectedAmenities state removed
  const [responseMessage, setResponseMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [selectedMasterLocationId, setSelectedMasterLocationId] = useState<string>(PREDEFINED_LOUNGE_LOCATIONS[0].id);
  const [selectedOfferSpecificsPresetId, setSelectedOfferSpecificsPresetId] = useState<string>(PREDEFINED_OFFER_SPECIFICS_PRESETS[0].id);

  const getRandomImage = () => PREDEFINED_TEST_IMAGES[Math.floor(Math.random() * PREDEFINED_TEST_IMAGES.length)];
  const getRandomCarouselImages = (count = 2) => {
    const shuffled = [...PREDEFINED_TEST_IMAGES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

  useEffect(() => {
    // Use functional update to preserve existing manually entered fields
    setFormData(prevFormData => {
      const initialRandomImage = getRandomImage(); // Assuming these should still be randomized on change
      const initialRandomCarouselImages = getRandomCarouselImages(2);

      let updatedFormData = {
        ...prevFormData, // Preserve existing data
        image: initialRandomImage, // Then update/randomize images
        carouselImages: initialRandomCarouselImages,
      };

      const defaultLocation = PREDEFINED_LOUNGE_LOCATIONS.find(loc => loc.id === selectedMasterLocationId);
      if (defaultLocation) {
        updatedFormData = {
          ...updatedFormData,
          location: defaultLocation.location,
          fullLocation: defaultLocation.fullLocation,
          airport: defaultLocation.airport,
          hours: defaultLocation.hours,
          directions: defaultLocation.directions,
        };
      }

      const defaultOfferPreset = PREDEFINED_OFFER_SPECIFICS_PRESETS.find(p => p.id === selectedOfferSpecificsPresetId);
      if (defaultOfferPreset) {
        updatedFormData = {
          ...updatedFormData,
          walkInDetails: defaultOfferPreset.walkInDetails,
          entitlement: defaultOfferPreset.entitlement,
          walkInButtonText: defaultOfferPreset.walkInButtonText,
          fairUsePolicy: defaultOfferPreset.fairUsePolicy,
        };
      }
      return updatedFormData;
    });
    // setSelectedAmenities([]); // Reset amenities when presets change - Removed
  }, [selectedMasterLocationId, selectedOfferSpecificsPresetId]);

  // Effect to reset form when selectedPartnerId changes (e.g., user navigates away and back)
  useEffect(() => {
    if (selectedPartnerId) {
        // Optionally, re-initialize or clear specific fields if needed when a new partner is selected
        // For now, the main reset happens via the useEffect above when location/offer presets change
        // or on successful submission.
    }
  }, [selectedPartnerId]);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMasterLocationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedMasterLocationId(e.target.value);
  };

  const handleOfferSpecificsPresetChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOfferSpecificsPresetId(e.target.value);
  };

  // handleAmenityChange function removed

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPartnerId) {
      setResponseMessage({ type: 'error', message: 'No Partner ID selected. Please go to "View Partners & Offers" to select a partner context first, then return here.' });
      return;
    }
    setResponseMessage(null);

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'carouselImages') {
        formPayload.append(key, value as string);
      }
    });
    
    formPayload.append('carouselImages', JSON.stringify(formData.carouselImages));

    // Generate 5 random amenities
    const getRandomAmenityObjects = (count = 5): Amenity[] => {
      const shuffled = [...PREDEFINED_AMENITIES].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(count, shuffled.length));
    };
    const amenitiesToSubmit = getRandomAmenityObjects(5);
    formPayload.append('amenities', JSON.stringify(amenitiesToSubmit));

    try {
      const response = await fetch(`${API_PREFIX}/partners/${selectedPartnerId}/offers`, { 
        method: 'POST',
        body: formPayload,
      });
      const result = await response.json();

      if (response.ok) {
        setResponseMessage({ type: 'success', message: result.message || 'Offer added successfully!' });
        
        // Reset form to initial state including random images and preset-driven fields
        const initialRandomImage = getRandomImage();
        const initialRandomCarouselImages = getRandomCarouselImages(2);
        let resetFormData = { 
            ...initialOfferFormData,
            image: initialRandomImage,
            carouselImages: initialRandomCarouselImages
        };
        const defaultLocation = PREDEFINED_LOUNGE_LOCATIONS.find(loc => loc.id === selectedMasterLocationId);
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
        const defaultOfferPreset = PREDEFINED_OFFER_SPECIFICS_PRESETS.find(p => p.id === selectedOfferSpecificsPresetId);
        if (defaultOfferPreset) {
            resetFormData = {
                ...resetFormData,
                walkInDetails: defaultOfferPreset.walkInDetails,
                entitlement: defaultOfferPreset.entitlement,
                walkInButtonText: defaultOfferPreset.walkInButtonText,
                fairUsePolicy: defaultOfferPreset.fairUsePolicy,
            };
        }
        setFormData(resetFormData);
        // setSelectedAmenities([]); // Removed
      } else {
        setResponseMessage({ type: 'error', message: result.message || 'Failed to add offer.' });
      }
    } catch (error) {
      console.error('Error submitting offer:', error);
      setResponseMessage({ type: 'error', message: 'An error occurred. Please try again.' });
    }
  };

  if (!selectedPartnerId) {
    return (
      <section id="addOfferSection" className="content-section">
        <h2>Add New Offer</h2>
        <p style={{ color: 'orange', fontWeight: 'bold' }}>
          Please select a partner context from the "View Partners & Offers" tab before adding a new offer.
        </p>
      </section>
    );
  }

  return (
    <section id="addOfferSection" className="content-section">
      <h2>Add New Offer for Partner ID: {selectedPartnerId}</h2>
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
            <h4>Offer Branding</h4>
            <div className="form-row">
                <div className="form-cell">
                    <label htmlFor="bankName">Offer's Bank Name:*</label>
                    <input type="text" id="bankName" name="bankName" value={formData.bankName} onChange={handleInputChange} placeholder="e.g., HSBC Premier" required />
                </div>
                <div className="form-cell">
                    <label htmlFor="bankLogo">Offer's Bank Logo:*</label>
                    <select id="bankLogo" name="bankLogo" value={formData.bankLogo} onChange={handleInputChange} required>
                        <option value="">Select a Bank Logo</option>
                        {BANK_LOGO_OPTIONS.map(logoPath => (
                            <option key={logoPath} value={logoPath}>{logoPath}</option>
                        ))}
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
        
        {/* <div className="form-section">
            <h3>Imagery</h3>
            Imagery is selected randomly. No UI elements are shown in this section.
            <p style={{fontSize: '0.9em', color: '#555'}}>Main image and carousel images are set randomly for this offer. Paths: Main: '{formData.image}', Carousel: [{formData.carouselImages.join(', ')}]</p>
        </div> */}

        {/* Amenities selection section removed - 5 random amenities will be applied automatically */}

        <button type="submit" className="submit-button" disabled={!selectedPartnerId}>Add Offer to Partner</button>
      </form>
    {responseMessage && (
        <div className={`form-response-message ${responseMessage.type}`}>
        {responseMessage.message}
        </div>
    )}
    </section>
  );
};

export default AddOfferForm;
