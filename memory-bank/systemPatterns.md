# System Patterns

## System Architecture
- **Client-Server Model for Images:**
    - React Native application (client) fetches images from a `partner-backend` (server).
    - `partner-backend` serves static image files.
    - Client implements caching for these images.
- (To be defined further)

## Key Technical Decisions
- **Custom Image Caching Solution:** A custom solution using `react-native-fs` and `@react-native-async-storage/async-storage` was implemented for client-side image caching. This decision was driven by peer dependency conflicts between `react-native-fast-image` and the project's React 19 version.
- (To be defined further)

## Design Patterns in Use
- **Service-Oriented Caching:**
    - `src/services/ImageCache.ts` acts as a dedicated service for managing image caching logic (downloading, storing, retrieving). This decouples caching logic from UI components.
- **Higher-Order Component (Wrapper Component for Caching):**
    - `src/components/CachedImage.tsx` wraps the standard React Native `Image` component. It enhances `Image` with caching capabilities by interacting with `ImageCache.ts`, managing loading states, and determining whether to display a cached local version or fetch/display a remote version.
- (To be defined further)

## Data Handling Patterns
- **Remote Image URL Construction:**
    - Image filenames/paths received from the backend API (via `fetchLoungesFromAPI` in `src/data/mockData.ts`) are dynamically prefixed with the backend's image base URL (e.g., `https://lounge-app-536s.onrender.com/images/`) to form full, loadable URLs.
- **Local Cache Management:**
    - `ImageCache.ts` uses `AsyncStorage` to store metadata mapping remote image URLs to their local file paths within the app's cache directory. `react-native-fs` is used for actual file I/O (downloads, saves, existence checks).

## UI Layout Patterns
- **Row with Sibling Elements**:
    - In `ExploreScreen.tsx`, a `View` with `flexDirection: 'row'` (`styles.newFilterButtonRow`) is used to position a flexible-width dropdown (`styles.dropdownContainer` with `flex: 1`) alongside a fixed-width button (`styles.actualFilterButton`). This pattern allows for an input-like element to take available space while a button or icon sits neatly beside it.

## Component Relationships
- `LoungeCard.tsx`, `OfferDetailScreen.tsx` (and potentially other components displaying images) now depend on `CachedImage.tsx`.
- `CachedImage.tsx` depends on `ImageCache.ts`.
- `ImageCache.ts` depends on `react-native-fs` and `@react-native-async-storage/async-storage`.
- (To be defined further)
