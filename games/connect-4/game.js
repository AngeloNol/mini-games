const boardElement = document.getElementById("board");
const message = document.getElementById("message");
const resetButton = document.getElementById("reset-button");

let board = Array(6).fill(null).map(() => Array(7).fill(null));
let currentPlayer = "Red";
let gameOver = false;

function createBoard() {
  boardElement.innerHTML = "";
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      boardElement.appendChild(cell);
    }
  }
}

function drawBoard() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    cell.innerHTML = "";
    if (board[row][col]) {
      const disc = document.createElement("div");
      disc.classList.add("disc", board[row][col]);
      disc.style.transform = "translateY(-300px)";
      requestAnimationFrame(() => {
        disc.style.transform = "translateY(0)";
      });
      cell.appendChild(disc);
    }
  });
}

function getAvailableRow(col) {
  for (let row = 5; row >= 0; row--) {
    if (board[row][col] === null) {
      return row;
    }
  }
  return -1;
}

function handleClick(e) {
  if (gameOver) return;
  const col = parseInt(e.target.dataset.col);
  if (isNaN(col)) return;

  const row = getAvailableRow(col);
  if (row === -1) return;

  board[row][col] = currentPlayer;
  drawBoard();
  checkGameEnd(row, col);
}

function checkGameEnd(row, col) {
  if (checkWin(row, col)) {
    message.textContent = `${currentPlayer} wins!`;
    gameOver = true;
    setTimeout(resetGame, 5000); // 5-second delay on win
  } else if (board.flat().every(cell => cell !== null)) {
    message.textContent = "It's a draw!";
    gameOver = true;
    resetGame(); // Immediate reset on draw
  } else {
    currentPlayer = currentPlayer === "Red" ? "Yellow" : "Red";
  }
}

function checkWin(row, col) {
  const directions = [
    [[0, 1], [0, -1]],  // Horizontal
    [[1, 0], [-1, 0]],  // Vertical
    [[1, 1], [-1, -1]], // Diagonal \
    [[1, -1], [-1, 1]]  // Diagonal /
  ];

  return directions.some(direction => {
    let count = 1;
    direction.forEach(([dx, dy]) => {
      let r = row + dx;
      let c = col + dy;
      while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === currentPlayer) {
        count++;
        r += dx;
        c += dy;
      }
    });
    return count >= 4;
  });
}

function resetGame() {
  board = Array(6).fill(null).map(() => Array(7).fill(null));
  currentPlayer = "Red";
  gameOver = false;
  message.textContent = "";
  drawBoard();
}

boardElement.addEventListener("click", handleClick);
resetButton.addEventListener("click", resetGame);

createBoard();
drawBoard();
