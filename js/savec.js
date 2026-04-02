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
   
};

