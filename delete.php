<?php
require("database.php");
ini_set("session.cookie_httponly", 1);
session_start();
header("Content-Type: application/json");
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);
$event_id = $json_obj['event_id'];
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
$stmt = $mysqli->prepare("DELETE FROM Event WHERE event_id = ?");
checkError($stmt);
$stmt->bind_param('i', $event_id);
$stmt->execute();

echo json_encode(array(
	"success" => true
));
$stmt->close();
?>