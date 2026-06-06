document.addEventListener("DOMContentLoaded", () => {
    loadBalance();
});

function loadBalance() {
    fetch("php/getBalance.php")
        .then(res => {
            if (!res.ok) throw new Error("Network response failed");
            return res.json();
        })
        .then(data => {
            if (data.length === 0) {
                console.warn("No data found for today");
                return;
            }
            calculateBalance(data);
        })
        .catch(err => console.error("Error loading balance:", err));
}

function calculateBalance(data) {
    // Parse all values to numbers
    data.forEach(machine => {
        machine.difference = parseFloat(machine.difference);
        machine.new_capital = parseFloat(machine.new_capital);
        machine.remainingDifference = machine.difference;
        machine.updatedCapital = machine.new_capital;
        machine.originalDifference = machine.difference; // Store original
    });

    // Store corrections
    let corrections = [];

    // Separate positive and negative machines
    let positive = data.filter(m => m.remainingDifference > 0);
    let negative = data.filter(m => m.remainingDifference < 0);

    // Sort negative by most negative first (largest absolute deficit)
    negative.sort((a, b) => a.remainingDifference - b.remainingDifference);
    // Sort positive by smallest excess first
    positive.sort((a, b) => a.remainingDifference - b.remainingDifference);

    // Track running totals for reason messages
    let runningExcess = {};
    let runningDeficit = {};

    positive.forEach(p => {
        runningExcess[p.cash_name] = p.remainingDifference;
    });
    negative.forEach(n => {
        runningDeficit[n.cash_name] = Math.abs(n.remainingDifference);
    });

    // Distribute positive to negative
    for (let neg of negative) {
        let deficit = Math.abs(neg.remainingDifference);
        
        for (let pos of positive) {
            if (deficit <= 0) break;
            if (pos.remainingDifference <= 0) continue;
            
            let amount = Math.min(pos.remainingDifference, deficit);
            
            // Record correction
            if (amount > 0) {
                corrections.push({
                    from: pos.cash_name,
                    to: neg.cash_name,
                    amount: amount
                });
            }
            
            // Transfer amount
            pos.remainingDifference -= amount;
            neg.remainingDifference += amount;
            
            // Update capital: negative machine gains capital, positive loses capital
            pos.updatedCapital -= amount;
            neg.updatedCapital += amount;
            
            deficit -= amount;
        }
    }

    // Store results for display
    data.forEach(machine => {
        machine.correctedDifference = machine.remainingDifference;
        machine.correctedCapital = machine.updatedCapital;
    });

    displayBalance(data);
    displayRecommendations(corrections);
    displaySummary(data);
}

function displayBalance(data) {
    let tbody = document.querySelector("#balanceTable tbody");
    tbody.innerHTML = "";

    data.forEach(machine => {
        let diffClass = machine.correctedDifference > 0 ? 'positive' : (machine.correctedDifference < 0 ? 'negative' : 'zero');
        
        tbody.innerHTML += `
            <tr>
                <td><strong>${machine.cash_name}</strong></td>
                <td class="${machine.originalDifference > 0 ? 'positive' : (machine.originalDifference < 0 ? 'negative' : 'zero')}">
                    ${formatNumber(machine.originalDifference)} TZS
                </td>
                <td class="${diffClass}">
                    ${formatNumber(machine.correctedDifference)} TZS
                </td>
                <td>${formatNumber(machine.correctedCapital)} TZS</td>
            </tr>
        `;
    });
}

function displayRecommendations(corrections){

const tbody=
document.getElementById(
"recommendationsBody"
);

tbody.innerHTML="";

if(corrections.length===0){

tbody.innerHTML=`
<tr>

<td colspan="3">

✓ No corrections needed

</td>

</tr>
`;

return;

}

corrections.forEach(corr=>{

tbody.innerHTML+=`

<tr>

<td>

${corr.from}

</td>

<td>

${corr.to}

</td>

<td class="positive">

${formatNumber(corr.amount)}

TZS

</td>

</tr>

`;

});

}

function displaySummary(data) {
    let summaryDiv = document.getElementById("summaryNote");
    if (!summaryDiv) {
        // Create summary div if it doesn't exist
        const recommendationsDiv = document.getElementById("recommendationsSection");
        const newSummaryDiv = document.createElement("div");
        newSummaryDiv.id = "summaryNote";
        newSummaryDiv.className = "summary-note";
        if (recommendationsDiv) {
            recommendationsDiv.insertAdjacentElement('afterend', newSummaryDiv);
        } else {
            document.getElementById("chargesSection").appendChild(newSummaryDiv);
        }
        summaryDiv = newSummaryDiv;
    }
    
    // Build summary messages
    let summaryHtml = '<strong>📋 Balance Summary</strong><br>';
    
    data.forEach(machine => {
        let originalDiff = machine.originalDifference;
        let remainingDiff = machine.correctedDifference;
        
        if (originalDiff === 0 && remainingDiff === 0) {
            summaryHtml += `• ${machine.cash_name}: ✓ Balanced (0)<br>`;
        } 
        else if (originalDiff !== 0 && remainingDiff === 0) {
            summaryHtml += `• ${machine.cash_name}: ✓ Fully balanced (was ${formatNumber(originalDiff)} → now 0)<br>`;
        }
        else if (remainingDiff > 0) {
            summaryHtml += `<span class="positive">• ${machine.cash_name}: ⚠️ Still has excess +${formatNumber(remainingDiff)} TZS</span><br>`;
        }
        else if (remainingDiff < 0) {
            summaryHtml += `<span class="negative">• ${machine.cash_name}: ⚠️ Still has deficit ${formatNumber(remainingDiff)} TZS</span><br>`;
        }
        else if (originalDiff === 0 && remainingDiff !== 0) {
            summaryHtml += `• ${machine.cash_name}: ${formatNumber(remainingDiff)} TZS remaining<br>`;
        }
    });
    
    // Check if any machine has remaining imbalance
    let hasRemainingImbalance = data.some(m => m.correctedDifference !== 0);
    
    if (!hasRemainingImbalance) {
        summaryHtml += '<br><span class="positive" style="font-weight:bold;">✅ All machines perfectly balanced!</span>';
    } else {
        summaryHtml += '<br><span class="negative" style="font-weight:bold;">⚠️ Note: Some imbalances remain (insufficient excess to cover all deficits)</span>';
    }
    
    summaryDiv.innerHTML = summaryHtml;
}

function formatNumber(value) {
    if (isNaN(value)) return "0.00";
    return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}



// Show the section after loading
setTimeout(() => {
    const section = document.getElementById("chargesSection");
    if (section) section.style.display = "block";
}, 500);