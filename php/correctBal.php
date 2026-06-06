<?php

include "db.php";

$data =
json_decode(
file_get_contents(
"php://input"
),
true
);

foreach($data as $row){

$cash_name =
$row["cash_name"];

$difference =
$row["correctedDifference"];

$capital =
$row["correctedCapital"];

$date =
date("Y-m-d");


// CHECK IF ALREADY SAVED

$check =
$conn->prepare(

"SELECT balance_id
FROM balanced_table

WHERE cash_name=?

AND balance_date=?"

);

$check->bind_param(

"ss",

$cash_name,

$date

);

$check->execute();

$result =
$check->get_result();

if(
$result->num_rows==0
){

$stmt =
$conn->prepare(

"INSERT INTO balanced_table
(
cash_name,
corrected_difference,
corrected_capital,
balance_date
)

VALUES(
?,
?,
?,
?
)"

);

$stmt->bind_param(

"sdds",

$cash_name,

$difference,

$capital,

$date

);

$stmt->execute();

}

}

echo "Saved";

?>