SELECT 
`user`.`id` AS `user_id`, `user`.`login` AS `user_login`, `reservations`.`id` AS `reservations_id`, `reservations`.`userId` AS `reservations_userId`, `reservations`.`bookId` AS `reservations_bookId`, 
(SELECT COUNT(case when `reservations`.`canceledAt` IS NOT NULL or (`reservations`.`endAt` is NOT NULL) then 1 end) FROM `reservation` `reservations`) AS `xxx` FROM `user` `user` 
LEFT JOIN `reservation` `reservations` ON `reservations`.`userId`=`user`.`id