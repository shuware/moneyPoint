<?php

$conn = mysqli_connect("localhost", "root", "", "cash_tracking");

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$data = json_decode(file_get_contents("php://input"), true);

$machine = $data['machine']; // MACHINE NAME
$date = $data['date'];

// =======================
// 1. DAILY CASH
// =======================
$sql = "SELECT * FROM dailycash 
        WHERE cash_name='$machine' AND cash_date='$date'";

$result = mysqli_query($conn, $sql);
$cash = mysqli_fetch_assoc($result);

if (!$cash) {
    echo "No daily cash found!";
    exit;
}

$float = $cash['cash_float'];
$shop  = $cash['cash_shop'];
$home  = $cash['cash_home'];

// =======================
// 2. CHARGES
// =======================
$sql = "SELECT SUM(charge_amount) AS total 
        FROM charges 
        WHERE charge_machine='$machine' AND charge_date='$date'";

$result = mysqli_query($conn, $sql);
$row = mysqli_fetch_assoc($result);
$charges = $row['total'] ? $row['total'] : 0;

// =======================
// 3. COMMISSION
// =======================
$sql = "SELECT SUM(commission_amount) AS total 
        FROM commission 
        WHERE commission_machine='$machine' AND commission_date='$date'";

$result = mysqli_query($conn, $sql);
$row = mysqli_fetch_assoc($result);
$commission = $row['total'] ? $row['total'] : 0;

// =======================
// 4. CALCULATIONS
// =======================
$totalToday = $float + $shop + $home;

$nonCapital = $charges + $commission;

$realCapital = $totalToday - $nonCapital;

// =======================
// 5. YESTERDAY
// =======================
$sql = "SELECT * FROM calculation 
        WHERE cal_name='$machine'
        ORDER BY calc_date DESC 
        LIMIT 1";

$result = mysqli_query($conn, $sql);
$yesterday = mysqli_fetch_assoc($result);

if (!$yesterday) {
    $initial = $totalToday;
    $difference = $realCapital - $initial;
} else {
    $difference = ($realCapital - $yesterday['new_capital']) + $yesterday['difference'];
}

// =======================
// 6. NEW CAPITAL
// =======================
$newCapital = $realCapital + $nonCapital;

// =======================
// 7. SAVE
// =======================
$sql = "INSERT INTO calculation 
(cal_name, calc_date, total_today, non_capital, real_capital, difference, new_capital)
VALUES 
('$machine', '$date', '$totalToday', '$nonCapital', '$realCapital', '$difference', '$newCapital')";

if (mysqli_query($conn, $sql)) {
    echo "Calculation saved successfully!";
} else {
    echo "Error: " . mysqli_error($conn);
}

mysqli_close($conn);

?>