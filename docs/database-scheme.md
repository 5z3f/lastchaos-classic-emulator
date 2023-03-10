# Database Scheme
This file will be updated regularly to document any changes made to the database scheme. \
Database engine may be changed in future, currently using `MariaDB`

## accounts
The `accounts` table stores information related to player accounts.

| Field     | Type         | Description |
|-----------|--------------|------------------------------------------------------------------------
| id        | int(11)      | Unique identifier for each account
| enabled   | tinyint(1)   | Flag indicating whether the account is currently enabled or disabled
| username  | varchar(255) | Username associated with the account
| hash      | varchar(255) | Hashed password associated with the account (bcrypt)
| createdAt | datetime(0)  | Timestamp indicating when the account was created

## characters
The `characters` table stores information about each player's character in the game.

| Field        | Type         | Description
|--------------|--------------|-------------------------------------------------------
| id           | int(11)      | Unique identifier for the character
| accountId    | int(11)      | Player's account ID
| face         | tinyint(1)   | Facial appearance ID
| hair         | tinyint(1)   | Hairstyle ID
| nickname     | varchar(255) | Ingame name
| level        | int(3)       | Current level
| class        | tinyint(1)   | Class ID
| profession   | tinyint(1)   | Profession ID of the character's class
| experience   | int(11)      | Experience points
| skillpoints  | int(11)      | Skill points
| recentHealth | int(11)      | Recent health points
| recentMana   | int(11)      | Recent mana points
| strength     | int(11)      | Strength attribute
| dexterity    | int(11)      | Dexterity attribute
| intelligence | int(11)      | Intelligence attribute
| condition    | int(11)      | Condition attribute
| statpoints   | int(11)      | Statpoints to use
| role         | varchar(255) | Role, default = user
| updatedAt    | datetime(0)  | Last time record was updated
| createdAt    | datetime(0)  | Timestamp when the character was created

## banlog
The `banlog` table is used to keep track of banned players.

| Field       | Type         | Description
|-------------|--------------|---------------------------------------------------------------
| id          | int(11)      | Unique identifier for each banned player
| accountId   | int(11)      | Identifier for the account associated with the banned player
| reason      | varchar(255) | Reason for the player's ban
| proof       | longtext     | Optional field for providing proof of the player's misconduct
| expiresAt   | datetime(0)  | When the ban will expire
| bannedAt    | datetime(0)  | When the ban was issued

## items
The items table contains information about in-game items.
Each record in the table represents an instance of an item in the game.

| Field           | Type         | Description                                                                  
|-----------------|--------------|---------------------------------------------------------------------------
| id              | int(11)      | Unique virtual identifier for the item instance
| parentId        | int(11)      | ID of the unique parent item
| itemId          | int(11)      | ID of the base item
| accountId       | int(11)      | ID of the account that owns the item
| charId          | int(11)      | ID of the character that owns the item
| place           | tinyint(1)   | Location of the item instance: 0 = Ground, 1 = Inventory, 2 = Warehouse
| position        | varchar(255) | Position of the item instance in the inventory or warehouse
| plus            | int(11)      | Plus value of the item
| wearingPosition | int(11)      | Position of the item instance when equipped
| seals           | varchar(255) | Seals attached to the item instance
| removed         | tinyint(1)   | Indicates whether the item has been removed: 0 = No, 1 = Yes
| updatedAt       | datetime(3)  | Timestamp of the last update to the item instance
| createdAt       | datetime(3)  | Timestamp of the creation of the item instance


## goldflow
The `goldflow` table is used to keep track of gold transactions.

| Field       | Data Type      | Description                                                           
|--------------|---------------|-----------------------------------------------------------------------
| id           | int(11)       | Unique identifier for each gold transfer.
| from         | varchar (255) | IDs of the character and account that sent the gold.
| to           | varchar (255) | IDs of the character and account that received the gold.
| amount       | int(11)       | Amount of gold that was transferred.
| position     | varchar(255)  | Positions of the transaction.
| transferAt   | datetime(3)   | Timestamp when the transaction occurred.

# itemflow
The `itemflow` table is used to keep track of item transfers between different players or storage locations.

| Field        | Type         | Comments                                          
|--------------|--------------|---------------------------------------------------
| id           | int(11)      | Unique identifier for the item transfer.
| uid          | int(11)      | Item's unique identifier.
| from         | varchar(255) | Entity that the item was transferred from.
| to           | varchar(255) | Entity that the item was transferred to.
| position     | varchar(255) | Positions of the transaction.
| transferedAt | datetime(3)  | Timestamp when the transfer occurred.
