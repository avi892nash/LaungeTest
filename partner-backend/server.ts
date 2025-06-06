import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs'; // For ensuring directory exists
import multer from 'multer'; // For handling file uploads
import initialLoungeData from './initial-lounge-data.json';

// Define types for the backend
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
  icon: string;
}

interface Lounge {
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
  bankName: string; 
  bankLogo: string; 
  offerType: OfferType | string; 
  partnerId: string; // Added to link offer to a partner
}

const app: Express = express();
const PORT: string | number = process.env.PORT || 3001; // Reverted port to 3001 as per last direct request

app.use(cors());

// Determine the root of the partner-backend directory, whether running from /dist or directly
const partnerBackendRoot = path.resolve(__dirname, path.basename(__dirname) === 'dist' ? '..' : '.');

// Define paths relative to partnerBackendRoot
const partnerFrontendDistPath = path.join(partnerBackendRoot, 'partner-frontend', 'dist');
const publicPath = path.join(partnerBackendRoot, 'public');
const UPLOADS_DIR = path.join(publicPath, 'images', 'uploads');

app.use(express.static(partnerFrontendDistPath));
app.use('/images', express.static(path.join(publicPath, 'images'))); // Serve images specifically from /images route
// app.use(express.static(publicPath)); // General static serving from public if needed for other files

let loungeDataStore: Lounge[] = [...initialLoungeData] as Lounge[];
console.log(`Successfully loaded ${loungeDataStore.length} initial lounge data entries from JSON.`);

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

app.post('/api/integrate-offer', upload, ((req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const body = req.body;

    // body.id is now treated as partnerId
    // body.name is offer name
    // body.bankName is offer's bank name
    if (!body.id || !body.name || !body.bankName) {
      cleanupFiles(files);
      return res.status(400).json({ message: 'Invalid data. Missing required fields: id (Partner ID), name (Offer Name), bankName (Offer Bank Name).' });
    }

    const bankLogoFile = files?.['bankLogo']?.[0];
    if (!bankLogoFile) {
      cleanupFiles(files);
      return res.status(400).json({ message: 'Missing required field: Offer Bank Logo (bankLogo).' });
    }
    
    const mainImageFile = files?.['image']?.[0];
    const carouselImageFiles = files?.['images'] || [];

    if (!mainImageFile) {
      cleanupFiles(files);
      return res.status(400).json({ message: 'Missing required field: Main List Image (image) for offer.' });
    }
    if (!body.location || !body.description || !body.offerType || !body.hours || !body.airport) {
      cleanupFiles(files);
      return res.status(400).json({ message: 'Missing required fields for offer (e.g., location, description, offerType, hours, airport).' });
    }

    let parsedAmenities: Amenity[] = [];
    if (body.amenities) {
        try {
            parsedAmenities = JSON.parse(body.amenities);
            if (!Array.isArray(parsedAmenities)) parsedAmenities = [];
        } catch (e) { 
            console.warn('Could not parse amenities JSON string:', body.amenities);
            parsedAmenities = [];
        }
    }
    
    const newOfferId = `offer_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    const newOffer: Lounge = {
      id: newOfferId, // Unique ID for the offer
      partnerId: body.id, // Partner's unique ID from the form
      name: body.name, 
      bankName: body.bankName,
      offerType: body.offerType,
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
      image: `images/uploads/${mainImageFile.filename}`,
      bankLogo: `images/uploads/${bankLogoFile.filename}`,
      images: carouselImageFiles.map(file => `images/uploads/${file.filename}`),
      amenities: parsedAmenities,
      amenitiesCount: parsedAmenities.length,
    };
    
    if (!Object.values(OfferType).includes(newOffer.offerType as OfferType) && typeof newOffer.offerType === 'string') {
        console.warn(`Invalid offerType ('${newOffer.offerType}') for new offer ID ${newOffer.id}. Defaulting.`);
        newOffer.offerType = OfferType.MEMBERSHIP_CREDENTIAL; 
    }

    loungeDataStore.push(newOffer);
    console.log('New offer integrated:', newOffer.name);
    return res.status(201).json({ message: 'Offer integrated successfully', offer: newOffer });
  } catch (error) {
    console.error('Error in /api/integrate-offer:', error);
    cleanupFiles(req.files as { [fieldname: string]: Express.Multer.File[] } | undefined);
    next(error);
  }
}) as any); 

app.get('/api/offers', (req: Request, res: Response) => {
  res.json(loungeDataStore);
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

    // Verify partner context exists by checking if there's at least one offer with this partnerId
    const partnerContextExists = loungeDataStore.some(item => item.partnerId === partnerId);
    if (!partnerContextExists) {
      return res.status(404).json({ message: `Partner context with ID ${partnerId} not found. Ensure the partner has integrated at least one offer or has a registered ID.` });
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

    const newOffer: Lounge = {
      id: newOfferId, // Unique ID for the new offer
      partnerId: partnerId, // From URL param
      name: body.offerTitle, // Using offerTitle as name
      bankName: body.bankName, // Specific bank name for this offer from body
      bankLogo: body.bankLogo, // Specific bank logo for this offer from body (assuming path)
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

    if (!Object.values(OfferType).includes(newOffer.offerType as OfferType) && typeof newOffer.offerType === 'string') {
        console.warn(`Invalid offerType ('${newOffer.offerType}') for new offer ID ${newOffer.id}. Defaulting.`);
        newOffer.offerType = OfferType.MEMBERSHIP_CREDENTIAL; 
    }

    loungeDataStore.push(newOffer);
    console.log(`New offer "${newOffer.name}" added for partner ID "${partnerId}":`, newOffer); // Renamed text and param
    res.status(201).json({ message: 'Offer added successfully to partner.', offer: newOffer }); // Renamed text

  } catch (error) {
    console.error(`Error in /api/partners/${req.params.partnerId}/offers:`, error); // Renamed path and req.params.partnerId
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
