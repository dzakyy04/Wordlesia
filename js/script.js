var width = 5;
var height = 6;
var row = 0;
var col = 0;

var word = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
var gameOver = false;

// rules
const question = document.querySelector(".fa-question")
const rules = document.querySelector(".rules");
const rulesClose = document.querySelector(".rules .close");

rulesClose.addEventListener("click", function () {
    rules.style.display = "none";
    localStorage.setItem("showRules", "off");
});

question.addEventListener("click", function () {
    rules.style.display = "block";
});

// Result
const result = document.querySelector(".result");
const winOrLose = document.querySelector(".result h4"); // Win or Lose
const data = document.querySelector(".data"); // Number of guesses
const answer = document.querySelector("#wordIs"); // 
const keyWord = document.querySelector("#keyword");
const button = document.querySelector(".result button");


const resultClose = document.querySelector(".result .close");
resultClose.addEventListener("click", function () {
    result.style.display = "none";
});

button.addEventListener("click", function () {
    window.location.reload();
});


// Not Enough words
const notEnough = document.querySelector(".notEnough");
const notEnoughP = document.querySelector(".notEnough p");
const notEnoughClose = document.querySelector(".notEnough .close");

notEnoughClose.addEventListener("click", function () {
    notEnough.style.display = "none";
});

// Nothing words
const nothing = document.querySelector(".nothing");
const nothingP = document.querySelector(".nothing p");
const nothingClose = document.querySelector(".nothing .close");

nothingClose.addEventListener("click", function () {
    nothing.style.display = "none";
});


// Setting
const hamburger = document.querySelector(".fa-bars")
const setting = document.querySelector(".setting");
const settingClose = document.querySelector(".setting .close");

settingClose.addEventListener("click", function () {
    setting.style.display = "none";
});

hamburger.addEventListener("click", function () {
    setting.style.display = "block";
});

// Toggle
const toggleDark = document.querySelector(".toggle-checkbox.dark");
toggleDark.addEventListener("change", () => {
    if (toggleDark.checked == true) {
        darkModeOn();
        localStorage.setItem("theme", "dark");
    } else {
        darkModeOff();
        localStorage.removeItem("theme");
    }
});

// Swap key
const toggleSwap = document.querySelector(".toggle-checkbox.swap");
const enterKey = document.getElementById("Enter");
const backSpaceKey = document.getElementById("Backspace");
toggleSwap.addEventListener("change", () => {
    if (toggleSwap.checked == true) {
        swapElements(enterKey, backSpaceKey);
    } else {
        swapElements(backSpaceKey, enterKey);
    }
});

// Surrender
const surrButton = document.querySelector("#surrend");
surrButton.addEventListener("click", () => {
    setting.style.display = "none";
    gameOver = true;
    isLose();
});



// Onload
window.onload = function () {
    init();

    if (localStorage.getItem("showRules") == "off") {
        rules.style.display = "none";
    } else {
        rules.style.display = "block";
    }

    if (localStorage.getItem("theme") == "dark") {
        darkModeOn();
        toggleDark.checked = true;
    } else {
        darkModeOff();
    }
}

function init() {
    // Gameboard
    const board = document.querySelector(".board");
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            const tile = document.createElement("span");
            tile.setAttribute("id", r + "-" + c);
            tile.classList.add("rowTile-" + r)
            tile.classList.add("tile");
            tile.innerText = "";
            board.appendChild(tile);
        }
    }

    // Keyboard
    let keyboard = [
        "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
        "A", "S", "D", "F", "G", "H", "J", "K", "L",
        "Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"
    ];

    // Keypass
    // --> click
    const keyTile = document.querySelectorAll(".keyTile");
    for (let i = 0; i < keyTile.length; i++) {
        keyTile[i].addEventListener("click", function () {
            if (gameOver == true) return;

            if (keyTile[i].id == "Enter") {
                enter();
            } else if (keyTile[i].id == "Backspace") {
                backspace();
            } else {
                keyPress(keyboard[i]);
            }

            // Game selesai
            if (!gameOver && row == height) {
                gameOver = true;
                isLose();
            }
        });
    }

    // --> keyup
    document.addEventListener("keyup", function (e) {
        if (gameOver == true) return;
        if (e.code == "Enter") {
            enter();
        } else if (e.code == "Backspace") {
            backspace();
        } else if (e.code[0] == "K" && e.code[1] == "e" && e.code[2] == "y" && col < width) {
            keyPress(e.code[3]);
        }

        // Game selesai
        if (!gameOver && row == height) {
            gameOver = true;
            isLose();
        }
    });

}

// check text
function check() {
    // Build a guess word
    let correct = 0;
    let guess = "";

    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;
        guess += letter;
    }

    let lowGuess = guess.toLowerCase(); //case sensitive
    if (!guessList.includes(lowGuess)) {
        nothing.style.display = "flex";
        nothingP.innerText = "Kata tidak ada di kamus";
        errorTile();
        return;
    }


    // Start processing game
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < width; j++) {
            let currTile = document.getElementById(row + "-" + i);
            let keyTile = document.getElementById("Key" + guess[i]);
            if (guess[i] == word[j]) {
                if (i == j) {
                    currTile.classList.add("correct");
                    keyTile.classList.add("correct");
                    currTile.classList.remove("inputLetter");
                    correct++;
                } else {
                    currTile.classList.add("present");
                    keyTile.classList.add("present");
                    currTile.classList.remove("inputLetter");
                }
            } else {
                currTile.classList.add("absent");
                keyTile.classList.add("absent");
                currTile.classList.remove("inputLetter");
            }
        }
    }

    if (correct == width) {
        gameOver = true;
        isWin();
    }

    // Move row and reset column
    row++;
    col = 0;
}

function isWin() {
    result.style.display = "flex";
    winOrLose.innerText = "KAMU MENANG";
    data.innerText = "Kamu menang dalam " + (row + 1) + " percobaan";
    answer.innerText = word;
    keyWord.href = "https://kbbi.kemdikbud.go.id/entri/" + word;
}

function isLose() {
    result.style.display = "flex";
    winOrLose.innerText = "KAMU KALAH";
    data.innerText = "Kamu kalah setelah " + row + " percobaan";
    answer.innerText = word;
    keyWord.href = "https://kbbi.kemdikbud.go.id/entri/" + word;
}

function errorTile() {
    const rowTile = document.querySelectorAll(".rowTile-" + row);
    for (let i = 0; i < rowTile.length; i++) {
        rowTile[i].style.animation = "shake .3s";
        setTimeout(() => {
            rowTile[i].removeAttribute("style");
        }, 300);
    }
}

function inputTile(currTile) {
    currTile.style.animation = "input .3s";
    setTimeout(() => {
        currTile.removeAttribute("style");
    }, 300);
}

// Keyboard function
function enter() {
    if (col < width) {
        notEnough.style.display = "flex";
        notEnoughP.innerText = "Kata tidak cukup";
        errorTile();
    } else {
        check();
    }
}

function backspace() {
    if (col > 0 && col <= width) {
        col--;
    }
    let currTile = document.getElementById(row + "-" + col);
    currTile.classList.remove("inputLetter");
    currTile.innerText = "";
}

function keyPress(value) {
    if (col < width) {
        let currTile = document.getElementById(row + "-" + col);
        currTile.innerText = value;
        currTile.classList.add("inputLetter");
        inputTile(currTile);
        col++;
    }
}

function darkModeOn() {
    // Tile
    const tile = document.querySelectorAll(".tile");
    for (let i = 0; i < tile.length; i++) {
        tile[i].classList.add("tile-darkMode");
    }
    // Keyboard
    const keyTile = document.querySelectorAll(".keyTile");
    for (let i = 0; i < keyTile.length; i++) {
        keyTile[i].classList.add("keyTile-darkMode");
    }
    // Result
    winOrLose.style.backgroundColor = "rgb(49,52,72)";
    // Body
    document.body.classList.add("darkMode");
}

function darkModeOff() {
    // Tile
    const tile = document.querySelectorAll(".tile");
    for (let i = 0; i < tile.length; i++) {
        tile[i].classList.remove("tile-darkMode");
    }
    // Keyboard
    const keyTile = document.querySelectorAll(".keyTile");
    for (let i = 0; i < keyTile.length; i++) {
        keyTile[i].classList.remove("keyTile-darkMode");
    }
    // Result
    winOrLose.style.backgroundColor = "rgb(243, 241, 234)";
    // Body
    document.body.classList.remove("darkMode");
}

function swapElements(el1, el2) {
    let prev1 = el1.previousSibling;
    let prev2 = el2.previousSibling;

    prev1.after(el2);
    prev2.after(el1);
}