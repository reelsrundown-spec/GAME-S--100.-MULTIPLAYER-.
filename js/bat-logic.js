const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("scoreVal");

const box = 25; // Size slightly increased
canvas.width = 300; 
canvas.height = 400;

let bat = [{ x: 6 * box, y: 10 * box }];
let food = { x: Math.floor(Math.random() * 11) * box, y: Math.floor(Math.random() * 13 + 2) * box };
let stones = []; 
let score = 0;
let foodCounter = 0;
let d = "RIGHT";

function changeDir(direction) {
    if (direction == 'LEFT' && d != 'RIGHT') d = 'LEFT';
    if (direction == 'UP' && d != 'DOWN') d = 'UP';
    if (direction == 'RIGHT' && d != 'LEFT') d = 'RIGHT';
    if (direction == 'DOWN' && d != 'UP') d = 'DOWN';
}

function draw() {
    ctx.fillStyle = "#000"; // Dark background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Bat (Emoji)
    ctx.font = "20px serif";
    for (let i = 0; i < bat.length; i++) {
        ctx.fillText(i == 0 ? "🦇" : "🌑", bat[i].x, bat[i].y + box);
    }

    // Draw Food (Insect Emoji)
    ctx.fillText("🦟", food.x, food.y + box);

    // Draw Falling Obstacles (Rock Emoji)
    for(let i=0; i<stones.length; i++) {
        ctx.fillText("🌑", stones[i].x, stones[i].y + box);
        stones[i].y += 5;

        if(Math.abs(stones[i].x - bat[0].x) < box && Math.abs(stones[i].y - bat[0].y) < box) {
            gameOver();
        }
    }

    let batX = bat[0].x;
    let batY = bat[0].y;

    if (d == "LEFT") batX -= box;
    if (d == "UP") batY -= box;
    if (d == "RIGHT") batX += box;
    if (d == "DOWN") batY += box;

    if (batX == food.x && batY == food.y) {
        score++;
        foodCounter++;
        scoreElement.innerHTML = score;
        food = { x: Math.floor(Math.random() * 11) * box, y: Math.floor(Math.random() * 13 + 2) * box };
        
        if(foodCounter % 5 == 0) {
            stones.push({ x: Math.floor(Math.random() * 11) * box, y: 0 });
        }
    } else {
        bat.pop();
    }

    let newHead = { x: batX, y: batY };

    if (batX < 0 || batX >= canvas.width || batY < 0 || batY >= canvas.height || collision(newHead, bat)) {
        gameOver();
    }

    bat.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

function gameOver() {
    clearInterval(game);
    alert("Game Over! Score: " + score);
    location.reload();
}

let game = setInterval(draw, 150);
