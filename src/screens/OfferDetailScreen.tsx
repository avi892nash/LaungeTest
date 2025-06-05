import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator, // Added for loading state
  ImageSourcePropType, // Added ImageSourcePropType
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
// import mockLounges, { Amenity } from '../data/mockData'; // Original import
import { Lounge, Amenity, fetchLoungesFromAPI } from '../data/mockData'; // Updated import
import BottomNavigationBar from '../components/BottomNavigationBar';

// Define navigation and route prop types for this screen
type OfferDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'OfferDetail'
>;
type OfferDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'OfferDetail'
>;

type Props = {
  navigation: OfferDetailScreenNavigationProp;
  route: OfferDetailScreenRouteProp;
};

const OfferDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { loungeId } = route.params;
  const [lounge, setLounge] = useState<Lounge | null | undefined>(undefined); // undefined for initial, null if not found
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLoungeDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const allLounges = await fetchLoungesFromAPI();
        const foundLounge = allLounges.find((l: Lounge) => l.id === loungeId); // Added type for l
        setLounge(foundLounge || null); // Set to null if not found
      } catch (e) {
        setError('Failed to load lounge details.');
        console.error("Error fetching lounge detail:", e);
        setLounge(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (loungeId) {
      loadLoungeDetail();
    } else {
      setError("Lounge ID not provided.");
      setIsLoading(false);
      setLounge(null);
    }
  }, [loungeId]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.centerContent]}>
          <Text style={styles.errorTextDetail}>{error}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!lounge) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.centerContent]}>
          <Text style={styles.errorTextDetail}>Lounge not found!</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderAmenity = (amenityItem: Amenity, isLastVisible: boolean = false) => {
    // If it's the last visible item and there are more amenities, render the 3 dots icon
    if (isLastVisible && lounge && lounge.amenities.length > MAX_AMENITIES_DISPLAYED) {
      return (
        <View key="more-amenities" style={styles.amenityItem}>
          <Image source={require('../assets/images/3dots.png')} style={styles.amenityImage} />
        </View>
      );
    }
    // Otherwise, render the actual amenity icon
    return (
      <View key={amenityItem.id} style={styles.amenityItem}>
        <Image source={amenityItem.icon} style={styles.amenityImage} />
        {/* Text name removed as per requirement */}
      </View>
    );
  };

  const MAX_AMENITIES_DISPLAYED = 5; // Number of amenities to show before the '...'

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2C5282" translucent={false} />
      
      {/* Header */}
      <View style={styles.header}>
        {lounge.bankLogo ? (
          <Image source={lounge.bankLogo} style={styles.bankLogoImage} />
        ) : (
          <Text style={styles.headerBankLogo}>BANK LOGO</Text> 
        )}
        <Text style={styles.headerVisaLogo}>VISA</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Image with overlay buttons */}
        <View style={styles.imageContainer}>
          <Image
            source={lounge.images[0]} // Use the first image from the local data
            style={styles.detailImage}
          />
          {/* Overlay buttons on image */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.overlayBackButton}>
            <Image source={require('../assets/images/back.png')} style={styles.overlayIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.overlayHeartButton}>
            <Image source={require('../assets/images/heart.png')} style={styles.overlayIcon} />
          </TouchableOpacity>
        </View>

        {/* Dots for carousel */}
        <View style={styles.dotsContainer}>
          {lounge.images.map((imageSource: ImageSourcePropType, index: number) => ( // Added types
            <View key={index} style={[styles.dot, index === 0 && styles.activeDot]} />
          ))}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.loungeName}>{lounge.name}</Text>
            <TouchableOpacity style={styles.questionIcon}>
              <Image source={require('../assets/images/question.png')} style={styles.questionImage} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.locationRow}>
            <Image source={require('../assets/images/location.png')} style={styles.locationImage} />
            <Text style={styles.loungeFullLocation}>{lounge.fullLocation}</Text>
          </View>
          
          <View style={styles.hoursRow}>
            <Image source={require('../assets/images/clock.png')} style={styles.clockImage} />
            <Text style={styles.loungeHours}>{lounge.hours}</Text>
          </View>

          {/* Combined Access Card - matches reference design */}
          <View style={styles.accessCard}>
            {/* Walk-in Section */}
            <View style={styles.walkInSection}>
              <Text style={styles.walkInTitle}>Walk-in</Text>
              <Text style={styles.walkInDescription}>{lounge.walkInDetails}</Text>
            </View>
            
            {/* Divider */}
            <View style={styles.accessDivider} />
            
            {/* Entitlement Section */}
            <View style={styles.entitlementSection}>
              <View style={styles.entitlementRow}>
                <Text style={styles.entitlementIcon}>🎫</Text>
                <View style={styles.entitlementTextContainer}>
                  <Text style={styles.entitlementTitle}>{lounge.entitlement}</Text>
                  <Text style={styles.entitlementSubtitle}>{lounge.entitlementPrice}</Text>
                </View>
              </View>
            </View>
            
            {/* Walk-in Button */}
            <TouchableOpacity style={styles.accessButton}>
              <Image source={require('../assets/images/qr_icon.png')} style={styles.accessButtonImage} />
              <Text style={styles.accessButtonText}>{lounge.walkInButtonText}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fairUseBox}>
            <Text style={styles.fairUseIcon}>ℹ️</Text>
            <Text style={styles.fairUseText}>{lounge.fairUsePolicy}</Text>
          </View>

          <View style={styles.amenitiesContainer}>
            <View style={styles.amenitiesHeader}>
              <Text style={styles.sectionTitle}>Amenities ({lounge.amenitiesCount})</Text>
              <Image source={require('../assets/images/down.png')} style={styles.expandIconImage} />
            </View>
            <View style={styles.amenitiesGrid}>
              {lounge.amenities.slice(0, MAX_AMENITIES_DISPLAYED).map((amenity: Amenity, index: number) =>  // Added types
                renderAmenity(amenity, index === MAX_AMENITIES_DISPLAYED - 1)
              )}
            </View>
            {/* Removed old text expand icon */}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Directions</Text>
            <Text style={styles.sectionText}>{lounge.directions}</Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.sectionText}>{lounge.description}</Text>
          </View>
        </View>
      </ScrollView>
      <BottomNavigationBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2C5282', // Match header blue for top area
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#2C5282', // Updated to match reference blue
  },
  headerBankLogo: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    letterSpacing: 1,
  },
  bankLogoImage: {
    width: 100, // Adjust as needed
    height: 35,  // Adjust as needed
    resizeMode: 'contain',
    backgroundColor: '#FFFFFF', // Added white background
    paddingHorizontal: 10, // Added horizontal padding
  },
  headerVisaLogo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  overlayIcon: {
    width: 50,
    height: 50,
  },
  // Overlay buttons on image
  overlayBackButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  overlayHeartButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  detailImage: {
    width: '100%',
    height: 280, // Increased height to match reference
    resizeMode: 'cover',
    borderTopLeftRadius: 20, // Added for rounded top corners
    borderTopRightRadius: 20, // Added for rounded top corners
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#2C5282',
    width: 20,
    borderRadius: 3,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20, // Overlap with image to create curved effect
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  loungeName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1A202C',
    flex: 1,
    marginRight: 10,
    lineHeight: 28,
  },
  questionIcon: {
    width: 28,
    height: 28,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionIconText: {
    color: '#4A5568',
    fontWeight: '600',
    fontSize: 14,
  },
  questionImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  locationImage: {
    width: 16,
    height: 16,
    marginRight: 8,
    marginTop: 2,
    resizeMode: 'contain',
  },
  loungeFullLocation: {
    fontSize: 15,
    color: '#718096',
    flex: 1,
    lineHeight: 20,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  clockIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  clockImage: {
    width: 16,
    height: 16,
    marginRight: 8,
    resizeMode: 'contain',
  },
  loungeHours: {
    fontSize: 15,
    color: '#718096',
  },
  
  // Combined Access Card Styles - NEW
  accessCard: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    overflow: 'hidden',
  },
  walkInSection: {
    padding: 20,
    paddingBottom: 16,
  },
  walkInTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 6,
  },
  walkInDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 18,
  },
  accessDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 20,
  },
  entitlementSection: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  entitlementRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entitlementIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  entitlementTextContainer: {
    flex: 1,
  },
  entitlementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 2,
  },
  entitlementSubtitle: {
    fontSize: 13,
    color: '#718096',
  },
  accessButton: {
    backgroundColor: '#D69E2E',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    // No border radius here since it's part of the card
  },
  accessButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  accessButtonImage: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#FFFFFF', // Assuming QR icon should be white like the text
  },
  accessButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Old styles - REMOVED
  // infoBox, walkInButton styles are now replaced by accessCard styles above

  fairUseBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  fairUseIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  fairUseText: {
    fontSize: 14,
    color: '#92400E',
    flex: 1,
    lineHeight: 20,
  },
  amenitiesContainer: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10, // Adjusted padding
  },
  amenitiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A202C',
    // marginBottom removed as it's handled by amenitiesHeader
  },
  amenitiesGrid: {
    flexDirection: 'row',
    // flexWrap: 'wrap', // Removed wrap, will handle overflow with '...'
    justifyContent: 'space-around', // Distribute items evenly
    alignItems: 'center',
    marginBottom: 10, // Add some space below icons
  },
  amenityItem: {
    alignItems: 'center',
    // width: '20%', // Width will be implicit based on content or fixed size
    paddingHorizontal: 5, // Add some spacing between items
    marginBottom: 10, // Reduced from 20, as names are removed
  },
  amenityImage: { // New style for amenity icons
    width: 32, // Adjust size as per reference image
    height: 32, // Adjust size as per reference image
    resizeMode: 'contain',
    // marginBottom: 8, // Removed as name is removed
  },
  // amenityIcon and amenityIconMore are replaced by amenityImage
  // amenityName is removed
  expandIconImage: { // New style for down arrow image
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#4A5568', // Match color of old text icon
  },
  // expandIcon (Text style) is replaced by expandIconImage
  sectionContainer: {
    marginBottom: 24,
  },
  sectionText: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 22,
  },
  // For the error case
  container: { // General container, not necessarily centered for the main view
    flex: 1,
    // justifyContent: 'center', // Removed for main scroll view
    // alignItems: 'center', // Removed for main scroll view
    // padding: 20, // Padding is handled by contentContainer
  },
  centerContent: { // Specific style for loading/error states
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2C5282', // Match safe area for these states
  },
  errorTextDetail: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2C5282',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default OfferDetailScreen;
