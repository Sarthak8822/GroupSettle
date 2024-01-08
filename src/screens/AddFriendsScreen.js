import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import DeleteButton from "../components/Buttons/DeleteButton"

const AddFriendsScreen = ({ navigation }) => {
  const [friendName, setFriendName] = useState('');
  const [friendsList, setFriendsList] = useState([]);
  const [allFriends, setAllFriends] = useState([]);

  // Function to fetch all friends
  const fetchAllFriends = async () => {
    try {
      const response = await fetch('http://192.168.29.184:8080/api/getFriends');

      if (response.ok) {
        const friendsList = await response.json();
        setAllFriends(friendsList);
      } else {
        console.error('Failed to fetch friends:', response);
      }
    } catch (error) {
      console.error('Error fetching friends:', error.message);
    }
  };

  // Call the fetchAllFriends function to load friends when the component mounts
  useEffect(() => {
    fetchAllFriends();
  }, []);

  // Function to add a new friend
  const handleAddFriend = async () => {
    try {
      const response = await fetch('http://192.168.29.184:8080/api/addFriend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: friendName }),
      });

      if (response.ok) {
        // If the friend is successfully added, update the local state
        const newFriend = await response.json();
        setFriendsList([...friendsList, newFriend]);
        setFriendName('');
        // Fetch all friends again to update the list
        fetchAllFriends();
      } else {
        console.error('Failed to add friend:', response);
      }
    } catch (error) {
      console.error('Error adding friend:', error.message);
    }
  };

  // Function to delete a friend
  const handleDeleteFriend = async (friendId) => {
    try {
      console.log("first", friendId)
      const response = await fetch(`http://192.168.29.184:8080/api/deleteFriend/${friendId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // If the friend is successfully deleted, update the local state
        setFriendsList(friendsList.filter(friend => friend.id !== friendId));
        // Fetch all friends again to update the list
        fetchAllFriends();
      } else {
        console.error('Failed to delete friend:', response);
      }
    } catch (error) {
      console.error('Error deleting friend:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Friends List</Text>

      {/* Display the list of friends added in this session */}
      <FlatList
        data={allFriends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Text>{item.name}</Text>
            <DeleteButton title="Delete" onPress={() => handleDeleteFriend(item.id)} />
          </View>
        )}
      />

      {/* Input area for adding a new friend */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Friend's Name"
          value={friendName}
          onChangeText={setFriendName}
        />
        <Button title="Add Friend" onPress={handleAddFriend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  friendItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
});

export default AddFriendsScreen;
