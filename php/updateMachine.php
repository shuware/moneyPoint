<?php

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];
$name = $data["machine"];
$float = $data["float"];
$shop = $data["shop"];
$home = $data["home"];

$total = $float + $shop + $home;

$sql = "UPDATE machines 
SET machine_name='$name',
float_amount='$float',
cash_shop='$shop',
cash_home='$home',
total='$total'
WHERE id='$id'";

$conn->query($sql);

echo json_encode(["status"=>"updated"]);

?>