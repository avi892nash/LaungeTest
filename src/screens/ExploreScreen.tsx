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
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import mockLounges, { Lounge } from '../data/mockData';
import LoungeCard from '../components/LoungeCard';
import BottomNavigationBar from '../components/BottomNavigationBar';

// Define navigation prop type for this screen
type ExploreScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Explore'
>;

type Props = {
  navigation: ExploreScreenNavigationProp;
};

// Airport options enum
const AIRPORT_OPTIONS = [
  { id: 1, code: 'DBX', name: 'Dubai International Airport' },
  { id: 2, code: 'JFK', name: 'John F. Kennedy International Airport' },
  { id: 3, code: 'LAX', name: 'Los Angeles International Airport' },
  { id: 4, code: 'LHR', name: 'London Heathrow Airport' },
  { id: 5, code: 'NRT', name: 'Tokyo Narita International Airport' },
  { id: 6, code: 'SIN', name: 'Singapore Changi Airport' },
  { id: 7, code: 'CDG', name: 'Charles de Gaulle Airport' },
  { id: 8, code: 'DXB', name: 'Dubai International Airport' },
];

// Filter options enum
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
  const [filteredLoungeData, setFilteredLoungeData] = useState<Lounge[]>(mockLounges);

  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    let lounges = [...mockLounges];

    // Filter by selected airport (dropdown selection)
    if (selectedAirport) {
      lounges = lounges.filter(lounge =>
        lounge.airport.toLowerCase().includes(selectedAirport.code.toLowerCase()) ||
        lounge.airport.toLowerCase().includes(selectedAirport.name.toLowerCase())
      );
    }
    // Filter by search text (EditText for airports, but also applying to lounge name/airport if no airport selected)
    else if (searchText.trim() !== '') {
      const lowerSearchText = searchText.toLowerCase();
      lounges = lounges.filter(lounge =>
        lounge.name.toLowerCase().includes(lowerSearchText) ||
        lounge.airport.toLowerCase().includes(lowerSearchText)
      );
    }

    // Filter by selected category filter
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
  }, [selectedAirport, searchText, selectedFilter]);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      // Show all airports when search is empty
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
  };

  const handleFilterSelect = (filter: typeof FILTER_OPTIONS[0]) => {
    setSelectedFilter(filter);
    setShowFilterDropdown(false);
  };

  const handleClearSelection = () => {
    setSelectedAirport(null);
    setSearchText('');
    setShowAirportDropdown(false);
    // Focus the input when it reappears after clearing selection
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleTextInputFocus = () => {
    // Show all airports as recommendations when focused, even without text
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
      {/* Set StatusBar background to match the blue theme */}
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#0A2540"
        translucent={false}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.topBlueBackgroundContainer}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Explore</Text>
            </View>

            {/* Airport Selection Section */}
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
                      // Hide dropdown when input loses focus, but with a small delay
                      // to allow dropdown item selection
                      setTimeout(() => {
                        setShowAirportDropdown(false);
                      }, 150);
                    }}
                  />
                )}
              </View>
            </View>

            {/* Airport Dropdown - Positioned absolutely to avoid layout shifts */}
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

            {/* Filter Dropdown Modal */}
            <Modal
              visible={showFilterDropdown}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowFilterDropdown(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setShowFilterDropdown(false)}
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

            {/* Filter Row */}
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

          {/* Membership Benefits Section */}
          <View style={styles.benefitsContainer}>
            <Text style={styles.membershipBenefitsTitle}>Membership benefits</Text>
            <FlatList
              data={filteredLoungeData}
              renderItem={renderLoungeItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContentContainer}
              showsVerticalScrollIndicator={false}
            />
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
    backgroundColor: '#0A2540',
  },
  container: {
    flex: 1,
  },
  topBlueBackgroundContainer: {
    backgroundColor: '#2C5282',
    paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    position: 'relative', // Added for absolute positioning of dropdown
  },
  headerContainer: {
    paddingVertical: 15,
    marginHorizontal: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  airportSelectionContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInputMainContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  flightIconStyle: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#6B7280',
  },
  selectedAirportDisplayContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedAirportDisplayText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    paddingVertical: 0,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  allFilterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  allFilterText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  controlTowerIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#374151',
  },
  downArrowIcon: {
    width: 16,
    height: 16,
    marginLeft: 8,
    tintColor: '#9CA3AF',
  },
  filterIconButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterIcon: {
    width: 20,
    height: 20,
    tintColor: '#374151',
  },
  membershipBenefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  benefitsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginTop: 0,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  // Updated dropdown styles - No longer using modal for airport dropdown
  dropdownContainer: {
    position: 'absolute',
    top: 120, // Adjust based on your header height
    left: 25,
    right: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  dropdownList: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333333',
  },
  // Modal styles for filter dropdown only
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 200 : 180,
    paddingHorizontal: 20,
  },
  modalDropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  filterDropdownContainer: {
    marginTop: Platform.OS === 'ios' ? 50 : 30,
  },
});

export default ExploreScreen;