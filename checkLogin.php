<?php
//test commit
ini_set("session.cookie_httponly", 1);
session_start();

header("Content-Type: application/json");

if(isset($_SESSION['token']) && isset($_SESSION['username'])){
    $username = $_SESSION['username'];
    $token = $_SESSION['token'];
    echo json_encode(array(
        "success" => true,
        "username" => $username,
        "token" => $token
    ));
}
else{
    echo json_encode(array(
        "success" => false
    ));
}



exit;
?>