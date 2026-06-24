
document.getElementById("dailys").addEventListener("click", function() {
    const id = document.getElementById("editId").value;
    const machine = document.getElementById("machineSelect").value;
    const float = document.getElementById("dailyfloat").value;
    const shop = document.getElementById("dailyshop").value;
    const home = document.getElementById("dailyhome").value;
    const date = document.getElementById("dailydate").value;

    if(!machine || !float || !shop || !home || !date){
        alert("Please fill all fields!");
        return;
    }

    

    // 🔥 IF UPDATE
    if(id){
        fetch("php/updatedailycash.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id,
                cash_float: float,
                cash_shop: shop,
                cash_home: home
            })
        })
        .then(res => res.text())
        .then(data => {
            alert(data);

            document.getElementById("editId").value = "";
            document.getElementById("dailys").innerText = "Save";

            loadDailyCash();
        });

        return;
    }
    fetch("php/saveDailyCash.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ machine, float, shop, home, date })
    })
    .then(res => res.text())
    .then(data => {
        alert(data);
    
        document.getElementById("dailyfloat").value = "";
        document.getElementById("dailyshop").value = "";
        document.getElementById("dailyhome").value = "";
        document.getElementById("dailydate").value = "";
        document.getElementById("machineSelect").value = "";

        setTimeout(() => {
        loadDailyCash();
    }, 300);
    })
    .catch(err => console.error(err));
});

function loadDailyCash(){

fetch("php/loadDailyCash.php")
.then(res=>res.json())
.then(data=>{

let html = "";

data.forEach(row=>{

html += `
<tr>
<td>${row.cash_name}</td>
<td>${Number(row.cash_float).toLocaleString()}</td>
<td>${Number(row.cash_shop).toLocaleString()}</td>
<td>${Number(row.cash_home).toLocaleString()}</td>
<td>${row.cash_date}</td>
<td>
<button onclick="editDailyCash(
${row.cash_id},
'${row.cash_name}',
'${row.cash_float}',
'${row.cash_shop}',
'${row.cash_home}',
'${row.cash_date}'
)">Update</button>
<button onclick="deleteDailyCash(${row.cash_id})">Delete</button>
</td>
</tr>
`;

});

document.getElementById("dailyCashBody").innerHTML = html;

});

}
loadDailyCash();

function editDailyCash(id, machine, float, shop, home, date){

// save id kwenye hidden input
document.getElementById("editId").value = id;

// jaza inputs zako
document.getElementById("machineSelect").value = machine;
document.getElementById("dailyfloat").value = float;
document.getElementById("dailyshop").value = shop;
document.getElementById("dailyhome").value = home;
document.getElementById("dailydate").value = date;

document.getElementById("dailys").innerText = "Update";

}