var playerRed = 'R';
var playerYellow = 'Y';
var currPlayer = playerRed; // Red starts the game
var board = [];
var rows = 6;
var columns = 7;

window.onload = function() {
    createBoard();
};

function createBoard() {
    const boardContainer = document.getElementById('board');
    boardContainer.innerHTML = ''; // Clear the board

    // Create the grid structure
    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < columns; c++) {
            board[r][c] = null;
            let tile = document.createElement('div');
            tile.classList.add('tile');
            tile.addEventListener('click', () => placeDisc(c));
            boardContainer.appendChild(tile);
        }
    }
}

function placeDisc(col) {
    for (let r = rows - 1; r >= 0; r--) {
        if (board[r][col] === null) {
            board[r][col] = currPlayer; // Place the player's disc in the lowest empty spot
            updateBoard(r, col, currPlayer);
            checkForWin(r, col);
            currPlayer = currPlayer === playerRed ? playerYellow : playerRed; // Switch turns
            break;
        }
    }
}

function updateBoard(row, col, player) {
    let tile = document.querySelectorAll('.tile')[row * columns + col];  // Select the correct tile based on row and column
    let disc = document.createElement('div');
    disc.className = 'disc'; // Base class for all discs
    if (player === playerRed) {
        disc.classList.add('red-piece'); // Add the 'red-piece' class for red player
    } else {
        disc.classList.add('yellow-piece'); // Add the 'yellow-piece' class for yellow player
    }
    tile.appendChild(disc); // Append the disc to the tile
}

function checkForWin(row, col) {
    if (checkDirection(row, col, 0, 1) + checkDirection(row, col, 0, -1) > 2 ||
        checkDirection(row, col, 1, 0) > 3 ||
        checkDirection(row, col, 1, 1) + checkDirection(row, col, -1, -1) > 2 ||
        checkDirection(row, col, 1, -1) + checkDirection(row, col, -1, 1) > 2) {
        document.getElementById('winner').innerText = `${currPlayer === playerRed ? 'Red' : 'Yellow'} Wins!`;
        setTimeout(() => alert(`${currPlayer === playerRed ? 'Red' : 'Yellow'} wins! Game will reset.`), 10);
        setTimeout(createBoard, 50);
    }
}

function checkDirection(row, col, stepR, stepC) {
    let count = 0;
    let r = row + stepR;
    let c = col + stepC;
    while (r >= 0 && r < rows && c >= 0 && c < columns && board[r][c] === currPlayer) {
        count++;
        r += stepR;
        c += stepC;
    }
    return count;
}
