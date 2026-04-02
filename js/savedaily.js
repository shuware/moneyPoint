document.getElementById("dailys").addEventListener("click", function() {
    // Get values
    const machine = document.getElementById("machineSelect").value;
    const float = document.getElementById("dailyfloat").value;
    const shop = document.getElementById("dailyshop").value;
    const home = document.getElementById("dailyhome").value;
    const date = document.getElementById("dailydate").value;

    // Validate
    if (!machine || !float || !shop || !home || !date) {
        alert("Please fill all fields!");
        return;
    }

    // Send to PHP
    fetch("php/saveDailyCash.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            machine: machine,
            float: float,
            shop: shop,
            home: home,
            date: date
        })
    })
    .then(res => res.text())
    .then(data => {
        alert(data); // show success or error message
        // Clear form
        document.getElementById("dailyfloat").value = "";
        document.getElementById("dailyshop").value = "";
        document.getElementById("dailyhome").value = "";
        document.getElementById("dailydate").value = "";
        document.getElementById("machineSelect").value = "";
    })
    .catch(err => console.error(err));
});