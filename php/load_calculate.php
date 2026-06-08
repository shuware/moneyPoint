<?php

include "db.php";


$sql="SELECT
cash_name,
difference,
new_capital
FROM calculate
WHERE calc_date=CURDATE()";

$result=mysqli_query(
$conn,
$sql
);

$data=[];

while(
$row=mysqli_fetch_assoc($result)
){

$data[]=$row;

}

echo json_encode($data);

?>