// BillItem.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BillItem = ({ title, amount }) => {
  return (
    <View style={styles.billItem}>
      <Text style={styles.billTitle}>{title}</Text>
      <Text style={styles.billAmount}>{amount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  billTitle: {
    fontSize: 16,
  },
  billAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BillItem;
