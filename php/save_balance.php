<?php

include "db.php";

$data=json_decode(
file_get_contents(
"php://input"
),
true
);

foreach(
$data as $row
){

$stmt=mysqli_prepare(
$conn,

"INSERT INTO balanced_table
(
cash_name,
corrected_difference,
corrected_capital,
balance_date
)

VALUES
(
?,
?,
?,
CURDATE()
)"

);

mysqli_stmt_bind_param(

$stmt,

"sdd",

$row['cash_name'],

$row['corrected_difference'],

$row['corrected_capital']

);

mysqli_stmt_execute(
$stmt
);

}

echo "Saved Successfully";

?>