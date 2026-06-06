<?php
include "db.php";

$date = date("Y-m-d");

$sql = "SELECT * 
        FROM calculate
        WHERE calc_date='$date'
        ORDER BY calc_id ASC";

$result = $conn->query($sql);

$data = [];

while($row = $result->fetch_assoc()) {
    // Ensure numeric values
    $row['difference'] = (float)$row['difference'];
    $row['new_capital'] = (float)$row['new_capital'];
    $row['total_today'] = (float)$row['total_today'];
    $row['non_capital'] = (float)$row['non_capital'];
    $row['real_capital'] = (float)$row['real_capital'];
    $data[] = $row;
}

echo json_encode($data);
?>