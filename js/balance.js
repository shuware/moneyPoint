function formatNumber(num){

num = Number(num);

if(num < 0){
return "-" + Math.abs(num).toLocaleString();
}

return num.toLocaleString();

}

function loadBalance(){

let date = document.getElementById("date").value;

fetch("load_balance.php?date="+date)
.then(res=>res.json())
.then(data=>{

let html = `
<table>
<tr>
<th>Machine</th>
<th>Non Capital</th>
<th>Real Capital Today</th>
<th>Difference</th>
<th>New Capital Today</th>
</tr>
`;

data.forEach(row=>{

let diffClass = "neutral";

if(row.difference > 100){
diffClass = "negative";
}

if(row.difference < -100){
diffClass = "positive";
}

html += `
<tr>
<td>${row.machine}</td>
<td>${formatNumber(row.non_capital)} TZS</td>
<td>${formatNumber(row.real_capital_today)} TZS</td>
<td class="${diffClass}">
${formatNumber(row.difference)} TZS
</td>
<td>${formatNumber(row.new_capital_today)} TZS</td>
</tr>
`;

});

html += "</table>";

document.getElementById("balanceTable").innerHTML = html;

});

}