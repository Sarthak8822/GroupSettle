// AllSplitsScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import Header from '../components/Header';
import DeleteButton from '../components/Buttons/DeleteButton'; // Assuming you have a DeleteButton component

const AllSplitsScreen = () => {
  const [allSplits, setAllSplits] = useState([]);

  useEffect(() => {
    fetchAllSplits();
  }, []);

  const fetchAllSplits = async () => {
    try {
      const response = await fetch('http://192.168.29.184:8080/api/getBalances');

      if (response.ok) {
        const splitList = await response.json();
        setAllSplits(splitList);
      } else {
        console.error('Failed to fetch splits:', response);
      }
    } catch (error) {
      console.error('Error fetching splits:', error.message);
    }
  };

  return (
    <View>
      <Header title="All Splits" />
      <FlatList
        data={allSplits}
        // keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.friend_name}</Text>
            <Text>{item.net_balance}</Text>
            {/* Add more information as needed */}
            {/* <DeleteButton title="Delete" onPress={() => handleDeleteSplit(item.id)} /> */}
          </View>
        )}
      />
    </View>
  );
};

export default AllSplitsScreen;
