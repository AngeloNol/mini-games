// DOM Elements
const boardElement = document.getElementById("board");
const message = document.getElementById("message");
const resetButton = document.getElementById("reset-button");

// Game Constants
const ROWS = 6;
const COLS = 7;

// Game State
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let currentPlayer = "Red";
let gameOver = false;

// Create and render the board cells
function createBoard() {
  boardElement.innerHTML = "";

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      boardElement.appendChild(cell);
    }
  }
}

// Get the first available row in the selected column
function getAvailableRow(col) {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!board[row][col]) {
      return row;
    }
  }
  return null;
}

// Drop a disc with falling animation
function dropDisc(row, col, color) {
  const cell = document.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`
  );
  const disc = document.createElement("div");
  disc.classList.add("disc", color);
  cell.appendChild(disc);
}

// Check for a win starting from a given cell
function checkWin(row, col) {
  const directions = [
    [0, 1],  // Horizontal
    [1, 0],  // Vertical
    [1, 1],  // Diagonal \
    [1, -1], // Diagonal /
  ];

  for (let [dx, dy] of directions) {
    let count = 1;

    count += countDirection(row, col, dx, dy);
    count += countDirection(row, col, -dx, -dy);

    if (count >= 4) return true;
  }

  return false;
}

// Count discs in a direction
function countDirection(row, col, dx, dy) {
  let r = row + dx;
  let c = col + dy;
  let count = 0;

  while (
    r >= 0 &&
    r < ROWS &&
    c >= 0 &&
    c < COLS &&
    board[r][c] === currentPlayer
  ) {
    count++;
    r += dx;
    c += dy;
  }

  return count;
}

// Handle a player's move
function handleClick(e) {
  if (gameOver || !e.target.classList.contains("cell")) return;

  const col = parseInt(e.target.dataset.col);
  const row = getAvailableRow(col);

  if (row === null) return;

  // Update game state
  board[row][col] = currentPlayer;
  dropDisc(row, col, currentPlayer);

  // Check for win
  if (checkWin(row, col)) {
    message.textContent = `${currentPlayer} wins!`;
    gameOver = true;
    setTimeout(resetGame, 5000); // Delay reset after win
    return;
  }

  // Check for draw
  if (board.flat().every(cell => cell !== null)) {
    message.textContent = "It's a draw!";
    gameOver = true;
    resetGame(); // Reset immediately on draw
    return;
  }

  // Switch player
  currentPlayer = currentPlayer === "Red" ? "Yellow" : "Red";
}

// Reset the board state and UI
function resetGame() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  currentPlayer = "Red";
  gameOver = false;
  message.textContent = "";
  createBoard();
}

// Initialize the game
createBoard();
boardElement.addEventListener("click", handleClick);
resetButton.addEventListener("click", resetGame);
