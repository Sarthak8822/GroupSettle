// ViewBillsScreen.js
import React from 'react';
import { View, FlatList } from 'react-native';
import Header from '../components/Header';
import BillItem from '../components/BillItem';

const ViewBillsScreen = () => {
  // Replace the dummy data with your actual data
  const billData = [
    { title: 'Groceries', amount: '$50.00' },
    { title: 'Dinner', amount: '$30.00' },
    // Add more bill items as needed
  ];

  return (
    <View>
      <Header title="View Bills" />
      <FlatList
        data={billData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <BillItem title={item.title} amount={item.amount} />}
      />
    </View>
  );
};

export default ViewBillsScreen;
