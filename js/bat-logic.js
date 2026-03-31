const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("scoreVal");

canvas.width = 320; 
canvas.height = 380;

let batSize = 1.5; // Scale for pixel art
let batX = canvas.width / 2;
let batY = canvas.height / 2;
let speed = 4;
let frame = 0; // For animation

let food = {
    x: Math.random() * (canvas.width - 40) + 20,
    y: Math.random() * (canvas.height - 40) + 20
};

let stones = [];
let score = 0;
let foodCounter = 0;
let direction = "STATIONARY";

function changeDir(d) {
    direction = d;
}

// Function to draw pixelated bat
function drawPixelBat(x, y, scale) {
    ctx.fillStyle = "#333";
    frame++;

    // Simple pixel animation logic
    let wingPos = Math.sin(frame * 0.2) > 0 ? 0 : 2;

    // Body
    ctx.fillRect(x - (2 * scale), y, 4 * scale, 4 * scale);
    
    // Wings (Animated)
    ctx.fillRect(x - (8 * scale), y - (wingPos * scale), 6 * scale, 2 * scale);
    ctx.fillRect(x + (2 * scale), y - (wingPos * scale), 6 * scale, 2 * scale);
    
    // Ears
    ctx.fillRect(x - (2 * scale), y - (2 * scale), scale, scale);
    ctx.fillRect(x + (scale), y - (2 * scale), scale, scale);

    // Eyes
    ctx.fillStyle = "white";
    ctx.fillRect(x - scale, y + scale, scale, scale);
    ctx.fillRect(x + scale, y + scale, scale, scale);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Mosquito
    ctx.font = "20px serif";
    ctx.fillText("🦟", food.x, food.y);

    // Draw Stones
    for (let i = 0; i < stones.length; i++) {
        ctx.fillText("🌑", stones[i].x, stones[i].y);
        stones[i].y += 3;

        let dist = Math.hypot(stones[i].x - batX, stones[i].y - batY);
        if (dist < (batSize * 10)) {
            alert("Game Over! Score: " + score);
            location.reload();
        }
    }

    // Movement
    if (direction === "UP") batY -= speed;
    if (direction === "DOWN") batY += speed;
    if (direction === "LEFT") batX -= speed;
    if (direction === "RIGHT") batX += speed;

    // Draw Animated Pixel Bat
    drawPixelBat(batX, batY, batSize);

    // Eat Logic
    let distToFood = Math.hypot(batX - food.x, batY - food.y);
    if (distToFood < (batSize * 10) + 10) {
        score++;
        foodCounter++;
        scoreElement.innerHTML = score;
        
        // Grow bigger!
        batSize += 0.2; 
        
        food = {
            x: Math.random() * (canvas.width - 40) + 20,
            y: Math.random() * (canvas.height - 40) + 20
        };

        if (foodCounter % 5 === 0) {
            stones.push({ x: Math.random() * canvas.width, y: 0 });
        }
    }

    // Boundary Check
    if (batX < 0 || batX > canvas.width || batY < 0 || batY > canvas.height) {
        alert("Hit the wall! Game Over");
        location.reload();
    }

    requestAnimationFrame(update);
}

update();
