const minRange = document.getElementById("minRange");
const maxRange = document.getElementById("maxRange");
const priceText = document.getElementById("priceText")

function updatePrice() {
    let min = Number(minRange.value);
    let max = Number(maxRange.value);

    if (min > max) {
        minRange.value = max;
    }

    priceText.textContent = `$${minRange.value} to $${maxRange.value}`;
}

updatePrice();