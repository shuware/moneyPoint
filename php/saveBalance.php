<?php

header("Content-Type: application/json");
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$machine = $data["machine"];
$float = $data["float"];
$shop = $data["shop"];
$home = $data["home"];
$date = $data["date"];


/* -------------------------
1. SAVE FLOAT, SHOP, HOME
IN DAILY_BALANCE
--------------------------*/

$save_daily = "INSERT INTO daily_balance
(machine_name,float_amount,cash_shop,cash_home,date)
VALUES
('$machine','$float','$shop','$home','$date')";

$conn->query($save_daily);


/* -------------------------
2. TOTAL TODAY
--------------------------*/

$total_today = $float + $shop + $home;


/* -------------------------
3. GET CHARGES
--------------------------*/

$charge_sql = "SELECT SUM(amount) as total_charge
FROM charges
WHERE machine_name='$machine' AND date='$date'";

$charge_result = $conn->query($charge_sql)->fetch_assoc();
$charge = $charge_result["total_charge"] ?? 0;


/* -------------------------
4. GET COMMISSION
--------------------------*/

$comm_sql = "SELECT SUM(amount) as total_commission
FROM commissions
WHERE machine_name='$machine' AND date='$date'";

$comm_result = $conn->query($comm_sql)->fetch_assoc();
$commission = $comm_result["total_commission"] ?? 0;


/* -------------------------
5. NON CAPITAL
--------------------------*/

$non_capital = $charge + $commission;


/* -------------------------
6. REAL CAPITAL TODAY
--------------------------*/

$real_capital_today = $total_today - $non_capital;


/* -------------------------
7. GET CAPITAL ADDED
--------------------------*/

$cap_sql = "SELECT SUM(amount) as capital_added
FROM capital_added
WHERE machine_name='$machine' AND date='$date'";

$cap_result = $conn->query($cap_sql)->fetch_assoc();
$capital_added = $cap_result["capital_added"] ?? 0;


/* -------------------------
8. GET YESTERDAY BALANCE
--------------------------*/

$yesterday_sql = "SELECT new_capital_today,difference
FROM balances
WHERE machine='$machine'
AND balance_date < '$date'
ORDER BY balance_date DESC
LIMIT 1";

$yesterday = $conn->query($yesterday_sql)->fetch_assoc();


/* -------------------------
9. GET INITIAL MACHINE CAPITAL
--------------------------*/

$init_sql = "SELECT float_amount,cash_shop,cash_home
FROM machines
WHERE machine_name='$machine'";

$init_result = $conn->query($init_sql)->fetch_assoc();

$initial_capital =
($init_result["float_amount"] ?? 0) +
($init_result["cash_shop"] ?? 0) +
($init_result["cash_home"] ?? 0);


/* -------------------------
10. CALCULATE DIFFERENCE
--------------------------*/

if(!$yesterday){

// FIRST DAY (NO PREVIOUS BALANCE)

$difference = $real_capital_today - $initial_capital;

}else{

$yesterday_capital = $yesterday["new_capital_today"];
$yesterday_difference = $yesterday["difference"];

$difference =
($real_capital_today - $yesterday_capital)
+ $yesterday_difference;

}


/* -------------------------
11. NEW CAPITAL TODAY
--------------------------*/

$new_capital_today =
$real_capital_today
+ $non_capital
+ $capital_added;


/* -------------------------
12. SAVE CALCULATIONS
IN BALANCES TABLE
--------------------------*/

$sql = "INSERT INTO balances
(machine,balance_date,total_today,non_capital,real_capital_today,difference,new_capital_today)

VALUES
('$machine','$date','$total_today','$non_capital','$real_capital_today','$difference','$new_capital_today')";

$conn->query($sql);


/* -------------------------
13. RETURN DATA TO DASHBOARD
--------------------------*/

echo json_encode([

"status"=>"success",

"float"=>$float,
"shop"=>$shop,
"home"=>$home,

"charge"=>$charge,
"commission"=>$commission,
"capital_added"=>$capital_added,

"total_today"=>$total_today,
"non_capital"=>$non_capital,

"real_capital_today"=>$real_capital_today,

"difference"=>$difference,

"new_capital_today"=>$new_capital_today

]);

?>