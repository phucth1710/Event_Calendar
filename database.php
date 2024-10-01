<?php

$mysqli = new mysqli('127.0.0.1', 'talekien1710', 'Kien12345678@', 'calendar');

if($mysqli-> connect_errno) {
	printf("Connection Failed: %s\n", $mysqli->connect_error);
	exit;
}

?>