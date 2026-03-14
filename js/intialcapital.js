// ===============================
// PAGE NAVIGATION
// ===============================
function showPage(pageId) {

    const sections = document.querySelectorAll('.page-content');

    sections.forEach(section => {
        section.style.setProperty("display", "none", "important");
    });

    const target = document.getElementById(pageId);

    if (target) {
        target.style.display = "block";
    }
}


// ===============================
// GLOBAL VARIABLES
// ===============================
let editingId = null;
let machinesAdded = new Set();


// ===============================
// STANDARDIZE MACHINE NAME
// ===============================
function standardizeMachineName(name){
    return name.trim().toUpperCase();
}


// ===============================
// KEYBOARD NAVIGATION
// ===============================
function handleKey(e){

    if(e.key === "Enter"){
        e.preventDefault();
        addMachine();
    }

    let inputs = ["machineName","float","shop","home"];
    let idx = inputs.indexOf(e.target.id);

    if(e.key === "ArrowDown"){
        idx = (idx + 1) % inputs.length;
        document.getElementById(inputs[idx]).focus();
    }

    if(e.key === "ArrowUp"){
        idx = (idx - 1 + inputs.length) % inputs.length;
        document.getElementById(inputs[idx]).focus();
    }
}


// ===============================
// CLEAR FORM
// ===============================
function clearForm(){

    document.getElementById("machineName").value = "";
    document.getElementById("float").value = "";
    document.getElementById("shop").value = "";
    document.getElementById("home").value = "";

    document.getElementById("machineName").focus();
}


// ===============================
// SHOW INITIAL CAPITAL
// ===============================
function showInitialCapital(){
    document.getElementById("initialCapitalSection").style.display = "block";
}


// ===============================
// ADD OR UPDATE MACHINE
// ===============================
function addMachine(){

    let name = standardizeMachineName(document.getElementById("machineName").value);
    let float = document.getElementById("float").value;
    let shop = document.getElementById("shop").value;
    let home = document.getElementById("home").value;

    if(name === ""){
        alert("Machine name required");
        return;
    }

    // prevent duplicate machine names
    if(machinesAdded.has(name) && editingId === null){
        alert("Machine already exists!");
        clearForm();
        return;
    }

    let url = editingId ? "php/updateMachine.php" : "php/addMachine.php";

    fetch(url,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            id: editingId,
            machine: name,
            float: float,
            shop: shop,
            home: home
        })
    })
    .then(res => res.json())
    .then(() => {

        editingId = null;

        clearForm();

        loadMachines();
    });
}


// ===============================
// LOAD MACHINES
// ===============================
function loadMachines(){

fetch("php/getMachines.php")

.then(res => res.json())

.then(data => {

    // =============================
    // TABLE SECTION
    // =============================

    let table = document.querySelector("#machineTable tbody");

    table.innerHTML = "";

    machinesAdded.clear();

    let totalCash = 0;


    // =============================
    // SELECT DROPDOWNS
    // =============================

    const selects = [
        document.getElementById("machineSelect"),
        document.getElementById("capitalMachineSelect"),
        document.getElementById("chargeMachineSelect"),
        document.getElementById("commissionMachineSelect")
    ];

    // clear old options
    selects.forEach(select=>{
        if(!select) return;
        select.innerHTML = '<option value="">-- Choose Machine --</option>';
    });


    // =============================
    // LOOP MACHINES
    // =============================

    data.forEach(machine => {

        machinesAdded.add(standardizeMachineName(machine.machine_name));


        // =============================
        // ADD TO TABLE
        // =============================

        let row = table.insertRow();

        row.insertCell(0).innerText = machine.machine_name;
        row.insertCell(1).innerText = machine.float_amount;
        row.insertCell(2).innerText = machine.cash_shop;
        row.insertCell(3).innerText = machine.cash_home;
        row.insertCell(4).innerText = machine.total;


        // =============================
        // ADD MACHINE TO SELECTS
        // =============================

        selects.forEach(select=>{
            if(!select) return;

            let option = document.createElement("option");
            option.value = machine.machine_name;
            option.textContent = machine.machine_name;

            select.appendChild(option);
        });


        // =============================
        // EDIT BUTTON
        // =============================

        let editBtn = document.createElement("button");
        editBtn.innerText = "Edit";

        editBtn.onclick = function(){

            editingId = machine.id;

            document.getElementById("machineName").value = machine.machine_name;
            document.getElementById("float").value = machine.float_amount;
            document.getElementById("shop").value = machine.cash_shop;
            document.getElementById("home").value = machine.cash_home;

            document.getElementById("machineName").focus();
        };


        // =============================
        // DELETE BUTTON
        // =============================

        let deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";

        deleteBtn.onclick = function(){

            if(confirm("Delete " + machine.machine_name + " ?")){

                fetch("php/deleteMachine.php?id=" + machine.id)

                .then(() => {
                    loadMachines();
                });
            }
        };


        // =============================
        // ACTION CELL
        // =============================

        let actionCell = row.insertCell(5);

        actionCell.appendChild(editBtn);
        actionCell.appendChild(document.createTextNode(" "));
        actionCell.appendChild(deleteBtn);


        totalCash += parseFloat(machine.total);

    });


    // =============================
    // TOTAL CASH
    // =============================

    document.getElementById("totalCash").innerText =
        totalCash.toLocaleString();

});
}



// ===============================
// AUTO LOAD WHEN PAGE OPENS
// ===============================
window.onload = function(){

    loadMachines();

};



document.addEventListener("DOMContentLoaded", function(){

let today = new Date().toISOString().split("T")[0];

loadDashboard(today);

});

document.getElementById("balanceForm").addEventListener("submit", function(e){

e.preventDefault();

let machine = document.getElementById("machineSelect").value;
let float = document.getElementById("cashInMachine").value.replace(/,/g,'');
let shop = document.getElementById("cashAtShop").value.replace(/,/g,'');
let home = document.getElementById("cashAtHome").value.replace(/,/g,'');
let date = document.getElementById("balanceDate").value;

fetch("php/saveBalance.php",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
machine:machine,
float:float,
shop:shop,
home:home,
date:date
})

})

.then(res=>res.json())

.then(data=>{

alert("Balance Saved");

loadDashboard(date);

});

});

document.getElementById("saveCharge").onclick = function(){

let machine = document.getElementById("chargeMachineSelect").value;
let amount = document.getElementById("chargeAmount").value.replace(/,/g,'');
let location = document.getElementById("chargeLocation").value;
let date = document.getElementById("chargeDate").value;

fetch("php/saveCharge.php",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
machine:machine,
amount:amount,
location:location,
date:date
})

})

.then(res=>res.json())

.then(data=>{

alert("Charge Saved");

loadDashboard(date);

});

};

document.getElementById("saveCapital").onclick = function(){
    let machine = document.getElementById("capitalMachineSelect").value;
    let amount = document.getElementById("capitalAmount").value.replace(/,/g,'');
    let location = document.getElementById("capitalLocation").value;
    let date = document.getElementById("capitalDate").value;

    // DEBUG: Check values before sending
    console.log("Capital Debug:", machine, amount, location, date);

    if(!machine || !amount || !location || !date){
        alert("Please fill all fields!");
        return;
    }

    fetch("php/saveCapital.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({machine, amount, location, date})
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === "success"){
            alert("Capital Added!");
            loadDashboard(date);
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Network or server error!");
    });
};
document.getElementById("saveCommission").onclick = function(){
    let machine = document.getElementById("commissionMachineSelect").value;
    let amount = document.getElementById("commissionAmount").value.replace(/,/g,'');
    let location = document.getElementById("commissionLocation").value;
    let date = document.getElementById("commissionDate").value;

    // DEBUG: Check values before sending
    console.log("Commission Debug:", machine, amount, location, date);

    if(!machine || !amount || !location || !date){
        alert("Please fill all fields!");
        return;
    }

    fetch("php/saveCommission.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({machine, amount, location, date})
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === "success"){
            alert("Commission Saved!");
            loadDashboard(date);
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Network or server error!");
    });
};

