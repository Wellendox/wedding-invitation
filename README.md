# wedding-invitation
A page where people can accept / decline a fictional wedding invitation. Made with next.js 14

# Setup

## Node
- Make sure you have the latest node.js version installed.
- Open git bash or any other console terminal in the project root
- run "npm install" or "npm audit fix"

## MySQL

### Install MySQL (Preferred)
Get it [here or something](https://dev.mysql.com/downloads/installer/)

### MySQL Schema
Import that schema
```sql
CREATE DATABASE IF NOT EXISTS `wedding` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `wedding`;

CREATE TABLE IF NOT EXISTS `companion` (
  `Id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `GuestId` int(10) unsigned NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Status` enum('Accepted','Refused') DEFAULT NULL,
  `Vegetarian` tinyint(1) NOT NULL,
  `Vegan` tinyint(1) NOT NULL,
  `Hotel` tinyint(1) NOT NULL,
  `Child` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK__guest` (`GuestId`),
  CONSTRAINT `FK__guest` FOREIGN KEY (`GuestId`) REFERENCES `guest` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `guest` (
  `Id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Status` enum('Accepted','Refused') NOT NULL,
  `Vegetarian` tinyint(1) NOT NULL,
  `Vegan` tinyint(1) NOT NULL,
  `Hotel` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## Prisma
To make sure Prisma is capable of communicating with your database, please set it up accordingly.
- Create a file called ".env" in the root directory
- Check [which connection url to use](https://www.prisma.io/docs/orm/reference/connection-urls)
- ???
- Profit

Your .env should look roughly like this:
```
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

### That should be all. Y
# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="mysql://user:password@127.0.0.1:3306/wedding"
```
