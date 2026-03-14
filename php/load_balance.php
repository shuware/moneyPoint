<?php
include "db.php";

$date = $_GET['date'];

// Select including total_today
$sql = "SELECT machine,
               total_today,
               non_capital,
               real_capital_today,
               difference,
               new_capital_today
        FROM balances
        WHERE balance_date = '$date'";

$result = $conn->query($sql);

$data = [];

while($row = $result->fetch_assoc()){
    $data[] = $row;
}

// Return JSON
echo json_encode($data);
?>