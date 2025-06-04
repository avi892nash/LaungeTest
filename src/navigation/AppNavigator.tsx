import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import ExploreScreen from '../screens/ExploreScreen'; // Will resolve to .tsx
import OfferDetailScreen from '../screens/OfferDetailScreen'; // Will resolve to .tsx

// Define ParamList for type safety with navigation
export type RootStackParamList = {
  Explore: undefined; // No params expected for Explore screen
  OfferDetail: { loungeId: string }; // Expects a loungeId param
  // Add other screens here if needed
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Explore"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OfferDetail"
        component={OfferDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
