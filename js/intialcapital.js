
// PAGE NAVIGATION
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

// GLOBAL VARIABLES
let editingId = null;
let machinesAdded = new Set();

// STANDARDIZE MACHINE NAME
function standardizeMachineName(name){
    return name.trim().toUpperCase();
}

// CLEAR FORM

function clearForm(){

    document.getElementById("machineName").value = "";
    document.getElementById("float").value = "";
    document.getElementById("shop").value = "";
    document.getElementById("home").value = "";

    document.getElementById("machineName").focus();
}

// SHOW INITIAL CAPITAL
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

// LOAD MACHINES

function loadMachines(){

fetch("php/getMachines.php")

.then(res => res.json())

.then(data => {

    // TABLE SECTION

    let table = document.querySelector("#machineTable tbody");

    table.innerHTML = "";

    machinesAdded.clear();

    let totalCash = 0;

    // SELECT DROPDOWNS

    const selects = [
        document.getElementById("machineSelect"),
        document.getElementById("capitalMachineSelect"),
        document.getElementById("chargeMachineSelect"),
        document.getElementById("commissionMachineSelect"),
       
    ];

    // clear old options
    selects.forEach(select=>{
        if(!select) return;
        select.innerHTML = '<option value="">-- Choose Machine --</option>';
    });

    // LOOP MACHINES

    data.forEach(machine => {

        machinesAdded.add(standardizeMachineName(machine.machine_name));

        // ADD TO TABLE

        let row = table.insertRow();

        row.insertCell(0).innerText = machine.machine_name;
        row.insertCell(1).innerText = machine.machine_float;
        row.insertCell(2).innerText = machine.machine_shop;
        row.insertCell(3).innerText = machine.machine_home;
        row.insertCell(4).innerText = machine.machine_total;

        // ADD MACHINE TO SELECTS

        selects.forEach(select=>{
            if(!select) return;

            let option = document.createElement("option");
            option.value = machine.machine_name;
            option.textContent = machine.machine_name;

            select.appendChild(option);
        });

        // EDIT BUTTON

        let editBtn = document.createElement("button");
        editBtn.innerText = "Edit";

        editBtn.onclick = function(){

            editingId = machine.machine_id;

            document.getElementById("machineName").value = machine.machine_name;
            document.getElementById("float").value = machine.machine_float;
            document.getElementById("shop").value = machine.machine_shop;
            document.getElementById("home").value = machine.machine_home;

            document.getElementById("machineName").focus();
        };

        // DELETE BUTTON

        let deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";

        deleteBtn.onclick = function(){

            if(confirm("Delete " + machine.machine_id + " ?")){

                fetch("php/deleteMachine.php?machine_id=" + machine.machine_id)

                .then(() => {
                    loadMachines();
                });
            }
        };

        // ACTION CELL

        let actionCell = row.insertCell(5);

        actionCell.appendChild(editBtn);
        actionCell.appendChild(document.createTextNode(" "));
        actionCell.appendChild(deleteBtn);


        totalCash += parseFloat(machine.machine_total);

    });

    // TOTAL CASH

    document.getElementById("totalCash").innerText =
        totalCash.toLocaleString();

});
}

// AUTO LOAD WHEN PAGE OPENS
window.onload = function(){

    loadMachines();

};







