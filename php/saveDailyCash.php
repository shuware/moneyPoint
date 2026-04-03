<?php
// Database connection
$conn = mysqli_connect("localhost", "root", "", "cash_tracking");
if (!$conn) { die("Connection failed: " . mysqli_connect_error()); }

// Get JSON data
$data = json_decode(file_get_contents("php://input"), true);

$machine = $data['machine'];
$float   = floatval($data['float']);
$shop    = floatval($data['shop']);
$home    = floatval($data['home']);
$date    = $data['date'];

if(!$machine || !$float || !$shop || !$home || !$date){
    echo "All fields are required!";
    exit;
}

// 1️⃣ Save daily cash
$sql = "INSERT INTO dailycash (cash_name, cash_float, cash_shop, cash_home, cash_date) VALUES (?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "sddds", $machine, $float, $shop, $home, $date);
if(!mysqli_stmt_execute($stmt)){
    echo "Error saving daily cash: " . mysqli_error($conn);
    exit;
}
mysqli_stmt_close($stmt);

// 2️⃣ Calculate totals
$total_today = $float + $shop + $home;

// Non-Capital = sum of commissions + charges today
$non_capital = 0;

// Charges today
$res = mysqli_query($conn, "SELECT SUM(charge_amount) as total_charge FROM charge WHERE charge_name='$machine' AND charge_date='$date'");
$row = mysqli_fetch_assoc($res);
$non_capital += floatval($row['total_charge']);

// Commissions today
$res = mysqli_query($conn, "SELECT SUM(commission_amount) as total_commission FROM commission WHERE commission_name='$machine' AND commission_date='$date'");
$row = mysqli_fetch_assoc($res);
$non_capital += floatval($row['total_commission']);

// Real Capital Today
$real_capital = $total_today - $non_capital;

// Get machine total as initial capital (first day)
$res = mysqli_query($conn, "SELECT machine_total FROM machines WHERE machine_name='$machine' LIMIT 1");
$row = mysqli_fetch_assoc($res);
$initial_capital = floatval($row['machine_total'] ?? 0);

// Previous day calculation
$res = mysqli_query($conn, "SELECT * FROM calculate WHERE cash_name='$machine' ORDER BY calc_date DESC LIMIT 1");
$yesterday = mysqli_fetch_assoc($res);

if(!$yesterday){ // first day
    $difference = $real_capital - $initial_capital;
}else{
    $difference = ($real_capital - $yesterday['new_capital']) + $yesterday['difference'];
}

// New Capital Today = Real Capital + Non-Capital + Added Capital Today
$added_capital_today = 0;
$res = mysqli_query($conn, "SELECT SUM(capital_amount) as added_capital FROM capital WHERE capital_name='$machine' AND capital_date='$date'");
$row = mysqli_fetch_assoc($res);
$added_capital_today = floatval($row['added_capital'] ?? 0);

$new_capital_today = $real_capital + $non_capital + $added_capital_today;

// Save calculation
$sql = "INSERT INTO calculate (cash_name, calc_date, total_today, non_capital, real_capital, difference, new_capital)
        VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "ssddddd", $machine, $date, $total_today, $non_capital, $real_capital, $difference, $new_capital_today);
if(mysqli_stmt_execute($stmt)){
    echo "Daily cash saved and calculation done successfully!";
}else{
    echo "Error saving calculation: " . mysqli_error($conn);
}
mysqli_stmt_close($stmt);
mysqli_close($conn);
?>