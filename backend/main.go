package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

type Friend struct {
	ID         int    `json:"id"`
	FriendName string `json:"name"`
}

var db *sql.DB

func init() {
	// Initialize database connection (replace with your actual database details)
	var err error
	db, err = sql.Open("mysql", "root:Mysql8822@@tcp(127.0.0.1:3306)/groupsettle")
	fmt.Println("avdkadvbdbvsdhjkvbdksbvk", err)
	if err != nil {
		log.Fatal("Error connecting to the database:", err)
	}

	// Check if the connection is successful
	if err := db.Ping(); err != nil {
		log.Fatal("Error pinging the database:", err)
	}
	fmt.Println("Database connection successful!")
}

func main() {
	router := gin.Default()

	// API endpoint to test your server
	router.GET("/api/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	// API endpoint to add a friend
	router.POST("/api/addFriend", addFriendHandler)

	router.GET("/api/getFriends", getFriendsHandler)

	// API endpoint to delete a friend
	router.DELETE("/api/deleteFriend/:id", deleteFriendHandler)

	// Start the server on port 8080
	router.Run(":8080")
}

func addFriendHandler(c *gin.Context) {
	var friend Friend
	if err := c.ShouldBindJSON(&friend); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Insert the friend into the database
	result, err := db.Exec("INSERT INTO friends (friendName) VALUES (?)", friend.FriendName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add friend", "details": err.Error()})
		return
	}

	// Get the ID of the inserted friend
	friendID, err := result.LastInsertId()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get friend ID", "details": err.Error()})
		return
	}

	// Update the friend object with the generated ID
	friend.ID = int(friendID)

	c.JSON(http.StatusOK, friend)
}

func getFriendsHandler(c *gin.Context) {
	// Query the database to get all friends
	rows, err := db.Query("SELECT id, friendName FROM friends")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve friends", "details": err.Error()})
		return
	}
	defer rows.Close()

	var friends []Friend

	// Iterate over the rows and populate the friends slice
	for rows.Next() {
		var friend Friend
		if err := rows.Scan(&friend.ID, &friend.FriendName); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan rows", "details": err.Error()})
			return
		}
		friends = append(friends, friend)
	}

	// Check for errors during iteration
	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error during iteration", "details": err.Error()})
		return
	}

	// Return the list of friends
	c.JSON(http.StatusOK, friends)
}

func deleteFriendHandler(c *gin.Context) {
	friendID := c.Param("id")
	fmt.Println("FriendId", friendID)
	// Delete the friend from the database
	_, err := db.Exec("DELETE FROM friends WHERE id = ?", friendID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete friend", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Friend deleted successfully"})
}
