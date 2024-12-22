const sortBySelect = document.querySelector("#sortBySelect");
const orderBySelect = document.querySelector("#orderBySelect");
const showAmountSelect = document.querySelector("#showAmountSelect");
const splitSelect = document.querySelector("#splitSelect");
const batchSelect = document.querySelector("#batchSelect");
const pinsContainer = document.querySelector("#pinsContainer");
const pagination = document.querySelector("#pagination");
const progressLegend = document.querySelector(".progressLegend");
const progressBar = document.querySelector(".progressBar");
const nextPageBtn = document.querySelector("#nextPage");
const prevPageBtn = document.querySelector("#prevPage");

let totalPins;
let completed;
let currentPage;

//TODO disable prev and next button when appropiate
//TODO share functionality
//TODO cookies to remember last settings
//TODO on batch completed option to send whatsapp message
//And suggestion to move to next batch
//TODO long press on a pin to mark it as successful pin
//and save historic of successful pins
//TODO help button that show instructions and tips on code raid

prevPageBtn.onclick = () => {
    if (currentPage <= 1) return;

    let allPinButtons = [...document.querySelectorAll(".pin")];
    let checkedAmount = allPinButtons.reduce((acc, curr) => {
        return curr.classList.contains("checked") ? acc + 1 : acc;
    }, 0);

    completed -= checkedAmount;
    if (completed < 0) completed = 0;
    currentPage--;

    getPinsByFiltering();

    allPinButtons = [...document.querySelectorAll(".pin")];
    allPinButtons.map(curr => curr.classList.add("checked"));
}

nextPageBtn.onclick = () => {
    if (currentPage >= totalPins / showAmountSelect.value) return;

    let allPinButtons = [...document.querySelectorAll(".pin")];
    let uncheckedAmount = allPinButtons.reduce((acc, curr) => {
        return curr.classList.contains("checked") ? acc : acc + 1;
    }, 0);

    completed += uncheckedAmount;

    currentPage++;

    getPinsByFiltering();
}

sortBySelect.onchange = () => {
    init();
}
orderBySelect.onchange = () => {
    init();
}
showAmountSelect.onchange = () => {
    init();
}
splitSelect.onchange = () => {
    updateBatchSelectOptions();
    init();
}
batchSelect.onchange = () => {
    init();
}

function init() {
    completed = 0;
    currentPage = 1;

    getPinsByFiltering();
}

function getPinsByFiltering() {
    let sortedPins = [...pins];

    sortBySelect.value == "Value" && sortedPins.sort();

    const batchSize = Math.ceil(sortedPins.length / (100 / parseInt(splitSelect.value)));
    const batch = batchSelect.value;

    sortedPins = sortedPins.splice((batch - 1) * batchSize, batchSize);

    totalPins = sortedPins.length;

    orderBySelect.value == "Descending" && sortedPins.reverse();

    sortedPins = sortedPins.slice((currentPage - 1) * showAmountSelect.value, currentPage * showAmountSelect.value);

    pinsContainer.innerHTML = sortedPins
        .map(curr => `<button class="pin">${curr}</button>`)
        .join('');

    addFunctionalityToPinButtons();
    updateProgress();
}

function updateProgress() {
    let percentage = (100 / (totalPins / completed)).toFixed(2).replace(/\.00$/, '');

    pagination.innerText = `Page ${currentPage} of ${(totalPins / showAmountSelect.value).toLocaleString('en-US')}`;
    progressLegend.innerHTML = `<span>${completed.toLocaleString('en-US')} of ${totalPins.toLocaleString('en-US')} pins.</span><span>${percentage}% Completed!</span>`;
    progressBar.style.setProperty("--percentage", percentage + "%");
}

function addFunctionalityToPinButtons() {
    const pinButtons = document.querySelectorAll(".pin");

    pinButtons.forEach(pB => {
        pB.addEventListener("pointerdown", () => {
            if (pB.classList.contains("checked")) {
                pB.classList.remove("checked");
                completed--;
            } else {
                pB.classList.add("checked");
                completed++;
            }
            updateProgress();
        })
    })
}

function updateBatchSelectOptions() {
    let splitValue = parseInt(splitSelect.value);

    batchSelect.innerHTML = '';

    let numberOfOptions = 100 / splitValue;

    for (let i = 1; i <= numberOfOptions; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = `Batch ${i} of ${numberOfOptions} batches`;
        batchSelect.appendChild(option);
    }
}


init();