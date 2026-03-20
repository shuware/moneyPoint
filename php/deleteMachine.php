<?php

include "db.php";

$id = $_GET["machine_id"];

$conn->query("DELETE FROM machines WHERE machine_id=$id");

?>