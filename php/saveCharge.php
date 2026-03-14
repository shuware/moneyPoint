<?php

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$machine = $data["machine"];
$amount = $data["amount"];
$location = $data["location"];
$date = $data["date"];

$sql = "INSERT INTO charges(machine_name,amount,location,date)
VALUES('$machine','$amount','$location','$date')";

$conn->query($sql);

echo json_encode(["status"=>"success"]);

?>