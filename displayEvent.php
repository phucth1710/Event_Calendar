<?php
ini_set("session.cookie_httponly", 1);
session_start();
$username = $_SESSION['username'];
header("Content-Type: application/json");
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$beginDate = $json_obj['begin'];
$endDate = $json_obj['end'];
$token = $json_obj['token'];

if($token != $_SESSION['token']){
    echo json_encode(array(
        "success" => false,
        "message" => "Tokens do not match"
    ));
    exit;
}

require("database.php");

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

$friends = array();
array_push($friends, $username);
$stmt = $mysqli->prepare("SELECT owner FROM Friend WHERE friend = ?");
checkError($stmt);
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($friend);
while ($stmt->fetch()){
    array_push($friends, $friend);
}

$allTitle = array();
$allDate = array();
$allTime = array();
$allEventId = array();
$allOwner = array();
//Me and my friend's event
foreach ($friends as $friend){
    $stmt = $mysqli->prepare("SELECT title, date, time, event_id FROM Event WHERE username = ? and date >= ? and date <= ?");
    checkError($stmt);
    $stmt->bind_param('sss', $friend, $beginDate, $endDate);
    $stmt->execute();
    $stmt->bind_result($title, $date, $time, $event_id);

    while ($stmt->fetch()){
        // echo("$title---------$date---------$time---------");
        array_push($allTitle, $title);
        array_push($allDate, $date);
        array_push($allTime, $time);
        array_push($allEventId, $event_id);
        array_push($allOwner, $friend);
    }
    $stmt->close();
}

//select event I participated as participant
$allEventIDParticipant = array();
$stmt = $mysqli->prepare("SELECT event_id FROM Participant WHERE participant = ?");
checkError($stmt);
$stmt->bind_param('s', $username);    
$stmt->execute();
$stmt->bind_result($event_id_participant);
while ($stmt->fetch()){
    array_push($allEventIDParticipant, $event_id_participant);
}
$stmt->close();

foreach($allEventIDParticipant as $event_id_participant){
    if(!in_array($event_id_participant, $allEventId)){
        $stmt = $mysqli->prepare("SELECT title, date, time, event_id FROM Event WHERE event_id = ? and date >= ? and date <= ?");
        checkError($stmt);
        $stmt->bind_param('iss', $event_id_participant, $beginDate, $endDate);
        $stmt->execute();
        $stmt->bind_result($title, $date, $time, $event_id);
        if ($stmt->fetch()){
            // echo("$title---------$date---------$time---------");
            array_push($allTitle, $title);
            array_push($allDate, $date);
            array_push($allTime, $time);
            array_push($allEventId, $event_id);
            array_push($allOwner, $friend);
        }
        $stmt->close();
    }
}


echo json_encode(array(
	"success" => true,
    "title" => $allTitle,
    "date" => $allDate,
    "time" => $allTime,
    "event_id" => $allEventId,
    "owner" => $allOwner
));


?>