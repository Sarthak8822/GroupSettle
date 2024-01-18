import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Pressable, StyleSheet } from 'react-native';
import Header from '../components/Header';
import InputField from '../components/InputField';
import Button from '../components/Buttons/Button';
import Checkbox from '../components/Checkbox';
import Modal from '../components/Modal';

const AddBillScreen = ({ navigation }) => {
  const [billTitle, setBillTitle] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [allFriends, setAllFriends] = useState([]);
  const [friendsList, setFriendList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPayer, setSelectedPayer] = useState(null);

  useEffect(() => {
    fetchAllFriends();
  }, []);

  const handleCheckboxChange = (index) => {
    const updatedFriendsList = [...friendsList];
    updatedFriendsList[index].isSelected = !updatedFriendsList[index].isSelected;
    setFriendList(updatedFriendsList);
  };

  const handlePayerSelection = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handlePayerSelect = (payer) => {
    setSelectedPayer(payer);
    setModalVisible(false);
  };

  const fetchAllFriends = async () => {
    try {
      const response = await fetch('http://192.168.29.184:8080/api/getFriends');

      if (response.ok) {
        const friendsList = await response.json();
        setAllFriends(friendsList);
        setFriendList(
          friendsList.map((friend) => ({ ...friend, isSelected: false }))
        );
      } else {
        console.error('Failed to fetch friends:', response);
      }
    } catch (error) {
      console.error('Error fetching friends:', error.message);
    }
  };

  const handleAddBill = async () => {
    const selectedFriends = friendsList.filter((friend) => friend.isSelected);

    if (selectedFriends.length === 0) {
      Alert.alert(
        'No friends selected',
        'Please select at least one friend to split the bill.'
      );
      return;
    }

    if (!selectedPayer) {
      Alert.alert(
        'Payer not selected',
        'Please select the person who paid the bill.'
      );
      return;
    }

    try {
      const response = await fetch('http://192.168.29.184:8080/api/addBill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: billTitle,
          amount: parseFloat(billAmount),
          payerId: selectedPayer.id,
          participants: selectedFriends.map((friend) => friend.id),
        }),
      });

      if (response.ok) {
        console.log('Bill added successfully');
        // Add any additional actions you want to perform after successful bill addition
      } else {
        const data = await response.json();
        console.error('Failed to add bill:', data.error);
      }
    } catch (error) {
      console.error('Error adding bill:', error.message);
    }

    setBillTitle('');
    setBillAmount('');
    setFriendList(
      friendsList.map((friend) => ({ ...friend, isSelected: false }))
    );
    setSelectedPayer(null);
  };


  return (
    <View style={styles.container}>
      <Header title="Add Bill" />
      <View style={styles.content}>
        <InputField
          placeholder="Enter Bill Title"
          value={billTitle}
          onChangeText={setBillTitle}
        />
        <InputField
          placeholder="Enter Bill Amount"
          value={billAmount}
          onChangeText={setBillAmount}
          keyboardType="numeric"
        />

        <Pressable
          style={styles.button}
          onPress={handlePayerSelection}
        >
          <Text style={styles.buttonText}>
            Who Paid the Bill
          </Text>
        </Pressable>

        <Text style={styles.label}>Select Friends to Split the Bill:</Text>
        {friendsList.length !== 0 &&
          friendsList.map((friend, index) => (
            <Checkbox
              key={index}
              label={friend.name}
              isChecked={friend.isSelected}
              onToggle={() => handleCheckboxChange(index)}
            />
          ))}

        <Button title="Add Bill" onPress={handleAddBill} />

        <Modal
          visible={modalVisible}
          onClose={handleModalClose}
          modalText="Who Paid the bill"
        >
          {allFriends.map((friend, index) => (
            <Pressable
              key={index}
              style={styles.modalButton}
              onPress={() => handlePayerSelect(friend)}
            >
              <Text style={styles.modalButtonText}>
                {friend.name}
              </Text>
            </Pressable>
          ))}
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // padding: 16,
  },
  content: {
    flex: 1,
  },
  button: {
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#2196F3',
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  modalButton: {
    borderRadius: 5,
    // padding: 26,
    backgroundColor: '#2196F3',
    // color: "#fffff",
    width: 60,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AddBillScreen;
