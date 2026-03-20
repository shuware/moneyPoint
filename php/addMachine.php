<?php
include "db.php";

$data = json_decode(file_get_contents("php://input"),true);

$name = $data["machine"];
$float = $data["float"];
$shop = $data["shop"];
$home = $data["home"];

$total = $float + $shop + $home;

$sql = "INSERT INTO machines(machine_name,machine_float,machine_shop,machine_home,machine_total)
VALUES('$name','$float','$shop','$home','$total')";

$conn->query($sql);

echo json_encode(["status"=>"success"]);

?>