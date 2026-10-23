ALTER TABLE `User` RENAME COLUMN `login` TO `username`;
ALTER TABLE `User` RENAME INDEX `User_login_key` TO `User_username_key`;
