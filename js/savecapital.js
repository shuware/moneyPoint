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
    
};
