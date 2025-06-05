# Tech Context

## Technologies Used
- React Native: `0.79.2` (Main mobile application)
- React: `19.0.0` (Used by both React Native app and the new Partner Dashboard)
- TypeScript (Used across the project)
- Node.js for backend (`partner-backend` uses Express.js)
- **Partner Offer Dashboard Frontend:**
    - React (`^18.2.0` - typically installed by Vite, check `partner-backend/partner-frontend/package.json` for exact version)
    - Vite (Build tool and dev server)
    - TypeScript

## Development Setup
- Node.js environment with npm (or yarn) for package management.
- **React Native App:**
    - React Native CLI for running on iOS and Android simulators/devices.
    - Cocoapods for iOS native dependency management.
- **Partner Offer Dashboard (React App - `partner-backend/partner-frontend/`):**
    - `npm run dev` (or `yarn dev`) to start the Vite development server (typically on port 5173).
    - `npm run build` (or `yarn build`) to create a production build in the `dist` folder.
- **Backend (`partner-backend`):**
    - An Express.js application, likely run with `npm start` or similar (e.g., `ts-node server.ts` for development if not using `nodemon`).
    - Serves API endpoints and, in production, the built Partner Offer Dashboard static files from `partner-backend/partner-frontend/dist/`.
    - Intended for deployment (e.g., on Render).
- (To be defined further)

## Technical Constraints
- **React 19 Compatibility:** The use of React 19.0.0 has shown compatibility issues with some third-party libraries (e.g., `react-native-fast-image`), requiring workarounds like custom implementations or careful library selection.
- (To be defined further)

## Dependencies
- **Core React Native & Navigation:**
    - `react`: `19.0.0`
    - `react-native`: `0.79.2`
    - `@react-navigation/native`
    - `@react-navigation/stack`
    - `react-native-gesture-handler`
    - `react-native-safe-area-context`
    - `react-native-screens`
- **Custom Image Caching Solution:**
    - `react-native-fs`: For file system access (saving/reading cached images).
    - `@react-native-async-storage/async-storage`: For storing metadata about cached images.
- **Backend (`partner-backend` - selected dependencies):**
    - `express`: `^4.19.2` (downgraded for compatibility)
    - `cors`
    - `multer` (for file uploads)
- **Partner Offer Dashboard Frontend (`partner-backend/partner-frontend/package.json` - selected dependencies):**
    - `react`
    - `react-dom`
    - `vite`
    - `@vitejs/plugin-react`
    - `typescript`
- (Full list can be inferred from `package.json`, `partner-backend/package.json`, and `partner-backend/partner-frontend/package.json`)
