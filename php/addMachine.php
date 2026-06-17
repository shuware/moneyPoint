<?php
include "db.php";

$data = json_decode(file_get_contents("php://input"),true);

$name = $data["machine"];
$float = str_replace(",", "", $data["float"]);
$shop = str_replace(",", "", $data["shop"]);
$home = str_replace(",", "", $data["home"]);

$total = (float)$float + (float)$shop + (float)$home;

$sql = "INSERT INTO machines(machine_name,machine_float,machine_shop,machine_home,machine_total)
VALUES('$name','$float','$shop','$home','$total')";

$conn->query($sql);

echo json_encode(["status"=>"success"]);

?>