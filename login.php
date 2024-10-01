<?php
require("database.php");
header("Content-Type: application/json");
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];
$password = $json_obj['password'];

function checkError($stmt) {
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
}

$stmt = $mysqli->prepare("SELECT password, fullname FROM User WHERE username = ?");
checkError($stmt);
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($pass, $fullname);
if ($stmt->fetch()){
	if(password_verify ($password, $pass)){
		ini_set("session.cookie_httponly", 1);
		session_start();
		$_SESSION['username']  = $username;
		$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
		echo json_encode(array(
			"success" => true,
			"fullname" => $fullname,
			"token" => $_SESSION['token']
		));
		exit;
	}
	else{
		$message = "Incorrect Password";
	}
}
else{
	$message = "Username not found";
}
echo json_encode(array(
	"success" => false,
	"message" => $message
));

$stmt->close();
?>