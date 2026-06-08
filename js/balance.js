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
.addEventListener(
"click",
balanceMachines
);

function balanceMachines(){

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

positives.push({

row,

amount:diff

})

}

if(diff<0){

negatives.push({

row,

amount:Math.abs(diff)

})

}

});


negatives.forEach(neg=>{

positives.forEach(pos=>{

if(
neg.amount<=0
||
pos.amount<=0
){

return;

}

const used=
Math.min(
neg.amount,
pos.amount
);

neg.amount-=used;

pos.amount-=used;

updateRow(
neg.row,
used,
true
);

updateRow(
pos.row,
used,
false
);

});

});

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
.getElementById(
"saveBalancedDataBtn"
)
.addEventListener(
"click",
saveBalance
);

function saveBalance(){

const rows=
document.querySelectorAll(
"#balanceBody tr"
);

let data=[];

rows.forEach(row=>{

data.push({

cash_name:
row.cells[0].innerText,

corrected_difference:
row.cells[3].innerText,

corrected_capital:
row.cells[4].innerText

});

});

fetch(
"php/save_balance.php",
{

method:"POST",

body:JSON.stringify(
data
)

}

)

.then(res=>res.text())

.then(msg=>{

alert(msg)

})

}