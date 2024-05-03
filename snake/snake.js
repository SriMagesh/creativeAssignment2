// Board setup
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

// Snake head and body
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;
var velocityX = 0;
var velocityY = 0;
var snakeBody = [];

// Food and power-ups
var foodX;
var foodY;
var powerUpX;
var powerUpY;
var powerUpActive = false;
var powerUpType = '';

// Game control
var gameOver = false;
var level = 1;
var score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");

    placeFood();
    placePowerUp();
    document.addEventListener("keyup", changeDirection);
    setInterval(update, 1000/10); // 100 milliseconds
}

function update() {
    if (gameOver) {
        return;
    }

    // Clear the board
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    // Draw food
    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    // Draw power-ups
    if (powerUpActive) {
        context.fillStyle = powerUpType === 'speed' ? 'blue' : 'green';
        context.fillRect(powerUpX, powerUpY, blockSize, blockSize);
    }

    // Snake eats food
    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
        score += 10;
        document.getElementById('score').innerText = score;

        // Increase level based on length
        if (snakeBody.length % 10 === 0) {
            level++;
            document.getElementById('level').innerText = level;
        }
    }

    // Snake eats power-up
    if (powerUpActive && snakeX == powerUpX && snakeY == powerUpY) {
        activatePowerUp(powerUpType);
        powerUpActive = false;
    }

    // Move the snake
    moveSnake();

    // Draw the snake
    context.fillStyle = "lime";
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    // Check game over conditions
    checkGameOver();
}

function changeDirection(e) {
    // Prevent reverse direction
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function placeFood() {
    // Random placement within board boundaries
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function placePowerUp() {
    // Random placement and random type
    powerUpX = Math.floor(Math.random() * cols) * blockSize;
    powerUpY = Math.floor(Math.random() * rows) * blockSize;
    powerUpType = Math.random() > 0.5 ? 'speed' : 'slow';
    powerUpActive = true;
}

function moveSnake() {
    // Update snake body positions
    for (let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
}

function checkGameOver() {
    // Boundary and self-collision checks
    if (snakeX < 0 || snakeX > cols*blockSize || snakeY < 0 || snakeY > rows*blockSize || snakeBody.some(block => block[0] === snakeX && block[1] === snakeY)) {
        gameOver = true;
        alert("Game Over");
    }
}

function activatePowerUp(type) {
    // Modify game speed based on power-up type
    if (type === 'speed') {
        clearInterval(updateInterval);
        updateInterval = setInterval(update, 1000/15);
    } else if (type === 'slow') {
        clearInterval(updateInterval);
        updateInterval = setInterval(update, 1000/5);
    }
}

function changeTheme() {
    var body = document.body;
    if (body.className === 'nighttime') {
        body.className = 'daytime';
    } else {
        body.className = 'nighttime';
    }
}

var updateInterval = setInterval(update, 1000/10); // Main game loop
