<?php
// Database connection
$host = "localhost";
$user = "root"; // your DB username
$pass = "";     // your DB password
$db   = "cash_tracking";

$conn = new mysqli($host, $user, $pass, $db);

if($conn->connect_error){
    die("Connection failed: " . $conn->connect_error);
}

// Get JSON data
$data = json_decode(file_get_contents("php://input"), true);

$machine = $data['machine'];
$float   = $data['float'];
$shop    = $data['shop'];
$home    = $data['home'];
$date    = $data['date'];

// Simple validation
if(!$machine || !$float || !$shop || !$home || !$date){
    echo "All fields are required!";
    exit;
}

// Insert into dailycash table
$sql = "INSERT INTO dailycash (cash_name, cash_float, cash_shop, cash_home, cash_date) 
        VALUES (?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sddds", $machine, $float, $shop, $home, $date);

if($stmt->execute()){
    echo "Data saved successfully!";
} else {
    echo "Error saving data: " . $conn->error;
}

$stmt->close();
$conn->close();
?>