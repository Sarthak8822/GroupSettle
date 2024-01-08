// HomeScreen.js
import React from 'react';
import { View, Text } from 'react-native';
import Header from '../components/Header';
import Button from '../components/Buttons/Button';

const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Header title="Bill Splitter" />
      <View>
        <Text>Welcome to the Bill Splitter App!</Text>
        <Button title="Add Bill" onPress={() => navigation.navigate('AddBill')} />
        <Button title="View Bills" onPress={() => navigation.navigate('ViewBills')} />
        <Button title="Add Friends" onPress={() => navigation.navigate('AddFriends')} />
      </View>
    </View>
  );
};

export default HomeScreen;
