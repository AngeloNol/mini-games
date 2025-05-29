//store the game state: each cell can be empty, 'X', or 'O'
let board = Array(9).fill(null);

// 'x' always starts first
let currentPlayer = 'X';

// Reference to all cell elements (assuming 9 divs with class 'cell')
const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetbtn = document.getElementById('reset-btn');

// Winning combinations
const winPatterns = [
  [0, 1, 2], // top Row 
  [3, 4, 5], // middle Row 
  [6, 7, 8], // bottom Row 
  [0, 3, 6], // left Column 
  [1, 4, 7], // middle Column
  [2, 5, 8], // right Column 
  [0, 4, 8], // Diagonal \
  [2, 4, 6]  // Diagonal /
];

// Attach click handlers to each cell
cells.forEach((cell, index) => {
  cell.addEventListener('click', () => handleCellClick(index));
});

// Reset the game when the reset button is clicked
//resetbtn.addEventListener('click', resetGame);

// handle cell click
function handleCellClick(index) {
    // If the cell is already filled or the game is over, do nothing
    if (board[index] || checkWinner()) {
        return;
    }

    //update game state
    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;

    //check for win or draw
    if( checkWinner() ) {
        message.textContent = `${currentPlayer} wins!`;
        disableBoard(); // prevent further clicks
        setTimeout(resetGame, 5000); // reset after 5 seconds
    }else if (board.every(cell => cell)){
        message.textContent = "It's a draw!";
        //reset immediately
        setTimeout(resetGame, 1000); // reset after 1 seconds
    }else {
        //switch players
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

//check if there's a winner 
function checkWinner() {
    return winPatterns.some(([a, b, c]) => {
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

// Function to disable the board
function disableBoard() {
    cells.forEach(cell => {
        cell.style.pointerEvents = 'none'; // Disable further clicks
    });
}   

//Reset the game state
function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    message.textContent = '';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.pointerEvents = 'auto'; // Ensure cells are clickable again
    });
}