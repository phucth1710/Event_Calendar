<?php
require("database.php");
ini_set("session.cookie_httponly", 1);
session_start();
$username = $_SESSION['username'];
header("Content-Type: application/json");
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$event_title = $json_obj['event_title'];
$event_date = $json_obj['event_date'];
$event_time = $json_obj['event_time'];
$participants = preg_split("/[\s,]+/", $json_obj['participants']);
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

//insert + get event_id of the entry just inserted
$stmt = $mysqli->prepare("insert into Event (title, date, time, username) values (?, ?, ?, ?)");
checkError($stmt);
$stmt->bind_param('ssss', $event_title, $event_date, $event_time, $username);
$stmt->execute();
$eventId = $mysqli->insert_id;

$stmt->close();



foreach ($participants as $participant) {
    $stmt = $mysqli->prepare("insert into Participant (event_id, participant, owner) values (?, ?, ?)");
    checkError($stmt);
    $stmt->bind_param('iss', $eventId, $participant, $username);
    $stmt->execute();
    $stmt->close();
}

echo json_encode(array(
    "success" => true,
    "event_id" => $eventId,
    "participants" => $participants
));

exit;
?>