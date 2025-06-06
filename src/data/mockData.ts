// mockData.ts
// ImageSourcePropType is no longer needed here as we'll use string URLs
// import { ImageSourcePropType } from 'react-native';

export interface Amenity {
  id: string;
  name: string;
  icon: string; // Changed from ImageSourcePropType to string (URL)
}

export enum OfferType {
  DIRECT_PAID = "Direct Paid Access",
  CONDITIONAL_INQUIRY = "Conditional/Inquiry-Based Access",
  RESERVATION_BOOKING = "Reservation/Booking Required",
  MEMBERSHIP_CREDENTIAL = "Membership/Credential-Based Exclusive Access",
  GENERAL_ELIGIBILITY_IMPLIED = "General Access (Eligibility Implied)",
}

export interface Lounge {
  id: string;
  name: string;
  image: string; // Changed from ImageSourcePropType to string (URL)
  images: string[]; // Changed from ImageSourcePropType[] to string[] (URLs)
  location: string; // Short location for list item
  fullLocation: string; // Detailed location for detail screen
  airport: string;
  hours: string;
  walkInDetails: string;
  entitlement: string;
  entitlementPrice: string;
  walkInButtonText: string;
  fairUsePolicy: string;
  amenities: Amenity[];
  amenitiesCount: number;
  directions: string;
  description: string;
  bankName: string;
  bankLogo: string; // Changed from ImageSourcePropType to string (URL)
  offerType: OfferType;
}

// const mockLounges: Lounge[] = [
//   {
//     id: '1',
//     offerType: OfferType.DIRECT_PAID,
//     name: 'Marhaba Lounge (Concourse D)',
//     image: require('../assets/images/test1.webp'),
//     images: [
//       require('../assets/images/test2.webp'),
//       require('../assets/images/test3.jpg'),
//       require('../assets/images/test4.webp'),
//     ],
//     location: 'Terminal 1 • International Departure',
//     fullLocation: 'Terminal 1, International Departures, Dubai International Airport',
//     airport: 'Dubai International Airport (DBX)',
//     hours: '24 hours daily',
//     walkInDetails: 'Get access to the lounge today',
//     entitlement: '1 x Entitlement per person',
//     entitlementPrice: 'If entitlements are exhausted, visits will be charged at $32 pp',
//     walkInButtonText: 'Walk-in',
//     fairUsePolicy: 'Fair use policy applies. See Terms & Conditions for specifics.',
//     amenities: [
//       { id: 'a1', name: 'Fridge', icon: require('../assets/images/fridge.png') },
//       { id: 'a2', name: 'Beer', icon: require('../assets/images/beer.png') },
//       { id: 'a3', name: 'Ice Cream', icon: require('../assets/images/ice_cream.png') },
//       { id: 'a4', name: 'Showers', icon: require('../assets/images/shower.png') },
//       { id: 'a5', name: 'Washroom', icon: require('../assets/images/washroom.png') },
//       { id: 'a6', name: 'Wi-Fi', icon: require('../assets/images/wifi.png') },
//       { id: 'a7', name: 'Lobby', icon: require('../assets/images/lobby.png') },
//     ],
//     amenitiesCount: 7,
//     directions: 'Airside - After passport control and security check, the lounge is located across from gate E77.',
//     description: 'Relax and unwind before your flight in the comfort of Marhaba Lounge. Enjoy a range of amenities designed to make your pre-flight experience seamless and enjoyable. Whether you want to catch up on work, enjoy a meal, or simply rest, Marhaba Lounge provides a tranquil escape from the bustling airport.',
//     bankName: 'ABN AMRO',
//     bankLogo: require('../assets/images/Banks/abnamro.png'),
//   },
//   // ... (rest of the mockLounges array commented out for brevity in this example)
//   {
//     id: '16',
//     name: 'Turkish Airlines Lounge Istanbul Airport',
//     image: require('../assets/images/test1.webp'),
//     images: [require('../assets/images/test4.webp'), require('../assets/images/test5.jpg')],
//     location: 'International Terminal • Departures Floor',
//     fullLocation: 'International Terminal, Departures Floor, Istanbul Airport',
//     airport: 'Istanbul Airport (IST)',
//     hours: '24 hours daily',
//     walkInDetails: 'Turkish Airlines Business/Elite Plus, Star Alliance Gold',
//     entitlement: 'Eligible passengers',
//     entitlementPrice: 'N/A',
//     walkInButtonText: 'Enter Lounge',
//     fairUsePolicy: 'Standard Turkish Airlines policies.',
//     amenities: [
//       { id: 'p1', name: 'Wi-Fi', icon: require('../assets/images/wifi.png') },
//       { id: 'p2', name: 'Live Cooking Stations (Turkish & Intl)', icon: require('../assets/images/fridge.png') },
//       { id: 'p3', name: 'Cinema', icon: require('../assets/images/fridge.png') },
//       { id: 'p4', name: 'Golf Simulator', icon: require('../assets/images/fridge.png') },
//       { id: 'p5', name: 'Private Suites (with shower)', icon: require('../assets/images/shower.png') },
//       { id: 'p6', name: 'Kids Play Area', icon: require('../assets/images/fridge.png') },
//       { id: 'p7', name: 'Lobby', icon: require('../assets/images/lobby.png') },
//     ],
//     amenitiesCount: 7,
//     directions: 'Airside - International Terminal, after passport control, take escalator opposite Gate E1.',
//     description: 'The Turkish Airlines Lounge at Istanbul Airport is a vast, award-winning space offering diverse culinary delights, a cinema, golf simulator, and private suites.',
//     bankName: 'Bank of India',
//     bankLogo: require('../assets/images/Banks/bankofindia.png'),
//     offerType: OfferType.GENERAL_ELIGIBILITY_IMPLIED,
//   },
// ];

// The resolveImagePath function is no longer needed as we will use full URLs.

// Attempt to use VITE_API_BASE_URL from environment variables.
// Note: For React Native, ensure 'react-native-dotenv' or a similar mechanism is set up
// to make this variable available via process.env.
const APP_API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://lounge-app-536s.onrender.com'; // Fallback for safety

const IMAGE_BASE_URL = `${APP_API_BASE_URL}/images`;

export const fetchLoungesFromAPI = async (): Promise<Lounge[]> => {
  const API_ENDPOINT = `${APP_API_BASE_URL}/api`; // Ensure this matches your backend
  try {
    const response = await fetch(`${API_ENDPOINT}/offers`);
    if (!response.ok) {
      console.error(`Network response was not ok: ${response.status} ${response.statusText}`);
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data: any[] = await response.json();

    // Transform data to match the Lounge interface, constructing full image URLs
    return data.map((lounge): Lounge => ({
      ...lounge,
      image: lounge.image ? `${IMAGE_BASE_URL}/${lounge.image}` : '', // Handle cases where image might be missing
      images: (lounge.images as string[] || []).map(img => img ? `${IMAGE_BASE_URL}/${img}`: ''),
      bankLogo: lounge.bankLogo ? `${IMAGE_BASE_URL}/${lounge.bankLogo}` : '',
      amenities: (lounge.amenities as any[] || []).map(amenity => ({
        ...amenity,
        icon: amenity.icon ? `${IMAGE_BASE_URL}/${amenity.icon}` : '',
      })),
      offerType: lounge.offerType as OfferType,
    }));
  } catch (error) {
    console.error("Failed to fetch lounges from API:", error);
    return []; // Return empty array on error
  }
};

// Note: The original mockLounges array is commented out above.
// This file now primarily exports types and the fetchLoungesFromAPI function.
// Ensure consuming files import named exports:
// import { Lounge, Amenity, OfferType, fetchLoungesFromAPI } from './mockData';
