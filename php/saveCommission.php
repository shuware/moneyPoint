<?php
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$machine = $data["machine"] ?? '';
$amount = $data["amount"] ?? '';
$location = $data["location"] ?? '';
$date = $data["date"] ?? '';

if(empty($machine) || empty($amount) || empty($location) || empty($date)){
    echo json_encode(["status"=>"error","message"=>"Missing data"]);
    exit;
}

$sql = "INSERT INTO commission (commission_name, commission_amount, commission_location, commission_date)
        VALUES ('$machine','$amount','$location','$date')";

if($conn->query($sql) === TRUE){
    echo json_encode(["status"=>"success"]);
} else {
    echo json_encode(["status"=>"error","message"=>$conn->error]);
}
?>