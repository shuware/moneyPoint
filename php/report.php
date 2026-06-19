<?php

include 'db.php';

$today = date("Y-m-d");

$sql = "
SELECT

d.cash_name,

d.cash_float,
d.cash_shop,
d.cash_home,

c.total_today,
c.non_capital,
c.difference,

IFNULL(ch.total_charge,0) AS charge_amount,

IFNULL(cm.total_commission,0) AS commission_amount,

b.corrected_difference,
b.corrected_capital

FROM dailycash d

LEFT JOIN calculate c
ON d.cash_name = c.cash_name
AND c.calc_date = '$today'

LEFT JOIN
(
    SELECT charge_name,
           SUM(charge_amount) total_charge
    FROM charge
    WHERE charge_date = '$today'
    GROUP BY charge_name
) ch
ON d.cash_name = ch.charge_name

LEFT JOIN
(
    SELECT commission_name,
           SUM(commission_amount) total_commission
    FROM commission
    WHERE commission_date = '$today'
    GROUP BY commission_name
) cm
ON d.cash_name = cm.commission_name

LEFT JOIN balanced_table b
ON d.cash_name = b.cash_name
AND b.balance_date = '$today'

WHERE d.cash_date = '$today'

ORDER BY d.cash_name
";

$result = mysqli_query($conn,$sql);

$data = [];

while($row = mysqli_fetch_assoc($result)){
    $data[] = $row;
}

echo json_encode($data);

?>