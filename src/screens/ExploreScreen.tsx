import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  Modal,
  Keyboard,
  ActivityIndicator, // Added for loading state
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
// import mockLounges, { Lounge } from '../data/mockData'; // Original import
import { Lounge, fetchLoungesFromAPI } from '../data/mockData'; // Updated import - removed OfferType, Amenity
import LoungeCard from '../components/LoungeCard';
import BottomNavigationBar from '../components/BottomNavigationBar';

type ExploreScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Explore'
>;

type Props = {
  navigation: ExploreScreenNavigationProp;
};

const AIRPORT_OPTIONS = [
  { id: 1, code: 'DBX', name: 'Dubai International Airport' },
  { id: 2, code: 'JFK', name: 'John F. Kennedy International Airport' },
  { id: 3, code: 'LAX', name: 'Los Angeles International Airport' },
  { id: 4, code: 'LHR', name: 'London Heathrow Airport' },
  { id: 5, code: 'NRT', name: 'Tokyo Narita International Airport' },
  { id: 6, code: 'SIN', name: 'Singapore Changi Airport' },
  { id: 7, code: 'CDG', name: 'Charles de Gaulle Airport' },
  // Note: ID 8 DXB is a duplicate of ID 1 DBX, consider removing or differentiating
  { id: 8, code: 'DXB', name: 'Dubai International Airport' }, 
];

const FILTER_OPTIONS = [
  { id: 1, name: 'All' },
  { id: 2, name: 'Premium Lounges' },
  { id: 3, name: 'Business Class' },
  { id: 4, name: 'First Class' },
  { id: 5, name: 'VIP Services' },
  { id: 6, name: 'Free WiFi' },
  { id: 7, name: 'Food & Drinks' },
  { id: 8, name: 'Shower Facilities' },
];

const ExploreScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedAirport, setSelectedAirport] = useState<typeof AIRPORT_OPTIONS[0] | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<typeof FILTER_OPTIONS[0]>(FILTER_OPTIONS[0]);
  const [searchText, setSearchText] = useState('');
  const [showAirportDropdown, setShowAirportDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filteredAirports, setFilteredAirports] = useState(AIRPORT_OPTIONS);

  const [allLoungeData, setAllLoungeData] = useState<Lounge[]>([]);
  const [filteredLoungeData, setFilteredLoungeData] = useState<Lounge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const loadLounges = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const lounges = await fetchLoungesFromAPI();
        setAllLoungeData(lounges);
        setFilteredLoungeData(lounges); 
      } catch (e) {
        setError('Failed to load lounge data. Please check your connection or try again later.');
        console.error("Error fetching lounges in ExploreScreen:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadLounges();
  }, []);

  useEffect(() => {
    let lounges = [...allLoungeData];

    if (selectedAirport) {
      lounges = lounges.filter(lounge =>
        lounge.airport.toLowerCase().includes(selectedAirport.code.toLowerCase()) ||
        lounge.airport.toLowerCase().includes(selectedAirport.name.toLowerCase())
      );
    } else if (searchText.trim() !== '') {
      const lowerSearchText = searchText.toLowerCase();
      lounges = lounges.filter(lounge =>
        lounge.name.toLowerCase().includes(lowerSearchText) ||
        lounge.airport.toLowerCase().includes(lowerSearchText)
      );
    }

    if (selectedFilter && selectedFilter.name !== 'All') {
      const filterNameLower = selectedFilter.name.toLowerCase();
      switch (filterNameLower) {
        case 'premium lounges':
          lounges = lounges.filter(lounge => lounge.name.toLowerCase().includes('premium'));
          break;
        case 'business class':
          lounges = lounges.filter(lounge => lounge.name.toLowerCase().includes('business class'));
          break;
        case 'first class':
          lounges = lounges.filter(lounge => lounge.name.toLowerCase().includes('first class'));
          break;
        case 'vip services':
          lounges = lounges.filter(lounge => lounge.name.toLowerCase().includes('vip'));
          break;
        case 'free wifi':
          lounges = lounges.filter(lounge =>
            lounge.amenities.some(amenity => amenity.name.toLowerCase().includes('wi-fi') || amenity.name.toLowerCase().includes('wifi'))
          );
          break;
        case 'food & drinks':
          lounges = lounges.filter(lounge =>
            lounge.amenities.some(amenity =>
              amenity.name.toLowerCase().includes('food') ||
              amenity.name.toLowerCase().includes('dining') ||
              amenity.name.toLowerCase().includes('beverage') ||
              amenity.name.toLowerCase().includes('restaurant')
            )
          );
          break;
        case 'shower facilities':
          lounges = lounges.filter(lounge =>
            lounge.amenities.some(amenity => amenity.name.toLowerCase().includes('shower'))
          );
          break;
        default:
          break;
      }
    }
    setFilteredLoungeData(lounges);
  }, [selectedAirport, searchText, selectedFilter, allLoungeData]);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredAirports(AIRPORT_OPTIONS);
      setShowAirportDropdown(true);
    } else {
      const filtered = AIRPORT_OPTIONS.filter(
        airport =>
          airport.name.toLowerCase().includes(text.toLowerCase()) ||
          airport.code.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredAirports(filtered);
      setShowAirportDropdown(true);
    }
  };

  const handleAirportSelect = (airport: typeof AIRPORT_OPTIONS[0]) => {
    setSelectedAirport(airport);
    setSearchText(''); 
    setShowAirportDropdown(false);
    Keyboard.dismiss();
  };

  const handleFilterSelect = (filter: typeof FILTER_OPTIONS[0]) => {
    setSelectedFilter(filter);
    setShowFilterDropdown(false);
  };

  const handleClearSelection = () => {
    setSelectedAirport(null);
    setSearchText('');
    setShowAirportDropdown(false);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleTextInputFocus = () => {
    setFilteredAirports(AIRPORT_OPTIONS);
    setShowAirportDropdown(true);
  };

  const handleFilterButtonPress = () => {
    setShowFilterDropdown(true);
  };

  const renderLoungeItem = ({ item }: { item: Lounge }) => (
    <LoungeCard
      item={item}
      onPress={() => navigation.navigate('OfferDetail', { loungeId: item.id })}
    />
  );

  const renderAirportOption = ({ item }: { item: typeof AIRPORT_OPTIONS[0] }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleAirportSelect(item)}
    >
      <Text style={styles.dropdownItemText}>
        {item.name} ({item.code})
      </Text>
    </TouchableOpacity>
  );

  const renderFilterOption = ({ item }: { item: typeof FILTER_OPTIONS[0] }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleFilterSelect(item)}
    >
      <Text style={styles.dropdownItemText}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#0A2540"
        translucent={false}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.topBlueBackgroundContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Explore</Text>
            </View>
            <View style={styles.airportSelectionContainer}>
              <View style={styles.searchInputMainContainer}>
                <Image
                  source={require('../assets/images/flight.png')}
                  style={styles.flightIconStyle}
                />
                {selectedAirport ? (
                  <View style={styles.selectedAirportDisplayContainer}>
                    <Text style={styles.selectedAirportDisplayText} numberOfLines={1}>
                      {selectedAirport.name} ({selectedAirport.code})
                    </Text>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={handleClearSelection}
                    >
                      <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TextInput
                    ref={searchInputRef}
                    style={styles.searchInput}
                    placeholder="Search airports..."
                    placeholderTextColor="#9CA3AF"
                    value={searchText}
                    onChangeText={handleSearchChange}
                    onFocus={handleTextInputFocus}
                    autoCorrect={false}
                    autoCapitalize="none"
                    onBlur={() => {
                      setTimeout(() => {
                        if (!showAirportDropdown) Keyboard.dismiss(); // Dismiss only if dropdown not active
                      }, 150);
                    }}
                  />
                )}
              </View>
            </View>

            {showAirportDropdown && (
              <View style={styles.dropdownContainer}>
                <FlatList
                  data={filteredAirports}
                  renderItem={renderAirportOption}
                  keyExtractor={(item) => item.id.toString()}
                  style={styles.dropdownList}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            )}

            <Modal
              visible={showFilterDropdown}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowFilterDropdown(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPressOut={() => setShowFilterDropdown(false)}
              >
                <View style={[styles.modalDropdownContainer, styles.filterDropdownContainer]}>
                  <FlatList
                    data={FILTER_OPTIONS}
                    renderItem={renderFilterOption}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.dropdownList}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </TouchableOpacity>
            </Modal>

            <View style={styles.filterRow}>
              <TouchableOpacity 
                style={styles.allFilterButton}
                onPress={handleFilterButtonPress}
              >
                <Image source={require('../assets/images/control_tower.png')} style={styles.controlTowerIcon} />
                <Text style={styles.allFilterText}>
                  {selectedFilter.name}
                </Text>
                <Image source={require('../assets/images/down.png')} style={styles.downArrowIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterIconButton}>
                <Image
                  source={require('../assets/images/filter.png')}
                  style={styles.filterIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.benefitsContainer}>
            <Text style={styles.membershipBenefitsTitle}>Membership benefits</Text>
            {isLoading && <ActivityIndicator size="large" color="#0A2540" style={styles.loadingIndicator} />}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {!isLoading && !error && (
              <FlatList
                data={filteredLoungeData}
                renderItem={renderLoungeItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContentContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text style={styles.emptyListText}>No lounges found matching your criteria.</Text>}
              />
            )}
          </View>
        </View>
        <BottomNavigationBar />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Light grey for the whole safe area
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Light grey for the main container
  },
  topBlueBackgroundContainer: {
    backgroundColor: '#0A2540', // Dark blue
    paddingHorizontal: 10, // Reduced horizontal padding
    paddingBottom: 15,    // Reduced bottom padding
    paddingTop: Platform.OS === 'ios' ? 10 : StatusBar.currentHeight, // Adjust for status bar
    position: 'relative', 
    zIndex: 10, // Ensure top section is above dropdowns if they overlap
  },
  headerContainer: {
    paddingVertical: 10, // Reduced padding
    marginHorizontal: 5, 
  },
  headerTitle: {
    fontSize: 26, // Slightly smaller
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  airportSelectionContainer: {
    paddingHorizontal: 5, // Reduced padding
    paddingVertical: 8,  // Reduced padding
  },
  searchInputMainContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10, // Slightly smaller radius
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  flightIconStyle: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: '#6B7280',
  },
  selectedAirportDisplayContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedAirportDisplayText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
    marginRight: 6,
  },
  closeButton: {
    padding: 3,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    paddingVertical: 0, 
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5, // Reduced padding
    paddingTop: 8,     // Reduced padding
    justifyContent: 'space-between',
  },
  allFilterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10, // Slightly smaller radius
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  allFilterText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  controlTowerIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
    tintColor: '#374151',
  },
  downArrowIcon: {
    width: 14,
    height: 14,
    marginLeft: 6,
    tintColor: '#9CA3AF',
  },
  filterIconButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10, // Slightly smaller radius
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  filterIcon: {
    width: 18,
    height: 18,
    tintColor: '#374151',
  },
  membershipBenefitsTitle: {
    fontSize: 18, // Slightly smaller
    fontWeight: '600', // Bolder
    color: '#1C1C1E',
    marginBottom: 12,
    paddingHorizontal: 10, // Add padding to align with cards if list has padding
  },
  benefitsContainer: {
    backgroundColor: '#F8F9FA', // Match safe area
    flex: 1,
    paddingTop: 10, // Add some space from the blue section
  },
  listContentContainer: {
    paddingHorizontal: 10, // Add horizontal padding for cards
    paddingBottom: 20,
  },
  dropdownContainer: { // For airport suggestions
    position: 'absolute',
    top: Platform.OS === 'ios' ? 135 : 130 + (StatusBar.currentHeight || 0), // Dynamic top positioning
    left: 15,  // Align with airportSelectionContainer padding
    right: 15, // Align with airportSelectionContainer padding
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    maxHeight: 200, // Limit height
    borderColor: '#E5E7EB',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 1000, // Ensure it's above other elements
  },
  dropdownList: {
    // No specific style needed here if maxHeight is on container
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#374151',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center', // Center modal content
    alignItems: 'center',
  },
  modalDropdownContainer: { // For filter modal
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '90%', // Modal width
    maxHeight: '70%', // Modal max height
    paddingVertical: 10, // Padding inside modal
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  filterDropdownContainer: { // Specific adjustments if needed, but modalDropdownContainer handles most
     // marginTop: 0, // Reset if not needed due to modalOverlay centering
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  emptyListText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
    fontSize: 16,
  },
});

export default ExploreScreen;
