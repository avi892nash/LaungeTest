# System Patterns

## System Architecture
- **Client-Server Model for Images:**
    - React Native application (client) fetches images from a `partner-backend` (server).
    - `partner-backend` serves static image files.
    - Client implements caching for these images.
- **Partner Offer Dashboard (React Application):**
    - The frontend for partner offer management, now located in `partner-backend/partner-frontend/src/`, is a React application built with Vite and TypeScript.
    - It interacts with the `/api/offers` and `/api/integrate-offer` endpoints of the `partner-backend`.
    - **Layout:** Implemented as a two-column layout (using React components) with a fixed sidebar for navigation and a main content area for displaying different views.
    - **Build Process:** Uses Vite for development (dev server with HMR, proxy) and production builds (output to `partner-backend/partner-frontend/dist/`).
- (To be defined further)

## Key Technical Decisions
- **Partner Dashboard Technology Stack:** Converted from static HTML/CSS/JS to a React (with TypeScript and Vite) application for improved maintainability, scalability, and developer experience.
- **Custom Image Caching Solution (React Native App):** A custom solution using `react-native-fs` and `@react-native-async-storage/async-storage` was implemented for client-side image caching. This decision was driven by peer dependency conflicts between `react-native-fast-image` and the project's React 19 version.
- (To be defined further)

## Design Patterns in Use
- **Service-Oriented Caching:**
    - `src/services/ImageCache.ts` acts as a dedicated service for managing image caching logic (downloading, storing, retrieving). This decouples caching logic from UI components.
- **Higher-Order Component (Wrapper Component for Caching - React Native App):**
    - `src/components/CachedImage.tsx` wraps the standard React Native `Image` component. It enhances `Image` with caching capabilities by interacting with `ImageCache.ts`, managing loading states, and determining whether to display a cached local version or fetch/display a remote version.
- **Component-Based Architecture (React Partner Dashboard):**
    - The dashboard UI (`partner-backend/partner-frontend/src/`) is broken down into reusable React components (e.g., `App.tsx`, `Sidebar.tsx`, `IntegrateOfferForm.tsx`, `ViewMerchants.tsx`).
    - State management is handled within components using `useState` and `useRef`.
    - Props are used for parent-child communication.
- **Dynamic List and Detail View (React Partner Dashboard - `ViewMerchants.tsx`):**
    - Fetches all offers from `/api/offers`.
    - Groups offers by `bankName` (merchant) using JavaScript logic within the component.
    - Dynamically renders a clickable list of merchants.
    - On merchant click (managed by `selectedMerchant` state), filters and displays detailed offers for that specific merchant.
- **SPA-like Navigation (React Partner Dashboard - `App.tsx` & `Sidebar.tsx`):**
    - Uses React state (`currentView` in `App.tsx`) to conditionally render different view components (`IntegrateOfferForm.tsx`, `ViewMerchants.tsx`).
    - Sidebar links update this state, simulating page changes without full page reloads.
- **Predefined Amenity Selection (React Partner Dashboard - `IntegrateOfferForm.tsx`):**
    - Uses a predefined array of amenity objects (`PREDEFINED_AMENITIES`).
    - Dynamically generates and renders checkboxes for these amenities.
    - Manages selected amenities using React state (`selectedAmenities`).
    - On form submission, collects selected amenities and includes them in the `FormData` payload.
- (To be defined further)

## Data Handling Patterns
- **Remote Image URL Construction (React Native App):**
    - Image filenames/paths received from the backend API (via `fetchLoungesFromAPI` in `src/data/mockData.ts`) are dynamically prefixed with the backend's image base URL (e.g., `https://lounge-app-536s.onrender.com/images/`) to form full, loadable URLs.
- **Local Cache Management (React Native App):**
    - `ImageCache.ts` uses `AsyncStorage` to store metadata mapping remote image URLs to their local file paths within the app's cache directory. `react-native-fs` is used for actual file I/O (downloads, saves, existence checks).
- **Form Data Management (React Partner Dashboard - `IntegrateOfferForm.tsx`):**
    - Text-based form inputs are managed using a single state object (`formData`).
    - File inputs are handled using `useRef` to access their `files` property directly.
    - On submission, a `FormData` object is constructed, appending text fields from state, selected amenities (as a JSON string), and files.
- **API Interaction (React Partner Dashboard):**
    - Uses `fetch` API for GET requests (e.g., `/api/offers` in `ViewMerchants.tsx`) and POST requests (e.g., `/api/integrate-offer` with `FormData` in `IntegrateOfferForm.tsx`).
    - Handles API responses and errors, updating component state to reflect loading, success, or error messages.
- **Offer Data Grouping (React Partner Dashboard - `ViewMerchants.tsx`):**
    - Fetched offers are processed and grouped by `bankName` to create a list of unique merchants before display.
- **Amenity Data Collection (React Partner Dashboard - `IntegrateOfferForm.tsx`):**
    - Selected predefined amenities are collected from the `selectedAmenities` state (which stores IDs). These IDs are used to look up full amenity objects from `PREDEFINED_AMENITIES` before being JSON-stringified and sent with the form data.

## UI Layout Patterns
- **Two-Column Sidebar Layout (React Partner Dashboard):**
    - The main `App.tsx` renders a `div` with `className="dashboard-layout"`.
    - This class is styled in `src/index.css` using `display: flex`.
    - The `Sidebar.tsx` component and the main content area (rendered by `App.tsx`) are its flex children.
- **Checkbox Grid for Multi-Select (React Partner Dashboard - `IntegrateOfferForm.tsx`):**
    - The amenities section uses a `div` with `className="amenities-checkbox-grid"`.
    - This class is styled in `src/index.css` using CSS Grid (`display: grid`, `grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))`).
    - Each amenity is rendered as a `div.amenity-checkbox-item` containing an `input[type="checkbox"]` and its `label`.
- **Row with Sibling Elements (React Native App)**:
    - In `ExploreScreen.tsx`, a `View` with `flexDirection: 'row'` (`styles.newFilterButtonRow`) is used to position a flexible-width dropdown (`styles.dropdownContainer` with `flex: 1`) alongside a fixed-width button (`styles.actualFilterButton`). This pattern allows for an input-like element to take available space while a button or icon sits neatly beside it.

- **Image-Spacer-Text Horizontal Layout**:
  - A `linearLayout` (typically horizontal) is used to display an image on one side, a text element on the other, with controlled spacing in between.
  - Spacing can be achieved using a combination of:
    1. An empty nested `linearLayout` with a fixed width, acting as a dedicated spacer element.
    2. The `gap` property on the parent `linearLayout` to define space between its direct children (image, spacer view, text).
  - This pattern is useful for header-like rows or item displays requiring distinct elements with clear separation.
  - Example from the application (shows a bank logo and card type):
    ```json
    // Relevant part of the JSON structure:
    {
      "layout": "linearLayout",
      "config": {
        "height": "60",
        "width": "match_parent",
        "orientation": "horizontal",
        "gravity": "center", // Gravity for the group: image, spacer, text
        "gap": "130"         // Space between image-spacer, and spacer-text
      },
      "children": [
        {
          "type": "image",
          "config": {
            "height": "35",
            "width": "120",
            "url": ".../bnpparibas.png"
          }
        },
        {
          "layout": "linearLayout", // This is the explicit spacer
          "config": {
            "width": "130",
            "height": "match_parent" // Or specific height
          },
          "children": []
        },
        {
          "type": "text",
          "config": {
            "text": "VISA",
            // ... other text properties
            "width": "wrap_content"
          }
        }
      ]
    }
    ```

- **Weighted Space-Between Layout**:
  - A primary horizontal `linearLayout` is used to arrange elements with a main content group on the left and another element (e.g., an icon) on the right, with all available space distributed between them.
  - This "space-between" effect is achieved by including an empty `linearLayout` child with `config.width: "0"` and `config.weight: 1`. This weighted spacer expands to fill the available horizontal space.
  - The parent `linearLayout` might also use `config.gap: "auto"`, potentially interacting with or being governed by the weighted child.
  - Child elements (like the left group) can be nested `linearLayout`s themselves to group sub-elements (e.g., a selection indicator and text).
  - The main container can have styling like `padding` and `cornerRadii`.
  - This pattern is suitable for list items or rows where primary content is on the left and actions/icons are on the right.
  - String identifiers (e.g., `"SelectionComponent"`, `"PrimaryText"`, `"IconImage"`) are used as placeholders within the `children` array. These placeholders are resolved to actual UI components by the rendering system. The same JSON structure can thus produce varied visual outputs depending on how these placeholders are mapped to concrete content. For instance, `"SelectionComponent"` and `"PrimaryText"` could together form a "label + sub-label" pair (e.g., "Link Account" + "Freecharge") or an "indicator + label" pair (e.g., a radio button + "Simpl").
  - Example from the application (shows a selectable item with text and a trailing icon):
    ```json
    // Outer container
    {
      "layout": "linearLayout",
      "config": {
        "orientation": "horizontal",
        "gravity": "center_vertical",
        "padding": [10, 10, 10, 10],
        "gap": "auto", // May interact with weighted child
        "cornerRadii": ["8", true, true, true, true]
      },
      "children": [
        { // Left group: Selection + Spacer + Text
          "layout": "linearLayout",
          "config": {
            "orientation": "horizontal",
            "gravity": "center_vertical",
            "gap": "10" // Gap within the left group
          },
          "children": [
            "SelectionComponent",
            { "layout": "linearLayout", "config": {"width": "10"}, "children": [] }, // Spacer
            "PrimaryText"
          ]
        },
        { // Expanding weighted spacer
          "layout": "linearLayout",
          "config": {
            "width": "0",
            "weight": 1,
            "height": "match_parent"
          },
          "children": []
        },
        "IconImage" // Rightmost element
      ]
    }
    ```

## Component Relationships
- `LoungeCard.tsx`, `OfferDetailScreen.tsx` (and potentially other components displaying images) now depend on `CachedImage.tsx`.
- `CachedImage.tsx` depends on `ImageCache.ts`.
- `ImageCache.ts` depends on `react-native-fs` and `@react-native-async-storage/async-storage`.
- (To be defined further)
