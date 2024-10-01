<?php
require("database.php");
session_start();
header("Content-Type: application/json");
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$event_id = $json_obj['event_id'];
$event_title = $json_obj['event_title'];
$event_date = $json_obj['event_date'];
$event_time = $json_obj['event_time'];
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
$stmt = $mysqli->prepare("UPDATE Event set title = ?, date = ?, time = ? WHERE event_id = ?");
checkError($stmt);
$stmt->bind_param('sssi', $event_title, $event_date, $event_time, $event_id);
$stmt->execute();

echo json_encode(array(
	"success" => true
));
$stmt->close();
?>