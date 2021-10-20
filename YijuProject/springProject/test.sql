/*
 Navicat MySQL Data Transfer

 Source Server         : root
 Source Server Type    : MySQL
 Source Server Version : 50715
 Source Host           : localhost
 Source Database       : test

 Target Server Type    : MySQL
 Target Server Version : 50715
 File Encoding         : utf-8

 Date: 05/01/2020 17:44:53 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `fd_user_info`
-- ----------------------------
DROP TABLE IF EXISTS `fd_user_info`;
CREATE TABLE `fd_user_info` (
  `uid` varchar(500) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `username` varchar(80) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `fdname` varchar(80) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `fdtel` varchar(80) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `date` varchar(80) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `house_info`
-- ----------------------------
DROP TABLE IF EXISTS `house_info`;
CREATE TABLE `house_info` (
  `fid` varchar(500) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `uid` varchar(80) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `banner` varchar(3000) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `title` varchar(500) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `fee` int(80) DEFAULT NULL,
  `ssize` int(20) DEFAULT NULL,
  `tsize` int(20) DEFAULT NULL,
  `wsize` int(20) DEFAULT NULL,
  `homesize` int(80) DEFAULT NULL,
  `area` varchar(80) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `areaname` varchar(80) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `imgarr` varchar(3000) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `fddata` varchar(500) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `apartment` varchar(500) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `street` varchar(500) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `sendtime` varchar(80) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `step` varchar(80) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `haveall` varchar(3000) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `fukuan` varchar(500) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `introduce` varchar(3000) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `label` varchar(500) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`fid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `house_info`
-- ----------------------------
BEGIN;
INSERT INTO `house_info` VALUES ('f1dc245c8-36c5-42c1-ba94-7f050ab62a55', 'uac34dc8e-c185-4637-a70e-44993359ec06', 'img1.jpg', '莲坂地铁口 小清新 环境舒适 配套齐全 交通便利', '1800', '2', '1', '1', '50', '思明', 'siming', 'img3.jpg,img2.jpg,img1.jpg', '{\"fdname\":\"小红\",\"fdtel\":\"15677587988\"}', '新景数码港', '嘉禾路13-17号', '2020/4/26', '31', '洗衣机,床,空调,冰箱,衣柜,沙发', '押一付三', '1、房子概况：房子朝东西，50平，正规。2、小区概况：生活方便，适合。3、本人服务说明：该照片真实，另外本人作为专业经纪人，对于客户，做到负责，负责，再负责！只要您把您的需求告诉我，我就会给您一个满意的答案！您的满意，我的追求！', '整租,朝南,有电梯'), ('f1ef50fc7-3174-413a-81b6-d2d26bddc55d', 'uac34dc8e-c185-4637-a70e-44993359ec06', 'img2.jpg', '测试1', '2626', '1', '2', '1', '58', '海沧', 'haicang', 'img3.jpg,img4.jpg,img1.jpg', '{\"fdname\":\"测试1\",\"fdtel\":\"17878787878\"}', '测试1', '测试1', '2020/4/26', '5', '床,洗衣机,空调,冰箱,可做饭,电视,热水器,衣柜,宽带,沙发', '押一付一', '测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1', '整租,朝南,有电梯,一号线'), ('f2f13da5f-0c36-4094-a7b5-d5864c1c84d2', 'uac34dc8e-c185-4637-a70e-44993359ec06', 'img3.jpg', '龙山文创园 豪华装修 个人无其他费用', '2400', '1', '1', '1', '30', '海沧', 'haicang', 'img3.jpg,img2.jpg,img1.jpg', '{\"fdname\":\"小李\",\"fdtel\":\"18989890078\"}', '龙山公寓', '龙门大街', '2020/4/26', '6', '洗衣机,热水器,衣柜,宽带,沙发', '押一付一', '1、房子概况：房子朝东西，50平，正规。2、小区概况：生活方便，适合。', '整租,朝南,一号线'), ('f652cc065-73d7-4ee3-b540-a4b19af7c5dc', 'uac34dc8e-c185-4637-a70e-44993359ec06', 'img3.jpg', '测试2', '2626', '3', '1', '1', '158', '同安', 'tongan', 'img3.jpg,img2.jpg,img1.jpg', '{\"fdname\":\"测试2\",\"fdtel\":\"17878787878\"}', '测试2', '测试2', '2020/4/26', '19', '床,洗衣机,空调,冰箱,可做饭,电视,热水器,衣柜,宽带,沙发', '押一付一', '测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1', '合租,南北,有电梯,一号线'), ('f7b2ab621-4c56-4a29-a676-b0f41ff9abed', 'uac34dc8e-c185-4637-a70e-44993359ec06', 'img2.jpg', '测试3', '1312', '1', '1', '1', '44', '思明', 'siming', 'img3.jpg,img2.jpg,img4.jpg', '{\"fdname\":\"测试3\",\"fdtel\":\"15656565656\"}', '测试3', '测试3', '2020/4/26', '4', '床,空调,洗衣机,电视,热水器,衣柜,宽带', '押一付一', '测试3测试3测试3测试3测试3测试3测试3测试3测试3测试3测试3测试3测试3测试3测试3', '短租,南北,有电梯,一号线'), ('f7e425898-ddc4-4db6-8750-4df90f634bef', 'uac34dc8e-c185-4637-a70e-44993359ec06', 'img1.jpg', '靠近大明湖 千佛山 李工湖', '5000', '1', '1', '1', '148', '海沧', 'haicang', 'img3.jpg,img2.jpg', '{\"fdname\":\"小芳\",\"fdtel\":\"17888789878\"}', '诚基中心', '和平路', '2020/4/26', '9', '洗衣机,空调,床,冰箱,宽带,沙发', '押一付一', '靠近大明湖 千佛山 李工湖，特别好。靠近大明湖 千佛山 李工湖，特别好。靠近大明湖 千佛山 李工湖，特别好。靠近大明湖 千佛山 李工湖，特别好。靠近大明湖 千佛山 李工湖，特别好', '合租,南北,一号线'), ('f910b56b1-eb53-4aed-bdd2-288b5bc29420', 'user1', 'img3.jpg', '新房源', '1088', '1', '1', '1', '40', '思明', 'siming', 'img3.jpg,img4.jpg', '{\"fdname\":\"小明\",\"fdtel\":\"17878787878\"}', '诚基中心', '乐园大街', '2020/4/27', '8', '洗衣机,床,空调,冰箱,可做饭', '押一付一', '测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，', '整组,朝南,有电梯'), ('f9ae71953-d2e0-497e-8cf4-eb5b8e8c4b55', 'uac34dc8e-c185-4637-a70e-44993359ec06', 'img4.jpg', '富华广场 正规1房1厅 电梯高层 豆仔尾路 斗西BRT禾祥西', '1800', '1', '1', '1', '60', '湖里', 'huli', 'img1.jpg,img2.jpg,img4.jpg', '{\"fdname\":\"小明\",\"fdtel\":\"15687987876\"}', '新莲花新龙山花园', '莲花五村', '2020/4/26', '29', '洗衣机,床,冰箱', '半年付', '房子概况：房子朝东西，50平，正规。2、小区概况：生活方便，适合。3、本人服务说明。。。', '短租,朝南,有电梯'), ('fc03c8a2f-6cb1-4a7a-8d11-2eeeacb59a33', 'u197023ad-c636-4bc2-a8de-ace75775926c', 'img3.jpg', '新房子', '1090', '1', '1', '1', '50', '思明', 'siming', 'img3.jpg,img2.jpg', '{\"fdname\":\"小明\",\"fdtel\":\"17878787878\"}', '诚基中心', '乐园大街', '2020/4/27', '6', '空调,洗衣机,床', '押一付一', '测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，测试有没有存给用户表，', '整组,朝南,有电梯');
COMMIT;

-- ----------------------------
--  Table structure for `user_info`
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `uid` varchar(500) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `username` varchar(80) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `password` varchar(80) DEFAULT NULL,
  `identity` int(8) NOT NULL,
  `sex` varchar(16) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `email` varchar(80) DEFAULT NULL,
  `tel` varchar(80) DEFAULT NULL,
  `fids` varchar(5000) DEFAULT NULL,
  `mylike` varchar(5000) DEFAULT NULL,
  `notice` varchar(5000) DEFAULT NULL,
  `name` varchar(80) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `user_info`
-- ----------------------------
BEGIN;
INSERT INTO `user_info` VALUES ('1', 'admin', '888888', '2', '男', null, '15688888888', null, null, null, '管理员'), ('u197023ad-c636-4bc2-a8de-ace75775926c', 'user1', '111111', '1', '男', '', '18989898989', 'fc03c8a2f-6cb1-4a7a-8d11-2eeeacb59a33', null, '{\"uid\":\"u197023ad-c636-4bc2-a8de-ace75775926c\",\"isagree\":\"1\",\"time\":\"2020/4/28\"}', '房东小明'), ('u2a68851d-30af-4508-be38-bf5aa22fd372', 'u123', '123123', '0', '男', '123@qq.com', '15656565656', null, null, null, '小李同学'), ('u32136f0a-7765-4af3-adad-7b3e35989252', 'user2', '123123', '0', '男', '', '15678798094', null, null, '{\"uid\":\"u32136f0a-7765-4af3-adad-7b3e35989252\",\"isagree\":\"0\",\"time\":\"2020/4/28\"}', '用户2'), ('u4b8d0720-206a-4596-bff2-a450527b69d2', 'user3', '123123', '0', '男', '', '15675755656', null, null, null, '用户3'), ('uac34dc8e-c185-4637-a70e-44993359ec06', 'fangdong1', '1111', '1', '女', '123@163.com', '15656565656', 'f169bc363-f7f9-469c-994e-f208bbfc9ef9#f7c4cb35a-1c9d-4c0d-8971-86228b352e6b#f9ae71953-d2e0-497e-8cf4-eb5b8e8c4b55#f1dc245c8-36c5-42c1-ba94-7f050ab62a55#f2f13da5f-0c36-4094-a7b5-d5864c1c84d2#f7e425898-ddc4-4db6-8750-4df90f634bef#f1ef50fc7-3174-413a-81b6-d2d26bddc55d#f652cc065-73d7-4ee3-b540-a4b19af7c5dc#f7b2ab621-4c56-4a29-a676-b0f41ff9abed#f235580d4-fc35-4c2a-aff2-d21ed1b9c91d#fc92b3d65-97f1-4f3e-8541-c62d558acc69#f62a09163-bdac-4a84-b4ed-85f70b5a187e', '', null, '房东一号');
COMMIT;

-- ----------------------------
--  Table structure for `user_notice_info`
-- ----------------------------
DROP TABLE IF EXISTS `user_notice_info`;
CREATE TABLE `user_notice_info` (
  `uid` varchar(500) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `isagree` int(4) DEFAULT NULL,
  `time` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `user_notice_info`
-- ----------------------------
BEGIN;
INSERT INTO `user_notice_info` VALUES ('u2a68851d-30af-4508-be38-bf5aa22fd372', '1', '2020/4/27'), ('u2a68851d-30af-4508-be38-bf5aa22fd372', '0', '2020/4/27'), ('u2a68851d-30af-4508-be38-bf5aa22fd372', '1', '2020/4/27'), ('u32136f0a-7765-4af3-adad-7b3e35989252', '1', '2020/4/28'), ('u2a68851d-30af-4508-be38-bf5aa22fd372', '0', '2020/4/28'), ('u4b8d0720-206a-4596-bff2-a450527b69d2', '1', '2020/4/28'), ('u197023ad-c636-4bc2-a8de-ace75775926c', '1', '2020/4/28'), ('u32136f0a-7765-4af3-adad-7b3e35989252', '0', '2020/4/28');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
