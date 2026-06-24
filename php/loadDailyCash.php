<?php

include "db.php";

$today = date("Y-m-d");

$sql = "SELECT * FROM dailycash
        WHERE cash_date='$today'
        ORDER BY cash_id DESC";

$result = mysqli_query($conn,$sql);

$data = [];

while($row = mysqli_fetch_assoc($result)){
    $data[] = $row;
}

echo json_encode($data);

?>