// mockData.ts
import { ImageSourcePropType } from 'react-native';

export interface Amenity {
  id: string;
  name: string;
  icon: ImageSourcePropType; // Changed from string to ImageSourcePropType
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
}

const mockLounges: Lounge[] = [
  {
    id: '1',
    name: 'Marhaba Lounge (Concourse D)',
    image: require('../assets/images/test1.webp'),
    images: [
      require('../assets/images/test2.webp'),
      require('../assets/images/test3.jpg'),
      require('../assets/images/test4.webp'),
    ],
    location: 'Terminal 1 • International Departure',
    fullLocation: 'Terminal 1, International Departures, Dubai International Airport',
    airport: 'Dubai International Airport (DBX)',
    hours: '24 hours daily',
    walkInDetails: 'Get access to the lounge today',
    entitlement: '1 x Entitlement per person',
    entitlementPrice: 'If entitlements are exhausted, visits will be charged at $32 pp',
    walkInButtonText: 'Walk-in',
    fairUsePolicy: 'Fair use policy applies. See Terms & Conditions for specifics.',
    amenities: [
      { id: 'a1', name: 'Fridge', icon: require('../assets/images/fridge.png') },
      { id: 'a2', name: 'Beer', icon: require('../assets/images/beer.png') },
      { id: 'a3', name: 'Ice Cream', icon: require('../assets/images/ice_cream.png') },
      { id: 'a4', name: 'Showers', icon: require('../assets/images/shower.png') },
      { id: 'a5', name: 'Washroom', icon: require('../assets/images/washroom.png') },
      { id: 'a6', name: 'Wi-Fi', icon: require('../assets/images/wifi.png') },
      { id: 'a7', name: 'Lobby', icon: require('../assets/images/lobby.png') },
    ],
    amenitiesCount: 7,
    directions: 'Airside - After passport control and security check, the lounge is located across from gate E77.',
    description: 'Relax and unwind before your flight in the comfort of Marhaba Lounge. Enjoy a range of amenities designed to make your pre-flight experience seamless and enjoyable. Whether you want to catch up on work, enjoy a meal, or simply rest, Marhaba Lounge provides a tranquil escape from the bustling airport.',
    bankName: 'ABN AMRO',
    bankLogo: require('../assets/images/Banks/abnamro.png'),
  },
  {
    id: '2',
    name: 'Ahlan Business Class Lounge (Concourse D)',
    image: require('../assets/images/test5.jpg'),
    images: [require('../assets/images/test1.webp')],
    location: 'Terminal 1 • International Departure',
    fullLocation: 'Terminal 1, International Departures, Dubai International Airport',
    airport: 'Dubai International Airport (DBX)',
    hours: 'Open 24/7',
    walkInDetails: 'Access available for eligible passengers.',
    entitlement: 'Subject to airline/cardholder benefits',
    entitlementPrice: 'Enquire at desk for paid access.',
    walkInButtonText: 'Enquire Access',
    fairUsePolicy: 'Terms and conditions apply.',
    amenities: [
      { id: 'b1', name: 'Premium Wi-Fi', icon: require('../assets/images/wifi.png') },
      { id: 'b2', name: 'Gourmet Dining', icon: require('../assets/images/fridge.png') }, // Placeholder for 'restaurant'
      { id: 'b3', name: 'Bar', icon: require('../assets/images/beer.png') },
      { id: 'b4', name: 'Business Center', icon: require('../assets/images/fridge.png') }, // Placeholder for 'business_center'
      { id: 'b5', name: 'Reception', icon: require('../assets/images/receptionist_bell.png') },
    ],
    amenitiesCount: 5,
    directions: 'Located in Concourse D, near Gate D12.',
    description: 'Experience luxury and comfort at the Ahlan Business Class Lounge. Offering a wide array of services and amenities to cater to the discerning traveler.',
    bankName: 'AU Small Finance Bank',
    bankLogo: require('../assets/images/Banks/ausmallfinancebank.png'),
  },
  {
    id: '3',
    name: 'sleep \'n fly Sleep Lounge & Showers (Concourse D)',
    image: require('../assets/images/test2.webp'),
    images: [require('../assets/images/test3.jpg')],
    location: 'Terminal 1 • International Departure',
    fullLocation: 'Terminal 1, International Departures, Dubai International Airport',
    airport: 'Dubai International Airport (DBX)',
    hours: 'By appointment',
    walkInDetails: 'Book your sleep pod or shower.',
    entitlement: 'Various packages available',
    entitlementPrice: 'Starting from $20.',
    walkInButtonText: 'Book Now',
    fairUsePolicy: 'Booking terms apply.',
    amenities: [
      { id: 'c1', name: 'Sleep Pods', icon: require('../assets/images/fridge.png') }, // Placeholder for 'hotel'
      { id: 'c2', name: 'Showers', icon: require('../assets/images/shower.png') },
      { id: 'c3', name: 'Wi-Fi', icon: require('../assets/images/wifi.png') },
      { id: 'c4', name: 'Toilet', icon: require('../assets/images/toilet.png') },
    ],
    amenitiesCount: 4,
    directions: 'Concourse D, opposite Gate D7.',
    description: 'Catch up on rest or freshen up with our state-of-the-art sleep pods and shower facilities. Perfect for transiting passengers or those with long layovers.',
    bankName: 'Abu Dhabi Commercial Bank',
    bankLogo: require('../assets/images/Banks/abudhabicommercialbank.png'),
  },
  {
    id: '4',
    name: 'Centurion Lounge JFK',
    image: require('../assets/images/test4.webp'),
    images: [
      require('../assets/images/test1.webp'),
      require('../assets/images/test2.webp'),
    ],
    location: 'Terminal 4 • Post-Security',
    fullLocation: 'Terminal 4, Near Gate A2, John F. Kennedy International Airport',
    airport: 'John F. Kennedy International Airport (JFK)',
    hours: '05:00 - 22:00 daily',
    walkInDetails: 'Exclusive for Centurion Card Members',
    entitlement: 'Cardholder + 2 guests',
    entitlementPrice: 'N/A',
    walkInButtonText: 'Show Card',
    fairUsePolicy: 'Subject to capacity.',
    amenities: [
      { id: 'd1', name: 'Wi-Fi', icon: require('../assets/images/wifi.png') },
      { id: 'd2', name: 'Premium Food', icon: require('../assets/images/fridge.png') }, // Placeholder for 'food'
      { id: 'd3', name: 'Full Bar Service', icon: require('../assets/images/beer.png') },
      { id: 'd4', name: 'Showers', icon: require('../assets/images/shower.png') },
      { id: 'd5', name: 'Workspaces', icon: require('../assets/images/fridge.png') }, // Placeholder for 'business_center'
      { id: 'd6', name: 'Lobby', icon: require('../assets/images/lobby.png') },
    ],
    amenitiesCount: 6,
    directions: 'Airside - Terminal 4, past security, near Gate A2.',
    description: 'An exclusive retreat at JFK, the Centurion Lounge offers premium amenities, chef-inspired cuisine, and a full bar. Ideal for relaxing or working before your flight.',
    bankName: 'Airtel Payments Bank',
    bankLogo: require('../assets/images/Banks/airtelpaymentsbank.png'),
  },
  {
    id: '5',
    name: 'British Airways Galleries Club LHR',
    image: require('../assets/images/test5.jpg'),
    images: [
      require('../assets/images/test3.jpg'),
      require('../assets/images/test4.webp'),
    ],
    location: 'Terminal 5A South • Departures',
    fullLocation: 'Terminal 5A South, Departures Level, London Heathrow Airport',
    airport: 'London Heathrow Airport (LHR)',
    hours: '05:00 - 22:30 daily',
    walkInDetails: 'Eligible Oneworld passengers',
    entitlement: 'Business Class, First Class, Oneworld Sapphire/Emerald',
    entitlementPrice: 'Complimentary for eligible passengers',
    walkInButtonText: 'Check Eligibility',
    fairUsePolicy: 'Standard airline lounge policies apply.',
    amenities: [
      { id: 'e1', name: 'Wi-Fi', icon: require('../assets/images/wifi.png') },
      { id: 'e2', name: 'Food & Drinks', icon: require('../assets/images/fridge.png') }, // Placeholder for 'food'
      { id: 'e3', name: 'Business Center', icon: require('../assets/images/fridge.png') }, // Placeholder for 'business_center'
      { id: 'e4', name: 'Wine Gallery', icon: require('../assets/images/beer.png') },
      { id: 'e5', name: 'Kids Zone', icon: require('../assets/images/fridge.png') }, // Placeholder for 'child_friendly'
      { id: 'e6', name: 'Reception', icon: require('../assets/images/receptionist_bell.png') },
    ],
    amenitiesCount: 6,
    directions: 'Airside - Terminal 5A South, after security. Follow signs for "Galleries Lounges".',
    description: 'The British Airways Galleries Club lounge at Heathrow T5 offers a sophisticated space with a variety of seating areas, dining options, and business facilities.',
    bankName: 'American Express',
    bankLogo: require('../assets/images/Banks/americanexpress.png'),
  },
  {
    id: '6',
    name: 'SATS Premier Lounge SIN T1',
    image: require('../assets/images/test1.webp'),
    images: [
      require('../assets/images/test5.jpg'),
      require('../assets/images/test2.webp'),
    ],
    location: 'Terminal 1 • Departure Transit Hall',
    fullLocation: 'Terminal 1, Departure Transit Hall, Level 3, Singapore Changi Airport',
    airport: 'Singapore Changi Airport (SIN)',
    hours: '24 hours daily',
    walkInDetails: 'Priority Pass, DragonPass, eligible airline passengers',
    entitlement: 'Varies by program',
    entitlementPrice: 'Paid access available, approx $58 SGD',
    walkInButtonText: 'Purchase Access',
    fairUsePolicy: 'Maximum 3-hour stay.',
    amenities: [
      { id: 'f1', name: 'Wi-Fi', icon: require('../assets/images/wifi.png') },
      { id: 'f2', name: 'Buffet Food & Drinks', icon: require('../assets/images/fridge.png') }, // Placeholder for 'restaurant'
      { id: 'f3', name: 'Showers with Amenities', icon: require('../assets/images/shower.png') },
      { id: 'f4', name: 'Massage Chairs', icon: require('../assets/images/fridge.png') }, // Placeholder for 'spa'
      { id: 'f5', name: 'VIP Rooms (Chargeable)', icon: require('../assets/images/fridge.png') }, // Placeholder for 'star'
      { id: 'f6', name: 'Charging Stations', icon: require('../assets/images/fridge.png') }, // Placeholder for 'battery_charging_full'
      { id: 'f7', name: 'Toilet', icon: require('../assets/images/toilet.png') },
    ],
    amenitiesCount: 7,
    directions: 'Airside - Terminal 1, Level 3, Departure Transit Hall. Near C Gates.',
    description: 'SATS Premier Lounge at Changi T1 provides a comfortable environment with a wide range of food, drinks, shower facilities, and even massage chairs for a relaxing pre-flight experience.',
    bankName: 'Australia and New Zealand Banking Group',
    bankLogo: require('../assets/images/Banks/australiaandnewzealandbankinggroup.png'),
  },
  {
    id: '7',
    name: 'Air France Lounge CDG T2E Hall K',
    image: require('../assets/images/test2.webp'),
    images: [require('../assets/images/test3.jpg'), require('../assets/images/test4.webp')],
    location: 'Terminal 2E Hall K • Departures',
    fullLocation: 'Terminal 2E, Hall K, Charles de Gaulle Airport, Paris',
    airport: 'Charles de Gaulle Airport (CDG)',
    hours: '05:30 - 23:30 daily',
    walkInDetails: 'SkyTeam Elite Plus, Business/First Class passengers',
    entitlement: 'Varies by ticket/status',
    entitlementPrice: 'Paid access sometimes available',
    walkInButtonText: 'Inquire at Desk',
    fairUsePolicy: 'Standard lounge policies.',
    amenities: [
      { id: 'g1', name: 'Wi-Fi', icon: require('../assets/images/wifi.png') },
      { id: 'g2', name: 'French Cuisine Buffet', icon: require('../assets/images/fridge.png') }, // Placeholder for 'restaurant'
      { id: 'g3', name: 'Clarins Spa', icon: require('../assets/images/fridge.png') }, // Placeholder for 'spa'
      { id: 'g4', name: 'Showers', icon: require('../assets/images/shower.png') },
      { id: 'g5', name: 'Lobby', icon: require('../assets/images/lobby.png') },
    ],
    amenitiesCount: 5,
    directions: 'Airside - Terminal 2E, Hall K, after security checks.',
    description: 'Experience Parisian elegance at the Air France Lounge in CDG T2E Hall K, featuring Clarins spa services and gourmet French food.',
    bankName: 'Axis bank',
    bankLogo: require('../assets/images/Banks/axisbank.png'),
  },
  {
    id: '8',
    name: 'ANA Suite Lounge NRT T1',
    image: require('../assets/images/test3.jpg'),
    images: [require('../assets/images/test1.webp'), require('../assets/images/test5.jpg')],
    location: 'Terminal 1 Satellite 5 • International',
    fullLocation: 'Terminal 1, Satellite 5, Narita International Airport, Tokyo',
    airport: 'Tokyo Narita International Airport (NRT)',
    hours: '07:00 - Last ANA departure',
    walkInDetails: 'ANA First Class, Star Alliance First Class passengers',
    entitlement: 'First Class ticket holders',
    entitlementPrice: 'N/A',
    walkInButtonText: 'Present Boarding Pass',
    fairUsePolicy: 'Exclusive access.',
    amenities: [
      { id: 'h1', name: 'Wi-Fi', icon: require('../assets/images/wifi.png') },
      { id: 'h2', name: 'Live Kitchen Noodle Bar', icon: require('../assets/images/fridge.png') }, // Placeholder for 'ramen_dining'
      { id: 'h3', name: 'Sake Bar', icon: require('../assets/images/beer.png') },
      { id: 'h4', name: 'Private Work Booths', icon: require('../assets/images/fridge.png') }, // Placeholder for 'work'
      { id: 'h5', name: 'Showers', icon: require('../assets/images/shower.png') },
      { id: 'h6', name: 'Reception', icon: require('../assets/images/receptionist_bell.png') },
    ],
    amenitiesCount: 6,
    directions: 'Airside - Terminal 1, Satellite 5, near Gate 51.',
    description: 'Indulge in the ANA Suite Lounge at Narita, offering exceptional Japanese hospitality, a live noodle bar, and a curated sake selection.',
    bankName: 'BNP Paribas',
    bankLogo: require('../assets/images/Banks/bnpparibas.png'),
  },
  {
    id: '9',
    name: 'Star Alliance Lounge LAX TBIT',
    image: require('../assets/images/test4.webp'),
    images: [require('../assets/images/test2.webp'), require('../assets/images/test1.webp')],
    location: 'Tom Bradley Intl Terminal • Departures',
    fullLocation: 'Tom Bradley International Terminal, Level 6, Los Angeles International Airport',
    airport: 'Los Angeles International Airport (LAX)',
    hours: '07:00 - 00:30 daily (varies)',
    walkInDetails: 'Star Alliance Gold, Business/First Class passengers',
    entitlement: 'Varies by airline/status',
    entitlementPrice: 'N/A',
    walkInButtonText: 'Check Eligibility',
    fairUsePolicy: 'Standard Star Alliance policies.',
    amenities: [
      { id: 'i1', name: 'Wi-Fi', icon: require('../assets/images/wifi.png') },
      { id: 'i2', name: 'Indoor Terrace', icon: require('../assets/images/fridge.png') }, // Placeholder for 'deck'
      { id: 'i3', name: 'Bar', icon: require('../assets/images/beer.png') },
      { id: 'i4', name: 'Showers', icon: require('../assets/images/shower.png') },
      { id: 'i5', name: 'Media Room', icon: require('../assets/images/fridge.png') }, // Placeholder for 'tv'
      { id: 'i6', name: 'Toilet', icon: require('../assets/images/toilet.png') },
    ],
    amenitiesCount: 6,
    directions: 'Airside - Tom Bradley International Terminal, after security, take elevator to Level 6.',
    description: 'The Star Alliance Lounge at LAX boasts an impressive indoor terrace, stylish bar, and various zones for relaxation and work.',
    bankName: 'Bandhan Bank',
    bankLogo: require('../assets/images/Banks/bandhanbank.png'),
  },
  {
    id: '10',
    name: 'Emirates First Class Lounge DXB Concourse A',
    image: require('../assets/images/test5.jpg'),
    images: [require('../assets/images/test1.webp'), require('../assets/images/test2.webp')],
    location: 'Terminal 3 Concourse A • Departures',
    fullLocation: 'Terminal 3, Concourse A, Dubai International Airport',
    airport: 'Dubai International Airport (DBX)',
    hours: '24 hours daily',
    walkInDetails: 'Emirates First Class passengers',
    entitlement: 'First Class ticket holders',
    entitlementPrice: 'N/A',
    walkInButtonText: 'Direct Boarding',
    fairUsePolicy: 'Exclusive access.',
    amenities: [
      { id: 'j1', name: 'Wi-Fi', icon: require('../assets/images/wifi.png') },
      { id: 'j2', name: 'À la carte Dining', icon: require('../assets/images/fridge.png') }, // Placeholder for 'restaurant_menu'
      { id: 'j3', name: 'Wine Cellar', icon: require('../assets/images/beer.png') },
      { id: 'j4', name: 'Cigar Bar', icon: require('../assets/images/fridge.png') }, // Placeholder for 'smoking_rooms'
      { id: 'j5', name: 'Timeless Spa', icon: require('../assets/images/fridge.png') }, // Placeholder for 'spa'
      { id: 'j6', name: 'Shoe Shine Service', icon: require('../assets/images/fridge.png') }, // Placeholder for 'cleaning_services'
      { id: 'j7', name: 'Lobby', icon: require('../assets/images/lobby.png') },
    ],
    amenitiesCount: 7,
    directions: 'Airside - Terminal 3, Concourse A. Spans the entire length of the concourse.',
    description: 'The Emirates First Class Lounge in Concourse A is an epitome of luxury, offering direct boarding, fine dining, a spa, and a wine cellar.',
    bankName: 'Bank Maybank Indonesia',
    bankLogo: require('../assets/images/Banks/bankmaybankindonesia.png'),
  },
  {
    id: '11',
    name: 'Plaza Premium Lounge LHR T2',
    image: require('../assets/images/test1.webp'),
    images: [require('../assets/images/test3.jpg'), require('../assets/images/test4.webp')],
    location: 'Terminal 2A • Departures',
    fullLocation: 'Terminal 2A (The Queen\'s Terminal), Departures Level, London Heathrow Airport',
    airport: 'London Heathrow Airport (LHR)',
    hours: '05:00 - 21:30 daily',
    walkInDetails: 'Priority Pass, DragonPass, paid access',
    entitlement: 'Varies by program, or purchase',
    entitlementPrice: 'Approx £40-£50',
    walkInButtonText: 'Purchase Entry',
    fairUsePolicy: 'Max 3-hour stay for paid access.',
    amenities: [
      { id: 'k1', name: 'Wi-Fi', icon: require('../assets/images/wifi.png') },
      { id: 'k2', name: 'Food & Beverage', icon: require('../assets/images/fridge.png') }, // Placeholder for 'food'
      { id: 'k3', name: 'Bar', icon: require('../assets/images/beer.png') },
      { id: 'k4', name: 'Showers (Chargeable)', icon: require('../assets/images/shower.png') },
      { id: 'k5', name: 'Charging Stations', icon: require('../assets/images/fridge.png') }, // Placeholder for 'battery_charging_full'
      { id: 'k6', name: 'Reception', icon: require('../assets/images/receptionist_bell.png') },
    ],
    amenitiesCount: 6,
    directions: 'Airside - Terminal 2A, after security, follow signs for "Lounge A3".',
    description: 'Plaza Premium Lounge at Heathrow T2 offers a comfortable space for all travellers, with food, drinks, and optional shower facilities.',
    bankName: 'Bank of America',
    bankLogo: require('../assets/images/Banks/bankofamerica.png'),
  },
  {
    id: '12',
    name: 'The Wing, First by Cathay Pacific HKG',
    image: require('../assets/images/test2.webp'),
    images: [require('../assets/images/test5.jpg'), require('../assets/images/test1.webp')],
    location: 'Terminal 1 • Near Gates 1-4',
    fullLocation: 'Terminal 1, Near Gates 1-4, Hong Kong International Airport',
    airport: 'Hong Kong International Airport (HKG)',
    hours: '05:30 - Last departure',
    walkInDetails: 'Cathay Pacific First Class, Oneworld Emerald',
    entitlement: 'Eligible passengers',
    entitlementPrice: 'N/A',
    walkInButtonText: 'Present Credentials',
    fairUsePolicy: 'Exclusive access.',
    amenities: [
      { id: 'l1', name: 'Wi-Fi', icon: require('../assets/images/wifi.png') },
      { id: 'l2', name: 'The Haven (Restaurant)', icon: require('../assets/images/fridge.png') }, // Placeholder for 'restaurant'
      { id: 'l3', name: 'Cabanas (Private Suites with bath)', icon: require('../assets/images/washroom.png') },
      { id: 'l4', name: 'Champagne Bar', icon: require('../assets/images/beer.png') },
      { id: 'l5', name: 'The Sanctuary (Yoga & Meditation)', icon: require('../assets/images/fridge.png') }, // Placeholder for 'self_improvement'
      { id: 'l6', name: 'Toilet', icon: require('../assets/images/toilet.png') },
    ],
    amenitiesCount: 6,
    directions: 'Airside - Terminal 1, South Concourse, near Gates 1 to 4.',
    description: 'The Wing, First Class Lounge by Cathay Pacific at HKG is renowned for its luxurious Cabanas, fine dining at The Haven, and tranquil atmosphere.',
    bankName: 'Bank of Bahrain and Kuwait',
    bankLogo: require('../assets/images/Banks/bankofbahrainandkuwait.png'),
  },
  {
    id: '13',
    name: 'Lufthansa Senator Lounge MUC G28',
    image: require('../assets/images/test3.jpg'),
    images: [require('../assets/images/test4.webp'), require('../assets/images/test2.webp')],
    location: 'Terminal 2 Level G (Schengen) • Near G28',
    fullLocation: 'Terminal 2, Level G (Schengen Area), Near Gate G28, Munich Airport',
    airport: 'Munich Airport (MUC)',
    hours: '05:00 - 22:00 daily',
    walkInDetails: 'Lufthansa Senator, Star Alliance Gold, First Class',
    entitlement: 'Eligible passengers',
    entitlementPrice: 'N/A',
    walkInButtonText: 'Scan Boarding Pass',
    fairUsePolicy: 'Standard Lufthansa policies.',
    amenities: [
      { id: 'm1', name: 'Wi-Fi', icon: require('../assets/images/wifi.png') },
      { id: 'm2', name: 'Bavarian Buffet', icon: require('../assets/images/fridge.png') }, // Placeholder for 'bakery_dining'
      { id: 'm3', name: 'Bar', icon: require('../assets/images/beer.png') },
      { id: 'm4', name: 'Relaxation Zones', icon: require('../assets/images/fridge.png') }, // Placeholder for 'airline_seat_recline_normal'
      { id: 'm5', name: 'Showers', icon: require('../assets/images/shower.png') },
      { id: 'm6', name: 'Lobby', icon: require('../assets/images/lobby.png') },
    ],
    amenitiesCount: 6,
    directions: 'Airside - Terminal 2, Schengen Area (Level 04), near Gate G28.',
    description: 'The Lufthansa Senator Lounge at Munich Airport offers a comfortable Bavarian-themed environment with excellent food and relaxation options.',
    bankName: 'Bank of Baroda',
    bankLogo: require('../assets/images/Banks/bankofbaroda.png'),
  },
  {
    id: '14',
    name: 'Qantas International First Lounge SYD',
    image: require('../assets/images/test4.webp'),
    images: [require('../assets/images/test1.webp'), require('../assets/images/test5.jpg')],
    location: 'Terminal 1 • International Departures',
    fullLocation: 'Terminal 1, International Departures, Level 4, Sydney Kingsford Smith Airport',
    airport: 'Sydney Kingsford Smith Airport (SYD)',
    hours: '05:00 - Last Qantas departure',
    walkInDetails: 'Qantas First Class, Oneworld Emerald (on QF/EK)',
    entitlement: 'Eligible passengers',
    entitlementPrice: 'N/A',
    walkInButtonText: 'Welcome',
    fairUsePolicy: 'Exclusive access.',
    amenities: [
      { id: 'n1', name: 'Wi-Fi', icon: require('../assets/images/wifi.png') },
      { id: 'n2', name: 'Rockpool Dining', icon: require('../assets/images/fridge.png') }, // Placeholder for 'restaurant_menu'
      { id: 'n3', name: 'Aurora Spa', icon: require('../assets/images/fridge.png') }, // Placeholder for 'spa'
      { id: 'n4', name: 'Library', icon: require('../assets/images/fridge.png') }, // Placeholder for 'local_library'
      { id: 'n5', name: 'Private Suites (bookable)', icon: require('../assets/images/fridge.png') }, // Placeholder for 'meeting_room'
      { id: 'n6', name: 'Reception', icon: require('../assets/images/receptionist_bell.png') },
    ],
    amenitiesCount: 6,
    directions: 'Airside - Terminal 1, after customs and security, take escalators to Level 4.',
    description: 'The Qantas First Lounge in Sydney, designed by Marc Newson, offers award-winning Rockpool dining, an Aurora Spa, and stunning tarmac views.',
    bankName: 'Bank of Ceylon',
    bankLogo: require('../assets/images/Banks/bankofceylon.png'),
  },
  {
    id: '15',
    name: 'Delta Sky Club JFK T4',
    image: require('../assets/images/test5.jpg'),
    images: [require('../assets/images/test2.webp'), require('../assets/images/test3.jpg')],
    location: 'Terminal 4 Concourse B • Near Gate B32',
    fullLocation: 'Terminal 4, Concourse B, Near Gate B32, John F. Kennedy International Airport',
    airport: 'John F. Kennedy International Airport (JFK)',
    hours: '05:00 - 23:45 daily',
    walkInDetails: 'Delta One, SkyTeam Elite Plus, Amex Platinum/Centurion',
    entitlement: 'Varies by membership/ticket',
    entitlementPrice: 'Guest access fees may apply',
    walkInButtonText: 'Scan Card/Pass',
    fairUsePolicy: 'Standard Delta Sky Club policies.',
    amenities: [
      { id: 'o1', name: 'Wi-Fi', icon: require('../assets/images/wifi.png') },
      { id: 'o2', name: 'Food Buffet', icon: require('../assets/images/fridge.png') }, // Placeholder for 'food'
      { id: 'o3', name: 'Full-Service Bar', icon: require('../assets/images/beer.png') },
      { id: 'o4', name: 'Sky Deck (Outdoor Terrace)', icon: require('../assets/images/fridge.png') }, // Placeholder for 'deck'
      { id: 'o5', name: 'Showers', icon: require('../assets/images/shower.png') },
      { id: 'o6', name: 'Toilet', icon: require('../assets/images/toilet.png') },
    ],
    amenitiesCount: 6,
    directions: 'Airside - Terminal 4, Concourse B, near Gate B32.',
    description: 'The flagship Delta Sky Club at JFK T4 features an outdoor Sky Deck, premium food and beverage options, and ample space to relax or work.',
    bankName: 'Bank of China',
    bankLogo: require('../assets/images/Banks/bankofchina.png'),
  },
  {
    id: '16',
    name: 'Turkish Airlines Lounge Istanbul Airport',
    image: require('../assets/images/test1.webp'),
    images: [require('../assets/images/test4.webp'), require('../assets/images/test5.jpg')],
    location: 'International Terminal • Departures Floor',
    fullLocation: 'International Terminal, Departures Floor, Istanbul Airport',
    airport: 'Istanbul Airport (IST)',
    hours: '24 hours daily',
    walkInDetails: 'Turkish Airlines Business/Elite Plus, Star Alliance Gold',
    entitlement: 'Eligible passengers',
    entitlementPrice: 'N/A',
    walkInButtonText: 'Enter Lounge',
    fairUsePolicy: 'Standard Turkish Airlines policies.',
    amenities: [
      { id: 'p1', name: 'Wi-Fi', icon: require('../assets/images/wifi.png') },
      { id: 'p2', name: 'Live Cooking Stations (Turkish & Intl)', icon: require('../assets/images/fridge.png') }, // Placeholder for 'countertops'
      { id: 'p3', name: 'Cinema', icon: require('../assets/images/fridge.png') }, // Placeholder for 'theaters'
      { id: 'p4', name: 'Golf Simulator', icon: require('../assets/images/fridge.png') }, // Placeholder for 'golf_course'
      { id: 'p5', name: 'Private Suites (with shower)', icon: require('../assets/images/shower.png') },
      { id: 'p6', name: 'Kids Play Area', icon: require('../assets/images/fridge.png') }, // Placeholder for 'child_care'
      { id: 'p7', name: 'Lobby', icon: require('../assets/images/lobby.png') },
    ],
    amenitiesCount: 7,
    directions: 'Airside - International Terminal, after passport control, take escalator opposite Gate E1.',
    description: 'The Turkish Airlines Lounge at Istanbul Airport is a vast, award-winning space offering diverse culinary delights, a cinema, golf simulator, and private suites.',
    bankName: 'Bank of India',
    bankLogo: require('../assets/images/Banks/bankofindia.png'),
  },
];

export default mockLounges;
