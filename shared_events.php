<?php
require("database.php");
ini_set("session.cookie_httponly", 1);
session_start();
$username = $_SESSION['username'];
header("Content-Type: application/json");
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$shared_user = $json_obj['shared_user'];
$token = $json_obj['token'];

if($token != $_SESSION['token']){
    echo json_encode(array(
        "success" => false,
        "message" => "Tokens do not match"
    ));
    exit;
}

function checkError($stmt) {
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        echo json_encode(array(
        	"success" => false,
        	"message" => $mysqli->error
        ));
        exit;
    }
}

$stmt = $mysqli->prepare("insert into Friend (owner, friend) values (?, ?)");
checkError($stmt);
$stmt->bind_param('ss', $username, $shared_user);
$stmt->execute();
$eventId = $mysqli->insert_id;

$stmt->close();

echo json_encode(array(
    "success" => true
));

exit;
?>