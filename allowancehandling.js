const input = document.getElementById('allowanceInput');
const allowanceDisplay = document.getElementById('allowanceDisplay');
const container = document.querySelector('.container3');

function updateAllowance() {
    const value = parseInt(input.value) || 0;
    const formattedValue = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);
    allowanceDisplay.textContent = formattedValue;

    const hue = Math.max(0, Math.min(((value - 2500) / 7500) * 360, 360));
    const saturation = Math.min(value / 100, 100);
    allowanceDisplay.style.color = `hsl(${hue}, ${saturation}%, 50%)`;

    const glowIntensity = Math.max(0, Math.min(((value - 2500) / 7500) * 30, 30));
    container.style.boxShadow = `0 4px 6px rgba(0, 0, 0, 0.1), 0 0 ${glowIntensity}px hsl(${hue}, ${saturation}%, 50%)`;

    localStorage.money = Number(value);
}

input.addEventListener('input', updateAllowance);
updateAllowance();