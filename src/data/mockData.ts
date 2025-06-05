// mockData.ts
import { ImageSourcePropType } from 'react-native';

export interface Amenity {
  id: string;
  name: string;
  icon: ImageSourcePropType;
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
  image: ImageSourcePropType; // Main list image placeholder
  images: ImageSourcePropType[]; // Detail screen image carousel placeholders
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
  bankLogo: ImageSourcePropType;
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

// Helper to convert backend string paths to require-able ImageSourcePropType
const resolveImagePath = (imagePath: string): ImageSourcePropType => {
  switch (imagePath) {
    // Root images
    case '3dots.png': return require('../assets/images/3dots.png');
    case 'back.png': return require('../assets/images/back.png');
    case 'back.svg': return require('../assets/images/back.svg'); // SVGs might need special handling
    case 'beer.png': return require('../assets/images/beer.png');
    case 'clock.png': return require('../assets/images/clock.png');
    case 'control_tower.png': return require('../assets/images/control_tower.png');
    case 'down.png': return require('../assets/images/down.png');
    case 'filter.png': return require('../assets/images/filter.png');
    case 'flight.png': return require('../assets/images/flight.png');
    case 'fridge.png': return require('../assets/images/fridge.png');
    case 'heart.png': return require('../assets/images/heart.png');
    case 'ice_cream.png': return require('../assets/images/ice_cream.png');
    case 'lobby.png': return require('../assets/images/lobby.png');
    case 'location.png': return require('../assets/images/location.png');
    case 'qr_icon.png': return require('../assets/images/qr_icon.png');
    case 'question.png': return require('../assets/images/question.png');
    case 'receptionist_bell.png': return require('../assets/images/receptionist_bell.png');
    case 'shower.png': return require('../assets/images/shower.png');
    case 'test1.webp': return require('../assets/images/test1.webp');
    case 'test2.webp': return require('../assets/images/test2.webp');
    case 'test3.jpg': return require('../assets/images/test3.jpg');
    case 'test4.webp': return require('../assets/images/test4.webp');
    case 'test5.jpg': return require('../assets/images/test5.jpg');
    case 'test6.jpg': return require('../assets/images/test6.jpg');
    case 'test7.jpg': return require('../assets/images/test7.jpg');
    case 'toilet.png': return require('../assets/images/toilet.png');
    case 'washroom.png': return require('../assets/images/washroom.png');
    case 'wifi.png': return require('../assets/images/wifi.png');

    // Images in Banks/
    case 'Banks/abnamro.png': return require('../assets/images/Banks/abnamro.png');
    case 'Banks/abudhabicommercialbank.png': return require('../assets/images/Banks/abudhabicommercialbank.png');
    case 'Banks/airtelpaymentsbank.png': return require('../assets/images/Banks/airtelpaymentsbank.png');
    case 'Banks/americanexpress.png': return require('../assets/images/Banks/americanexpress.png');
    case 'Banks/ausmallfinancebank.png': return require('../assets/images/Banks/ausmallfinancebank.png');
    case 'Banks/australiaandnewzealandbankinggroup.png': return require('../assets/images/Banks/australiaandnewzealandbankinggroup.png');
    case 'Banks/axisbank.png': return require('../assets/images/Banks/axisbank.png');
    case 'Banks/bandhanbank.png': return require('../assets/images/Banks/bandhanbank.png');
    case 'Banks/bankmaybankindonesia.png': return require('../assets/images/Banks/bankmaybankindonesia.png');
    case 'Banks/bankofamerica.png': return require('../assets/images/Banks/bankofamerica.png');
    case 'Banks/bankofbahrainandkuwait.png': return require('../assets/images/Banks/bankofbahrainandkuwait.png');
    case 'Banks/bankofbaroda.png': return require('../assets/images/Banks/bankofbaroda.png');
    case 'Banks/bankofceylon.png': return require('../assets/images/Banks/bankofceylon.png');
    case 'Banks/bankofchina.png': return require('../assets/images/Banks/bankofchina.png');
    case 'Banks/bankofindia.png': return require('../assets/images/Banks/bankofindia.png');
    case 'Banks/bankofmaharastra.png': return require('../assets/images/Banks/bankofmaharastra.png');
    case 'Banks/barclaysbank.png': return require('../assets/images/Banks/barclaysbank.png');
    case 'Banks/bnpparibas.png': return require('../assets/images/Banks/bnpparibas.png');
    case 'Banks/canarabank.png': return require('../assets/images/Banks/canarabank.png');
    case 'Banks/centralbankofindia.png': return require('../assets/images/Banks/centralbankofindia.png');
    case 'Banks/citibank.png': return require('../assets/images/Banks/citibank.png');
    case 'Banks/cityunionbank.png': return require('../assets/images/Banks/cityunionbank.png');
    case 'Banks/créditagricolecorporateandinvestmentbank.png': return require('../assets/images/Banks/créditagricolecorporateandinvestmentbank.png');
    case 'Banks/creditsuisse.png': return require('../assets/images/Banks/creditsuisse.png');
    case 'Banks/csbbank.png': return require('../assets/images/Banks/csbbank.png');
    case 'Banks/dbsbank.png': return require('../assets/images/Banks/dbsbank.png');
    case 'Banks/dcbbank.png': return require('../assets/images/Banks/dcbbank.png');
    case 'Banks/deutschebank.png': return require('../assets/images/Banks/deutschebank.png');
    case 'Banks/dhanlaxmibank.png': return require('../assets/images/Banks/dhanlaxmibank.png');
    case 'Banks/dohabank.png': return require('../assets/images/Banks/dohabank.png');
    case 'Banks/emiratesnbd.png': return require('../assets/images/Banks/emiratesnbd.png');
    case 'Banks/esafsmallfinancebankltd.png': return require('../assets/images/Banks/esafsmallfinancebankltd.png');
    case 'Banks/federalbank.png': return require('../assets/images/Banks/federalbank.png');
    case 'Banks/finopaymentsbank.png': return require('../assets/images/Banks/finopaymentsbank.png');
    case 'Banks/firstabudhabibank.png': return require('../assets/images/Banks/firstabudhabibank.png');
    case 'Banks/firstrandbank.png': return require('../assets/images/Banks/firstrandbank.png');
    case 'Banks/handelsbanken.png': return require('../assets/images/Banks/handelsbanken.png');
    case 'Banks/hdfcbank.png': return require('../assets/images/Banks/hdfcbank.png');
    case 'Banks/hsbcbank.png': return require('../assets/images/Banks/hsbcbank.png');
    case 'Banks/icicibank.png': return require('../assets/images/Banks/icicibank.png');
    case 'Banks/idbibank.png': return require('../assets/images/Banks/idbibank.png');
    case 'Banks/idfcbank.png': return require('../assets/images/Banks/idfcbank.png');
    case 'Banks/indianbank.png': return require('../assets/images/Banks/indianbank.png');
    case 'Banks/indianoverseasbank.png': return require('../assets/images/Banks/indianoverseasbank.png');
    case 'Banks/indiapostpaymentsbank.png': return require('../assets/images/Banks/indiapostpaymentsbank.png');
    case 'Banks/induslndbank.png': return require('../assets/images/Banks/induslndbank.png');
    case 'Banks/industrial&commercialbankofchina.png': return require('../assets/images/Banks/industrial&commercialbankofchina.png');
    case 'Banks/industrialbankofkorea.png': return require('../assets/images/Banks/industrialbankofkorea.png');
    case 'Banks/jammu&kashmirbank.png': return require('../assets/images/Banks/jammu&kashmirbank.png');
    case 'Banks/jiopaymentsbank.png': return require('../assets/images/Banks/jiopaymentsbank.png');
    case 'Banks/jpmorganchase.png': return require('../assets/images/Banks/jpmorganchase.png');
    case 'Banks/karnatakabank.png': return require('../assets/images/Banks/karnatakabank.png');
    case 'Banks/karurvysyabank.png': return require('../assets/images/Banks/karurvysyabank.png');
    case 'Banks/kebhanabank.png': return require('../assets/images/Banks/kebhanabank.png');
    case 'Banks/kookminbank.png': return require('../assets/images/Banks/kookminbank.png');
    case 'Banks/kotakmahindrabank.png': return require('../assets/images/Banks/kotakmahindrabank.png');
    case 'Banks/krungthaibank.png': return require('../assets/images/Banks/krungthaibank.png');
    case 'Banks/mizuhocorporatebank.png': return require('../assets/images/Banks/mizuhocorporatebank.png');
    case 'Banks/mufgbank.png': return require('../assets/images/Banks/mufgbank.png');
    case 'Banks/natwestbank.png': return require('../assets/images/Banks/natwestbank.png');
    case 'Banks/paytmpaymentsbank.png': return require('../assets/images/Banks/paytmpaymentsbank.png');
    case 'Banks/punjab&sindbank.png': return require('../assets/images/Banks/punjab&sindbank.png');
    case 'Banks/punjabnationalbank.png': return require('../assets/images/Banks/punjabnationalbank.png');
    case 'Banks/punjabnationalbank(medium).png': return require('../assets/images/Banks/punjabnationalbank(medium).png');
    case 'Banks/qatarnationalbank.png': return require('../assets/images/Banks/qatarnationalbank.png');
    case 'Banks/rabobank.png': return require('../assets/images/Banks/rabobank.png');
    case 'Banks/rblbank.png': return require('../assets/images/Banks/rblbank.png');
    case 'Banks/saxobank.png': return require('../assets/images/Banks/saxobank.png');
    case 'Banks/sberbank.png': return require('../assets/images/Banks/sberbank.png');
    case 'Banks/scotiabank.png': return require('../assets/images/Banks/scotiabank.png');
    case 'Banks/shinhanbank.png': return require('../assets/images/Banks/shinhanbank.png');
    case 'Banks/sociétégénérale.png': return require('../assets/images/Banks/sociétégénérale.png');
    case 'Banks/southindianbank.png': return require('../assets/images/Banks/southindianbank.png');
    case 'Banks/standardcharteredbank.png': return require('../assets/images/Banks/standardcharteredbank.png');
    case 'Banks/statebankofindia.png': return require('../assets/images/Banks/statebankofindia.png');
    case 'Banks/sumitomomitsuibankingcorporation.png': return require('../assets/images/Banks/sumitomomitsuibankingcorporation.png');
    case 'Banks/tamilnadmercantilebank.png': return require('../assets/images/Banks/tamilnadmercantilebank.png');
    case 'Banks/ucobank.png': return require('../assets/images/Banks/ucobank.png');
    case 'Banks/ujjivansmallfinancebank.png': return require('../assets/images/Banks/ujjivansmallfinancebank.png');
    case 'Banks/unionbank.png': return require('../assets/images/Banks/unionbank.png');
    case 'Banks/unitedoverseasbank.png': return require('../assets/images/Banks/unitedoverseasbank.png');
    case 'Banks/westpac.png': return require('../assets/images/Banks/westpac.png');
    case 'Banks/wooribank.png': return require('../assets/images/Banks/wooribank.png');
    case 'Banks/yesbank(old).png': return require('../assets/images/Banks/yesbank(old).png');
    // Add other images as needed

    default:
      console.warn(`Image path not found in resolveImagePath: ${imagePath}. Using default placeholder.`);
      // Fallback to a default image. Ensure this default image is valid and required statically.
      return require('../assets/images/test1.webp'); // Or a specific placeholder image
  }
};

export const fetchLoungesFromAPI = async (): Promise<Lounge[]> => {
  const API_BASE_URL = 'https://lounge-app-536s.onrender.com/api'; // Ensure this matches your backend
  try {
    const response = await fetch(`${API_BASE_URL}/offers`);
    if (!response.ok) {
      console.error(`Network response was not ok: ${response.status} ${response.statusText}`);
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data: any[] = await response.json();

    // Transform data to match the Lounge interface, especially image paths
    return data.map((lounge): Lounge => ({
      ...lounge,
      image: resolveImagePath(lounge.image as string),
      images: (lounge.images as string[]).map(img => resolveImagePath(img as string)),
      bankLogo: resolveImagePath(lounge.bankLogo as string),
      amenities: (lounge.amenities as any[]).map(amenity => ({
        ...amenity,
        icon: resolveImagePath(amenity.icon as string),
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
