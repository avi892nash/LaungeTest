import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs'; // For ensuring directory exists
import multer from 'multer'; // For handling file uploads
import structuredInitialData from './structured-data.json'; // Changed import

// Define types for the backend
enum OfferType {
  DIRECT_PAID = "Direct Paid Access",
  CONDITIONAL_INQUIRY = "Conditional/Inquiry-Based Access",
  RESERVATION_BOOKING = "Reservation/Booking Required",
  MEMBERSHIP_CREDENTIAL = "Membership/Credential-Based Exclusive Access",
  GENERAL_ELIGIBILITY_IMPLIED = "General Access (Eligibility Implied)",
}

// Define a new interface for Partner
interface Partner {
  id: string;
  name: string;
  logo: string; // Path to the partner's logo
}

interface Amenity {
  id: string;
  name: string;
  icon: string;
}

// Offer structure within a Partner
interface OfferInPartner {
  id: string;
  name: string;
  image: string;
  images: string[];
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
  offerType: OfferType | string;
  // bankName and bankLogo here are specific to the offer, if they can differ from the main partner
  bankName: string; 
  bankLogo: string; 
}

// Updated Partner interface to include offers
interface PartnerWithOffers {
  partnerId: string;
  partnerName: string;
  partnerLogo: string;
  offers: OfferInPartner[];
}

// Type for the entire structured data file
type StructuredDataType = PartnerWithOffers[];

// This Lounge interface is now for the flattened list of offers served by /api/offers
// It needs to include partnerId, and the partner's name/logo for frontend compatibility
interface FlatOffer extends OfferInPartner {
  partnerId: string;
  // The bankName and bankLogo from OfferInPartner will be used.
  // If an offer doesn't have its own, the partner's could be a fallback,
  // but current OfferInPartner requires them.
}


const app: Express = express();
const PORT: string | number = process.env.PORT || 3001; // Reverted port to 3001 as per last direct request

app.use(cors());

// Determine the root of the partner-backend directory, whether running from /dist or directly
const partnerBackendRoot = path.resolve(__dirname, path.basename(__dirname) === 'dist' ? '..' : '.');

// Define paths relative to partnerBackendRoot
const partnerFrontendDistPath = path.join(partnerBackendRoot, 'partner-frontend', 'dist');
const publicPath = path.join(partnerBackendRoot, 'public');
// Changed UPLOADS_DIR to point directly to public/images, removing the 'uploads' subdirectory for storage
const UPLOADS_DIR = path.join(publicPath, 'images'); 

app.use(express.static(partnerFrontendDistPath));
app.use('/images', express.static(path.join(publicPath, 'images'))); // Serve images specifically from /images route
// app.use(express.static(publicPath)); // General static serving from public if needed for other files

// Load the structured data
let structuredDataStore: StructuredDataType = [...structuredInitialData] as StructuredDataType;
console.log(`Successfully loaded ${structuredDataStore.length} initial partners with their offers from structured JSON.`);


if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log(`Created uploads directory at: ${UPLOADS_DIR}`);
} else {
  console.log(`Uploads directory already exists at: ${UPLOADS_DIR}`);
}

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'bankLogo', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);

const cleanupFiles = (files: { [fieldname: string]: Express.Multer.File[] } | undefined) => {
    if (!files) return;
    const mainImage = files['image']?.[0];
    if (mainImage?.path && fs.existsSync(mainImage.path)) {
        fs.unlinkSync(mainImage.path);
    }
    const logoFile = files['bankLogo']?.[0];
    if (logoFile?.path && fs.existsSync(logoFile.path)) {
        fs.unlinkSync(logoFile.path);
    }
    if (files['images']) {
        files['images'].forEach(f => { 
            if (f?.path && fs.existsSync(f.path)) {
                fs.unlinkSync(f.path);
            }
        });
    }
};

app.post('/api/integrate-partner', upload, ((req: Request, res: Response, next: NextFunction) => { // Renamed endpoint
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const body = req.body;

    // body.id is now treated as partnerId
    // body.name is offer name (actually partner name from this form)
    // body.bankName is offer's bank name (now optional)
    if (!body.id || !body.name) { // bankName is now optional
      cleanupFiles(files);
      // Updated error message to reflect bankName is optional
      return res.status(400).json({ message: 'Invalid data. Missing required fields: id (Partner ID), name (Partner Name).' });
    }

    const bankLogoFile = files?.['bankLogo']?.[0];
    if (!bankLogoFile) {
      cleanupFiles(files);
      return res.status(400).json({ message: 'Missing required field: Offer Bank Logo (bankLogo).' });
    }
    
    // const mainImageFile = files?.['image']?.[0]; // Not used in this endpoint for creating a Partner
    // const carouselImageFiles = files?.['images'] || []; // Not used in this endpoint for creating a Partner

    // Main image is now optional for this endpoint
    // if (!mainImageFile) {
    //   cleanupFiles(files);
    //   return res.status(400).json({ message: 'Missing required field: Main List Image (image) for offer.' });
    // }
    
    // These fields are also part of an "offer", which this form doesn't fully supply.
    // For now, let's assume they might not be provided by this specific form and make them optional or handle defaults.
    // However, the original error was only about 'image'. Let's focus on that.
    // The backend will likely fail later if these are strictly required and not provided.
    // For now, only commenting out the mainImageFile check as per the specific error.
    // The user might provide further feedback if other fields cause issues.

    // Removing validation for offer-specific fields like location, description, offerType, etc.,
    // as the current "Integrate Partner" form does not supply them.
    // These will now default to empty strings or a default OfferType.
    // if (!body.location || !body.description || !body.offerType || !body.hours || !body.airport) {
    //   cleanupFiles(files);
    //   return res.status(400).json({ message: 'Missing required fields for offer (e.g., location, description, offerType, hours, airport).' });
    // }

    // This endpoint now creates a Partner, not an Offer.
    // Offer-specific parsing like amenities is not relevant here.
    // const newOfferId = `offer_${Date.now()}_${Math.random().toString(36).substring(2)}`; // Not creating an offer ID

    const newPartner: Partner = {
      id: body.id, // Partner's unique ID from the form
      name: body.name, // Partner's Name from the form
      logo: bankLogoFile.filename, // Store only the filename, frontend will add /images/ prefix
    };

    // Check if partner with this ID already exists in structuredDataStore
    const existingPartner = structuredDataStore.find(p => p.partnerId === newPartner.id);
    if (existingPartner) {
      cleanupFiles(files); // Clean up uploaded logo if partner is a duplicate
      return res.status(409).json({ message: `Partner with ID ${newPartner.id} already exists.` });
    }
    
    // Add to structuredDataStore
    const newPartnerWithOffers: PartnerWithOffers = {
      partnerId: newPartner.id, // from newPartner which uses body.id
      partnerName: newPartner.name, // from newPartner which uses body.name
      partnerLogo: newPartner.logo, // from newPartner which uses bankLogoFile.filename (already prefixed with images/)
      offers: [] // Initialize with empty offers array
    };
    structuredDataStore.push(newPartnerWithOffers);

    console.log('New partner integrated:', newPartnerWithOffers);
    // Return the core partner info, not the one with offers array for this specific response
    return res.status(201).json({ message: 'Partner integrated successfully', partner: {id: newPartner.id, name: newPartner.name, logo: newPartner.logo } });
  } catch (error) {
    console.error('Error in /api/integrate-partner:', error);
    cleanupFiles(req.files as { [fieldname: string]: Express.Multer.File[] } | undefined);
    next(error);
  }
}) as any); 

app.get('/api/partners', (req: Request, res: Response) => {
  // Extract partner info from structuredDataStore
  const partners = structuredDataStore.map(p => ({
    id: p.partnerId, // Frontend expects 'id'
    name: p.partnerName,
    logo: p.partnerLogo
  }));
  res.json(partners);
});

app.get('/api/offers', (req: Request, res: Response) => {
  // Flatten offers from structuredDataStore and add partnerId, partnerName, partnerLogo
  const flatOffers: FlatOffer[] = [];
  structuredDataStore.forEach(partner => {
    partner.offers.forEach(offer => {
      flatOffers.push({
        ...offer,
        partnerId: partner.partnerId
        // bankName and bankLogo are already in OfferInPartner, so they are part of ...offer
        // If they were not, you'd add them here:
        // bankName: offer.bankName || partner.partnerName, // Fallback to partner name if offer specific one is not there
        // bankLogo: offer.bankLogo || partner.partnerLogo  // Fallback to partner logo
      });
    });
  });
  res.json(flatOffers);
});

// Middleware for parsing FormData without file uploads for the new endpoint
const noFileUploadMulter = multer().none();

app.post('/api/partners/:partnerId/offers', noFileUploadMulter, (req: Request, res: Response, next: NextFunction) => { // Renamed path and param
  try {
    const { partnerId } = req.params; // Renamed param
    const body = req.body;

    // Basic validation
    if (!partnerId) {
      return res.status(400).json({ message: 'Partner ID is required in URL.' });
    }
    // Assuming bankName and bankLogo for the offer are provided in the body.
    // If bankLogo needs to be an upload, multer setup for this route needs to change.
    if (!body.offerTitle || !body.offerType || !body.location || !body.image || !body.carouselImages || !body.bankName || !body.bankLogo) {
      return res.status(400).json({ message: 'Missing required offer fields (e.g., offerTitle, offerType, location, image, carouselImages, bankName, bankLogo).' });
    }

    // Verify partner exists in structuredDataStore
    const partnerForOffer = structuredDataStore.find(p => p.partnerId === partnerId);
    if (!partnerForOffer) {
      return res.status(404).json({ message: `Partner with ID ${partnerId} not found. Cannot add offer.` });
    }
    
    let parsedCarouselImages: string[] = [];
    if (body.carouselImages) {
      try {
        parsedCarouselImages = JSON.parse(body.carouselImages);
        if (!Array.isArray(parsedCarouselImages)) parsedCarouselImages = [];
      } catch (e) {
        console.warn('Could not parse carouselImages JSON string:', body.carouselImages);
        return res.status(400).json({ message: 'Invalid format for carouselImages.' });
      }
    }

    let parsedAmenities: Amenity[] = [];
    if (body.amenities) {
        try {
            parsedAmenities = JSON.parse(body.amenities);
            if (!Array.isArray(parsedAmenities)) parsedAmenities = [];
        } catch (e) { 
            console.warn('Could not parse amenities JSON string:', body.amenities);
            // Not returning error, just empty amenities if parsing fails for this optional field
            parsedAmenities = [];
        }
    }
    
    // Construct the new offer object
    // The ID for the new offer should be unique.
    const newOfferId = `offer_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    // Construct the new offer object for OfferInPartner type
    const newOfferForPartner: OfferInPartner = {
      id: newOfferId,
      name: body.offerTitle,
      bankName: body.bankName, // Specific bank name for this offer
      bankLogo: body.bankLogo, // Specific bank logo for this offer
      offerType: body.offerType as OfferType | string,
      location: body.location,
      fullLocation: body.fullLocation,
      airport: body.airport,
      hours: body.hours,
      directions: body.directions || '',
      walkInDetails: body.walkInDetails || '',
      entitlement: body.entitlement || '',
      entitlementPrice: body.entitlementPrice || '',
      walkInButtonText: body.walkInButtonText || 'View Details',
      fairUsePolicy: body.fairUsePolicy || '',
      description: body.description,
      image: body.image, // Store plain filename
      images: parsedCarouselImages, // Store plain filenames
      amenities: parsedAmenities,
      amenitiesCount: parsedAmenities.length,
    };

    if (!Object.values(OfferType).includes(newOfferForPartner.offerType as OfferType) && typeof newOfferForPartner.offerType === 'string') {
        console.warn(`Invalid offerType ('${newOfferForPartner.offerType}') for new offer ID ${newOfferForPartner.id}. Defaulting.`);
        newOfferForPartner.offerType = OfferType.MEMBERSHIP_CREDENTIAL; 
    }

    // Add to the found partner's offers array
    partnerForOffer.offers.push(newOfferForPartner);

    console.log(`New offer "${newOfferForPartner.name}" added for partner ID "${partnerId}":`, newOfferForPartner);
    // The response should ideally reflect the offer as it was added, perhaps also including partnerId for context if needed by client
    // For now, returning the offer as added to the partner.
    // To match the old FlatOffer structure for the response, we'd need to add partnerId.
    const responseOffer: FlatOffer = {
        ...newOfferForPartner,
        partnerId: partnerId
    };
    res.status(201).json({ message: 'Offer added successfully to partner.', offer: responseOffer });

  } catch (error) {
    console.error(`Error in /api/partners/${req.params.partnerId}/offers:`, error);
    next(error);
  }
});


app.listen(PORT, () => {
  console.log(`Partner backend server running on http://localhost:${PORT}`);
});

app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api/')) {
    return next(); 
  }
  // Serve index.html from the partnerFrontendDistPath
  res.sendFile(path.join(partnerFrontendDistPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      // Check if the specific error is ENOENT (file not found)
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        res.status(404).send(`Frontend 'index.html' not found at ${path.join(partnerFrontendDistPath, 'index.html')}. Ensure the frontend has been built ('npm run build' in 'partner-backend/partner-frontend').`);
      } else {
        res.status(500).send('Error serving frontend application.');
      }
    }
  });
});
