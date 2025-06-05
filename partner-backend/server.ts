import express, { Express, Request, Response } from 'express';
import cors from 'cors';
// import fs from 'fs'; // No longer needed for initial load
// import path from 'path'; // No longer needed for initial load
import initialLoungeData from './initial-lounge-data.json'; // Import JSON data

// Define types for the backend - these can be simpler than frontend's ImageSourcePropType
// Or ideally, share types between frontend and backend via a common package.

enum OfferType {
  DIRECT_PAID = "Direct Paid Access",
  CONDITIONAL_INQUIRY = "Conditional/Inquiry-Based Access",
  RESERVATION_BOOKING = "Reservation/Booking Required",
  MEMBERSHIP_CREDENTIAL = "Membership/Credential-Based Exclusive Access",
  GENERAL_ELIGIBILITY_IMPLIED = "General Access (Eligibility Implied)",
}

interface Amenity {
  id: string;
  name: string;
  icon: string; // Simple string path for backend
}

interface Lounge {
  id: string;
  name: string;
  image: string; // Simple string path
  images: string[]; // Array of simple string paths
  location: string;
  fullLocation: string;
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
  bankLogo: string; // Simple string path
  offerType: OfferType | string; // Allow string for incoming data before validation/casting
}

const app: Express = express();
const PORT: string | number = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory store for lounge data, typed
let loungeDataStore: Lounge[] = [...initialLoungeData] as Lounge[];
console.log(`Successfully loaded ${loungeDataStore.length} initial lounge data entries from JSON.`);


// --- API Endpoints ---

// GET all lounge offers
app.get('/api/offers', (req: Request, res: Response) => {
  res.json(loungeDataStore);
});

// POST a new offer (partner integration)
app.post('/api/integrate-offer', ((req: Request, res: Response, next: express.NextFunction) => { // Removed async
  try {
    const newOffer = req.body as Lounge; // Explicitly cast

    // Basic validation (can be expanded)
    if (!newOffer || !newOffer.id || !newOffer.name || !newOffer.bankName) {
      return res.status(400).json({ message: 'Invalid offer data. Missing required fields: id, name, bankName.' });
    }

    // Check for duplicate ID
    if (loungeDataStore.find(lounge => lounge.id === newOffer.id)) {
      return res.status(400).json({ message: `Offer with ID ${newOffer.id} already exists.` });
    }
    
    // Validate or default offerType
    if (!newOffer.offerType || !Object.values(OfferType).includes(newOffer.offerType as OfferType)) {
        console.warn(`Invalid or missing offerType for new offer ID ${newOffer.id}. Defaulting to MEMBERSHIP_CREDENTIAL.`);
        newOffer.offerType = OfferType.MEMBERSHIP_CREDENTIAL; 
    }

    // Note: Image paths from partner frontend are expected to be relative strings like 'test1.webp' or 'Banks/logo.png'
    // The backend doesn't process/store these images, just the string paths.
    // The React Native app will handle `require()` based on these string paths.

    loungeDataStore.push(newOffer);
    console.log('New offer integrated:', newOffer.name, 'by', newOffer.bankName);
    res.status(201).json({ message: 'Offer integrated successfully', offer: newOffer });
  } catch (error) {
    next(error); // Pass errors to Express error handler
  }
}) as any); // Type assertion to bypass persistent overload error

app.listen(PORT, () => {
  console.log(`Partner backend server running on http://localhost:${PORT}`);
});
