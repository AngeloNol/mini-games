const canvas = document.getElementById("hangman");
const ctx = canvas.getContext("2d");
const wordDisplay = document.getElementById("word");
const lettersDiv = document.getElementById("letters");
const resetBtn = document.getElementById("reset");
const messageDiv = document.getElementById("message");
const topicSelect = document.getElementById("topic-select");
const customWordInput = document.getElementById("custom-word");
const startCustomBtn = document.getElementById("start-custom");
const customWordContainer = document.getElementById("custom-word-container");

const wordCategories = {
  animals: ["elephant", "giraffe", "alligator", "kangaroo", "penguin"],
  fruits: ["apple", "banana", "strawberry", "pineapple", "mango"]
};

const drawSteps = [
  () => { ctx.lineWidth = 4; ctx.strokeStyle = "#000"; ctx.beginPath(); ctx.moveTo(10, 230); ctx.lineTo(190, 230); ctx.stroke(); },
  () => { ctx.beginPath(); ctx.moveTo(50, 230); ctx.lineTo(50, 20); ctx.stroke(); },
  () => { ctx.beginPath(); ctx.moveTo(50, 20); ctx.lineTo(150, 20); ctx.stroke(); },
  () => { ctx.beginPath(); ctx.moveTo(150, 20); ctx.lineTo(150, 50); ctx.stroke(); },
  () => { ctx.beginPath(); ctx.arc(150, 70, 20, 0, Math.PI * 2); ctx.stroke(); },
  () => { ctx.beginPath(); ctx.moveTo(150, 90); ctx.lineTo(150, 150); ctx.stroke(); },
  () => { ctx.beginPath(); ctx.moveTo(150, 100); ctx.lineTo(120, 130); ctx.stroke(); },
  () => { ctx.beginPath(); ctx.moveTo(150, 100); ctx.lineTo(180, 130); ctx.stroke(); },
  () => { ctx.beginPath(); ctx.moveTo(150, 150); ctx.lineTo(120, 190); ctx.stroke(); },
  () => { ctx.beginPath(); ctx.moveTo(150, 150); ctx.lineTo(180, 190); ctx.stroke(); }
];

let selectedWord = "";
let guessedLetters = new Set();
let wrongGuesses = 0;
let letterButtons = {};

function selectWord() {
  const topic = topicSelect.value;
  if (topic && wordCategories[topic]) {
    const words = wordCategories[topic];
    return words[Math.floor(Math.random() * words.length)].toLowerCase();
  }
  return "";
}

function normalizeWord(word) {
  return word.toLowerCase().replace(/[^a-z\s]/g, "");
}

function init(custom = null) {
  if (custom) {
    selectedWord = normalizeWord(custom);
  } else {
    selectedWord = selectWord();
  }

  if (!selectedWord) {
    messageDiv.textContent = "Please select a topic or enter a word.";
    wordDisplay.textContent = "";
    lettersDiv.innerHTML = "";
    resetCanvas();
    resetBtn.disabled = true;
    return;
  }

  guessedLetters.clear();
  wrongGuesses = 0;
  resetCanvas();
  updateWordDisplay();
  createLetterButtons();
  messageDiv.textContent = "";
  resetBtn.disabled = false;
}

function resetCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateWordDisplay() {
  const display = selectedWord.split("").map(l => {
    if (l === " ") return " ";
    return guessedLetters.has(l) ? l.toUpperCase() : "_";
  }).join(" ");
  wordDisplay.textContent = display;
}

function createLetterButtons() {
  lettersDiv.innerHTML = "";
  letterButtons = {};

  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i).toLowerCase();
    const btn = document.createElement("button");
    btn.textContent = letter.toUpperCase();
    btn.addEventListener("click", () => guessLetter(letter, btn));
    letterButtons[letter] = btn;
    lettersDiv.appendChild(btn);
  }
}

function guessLetter(letter, btn) {
  if (guessedLetters.has(letter)) return;

  guessedLetters.add(letter);
  btn.disabled = true;

  if (selectedWord.includes(letter)) {
    updateWordDisplay();
    checkWin();
  } else {
    wrongGuesses++;
    drawSteps[wrongGuesses - 1]();
    checkLose();
  }
}

function checkWin() {
  const won = selectedWord.split("").every(char => char === " " || guessedLetters.has(char));
  if (won) {
    messageDiv.textContent = "🎉 You Won!";
    disableAllButtons();
  }
}

function checkLose() {
  if (wrongGuesses === drawSteps.length) {
    messageDiv.textContent = `😢 You Lost! Word: ${selectedWord.toUpperCase()}`;
    updateWordDisplay();
    disableAllButtons();
  }
}

function disableAllButtons() {
  const buttons = lettersDiv.querySelectorAll("button");
  buttons.forEach(btn => btn.disabled = true);
}

topicSelect.addEventListener("change", () => {
  customWordInput.value = "";
  customWordContainer.style.display = "block";
  init();
});

startCustomBtn.addEventListener("click", () => {
  const custom = customWordInput.value.trim();
  if (!custom) {
    messageDiv.textContent = "Please enter a word or sentence.";
    return;
  }
  topicSelect.value = "";
  customWordContainer.style.display = "none";
  init(custom);
});

resetBtn.addEventListener("click", () => {
  customWordContainer.style.display = "block";
  customWordInput.value = "";
  init();
});

// Keyboard input support
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (/^[a-z]$/.test(key)) {
    const btn = letterButtons[key];
    if (btn && !btn.disabled) {
      btn.click();
    }
  }
});

init();
