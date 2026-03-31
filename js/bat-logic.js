const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("scoreVal");

canvas.width = 320; 
canvas.height = 380;

let batSize = 1.5; 
let batX = canvas.width / 2;
let batY = canvas.height / 2;
let speed = 4;
let frame = 0;
let isGameOver = false;

let food = {
    x: Math.random() * (canvas.width - 40) + 20,
    y: Math.random() * (canvas.height - 40) + 20
};

let stones = [];
let score = 0;
let foodCounter = 0;
let direction = "STATIONARY";

function changeDir(d) {
    if(!isGameOver) direction = d;
}

function drawPixelBat(x, y, scale) {
    ctx.fillStyle = "#333";
    frame++;
    let wingPos = Math.sin(frame * 0.2) > 0 ? 0 : 2;
    ctx.fillRect(x - (2 * scale), y, 4 * scale, 4 * scale);
    ctx.fillRect(x - (8 * scale), y - (wingPos * scale), 6 * scale, 2 * scale);
    ctx.fillRect(x + (2 * scale), y - (wingPos * scale), 6 * scale, 2 * scale);
    ctx.fillRect(x - (2 * scale), y - (2 * scale), scale, scale);
    ctx.fillRect(x + (scale), y - (2 * scale), scale, scale);
    ctx.fillStyle = "white";
    ctx.fillRect(x - scale, y + scale, scale, scale);
    ctx.fillRect(x + scale, y + scale, scale, scale);
}

function update() {
    if(isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "20px serif";
    ctx.fillText("🦟", food.x, food.y);

    for (let i = 0; i < stones.length; i++) {
        ctx.fillText("🌑", stones[i].x, stones[i].y);
        stones[i].y += 3;
        let dist = Math.hypot(stones[i].x - batX, stones[i].y - batY);
        if (dist < (batSize * 10)) {
            endGame();
        }
    }

    if (direction === "UP") batY -= speed;
    if (direction === "DOWN") batY += speed;
    if (direction === "LEFT") batX -= speed;
    if (direction === "RIGHT") batX += speed;

    if (batX < 0) batX = canvas.width;
    if (batX > canvas.width) batX = 0;
    if (batY < 0) batY = canvas.height;
    if (batY > canvas.height) batY = 0;

    drawPixelBat(batX, batY, batSize);

    let distToFood = Math.hypot(batX - food.x, batY - food.y);
    if (distToFood < (batSize * 10) + 10) {
        score++;
        foodCounter++;
        scoreElement.innerHTML = score;
        batSize += 0.2; 
        food = {
            x: Math.random() * (canvas.width - 40) + 20,
            y: Math.random() * (canvas.height - 40) + 20
        };
        if (foodCounter % 5 === 0) {
            stones.push({ x: Math.random() * canvas.width, y: 0 });
        }
    }

    requestAnimationFrame(update);
}

function endGame() {
    isGameOver = true;
    
    // Dim background
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Game Over Text
    ctx.fillStyle = "#ff7675";
    ctx.font = "bold 30px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2 - 40);
    
    // Score Text
    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.fillText("Score: " + score, canvas.width/2, canvas.height/2);

    // Restart and Home Buttons
    drawButton("RESTART", canvas.width/2, canvas.height/2 + 50, "#00cec9");
    drawButton("HOME", canvas.width/2, canvas.height/2 + 100, "#a29bfe");

    canvas.addEventListener("click", handleGameOverClick);
}

function drawButton(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x - 60, y - 15, 120, 30);
    ctx.fillStyle = "black";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(text, x, y + 5);
}

function handleGameOverClick(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Check Restart Button (y+50)
    if (clickX > canvas.width/2 - 60 && clickX < canvas.width/2 + 60 &&
        clickY > canvas.height/2 + 35 && clickY < canvas.height/2 + 65) {
        location.reload();
    }
    
    // Check Home Button (y+100)
    if (clickX > canvas.width/2 - 60 && clickX < canvas.width/2 + 60 &&
        clickY > canvas.height/2 + 85 && clickY < canvas.height/2 + 115) {
        window.location.href = "home.html";
    }
}

update();
