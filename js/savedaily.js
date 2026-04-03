document.getElementById("dailys").addEventListener("click", function() {
    const machine = document.getElementById("machineSelect").value;
    const float = document.getElementById("dailyfloat").value;
    const shop = document.getElementById("dailyshop").value;
    const home = document.getElementById("dailyhome").value;
    const date = document.getElementById("dailydate").value;

    if(!machine || !float || !shop || !home || !date){
        alert("Please fill all fields!");
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
        // clear form
        document.getElementById("dailyfloat").value = "";
        document.getElementById("dailyshop").value = "";
        document.getElementById("dailyhome").value = "";
        document.getElementById("dailydate").value = "";
        document.getElementById("machineSelect").value = "";
    })
    .catch(err => console.error(err));
});