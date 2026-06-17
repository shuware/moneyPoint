console.log("Report JS Running");
fetch("php/report.php")
.then(res => res.json())
.then(data => {

    let html = "";

    let totalToday = 0;
    let totalCharge = 0;
    let totalCommission = 0;
    let totalDifference = 0;
    let totalNonCapital = 0;
    let totalNewCapital = 0;

    data.forEach(row => {

        html += `
        <tr>
            <td>${row.cash_name}</td>
            <td>${row.cash_float}</td>
            <td>${row.cash_shop}</td>
            <td>${row.cash_home}</td>
            <td>${row.total_today}</td>
            <td>${row.charge_amount}</td>
            <td>${row.commission_amount}</td>
            <td>${row.difference}</td>
            <td>${row.corrected_difference}</td>
            <td>${row.corrected_capital}</td>
        </tr>
        `;

        totalToday += Number(row.total_today || 0);
        totalCharge += Number(row.charge_amount || 0);
        totalCommission += Number(row.commission_amount || 0);
        totalDifference += Number(row.difference || 0);
        totalNonCapital += Number(row.non_capital || 0);
        totalNewCapital += Number(row.corrected_capital || 0);
    });

    document.getElementById("reportBody").innerHTML = html;

    document.getElementById("totalToday").innerText =
        totalToday.toLocaleString();

    document.getElementById("totalCharge").innerText =
        totalCharge.toLocaleString();

    document.getElementById("totalCommission").innerText =
        totalCommission.toLocaleString();

    document.getElementById("totalDifference").innerText =
        totalDifference.toLocaleString();

    document.getElementById("totalNonCapital").innerText =
        totalNonCapital.toLocaleString();

    document.getElementById("totalNewCapital").innerText =
        totalNewCapital.toLocaleString();
});