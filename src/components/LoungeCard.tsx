import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Lounge } from '../data/mockData'; // Import the Lounge type

interface LoungeCardProps {
  item: Lounge;
  onPress: () => void;
}

const LoungeCard: React.FC<LoungeCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.loungeCard} onPress={onPress}>
      <Image
        source={item.image}
        style={styles.loungeImage}
      />
      <View style={styles.loungeInfoContainer}>
        <Text style={styles.loungeName}>{item.name}</Text>
        <Text style={styles.loungeLocation}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loungeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0, // Changed from 6 to 0 for sharp corners
    marginBottom: 15,
    // marginHorizontal: 5, // This will be handled by the FlatList's container if needed
    // elevation: 3, // Removed
    // shadowColor: '#000000', // Removed
    // shadowOffset: { width: 0, height: 2 }, // Removed
    // shadowOpacity: 0.1, // Removed
    // shadowRadius: 3, // Removed
    borderWidth: 1, // Added
    borderColor: '#E0E0E0', // Added
    overflow: 'hidden',
    flexDirection: 'row', // Added for horizontal layout
    alignItems: 'center', // Added for vertical alignment
  },
  loungeImage: {
    width: 100, // Changed from '100%'
    height: 100, // Changed from 150
    // Consider adding borderRadius if image corners should be rounded independently
    // marginRight: 15, // Added space between image and text
  },
  loungeInfoContainer: {
    flex: 1, // Added to take remaining space
    padding: 15,
  },
  loungeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A2540',
    marginBottom: 5,
  },
  loungeLocation: {
    fontSize: 14,
    color: '#52667A',
  },
});

export default LoungeCard;
