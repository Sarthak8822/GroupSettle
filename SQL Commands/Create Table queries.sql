CREATE TABLE IF NOT EXISTS friends (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS bills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payer_id INT,
    FOREIGN KEY (payer_id) REFERENCES friends(id)
);

CREATE TABLE IF NOT EXISTS participants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bill_id INT,
    friend_id INT,
    FOREIGN KEY (bill_id) REFERENCES bills(id),
    FOREIGN KEY (friend_id) REFERENCES friends(id)
);

CREATE TABLE IF NOT EXISTS balances (
    id INT PRIMARY KEY AUTO_INCREMENT,
    friend_id INT,
    balance DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (friend_id) REFERENCES friends(id)
);

CREATE TABLE IF NOT EXISTS debts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    debtor_id INT,
    creditor_id INT,
    bill_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    UNIQUE KEY (debtor_id, creditor_id),
    FOREIGN KEY (debtor_id) REFERENCES friends(id),
    FOREIGN KEY (creditor_id) REFERENCES friends(id),
    FOREIGN KEY (bill_id) REFERENCES bills(id)
);

