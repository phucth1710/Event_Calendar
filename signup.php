<?php
require("database.php");
header("Content-Type: application/json");
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$fullname = $json_obj['fullname'];
$email = $json_obj['email'];
$username = $json_obj['username'];
$password = $json_obj['password'];
$friend = $json_obj['friend'];

if(empty($fullname) || empty($email) || empty($username) || empty($password)){
	echo json_encode(array(
		"success" => false,
		"message" => "Fill in all required information"
	));
	exit;
}

function checkError($stmt) {
	if(!$stmt){
		printf("Query Prep Failed: %s\n", $mysqli->error);
		exit;
	}
}

$stmt = $mysqli->prepare("SELECT username FROM User WHERE username =?");
checkError($stmt);
$stmt->bind_param('s', $username);
$stmt->execute();
$result = $stmt->get_result();
if($result->fetch_assoc()){
	echo json_encode(array(
		"success" => false,
		"message" => "Duplicate Username"
	));
	exit;
}
$stmt->close();

$uppercase = preg_match('@[A-Z]@', $password);
$lowercase = preg_match('@[a-z]@', $password);
$number    = preg_match('@[0-9]@', $password);
$username_space = strpos($username, " ");

if(!$uppercase || !$lowercase || !$number || strlen($password) < 8 || $username_space) {
	if($username_space){
		$message = "Error: Username cannot contain any spaces.";
	}
	else if(!$uppercase){
		$message = "Error: The password you inputted should include an upper case letter";
	}
	else if(!$lowercase){
		$message = "Error: The password you inputted should include an lower case letter";
	}
	else if(!$number){
		$message = "Error: The password you inputted should include a number";
	}
	else{
		$message = "Error: The password you inputted should be at least 8 characters";
	}
	echo json_encode(array(
		"success" => false,
		"message" => $message
	));
	exit;
}

// Hash Password
$password = password_hash($password, PASSWORD_BCRYPT);

$stmt = $mysqli->prepare("insert into User (fullname, username, password, email) values (?, ?, ?, ?)");
checkError($stmt);
$stmt->bind_param('ssss', $fullname, $username, $password, $email);
$stmt->execute();

echo json_encode(array(
	"success" => true,
	"friend" => $friend
));

$stmt->close();
?>