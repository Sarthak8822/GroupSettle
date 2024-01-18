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

var billData struct {
	Title        string  `json:"title"`
	Amount       float64 `json:"amount"`
	PayerID      int     `json:"payerId"`
	Participants []int   `json:"participants"`
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

	router.POST("/api/addBill", addBillHandler)

	// API endpoint to delete a friend
	router.DELETE("/api/deleteFriend/:id", deleteFriendHandler)
	// Add this line to your main function to register the new endpoint
	router.GET("/api/getBalances", getBalancesHandler)

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
	result, err := db.Exec("INSERT INTO friends (name) VALUES (?)", friend.FriendName)
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
	rows, err := db.Query("SELECT id, name FROM friends")
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

	// Begin a transaction
	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to begin transaction"})
		return
	}

	// Delete the friend from the 'friends' table
	_, err = tx.Exec("DELETE FROM friends WHERE id = ?", friendID)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete friend", "details": err.Error()})
		return
	}

	// Delete related records from other tables (participants, balances, debts, etc.)
	// Adjust the queries based on your actual schema

	_, err = tx.Exec("DELETE FROM participants WHERE friend_id = ?", friendID)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete participant records", "details": err.Error()})
		return
	}

	_, err = tx.Exec("DELETE FROM balances WHERE friend_id = ?", friendID)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete balance records", "details": err.Error()})
		return
	}

	_, err = tx.Exec("DELETE FROM debts WHERE debtor_id = ? OR creditor_id = ?", friendID, friendID)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete debt records", "details": err.Error()})
		return
	}

	// Commit the transaction if everything is successful
	err = tx.Commit()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Friend deleted successfully"})
}

func addBillHandler(c *gin.Context) {
	if err := c.ShouldBindJSON(&billData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Open a new database transaction
	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to begin transaction"})
		return
	}

	// Insert the bill details into the 'bills' table
	result, err := tx.Exec("INSERT INTO bills (title, amount, payer_id) VALUES (?, ?, ?)", billData.Title, billData.Amount, billData.PayerID)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add bill", "details": err.Error()})
		return
	}

	// Get the ID of the inserted bill
	billID, err := result.LastInsertId()
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get bill ID", "details": err.Error()})
		return
	}

	// Insert records into the 'participants' table for each participant
	for _, participantID := range billData.Participants {
		_, err := tx.Exec("INSERT INTO participants (bill_id, friend_id) VALUES (?, ?)", billID, participantID)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add participant", "details": err.Error()})
			return
		}
	}

	// Calculate individual share
	individualShare := billData.Amount / float64(len(billData.Participants))

	// Update balances for the payer and participants
	// _, err = tx.Exec("UPDATE balances SET balance = balance - ? WHERE friend_id = ?", billData.Amount, billData.PayerID)
	// if err != nil {
	// 	tx.Rollback()
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update payer's balance", "details": err.Error()})
	// 	return
	// }

	// Update debts for each participant
	for _, participantID := range billData.Participants {
		_, err := tx.Exec(`
			INSERT INTO debts (debtor_id, creditor_id, amount, bill_id)
			VALUES (?, ?, ?, ?)
			ON DUPLICATE KEY UPDATE amount = amount + ?;
		`, participantID, billData.PayerID, individualShare, billID, individualShare)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update debt record", "details": err.Error()})
			return
		}
	}

	// Commit the transaction if everything is successful
	tx.Commit()

	// Respond with success
	c.JSON(http.StatusOK, gin.H{"message": "Bill added successfully"})
}

// Add this function to your existing code

func getBalancesHandler(c *gin.Context) {
	// Query the database to get balances and debts
	rows, err := db.Query(`
		SELECT 
			friends.id as friend_id, 
			friends.name as friend_name, 
			COALESCE(SUM(balances.balance), 0) - COALESCE(SUM(debts.amount), 0) as net_balance 
		FROM friends
		LEFT JOIN balances ON friends.id = balances.friend_id
		LEFT JOIN debts ON friends.id = debts.debtor_id
		GROUP BY friends.id, friends.name
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve balances", "details": err.Error()})
		return
	}
	defer rows.Close()

	type Balance struct {
		FriendID   int     `json:"friend_id"`
		FriendName string  `json:"friend_name"`
		NetBalance float64 `json:"net_balance"`
	}

	var balances []Balance

	// Iterate over the rows and populate the balances slice
	for rows.Next() {
		var balance Balance
		if err := rows.Scan(&balance.FriendID, &balance.FriendName, &balance.NetBalance); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan rows", "details": err.Error()})
			return
		}
		balances = append(balances, balance)
	}

	// Check for errors during iteration
	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error during iteration", "details": err.Error()})
		return
	}

	// Return the list of balances
	c.JSON(http.StatusOK, balances)
}
