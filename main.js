const output = document.querySelector("#output");
const baseCurrency = document.querySelector("#base-dropbox");
const outputCurrency = document.querySelector("#output-dropbox-options");
const convertButton = document.querySelector("#convert");
const apiKey = "651a4c02e8-84f5c6e4c6-ssus1b";
const sound = new Audio("./sound.m4a");

function convert() {
    const baseAmount = parseFloat(document.querySelector("#base").value);
    const fromCurrency = baseCurrency.value;
    const toCurrency = outputCurrency.value;

    if (isNaN(baseAmount) || baseAmount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    fetch(`https://api.fastforex.io/fetch-one?from=${fromCurrency}&to=${toCurrency}&api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.result && data.result[toCurrency]) {
                const rate = data.result[toCurrency];
                const convertedAmount = (baseAmount * rate).toFixed(2);
                output.value = convertedAmount;
                sound.play();
                animateOutput(); // Trigger animation
            } else {
                alert("Currency not available.");     
            }
        })
        .catch(error => console.error("Error fetching exchange rate:", error));
}

// 🎉 Animation function (adds bubbles)
function animateOutput() {
    output.classList.add("pop-effect");

    for (let i = 0; i < 10; i++) {
        let bubble = document.createElement("div");
        bubble.classList.add("bubble");
        document.body.appendChild(bubble);

        let x = Math.random() * window.innerWidth;
        let y = Math.random() * window.innerHeight;
        let size = Math.random() * 20 + 10;

        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        setTimeout(() => bubble.remove(), 2000);
    }

    setTimeout(() => output.classList.remove("pop-effect"), 500);
}

function loadCurrency() {
    fetch(`https://api.fastforex.io/fetch-all?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.results) {
                const currencyNames = Object.keys(data.results);

                currencyNames.forEach(currency => {
                    const option1 = document.createElement("option");
                    const option2 = document.createElement("option");

                    option1.value = currency;
                    option1.textContent = currency;

                    option2.value = currency;
                    option2.textContent = currency;

                    baseCurrency.appendChild(option1);
                    outputCurrency.appendChild(option2);
                });
            }
        })
        .catch(error => console.error("Error fetching currencies:", error));
}

loadCurrency();
