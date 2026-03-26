const highScoreElement = document.getElementById("high-score");
const scoreElement = document.getElementById("score-board");
const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");

let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreElement.innerHTML = "High Score: " + highScore;

const box = 20; 
let snake, food, score, d, gameActive = false;
let d_next = "right"; 
let smoothX = 0;
let smoothY = 0;
let animationId;

// Speed: 2.0 aakki (Smoothness and Control balance cheyyan)
const moveSpeed = 2.0; 

function initGame() {
    document.getElementById('start-menu').style.display = 'none';
    resetGame();
}

function resetGame() {
    cancelAnimationFrame(animationId);
    snake = [
        { x: 5 * box, y: 10 * box },
        { x: 4 * box, y: 10 * box },
        { x: 3 * box, y: 10 * box }
    ];
    food = {
        x: Math.floor(Math.random() * 14 + 1) * box,
        y: Math.floor(Math.random() * 14 + 1) * box
    };
    score = 0;
    d = "right";
    d_next = "right";
    smoothX = 0;
    smoothY = 0;
    scoreElement.innerHTML = "Score: 0";
    gameActive = true;
    gameLoop();
}

function changeDir(dir) {
    if (!gameActive) return;
    if (dir === "left" && d !== "right") d_next = "left";
    else if (dir === "up" && d !== "down") d_next = "up";
    else if (dir === "right" && d !== "left") d_next = "right";
    else if (dir === "down" && d !== "up") d_next = "down";
}

function gameLoop() {
    if (!gameActive) return;
    update();
    draw();
    animationId = requestAnimationFrame(gameLoop);
}

function update() {
    if (d === "right") smoothX += moveSpeed;
    else if (d === "left") smoothX -= moveSpeed;
    else if (d === "up") smoothY -= moveSpeed;
    else if (d === "down") smoothY += moveSpeed;

    if (Math.abs(smoothX) >= box || Math.abs(smoothY) >= box) {
        smoothX = 0;
        smoothY = 0;
        d = d_next;

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
            gameActive = false;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("snakeHighScore", highScore);
                highScoreElement.innerHTML = "High Score: " + highScore;
            }
            return;
        }
        snake.unshift(newHead);
    }
}

function draw() {
    ctx.fillStyle = "#e0e0e0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Food (Apple look)
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Snake Body Drawing (Continuous Smooth Line)
    ctx.strokeStyle = "#34495e";
    ctx.lineWidth = box - 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();

    // Start drawing from smooth head position
    ctx.moveTo(snake[0].x + smoothX + box/2, snake[0].y + smoothY + box/2);
    
    for (let i = 0; i < snake.length; i++) {
        ctx.lineTo(snake[i].x + box/2, snake[i].y + box/2);
    }
    ctx.stroke();

    // Head Details (Eyes)
    let headX = snake[0].x + smoothX + box/2;
    let headY = snake[0].y + smoothY + box/2;
    
    ctx.fillStyle = "white";
    // Left eye
    ctx.beginPath();
    ctx.arc(headX - 4, headY - 4, 3, 0, Math.PI * 2);
    ctx.fill();
    // Right eye
    ctx.beginPath();
    ctx.arc(headX + 4, headY - 4, 3, 0, Math.PI * 2);
    ctx.fill();

    if (!gameActive) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "bold 22px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", canvas.width/2, canvas.height/2);
    }
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
