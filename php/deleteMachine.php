<?php

include "db.php";

$id = $_GET["id"];

$conn->query("DELETE FROM machines WHERE id=$id");

?>