// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import AddBillScreen from './src/screens/AddBillScreen';
import ViewBillsScreen from './src/screens/ViewBillsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AddFriendsScreen from './src/screens/AddFriendsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddFriends" component={AddFriendsScreen} />
        <Stack.Screen name="AddBill" component={AddBillScreen} />
        <Stack.Screen name="ViewBills" component={ViewBillsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
