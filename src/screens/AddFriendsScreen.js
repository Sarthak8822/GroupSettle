// AddFriendScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const AddFriendsScreen = ({ navigation }) => {
  const [friendName, setFriendName] = useState('');

  const handleAddFriend = () => {
    // Handle adding friend logic
    console.log(`Added friend: ${friendName}`);
    // You can store friends in state or a database
  };

  return (
    <View>
      <Text>Add Friends</Text>
      <TextInput
        placeholder="Friend's Name"
        value={friendName}
        onChangeText={setFriendName}
      />
      <Button title="Add Friend" onPress={handleAddFriend} />
    </View>
  );
};

export default AddFriendsScreen;
