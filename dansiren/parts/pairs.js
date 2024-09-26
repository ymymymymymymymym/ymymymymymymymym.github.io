main();

function main() {
    document.getElementById("fileInput").addEventListener("change", function(event) {
        const file = event.target.files[0];
        const fileExtension = file.name.split(".").pop().toLowerCase();
        const reader = new FileReader();
        
        reader.onload = function(e) {
            if (fileExtension == "xlsx") {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {type: "array"});

                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                var content = XLSX.utils.sheet_to_csv(worksheet);
            } else {
                var content = e.target.result;
            }

            const membersDiv = document.getElementById("membersBox");
            membersDiv.innerHTML = "";
            
            const lines = content.trim().split("\n");
            const header = lines[0].split(",");
            
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(",");
                const memberName = values[0];
                const memberDiv = document.createElement("label");
                memberDiv.classList.add("member");

                const checkBox = document.createElement("input");
                checkBox.type = "checkbox";
                checkBox.name = "members";
                checkBox.classList.add("memberBox");
                checkBox.value = memberName;
                memberDiv.appendChild(checkBox);

                const dummyInput = document.createElement("span");
                dummyInput.classList.add("dummyInput");
                memberDiv.appendChild(dummyInput);
                
                const label = document.createElement("span");
                label.classList.add("memberLabel");
                label.textContent = memberName;
                memberDiv.appendChild(label);

                membersDiv.appendChild(memberDiv);
                //membersDiv.appendChild(document.createElement("br"));
            }
        };
        
        reader.readAsText(file);
    });

    document.getElementById("generateButton").addEventListener("click", function() {
        const rounds = parseInt(document.getElementById("rounds").value);
        const fileInput = document.getElementById("fileInput");
        const selectedFile = fileInput.files[0];

        if (!selectedFile) {
            alert("CSVファイルを選択してください。");
            return;
        }

        const fileReader = new FileReader();

        fileReader.onload = function(event) {
            const csvData = event.target.result;
            const membersData = parseCSV(csvData);
            const selectedMembers = Array.from(document.querySelectorAll("input[name='members']:checked")).map(checkbox => checkbox.value);
            const selectedMembersData = membersData.filter(member => selectedMembers.includes(member.name));
            const pairs = generatePairs(selectedMembersData, rounds);
            const pairsOutput = pairs.map(roundPairs => roundPairs.map(index => selectedMembersData[index].name));
            displayPairs(pairsOutput);
        };

        fileReader.readAsText(selectedFile);
    });

    //全選択ボタン
    document.getElementById("selectAllBtn").addEventListener("click", function() {
        const membersDiv = document.getElementById("membersBox");
        let membersNames = membersDiv.querySelectorAll(".memberBox");
        let buttonIcon = document.getElementById("selectAllIcon");

        if (buttonIcon.innerText == "done_all") {
            membersNames.forEach(box => {box.checked = true});
            buttonIcon.innerText = "select";
        } else if (buttonIcon.innerText == "select") {
            membersNames.forEach(box => {box.checked = false});
            buttonIcon.innerText = "done_all";
        }
    });
    //スピンボタン
    //document.addEventListener("DOMContentLoaded", function () 
    makeSpinner();
}

function makeSpinner() {
    const roundsInput = document.querySelector("#rounds");
    const spinnerDown = document.querySelector(".spinnerDown");
    const spinnerUp = document.querySelector(".spinnerUp");
    
    const minValue = parseInt(roundsInput.getAttribute("min"));
    const maxValue = parseInt(roundsInput.getAttribute("max"));
    const stepValue = parseInt(roundsInput.getAttribute("step"));

    function updateInputValue(newValue) {
        roundsInput.value = newValue;
        updateButtonStates(newValue);
    }

    function updateButtonStates(value) {
        spinnerDown.classList.toggle("disabled", value <= minValue);
        spinnerUp.classList.toggle("disabled", value >= maxValue);
    }

    spinnerDown.addEventListener("click", function () {
        const currentValue = parseInt(roundsInput.value);
        if (currentValue > minValue) {
            updateInputValue(currentValue - stepValue);
        }
    });

    spinnerUp.addEventListener("click", function () {
        const currentValue = parseInt(roundsInput.value);
        if (currentValue < maxValue) {
            updateInputValue(currentValue + stepValue);
        }
    });

    // 初期状態のボタンステートを更新
    updateButtonStates(parseInt(roundsInput.value));
} //);

document.getElementById("copyButton").addEventListener("click", function() {
    let output = [];
    let table = document.getElementById("pairsTable");
    let rows = table.querySelectorAll("tr");
    rows.forEach(row => {
        let rowText = [];
        let cells = row.querySelectorAll("td");
        cells.forEach(cell => {
            rowText.push(cell.innerHTML);
        });

        rowText = rowText.join("\t")
        output.push(rowText);
    })

    output = output.join("\n");
    if (!navigator.clipboard) {
        alert("クリップボードにコピーできませんでした。");
        return false;
    }
    navigator.clipboard.writeText(output);
    return true;
});

function parseCSV(csvData) {
    const lines = csvData.trim().split("\n");
    const header = lines[0].split(",");
    return lines.slice(1).map(line => {
        const values = line.split(",");
        return Object.fromEntries(header.map((key, i) => [key, values[i]]));
    });
}

function generatePairs(members, nGames) {
    const players = members.map(member => ({ ...member, games: 0 }));
    const sum = nGames * 8;

    // Calculate base games and remaining games for each grade
    const grades = Array.from({ length: 7 }, (_, i) => i + 1);
    const baseGames = Math.floor(sum / players.length);

    players.forEach(player => player.games+=baseGames);

    let remainingGames = sum % players.length;

    for (const grade of grades) {
        const gradePlayers = players.filter(player => player.grade == grade);

        if (remainingGames >= gradePlayers.length) {
            gradePlayers.forEach(player => player.games++);
            remainingGames -= gradePlayers.length;
        } else if (remainingGames > 0) {
            const randomIndexes = getRandomIndexes(gradePlayers.length, remainingGames);
            randomIndexes.forEach(index => gradePlayers[index].games++);
            remainingGames = 0;
        } else {
            break;
        }
    }

    // Generate opponents for each round
    const opponents = makeOpponents(players, nGames);

    // Assign players to pairs based on opponent numbers
    const pairs = [];
    for (let i=0; i<nGames; i++) {
        const roundPairs = getPairIndexList().map(index => opponents[i][index])
        pairs.push(roundPairs);
    }
    return pairs;
}

function makeOpponents(players, nGames) {
    let gamesList = players.map(player => player.games);
    let opponents = Array.from({length: nGames}, (_,i) => Array(8));
    for (let i = 0; i < nGames; i++) {
        const baseProbabilities = Array.from({length: players.length}, (_, j) => gamesList[j] / gamesList.reduce((sum, value) => sum + value, 0));
        
        if (baseProbabilities.filter(element => element>0).length < 8) {
            opponents = makeOpponents(players, nGames);
            break
        };
        opponents[i] = getRandomIndicesWithProbability(baseProbabilities, 8);
        opponents[i].forEach(element => gamesList[element]--);
    }
    return opponents;
}

function getRandomIndexes(maxIndex, count) {
    const indexes = Array.from({ length: maxIndex }, (_, i) => i);
    for (let i = indexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
    }
    return indexes.slice(0, count);
}

function getRandomIndicesWithProbability(probabilities, size) {
    let result = [];
    const selectedList = new Set();
    while (selectedList.size < size) {
        const selectedIndex = getRandomIndexWithProbability(probabilities);
        selectedList.add(selectedIndex);
        result.push(selectedIndex);
    }

    result = Array.from(new Set(result));
    result.sort((a,b) => a - b);

    return result;
}

function getRandomIndexWithProbability(probabilities) {
    const randomValue = Math.random() * probabilities.reduce((sum, value) => sum + value, 0);
    let cumulativeProbability = 0;

    for (let i = 0; i < probabilities.length; i++) {
        cumulativeProbability += probabilities[i];
        if (randomValue <= cumulativeProbability) {
            return i;
        }
    }
}

function getPairIndexList() {
    let result0 = [];
    result0.push(0);
    result0.push(...(getRandomIndicesWithProbability([0.5, 0.3, 0.2], 2).map(e => e+1)));
    result0.push(getRandomIndexWithProbability([0.5,0.5]) + result0[2] + 1);
    
    let result1 = [...Array(8).keys()].filter(element => !result0.includes(element));

    //ペアを決める
    result0 = [result0[0], result0[3], result0[1], result0[2]];
    result1 = [result1[0], result1[3], result1[1], result1[2]];

    if (Math.random() < 0.5) {
        return result0.concat(result1);
    } else {
        return result1.concat(result0);
    }
}

function displayPairs(pairs) {
    const pairsTable = document.getElementById("pairsTable");
    pairsTable.innerHTML = "";

    const headerList = ["","東面","","","","","","西面","","","",""];
    const headerRow = document.createElement("tr");
    headerList.forEach((content) => {
        const headerCell = document.createElement("td");
        headerCell.textContent = content;
        headerCell.contentEditable = true;
        headerRow.appendChild(headerCell);
    });
    pairsTable.appendChild(headerRow);

    pairs = pairs.map((roundPairs, i) => {
        roundPairs.unshift(i+1);
        roundPairs.splice(3, 0, "vs");
        roundPairs.splice(6, 0, "");
        roundPairs.splice(9, 0, "vs");
        return roundPairs;
    });

    pairs.forEach((roundPairs, i) => {
        const roundRow = document.createElement("tr");
        roundPairs.forEach((content) => {
            const roundCell = document.createElement("td");
            roundCell.textContent = content;
            roundCell.contentEditable = true;
            roundRow.appendChild(roundCell);
        });
        pairsTable.appendChild(roundRow)
    });
}