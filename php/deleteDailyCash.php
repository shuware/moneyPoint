<?php

include "db.php";

$data = json_decode(file_get_contents("php://input"),true);

$id = $data['id'];

mysqli_query($conn,"DELETE FROM dailycash WHERE cash_id='$id'");

echo "Deleted successfully";

?>