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

// 🔥 CHECK DUPLICATE FIRST
$check = $conn->query("
    SELECT commission_id 
    FROM commission 
    WHERE commission_name='$machine' 
    AND commission_date='$date'
");

if($check->num_rows > 0){
    echo json_encode([
        "status" => "exists",
        "message" => "Commission already exists for this machine today!"
    ]);
    exit;
}

// INSERT
$sql = "INSERT INTO commission (commission_name, commission_amount, commission_location, commission_date)
        VALUES ('$machine','$amount','$location','$date')";

if($conn->query($sql) === TRUE){
    echo json_encode(["status"=>"success"]);
} else {
    echo json_encode(["status"=>"error","message"=>$conn->error]);
}
?>