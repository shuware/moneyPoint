<?php

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$machine = $data["machine"];
$amount = $data["amount"];
$location = $data["location"];
$date = $data["date"];

// 🔥 CHECK DUPLICATE FIRST
$check = $conn->query("
    SELECT charge_id FROM charge 
    WHERE charge_name='$machine' 
    AND charge_date='$date'
");

if($check->num_rows > 0){
    echo json_encode([
        "status" => "exists",
        "message" => "Charge already exists for this machine today!"
    ]);
    exit;
}

// INSERT
$sql = "INSERT INTO charge(charge_name,charge_amount,charge_location,charge_date)
        VALUES('$machine','$amount','$location','$date')";

$conn->query($sql);

echo json_encode(["status"=>"success"]);

?>