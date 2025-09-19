// Base API URL (latest exchange rates)
const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

// Get dropdowns
const dropdown = document.querySelectorAll(".dropdown select");

// Populate dropdowns with currency options
for (let select of dropdown) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Set default selection
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "PKR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  // Change flag when currency changes
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to update flag
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode] || "un"; // fallback if undefined
  let img = element.parentElement.querySelector("img");

  // Set flag URL
  img.src = `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`;

  // Fallback if flag not found
  img.onerror = () => {
    img.src = "https://flagcdn.com/48x36/un.png"; // default unknown/world flag
  };
};

// DOM Elements
const btn = document.querySelector("form button");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Set initial flags for default selections
updateFlag(fromCurrency);
updateFlag(toCurrency);

// Button click event
btn.addEventListener("click", async (e) => {
  e.preventDefault();

  let amount = document.querySelector(".amount input");
  if (amount.value === "" || amount.value === "0") {
    amount.value = "1"; 
  }

  // Build API URL dynamically based on selected 'from' currency
  const URL = `${BASE_URL}/${fromCurrency.value.toLowerCase()}.json`;

  try {
    let response = await fetch(URL);
    let data = await response.json();

    // Get exchange rate for selected 'to' currency
    let rate = data[fromCurrency.value.toLowerCase()][toCurrency.value.toLowerCase()];

    // Calculate converted amount
    let finalAmt = (amount.value * rate).toFixed(2);

    // Show result
    msg.innerText = `${amount.value} ${fromCurrency.value} = ${finalAmt} ${toCurrency.value}`;
  } catch (error) {
    msg.innerText = "Error fetching data. Try again!";
  }
});

