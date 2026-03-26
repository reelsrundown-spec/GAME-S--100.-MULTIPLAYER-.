const highScoreElement = document.getElementById("high-score");
const scoreElement = document.getElementById("score-board");
const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");

let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreElement.innerHTML = "High Score: " + highScore;

const box = 20; 
let snake, food, score, d, game, gameActive = false;

function initGame() {
    document.getElementById('start-menu').style.display = 'none';
    resetGame();
}

function resetGame() {
    clearInterval(game);
    snake = [{ x: 9 * box, y: 10 * box }];
    food = {
        x: Math.floor(Math.random() * 14 + 1) * box,
        y: Math.floor(Math.random() * 14 + 1) * box
    };
    score = 0;
    d = "right";
    scoreElement.innerHTML = "Score: 0";
    gameActive = true;
    game = setInterval(draw, 200); 
}

function changeDir(dir) {
    if (dir === "left" && d !== "right") d = "left";
    else if (dir === "up" && d !== "down") d = "up";
    else if (dir === "right" && d !== "left") d = "right";
    else if (dir === "down" && d !== "up") d = "down";
}

function draw() {
    ctx.fillStyle = "#e0e0e0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "#2c3e50" : "#34495e";
        ctx.fillRect(snake[i].x, snake[i].y, box - 2, box - 2);
    }

    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === "left") snakeX -= box;
    if (d === "up") snakeY -= box;
    if (d === "right") snakeX += box;
    if (d === "down") snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreElement.innerHTML = "Score: " + score;
        food = {
            x: Math.floor(Math.random() * 14 + 1) * box,
            y: Math.floor(Math.random() * 14 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        gameActive = false; 
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
            highScoreElement.innerHTML = "High Score: " + highScore;
        }
        
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", canvas.width/2, canvas.height/2);
        return;
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

canvas.addEventListener("click", function() {
    if (!gameActive && document.getElementById('start-menu').style.display === 'none') {
        resetGame();
    }
});
  
