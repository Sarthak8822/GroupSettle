// SettingsScreen.js
import React from 'react';
import { View, Text } from 'react-native';
import Header from '../components/Header';

const SettingsScreen = () => {
  return (
    <View>
      <Header title="Settings" />
      <View>
        <Text>Settings Screen</Text>
        {/* Add your settings components here */}
      </View>
    </View>
  );
};

export default SettingsScreen;
