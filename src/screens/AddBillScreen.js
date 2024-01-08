// AddBillScreen.js
import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import Header from '../components/Header';
import InputField from '../components/InputField';
import Button from '../components/Buttons/Button';
import Checkbox from '../components/Checkbox';

const AddBillScreen = ({ navigation }) => {
  const [billTitle, setBillTitle] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [friendsList, setFriendList] = useState([
    { name: "Lisa", isSelected: false },
    { name: "Mona", isSelected: false },
    { name: "Name3", isSelected: false },
    { name: "Name4", isSelected: false },
    { name: "Name5", isSelected: false },
  ]);

  const handleCheckboxChange = (index) => {
    const updatedFriendsList = [...friendsList];
    updatedFriendsList[index].isSelected = !updatedFriendsList[index].isSelected;
    setFriendList(updatedFriendsList);
  };

  const handleAddBill = () => {
    const selectedFriends = friendsList.filter(friend => friend.isSelected);

    if (selectedFriends.length === 0) {
      Alert.alert('No friends selected', 'Please select at least one friend to split the bill.');
      return;
    }

    const totalSelectedFriends = selectedFriends.length;
    const individualShare = parseFloat(billAmount) / totalSelectedFriends;

    selectedFriends.forEach(friend => {
      console.log(`${friend.name}: ${individualShare}`);
    });

    setBillTitle('');
    setBillAmount('');
    setFriendList(friendsList.map(friend => ({ ...friend, isSelected: false })));
  };

  return (
    <View>
      <Header title="Add Bill" />
      <View>
        <InputField
          placeholder="Enter Bill Title"
          value={billTitle}
          onChangeText={setBillTitle}
        />
        <InputField
          placeholder="Enter Bill Amount"
          value={billAmount}
          onChangeText={setBillAmount}
          keyboardType="numeric" // Use numeric keyboard for amount input
        />

        <Text>Select Friends to Split the Bill:</Text>
        {friendsList.map((friend, index) => (
          <Checkbox
            key={index}
            label={friend.name}
            isChecked={friend.isSelected}
            onToggle={() => handleCheckboxChange(index)}
          />
        ))}

        <Button title="Add Bill" onPress={handleAddBill} />
      </View>
    </View>
  );
};

export default AddBillScreen;
