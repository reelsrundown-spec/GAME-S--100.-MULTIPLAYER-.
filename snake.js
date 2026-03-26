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

// Speed Control: Smoothness koottaan speed kooduthal slow aakki (1.5)
const moveSpeed = 1.5; 

function initGame() {
    document.getElementById('start-menu').style.display = 'none';
    resetGame();
}

function resetGame() {
    cancelAnimationFrame(animationId);
    // Start with a small body for better look
    snake = [
        { x: 5 * box, y: 10 * box },
        { x: 4 * box, y: 10 * box },
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
    // Smooth transition logic
    if (d === "right") smoothX += moveSpeed;
    else if (d === "left") smoothX -= moveSpeed;
    else if (d === "up") smoothY -= moveSpeed;
    else if (d === "down") smoothY += moveSpeed;

    // When snake reaches the next grid box
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

        // Food collision
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

        // Game Over logic
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
    // Canvas background
    ctx.fillStyle = "#e0e0e0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Food (Small Circle)
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // --- Smooth Rounded Snake Drawing Logic ---

    ctx.fillStyle = "#34495e"; // Snake body color
    
    // Smooth Head Drawing (Round Circle)
    let headX = snake[0].x + smoothX;
    let headY = snake[0].y + smoothY;
    ctx.beginPath();
    ctx.arc(headX + box/2, headY + box/2, box/2, 0, Math.PI * 2);
    ctx.fill();

    // Body Drawing (Draw arcs between segments for smooth connection)
    for (let i = 1; i < snake.length; i++) {
        let prev = snake[i-1];
        let curr = snake[i];
        let next = snake[i+1];

        ctx.beginPath();
        
        // Drawing logic to round corners between blocks
        if (!next) {
            // End of tail: Draw full circle
            ctx.arc(curr.x + box/2, curr.y + box/2, box/2, 0, Math.PI * 2);
        } else {
            // Arcs to connect previous and next segments for rounded corners
            if (prev.x === next.x) {
                // Moving vertical: Draw partial arc
                ctx.arc(curr.x + box/2, curr.y + box/2, box/2, Math.PI / 2, 3 * Math.PI / 2);
            } else if (prev.y === next.y) {
                // Moving horizontal: Draw partial arc
                ctx.arc(curr.x + box/2, curr.y + box/2, box/2, 0, Math.PI);
            } else {
                // Turning: Draw rounded arc
                let dirIn = (prev.x === curr.x) ? 'v' : 'h';
                let dirOut = (curr.x === next.x) ? 'v' : 'h';
                
                if (dirIn === 'h' && dirOut === 'v') {
                   ctx.arc(curr.x + box/2, curr.y + box/2, box/2, Math.PI, 3 * Math.PI / 2);
                } else if (dirIn === 'v' && dirOut === 'h') {
                   ctx.arc(curr.x + box/2, curr.y + box/2, box/2, 0, Math.PI / 2);
                }
            }
        }
        ctx.fill();
    }

    if (!gameActive) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "bold 20px sans-serif";
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
                           
