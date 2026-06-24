<?php

include "db.php";

$data = json_decode(file_get_contents("php://input"),true);

$id = $data['id'];
$cash_float = str_replace(",","",$data['cash_float']);
$cash_shop = str_replace(",","",$data['cash_shop']);
$cash_home = str_replace(",","",$data['cash_home']);

$sql = "
UPDATE dailycash
SET
cash_float='$cash_float',
cash_shop='$cash_shop',
cash_home='$cash_home'
WHERE cash_id='$id'
";

mysqli_query($conn,$sql);

echo "Updated successfully";

?>