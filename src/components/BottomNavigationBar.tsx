import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const BottomNavigationBar = () => {
  // Placeholder icons - in a real app, use react-native-vector-icons or SVGs
  const navItems = [
    { name: 'Home', icon: '🏠' },
    { name: 'Explore', icon: '✈️' },
    { name: 'Membership', icon: '💳' },
    { name: 'Account', icon: '👤' },
  ];

  return (
    <View style={styles.navContainer}>
      {navItems.map((item) => (
        <TouchableOpacity key={item.name} style={styles.navItem}>
          <Text style={styles.navIcon}>{item.icon}</Text>
          <Text style={styles.navText}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    height: 70, // Adjusted height for better touch targets and text
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center', // Vertically center items
    justifyContent: 'space-around', // Distribute items evenly
    paddingBottom: 5, // Add some padding at the bottom for text
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Center icon and text vertically within the item
    paddingVertical: 5,
  },
  navIcon: {
    fontSize: 24, // Larger icons
    marginBottom: 4, // Space between icon and text
    color: '#52667A', // Default icon color
  },
  navText: {
    fontSize: 10, // Smaller text for labels
    color: '#52667A', // Default text color
    // Consider adding a style for the active tab:
    // color: '#0A2540',
    // fontWeight: 'bold',
  },
});

export default BottomNavigationBar;
