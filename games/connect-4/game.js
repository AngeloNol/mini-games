// Constants
const ROWS = 6;
const COLS = 7;

// Game state
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let currentPlayer = "red";

// DOM elements
const boardElement = document.getElementById("board");
const message = document.getElementById("message");
const resetBtn = document.getElementById("resetBtn");

// Create the game board
function createBoard() {
  boardElement.innerHTML = '';

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", () => handleCellClick(col));
      boardElement.appendChild(cell);
    }
  }
}

// Handle a column click
function handleCellClick(col) {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === null) {
      board[row][col] = currentPlayer;
      const cell = getCellElement(row, col);
      
      // Add disc color and falling animation
      cell.classList.add("falling");
      cell.classList.add(currentPlayer);

      // Remove falling class after animation
      setTimeout(() => {
        cell.classList.remove("falling");
      }, 500); // Match CSS animation duration

      if (checkWin(row, col)) {
        message.textContent = `${currentPlayer.toUpperCase()} wins!`;
        disableBoard();
        setTimeout(resetGame, 3000); // auto-reset after win
        return;
      } else if (isDraw()) {
        message.textContent = "It's a draw!";
        setTimeout(resetGame, 1000); // auto-reset after draw
        return;
      }

      // Switch player
      currentPlayer = currentPlayer === "red" ? "yellow" : "red";
      return;
    }
  }

  alert("Column is full!");
}

// Get a cell element by row and column
function getCellElement(row, col) {
  return document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
}

// Check win conditions
function checkWin(row, col) {
  return (
    checkDirection(row, col, 0, 1) ||  // horizontal
    checkDirection(row, col, 1, 0) ||  // vertical
    checkDirection(row, col, 1, 1) ||  // diagonal /
    checkDirection(row, col, 1, -1)    // diagonal \
  );
}

// Check a direction for 4 in a row
function checkDirection(row, col, rowDir, colDir) {
  let count = 1;
  count += countDiscs(row, col, rowDir, colDir);
  count += countDiscs(row, col, -rowDir, -colDir);
  return count >= 4;
}

// Count consecutive discs in one direction
function countDiscs(row, col, rowDir, colDir) {
  let r = row + rowDir;
  let c = col + colDir;
  let count = 0;

  while (
    r >= 0 && r < ROWS &&
    c >= 0 && c < COLS &&
    board[r][c] === currentPlayer
  ) {
    count++;
    r += rowDir;
    c += colDir;
  }

  return count;
}

// Check for a draw
function isDraw() {
  return board.flat().every(cell => cell !== null);
}

// Disable all cells (after win)
function disableBoard() {
  const clone = boardElement.cloneNode(true);
  boardElement.replaceWith(clone);
}

// Reset game state
function resetGame() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  currentPlayer = "red";
  message.textContent = "";
  createBoard();
}

// Manual reset
resetBtn.addEventListener("click", resetGame);

// Start game
createBoard();
