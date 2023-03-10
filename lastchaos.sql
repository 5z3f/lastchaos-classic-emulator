/*
 Navicat Premium Data Transfer

 Source Server         : docker-mariadb-lcemulator
 Source Server Type    : MariaDB
 Source Server Version : 101002
 Source Host           : localhost:3310
 Source Schema         : lastchaos

 Target Server Type    : MariaDB
 Target Server Version : 101002
 File Encoding         : 65001

 Date: 10/03/2023 05:37:04
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for accounts
-- ----------------------------
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `enabled` tinyint(1) NULL DEFAULT 1,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `createdAt` datetime(0) NULL DEFAULT current_timestamp,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of accounts
-- ----------------------------
INSERT INTO `accounts` VALUES (9, 1, 'test', '$2a$12$ufrAL.l4Kfr/hdXtJWth6uFP5/HkgxIQ.U3M.SsozvBfYIsyHNEfG', '2023-02-24 21:52:32');

-- ----------------------------
-- Table structure for banlog
-- ----------------------------
DROP TABLE IF EXISTS `banlog`;
CREATE TABLE `banlog`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accountId` int(11) NOT NULL,
  `reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `proof` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `expiresAt` datetime(0) NULL DEFAULT NULL,
  `bannedAt` datetime(0) NULL DEFAULT current_timestamp,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of banlog
-- ----------------------------

-- ----------------------------
-- Table structure for characters
-- ----------------------------
DROP TABLE IF EXISTS `characters`;
CREATE TABLE `characters`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accountId` int(11) NULL DEFAULT NULL,
  `face` tinyint(1) NULL DEFAULT NULL,
  `hair` tinyint(1) NULL DEFAULT NULL,
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `level` int(3) NULL DEFAULT 1,
  `class` tinyint(1) NULL DEFAULT NULL,
  `profession` tinyint(1) NULL DEFAULT NULL,
  `experience` int(11) NULL DEFAULT 0,
  `skillpoints` int(11) NULL DEFAULT 0,
  `recentHealth` int(11) NULL DEFAULT 0,
  `recentMana` int(11) NULL DEFAULT 0,
  `strength` int(11) NULL DEFAULT 0,
  `dexterity` int(11) NULL DEFAULT 0,
  `intelligence` int(11) NULL DEFAULT 0,
  `condition` int(11) NULL DEFAULT 0,
  `statpoints` int(11) NULL DEFAULT 0,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'user',
  `updatedAt` datetime(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `createdAt` datetime(0) NULL DEFAULT current_timestamp,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of characters
-- ----------------------------
INSERT INTO `characters` VALUES (2, 9, 1, 1, 'test', 85, 1, NULL, 0, 0, 0, 0, 23, 6, 11, 3, 957, 'user', '2023-03-10 04:33:31', '2023-02-26 02:41:05');

-- ----------------------------
-- Table structure for friends
-- ----------------------------
DROP TABLE IF EXISTS `friends`;
CREATE TABLE `friends`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `requester` int(11) NULL DEFAULT NULL,
  `receiver` int(11) NULL DEFAULT NULL,
  `group` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `acceptedAt` datetime(0) NULL DEFAULT NULL,
  `createdAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of friends
-- ----------------------------

-- ----------------------------
-- Table structure for goldflow
-- ----------------------------
DROP TABLE IF EXISTS `goldflow`;
CREATE TABLE `goldflow`  (
  `id` int(11) NOT NULL,
  `from` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `to` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `amount` int(11) NULL DEFAULT NULL,
  `position` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `transferAt` datetime(3) NULL DEFAULT current_timestamp,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of goldflow
-- ----------------------------

-- ----------------------------
-- Table structure for itemflow
-- ----------------------------
DROP TABLE IF EXISTS `itemflow`;
CREATE TABLE `itemflow`  (
  `id` int(11) NOT NULL,
  `uid` int(11) NULL DEFAULT NULL,
  `from` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `to` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `position` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `transferAt` datetime(3) NULL DEFAULT current_timestamp
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of itemflow
-- ----------------------------

-- ----------------------------
-- Table structure for items
-- ----------------------------
DROP TABLE IF EXISTS `items`;
CREATE TABLE `items`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'This is a unique virtual identifier.',
  `parentId` int(11) NULL DEFAULT NULL,
  `itemId` int(11) NULL DEFAULT NULL,
  `accountId` int(11) NULL DEFAULT NULL,
  `charId` int(11) NULL DEFAULT NULL,
  `place` tinyint(1) NULL DEFAULT NULL COMMENT '0 = Ground / 1 = Inventory / 2 = Warehouse',
  `position` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `plus` int(11) NULL DEFAULT 0,
  `wearingPosition` int(11) NULL DEFAULT NULL,
  `seals` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `removed` tinyint(1) NULL DEFAULT 0,
  `updatedAt` datetime(3) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of items
-- ----------------------------
INSERT INTO `items` VALUES (1, NULL, 802, 9, 2, 1, '0,0,0', 15, 1, NULL, 0, '2023-03-10 04:19:22.618', '2023-03-10 04:19:00.720');
INSERT INTO `items` VALUES (2, NULL, 803, 9, 2, 1, '0,0,1', 15, 3, NULL, 0, '2023-03-10 04:19:33.902', '2023-03-10 04:19:32.149');
INSERT INTO `items` VALUES (3, NULL, 804, 9, 2, 1, '0,0,2', 15, 5, NULL, 0, '2023-03-10 04:19:42.803', '2023-03-10 04:19:41.455');
INSERT INTO `items` VALUES (4, NULL, 805, 9, 2, 1, '0,0,3', 15, 6, NULL, 0, '2023-03-10 04:19:50.994', '2023-03-10 04:19:49.752');
INSERT INTO `items` VALUES (5, NULL, 806, 9, 2, 1, '0,0,4', 15, 0, NULL, 0, '2023-03-10 04:19:57.227', '2023-03-10 04:19:56.135');
INSERT INTO `items` VALUES (6, NULL, 2502, 9, 2, 1, '0,1,0', 15, 2, NULL, 0, '2023-03-10 04:33:56.832', '2023-03-10 04:20:09.350');
INSERT INTO `items` VALUES (17, NULL, 85, 9, 2, 1, '0,1,4', 0, NULL, NULL, 0, '2023-03-10 04:24:38.147', '2023-03-10 04:23:57.860');
INSERT INTO `items` VALUES (18, 17, 85, 9, 2, 1, '0,1,4', 0, NULL, NULL, 0, '2023-03-10 04:24:38.147', '2023-03-10 04:23:57.870');
INSERT INTO `items` VALUES (19, 17, 85, 9, 2, 1, '0,1,4', 0, NULL, NULL, 0, '2023-03-10 04:24:38.147', '2023-03-10 04:23:57.870');
INSERT INTO `items` VALUES (20, 17, 85, 9, 2, 1, '0,1,4', 0, NULL, NULL, 0, '2023-03-10 04:24:38.147', '2023-03-10 04:23:57.872');
INSERT INTO `items` VALUES (21, 17, 85, 9, 2, 1, '0,1,4', 0, NULL, NULL, 0, '2023-03-10 04:24:38.147', '2023-03-10 04:23:57.873');
INSERT INTO `items` VALUES (22, 17, 85, 9, 2, 1, '0,1,4', 0, NULL, NULL, 0, '2023-03-10 04:24:38.147', '2023-03-10 04:23:57.873');
INSERT INTO `items` VALUES (23, 17, 85, 9, 2, 1, '0,1,4', 0, NULL, NULL, 0, '2023-03-10 04:24:38.147', '2023-03-10 04:23:57.874');
INSERT INTO `items` VALUES (24, 17, 85, 9, 2, 1, '0,1,4', 0, NULL, NULL, 0, '2023-03-10 04:24:38.147', '2023-03-10 04:23:57.874');
INSERT INTO `items` VALUES (25, 17, 85, 9, 2, 1, '0,1,4', 0, NULL, NULL, 0, '2023-03-10 04:24:38.147', '2023-03-10 04:23:57.875');
INSERT INTO `items` VALUES (26, 17, 85, 9, 2, 1, '0,1,4', 0, NULL, NULL, 0, '2023-03-10 04:24:38.147', '2023-03-10 04:23:57.875');

-- ----------------------------
-- Table structure for messages
-- ----------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `from` int(11) NULL DEFAULT NULL,
  `to` int(11) NULL DEFAULT NULL,
  `message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `createdAt` datetime(3) NULL DEFAULT current_timestamp,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of messages
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
