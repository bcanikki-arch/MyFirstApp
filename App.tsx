import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import AboutScreen from './src/screens/AboutScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'To-Do App' }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
