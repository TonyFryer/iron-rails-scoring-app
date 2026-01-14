function getValue(elementID) {
    return value = document.getElementById(elementID).value;
}

function getPrivateCompanyValue(elementID) {
    const el = document.getElementById(elementID);
    if (!el || el.value === undefined) {
        return 0;
    }

    var value = parseInt(document.getElementById(elementID).value);
    return value = isNaN(value) ? 0 : value;
}

function getStationValue(elementID) {
    const el = document.getElementById(elementID);
    if (!el || el.value === undefined) {
        return 0;
    }

    var value = parseInt(document.getElementById(elementID).value);
    value = isNaN(value) ? 0 : value;
    if (value === 2)
        return 40;

    if (value === 3)
        return 100;

    if (value === 4)
        return 180;

    if (value === 5)
        return 280;

    return 0;
}

// function getIntegerValue(elementID) {
//     var value = parseInt(document.getElementById(elementID).value, 10);
//     value = isNaN(value) ? 0 : value;
//     return value;
// }
function getIntegerValue(elementID) {
    const el = document.getElementById(elementID);
    if (!el || el.value === undefined) {
        return 0;
    }

    const value = parseInt(el.value, 10);
    return Number.isNaN(value) ? 0 : value;
}

function getIntegerContent(elementID) {
    var value = parseInt(document.getElementById(elementID).innerHTML, 10);
    value = isNaN(value) ? 0 : value;
    return value;
}
function setValue(elementID, value) {
    document.getElementById(elementID).value = value;
}
function setContent(elementID, value) {
    document.getElementById(elementID).innerHTML = value;
}

// function setRupees(elementID, value) {
//     document.getElementById(elementID).innerHTML = value + " &yen;";
// }
function setRupees(elementID, value) {
    const el = document.getElementById(elementID);
    if (!el) {
        return 0 + " &yen;";
    }

    el.innerHTML = value + " &yen;";
    return 0;
}

// function isChecked(elementID) {
//     return document.getElementById(elementID).checked;
// }
function isChecked(elementID) {
    const el = document.getElementById(elementID);
    return !!(el && el.checked);
}

function hide(elementID) {
    document.getElementById(elementID).style.display = "none";
}
function show(elementID, display) {
    document.getElementById(elementID).style.display = display;
}
function showClass(classId, display) {
    const items = document.getElementsByClassName(classId);
    for (i = 0; i < items.length; i++) {
        items[i].style.display = display;
    }
}
function getCompanies() {
    // Company IDs used throughout the HTML (inputs, spans, and CSS classes)
    return ['jnr', 'npr', 'scr', 'ir', 'bsr', 'jur', 'jrc', 'hr', 'msr', 'esr', 'sr', 'cr', 'cbr'];
}
function calculate() {
    const companies = getCompanies();

    companies.forEach((companyId) => {
        var value = 0;
        var assets = 0;
        var ownSharesHeld = getIntegerValue(companyId + '-ownshares');
        value = getIntegerValue(companyId + '-sharevalue');
        assets += ownSharesHeld * value;
        assets += getIntegerValue(companyId + "-cash");
        assets += getStationValue(companyId + "-stations")
        assets += getPrivateCompanyValue(companyId + "-private")

        if (isChecked(companyId + "-6Ex3")) {
            assets += 1300;
        }
        if (isChecked(companyId + "-4x3")) {
            assets += 1100;
        }
        if (isChecked(companyId + "-3x3")) {
            assets += 900;
        }
        if (isChecked(companyId + "-2x4")) {
            assets += 900;
        }
        if (isChecked(companyId + "-4x2")) {
            assets += 800;
        }
        if (isChecked(companyId + "-3x2")) {
            assets += 700;
        }
        if (isChecked(companyId + "-6")) {
            assets += 600;
        }
        if (isChecked(companyId + "-8")) {
            assets += 700;
        }
        if (isChecked(companyId + "-4_1")) {
            assets += 450;
        }
        if (isChecked(companyId + "-4_2")) {
            assets += 450;
        }
        if (isChecked(companyId + "-4T_1")) {
            assets += 500;
        }
        if (isChecked(companyId + "-4T_2")) {
            assets += 500;
        }
        if (isChecked(companyId + "-3_1")) {
            assets += 300;
        }
        if (isChecked(companyId + "-3_2")) {
            assets += 300;
        }
        if (isChecked(companyId + "-3T_1")) {
            assets += 350;
        }
        if (isChecked(companyId + "-3T_2")) {
            assets += 350;
        }
        if (isChecked(companyId + "-2_1")) {
            assets += 180;
        }
        if (isChecked(companyId + "-2_2")) {
            assets += 180;
        }
        companies.forEach((company) => {
            if (company != companyId && isChecked(companyId + "-" + company + "-share")) {
                assets += getIntegerValue(company + '-sharevalue');
            }
        });
        value += Math.floor(assets / 10);
        setRupees(companyId + '-value', value);
        setRupees(companyId + '-summaryvalue', value);
        setRupees(companyId + '-assetvalue', assets);
    });
    hideCompanies();
}
function updatePlayers() {
    const players = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6'];
    const playerData = [];
    players.forEach((player) => {
        const name = getValue(player + '-name');
        const cash = getIntegerValue(player + '-cash');
        var portfolio = 0;
        setContent(player + "-heading", name);
        const companies = getCompanies();
        companies.forEach((company) => {
            const companyValue = getIntegerContent(company + "-value");
            const playerShares = getIntegerValue(player + "-" + company)
            const value = companyValue * playerShares;
            portfolio += value;
            const valueText = playerShares + " &times; " + companyValue + " &#x20B9; = " + value + " &#x20B9;";
            setContent(player + "-" + company + "-value", valueText);
        });
        const total = cash + portfolio;
        if (total > 0) {
            playerData.push({name: name, cash: cash, portfolio: portfolio, total: total});
        }
    });
    const tableBody = document.getElementById("playersummary").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
    playerData.sort((a, b) => {
        return parseInt(b.total) - parseInt(a.total);
    });
    playerData.forEach((player) => {
        const row = tableBody.insertRow();
        const nameCell = row.insertCell();
        nameCell.innerHTML = player.name;
        nameCell.className = "name";
        const cashCell = row.insertCell();
        cashCell.innerHTML = player.cash + " &#x20B9;";
        const portfolioCell = row.insertCell();
        portfolioCell.innerHTML = player.portfolio + " &#x20B9;";
        const totalCell = row.insertCell();
        totalCell.innerHTML = player.total + " &#x20B9;";
        totalCell.className = "total";
    });
}

function hideCompanies() {
    const companies = getCompanies();
    companies.forEach((company) => {
        if (getIntegerContent(company + "-value") > 0) {
            show(company + "-summary", "flex");
            showClass(company + "-share", "flex");
        }
    });
    element = document.getElementById("companysummary");
    Array.from(element.querySelectorAll(".row")).sort((a, b) => {
        return parseInt(b.querySelector(".value").textContent) - parseInt(a.querySelector(".value").textContent);
    }).forEach(item => {
        console.log(item);
        element.appendChild(item);
    });
}