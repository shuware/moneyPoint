document.addEventListener("keydown", function (e) {

    const inputs = Array.from(document.querySelectorAll("input, select, button"));
    const active = document.activeElement;
    let index = inputs.indexOf(active);

    // 🔼 Arrow Down = next field
    if (e.key === "ArrowDown") {
        e.preventDefault();
        if (index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    }

    // 🔼 Arrow Up = previous field
    if (e.key === "ArrowUp") {
        e.preventDefault();
        if (index > 0) {
            inputs[index - 1].focus();
        }
    }

    // 🔥 ENTER = simulate Save click
    if (e.key === "Enter") {
        e.preventDefault();

        // optional: target your save buttons
        const saveBtn = document.querySelector("button.save-btn, #dailys, #saveCapital, #saveCharge, #saveCommission");

        if (saveBtn) {
            saveBtn.click();
        }
    }
});
