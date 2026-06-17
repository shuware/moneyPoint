document
.getElementById(
"loadBalanceBtn"
)
.addEventListener(
"click",
loadCalculateData
);

function loadCalculateData(){

fetch(
"php/load_calculate.php"
)

.then(res=>res.json())

.then(data=>{

displayBalance(data)

})

}

function displayBalance(data){

const body=
document.getElementById(
"balanceBody"
);

body.innerHTML="";

data.forEach(machine=>{

body.innerHTML+=`

<tr>

<td>${machine.cash_name}</td>

<td class="difference">

${machine.difference}

</td>

<td class="capital">

${machine.new_capital}

</td>

<td class="correctedDifference">

${machine.difference}

</td>

<td class="correctedCapital">

${machine.new_capital}

</td>

</tr>

`;

})

}
document
.getElementById(
"balanceBtn"
)
addEventListener(
"click",
balanceMachines
);

function balanceMachines(){
    document.getElementById(
"recommendationsBody"
).innerHTML="";

let totalPositive=0;
let totalNegative=0;

const rows=
document.querySelectorAll(
"#balanceBody tr"
);

let positives=[];
let negatives=[];

rows.forEach(row=>{

const diff=
parseFloat(
row.querySelector(
".correctedDifference"
).innerText
);

if(diff>0){
totalPositive += diff;
positives.push({

row,

amount:diff

})

}

if(diff<0){
    totalNegative += Math.abs(diff);

negatives.push({

row,

amount:Math.abs(diff)

})

}

});


negatives.forEach(neg=>{

for(let pos of positives){

if(neg.amount<=0) break;
if(pos.amount<=0) continue;

const used = Math.min(neg.amount, pos.amount);

neg.amount -= used;
pos.amount -= used;

updateRow(neg.row, used, true);
updateRow(pos.row, used, false);

document.getElementById(
"recommendationsBody"
).innerHTML += `

<tr>

<td>
${pos.row.cells[0].innerText}
</td>

<td>
${neg.row.cells[0].innerText}
</td>

<td>
${used}
</td>

</tr>

`;


}

});

document.getElementById(
"summaryNote"
).innerHTML = `

<h3>Summary</h3>

<p>
Total Positive :
${totalPositive}
</p>

<p>
Total Negative :
${totalNegative}
</p>

<p>
Status :
Balanced Complete
</p>

`;
}

function updateRow(
row,
amount,
negative
){

const diffCell=
row.querySelector(
".correctedDifference"
);

const capCell=
row.querySelector(
".correctedCapital"
);

let diff=
parseFloat(
diffCell.innerText
);

let cap=
parseFloat(
capCell.innerText
);

if(negative){

diff+=amount;

cap+=amount;

}else{

diff-=amount;

cap-=amount;

}

diffCell.innerText=diff;

capCell.innerText=cap;

}
document
.getElementById("saveBalancedDataBtn")
.addEventListener(
"click",
function(){
console.log("Button Working");
saveBalancedData();
}
);

function saveBalancedData(){

const rows =
document.querySelectorAll(
"#balanceBody tr"
);

let data = [];

rows.forEach(row=>{

data.push({

cash_name:
row.cells[0].innerText,

corrected_difference:
parseFloat(
row.querySelector(
".correctedDifference"
).innerText
),

corrected_capital:
parseFloat(
row.querySelector(
".correctedCapital"
).innerText
)

});

});
console.log("Save button clicked");
fetch(
"php/save_balance.php",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
}
)
.then(res=>res.text())
.then(result=>{

console.log(result);
alert(result);

})
.catch(error=>{

console.error(error);

});

}