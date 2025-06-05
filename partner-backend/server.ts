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
  isMerchant?: boolean; 
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

    if (!body.id || !body.name || !body.bankName) {
      cleanupFiles(files);
      return res.status(400).json({ message: 'Invalid data. Missing required fields: id (Merchant ID), name (Merchant Name), bankName.' });
    }

    const bankLogoFile = files?.['bankLogo']?.[0];
    if (!bankLogoFile) {
      cleanupFiles(files); 
      return res.status(400).json({ message: 'Missing required field: Partner/Bank Logo (bankLogo).' });
    }
    
    if (loungeDataStore.find(item => item.id === body.id)) {
      cleanupFiles(files);
      return res.status(400).json({ message: `Entry with ID ${body.id} already exists.` });
    }

    const isMerchantOnlySubmission = !body.location && !body.description && !body.offerType && !files?.['image'];

    if (isMerchantOnlySubmission) {
      const newMerchantEntry: Lounge = {
        id: body.id,
        name: body.name, 
        bankName: body.bankName,
        bankLogo: `images/uploads/${bankLogoFile.filename}`,
        isMerchant: true, 
        image: `images/uploads/${bankLogoFile.filename}`, 
        images: [],
        location: "Merchant Profile", 
        fullLocation: body.fullLocation || "Not Applicable", 
        airport: "N/A",
        hours: "N/A",
        offerType: "N/A (Merchant Profile)",
        description: `Profile for merchant: ${body.name}.`,
        amenities: [],
        amenitiesCount: 0,
        directions: body.directions || "N/A",
        walkInDetails: "N/A",
        entitlement: "N/A",
        entitlementPrice: "N/A",
        walkInButtonText: "View Offers", 
        fairUsePolicy: "N/A",
      };
      loungeDataStore.push(newMerchantEntry);
      console.log('New merchant integrated:', newMerchantEntry.name);
      return res.status(201).json({ message: 'Merchant integrated successfully', merchant: newMerchantEntry });

    } else {
      const mainImageFile = files?.['image']?.[0];
      const carouselImageFiles = files?.['images'] || [];

      if (!mainImageFile) {
        cleanupFiles(files);
        return res.status(400).json({ message: 'Missing required field: Main List Image (image) for full offer.' });
      }
      if (!body.location || !body.description || !body.offerType || !body.hours || !body.airport) {
        cleanupFiles(files);
        return res.status(400).json({ message: 'Missing required fields for full offer (e.g., location, description, offerType, hours, airport).' });
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
      
      const newOffer: Lounge = {
        id: body.id, 
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
        isMerchant: false, 
      };
      
      if (!Object.values(OfferType).includes(newOffer.offerType as OfferType)) {
          console.warn(`Invalid offerType ('${newOffer.offerType}') for new offer ID ${newOffer.id}. Defaulting.`);
          newOffer.offerType = OfferType.MEMBERSHIP_CREDENTIAL; 
      }

      loungeDataStore.push(newOffer);
      console.log('New full offer integrated:', newOffer.name);
      return res.status(201).json({ message: 'Full offer integrated successfully', offer: newOffer });
    }
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

app.post('/api/merchants/:merchantId/offers', noFileUploadMulter, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { merchantId } = req.params;
    const body = req.body;

    // Basic validation
    if (!merchantId) {
      return res.status(400).json({ message: 'Merchant ID is required.' });
    }
    if (!body.offerTitle || !body.offerType || !body.location || !body.image || !body.carouselImages) {
      return res.status(400).json({ message: 'Missing required offer fields (e.g., offerTitle, offerType, location, image, carouselImages).' });
    }

    const merchantExists = loungeDataStore.some(item => item.id === merchantId && item.isMerchant === true);
    if (!merchantExists) {
      // Attempt to find if it's a non-merchant entry, to give a more specific error, or just a general "not found"
      const entryExistsAsNonMerchant = loungeDataStore.some(item => item.id === merchantId && !item.isMerchant);
      if (entryExistsAsNonMerchant) {
        return res.status(400).json({ message: `The entry with ID ${merchantId} is an offer, not a merchant. Cannot add offer to another offer.` });
      }
      return res.status(404).json({ message: `Merchant with ID ${merchantId} not found.` });
    }
    
    // Or, if merchantId is not the same as loungeDataStore item id, adjust this check.
    // For now, assuming merchantId might correspond to a bankName or a specific merchant entry.
    // Let's assume for simplicity that the merchant is identified by bankName for now,
    // and the offer is associated with that bankName.
    // A more robust system would have a separate merchants collection.
    // The current AddOfferForm sends merchantId which is derived from existing offer 'id's,
    // which might be confusing. Let's assume `merchantId` from params is the `bankName` for now for simplicity of adding to store.
    // This part needs clarification on how merchants are truly identified and offers associated.
    // For the purpose of this endpoint, we'll use merchantId as the bankName.

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
    const newOfferId = `${merchantId}_offer_${Date.now()}`;
    const associatedMerchant = loungeDataStore.find(m => m.id === merchantId); // Assuming merchantId is an ID of a merchant entry

    const newOffer: Lounge = {
      id: newOfferId,
      name: body.offerTitle, // Using offerTitle as name
      bankName: associatedMerchant ? associatedMerchant.bankName : merchantId, // Use merchantId as bankName if no direct merchant found
      bankLogo: associatedMerchant ? associatedMerchant.bankLogo : '', // Use merchant's logo or a default
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
      image: `/images/${body.image}`, // Assuming image path is relative to public/images/
      images: parsedCarouselImages.map(imgPath => `/images/${imgPath}`), // Assuming paths are relative
      amenities: parsedAmenities,
      amenitiesCount: parsedAmenities.length,
      isMerchant: false,
    };

    if (!Object.values(OfferType).includes(newOffer.offerType as OfferType) && typeof newOffer.offerType === 'string') {
        console.warn(`Invalid offerType ('${newOffer.offerType}') for new offer ID ${newOffer.id}. Defaulting.`);
        newOffer.offerType = OfferType.MEMBERSHIP_CREDENTIAL; 
    }

    loungeDataStore.push(newOffer);
    console.log(`New offer "${newOffer.name}" added for merchant ID "${merchantId}":`, newOffer);
    res.status(201).json({ message: 'Offer added successfully to merchant.', offer: newOffer });

  } catch (error) {
    console.error(`Error in /api/merchants/${req.params.merchantId}/offers:`, error);
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
