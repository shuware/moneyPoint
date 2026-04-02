document.getElementById("saveCharge").onclick = function(){
    let machine = document.getElementById("chargeMachineSelect").value;
    let amount = document.getElementById("chargeAmount").value.replace(/,/g,'');
    let location = document.getElementById("chargeLocation").value;
    let date = document.getElementById("chargeDate").value;

    // DEBUG: Check values before sending
    console.log("Charge Debug:", machine, amount, location, date);

    if(!machine || !amount || !location || !date){
        alert("Please fill all fields!");
        return;
    }

    fetch("php/saveCharge.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({machine, amount, location, date})
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === "success"){
            alert("Charge Added!");
            loadDashboard(date);
        } else {
            alert("Error: " + data.message);
        }
    })
    
};
