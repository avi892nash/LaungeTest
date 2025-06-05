# Tech Context

## Technologies Used
- React Native: `0.79.2`
- React: `19.0.0`
- TypeScript (Inferred from `.tsx` file extensions and `tsconfig.json`)
- Node.js for backend (`partner-backend` uses Express.js)

## Development Setup
- Node.js environment with npm (or yarn) for package management.
- React Native CLI for running the app on iOS and Android simulators/devices.
- Cocoapods for iOS native dependency management.
- Backend (`partner-backend`) is an Express.js application, likely run with `npm start` or similar, and intended for deployment (e.g., on Render).
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
- (Full list can be inferred from `package.json` and `partner-backend/package.json`)
