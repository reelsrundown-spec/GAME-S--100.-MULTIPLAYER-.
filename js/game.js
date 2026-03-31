const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("scoreVal");

const box = 20;
canvas.width = 320; 
canvas.height = 400;

let bat = [{ x: 8 * box, y: 10 * box }];
let food = { x: Math.floor(Math.random() * 15) * box, y: Math.floor(Math.random() * 15 + 2) * box };
let stones = []; // Mele ninnu veezhunna vasthukkal
let score = 0;
let foodCounter = 0;
let d;

function changeDir(direction) {
    if (direction == 'LEFT' && d != 'RIGHT') d = 'LEFT';
    if (direction == 'UP' && d != 'DOWN') d = 'UP';
    if (direction == 'RIGHT' && d != 'LEFT') d = 'RIGHT';
    if (direction == 'DOWN' && d != 'UP') d = 'DOWN';
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Vavval (Bat) - Snake style
    for (let i = 0; i < bat.length; i++) {
        ctx.fillStyle = (i == 0) ? "#9b59b6" : "#4a235a"; 
        ctx.fillRect(bat[i].x, bat[i].y, box, box);
    }

    // Food (Insects)
    ctx.fillStyle = "lime";
    ctx.fillRect(food.x, food.y, box, box);

    // Falling Stones (Obstacles)
    ctx.fillStyle = "red";
    for(let i=0; i<stones.length; i++) {
        ctx.fillRect(stones[i].x, stones[i].y, box, box);
        stones[i].y += 5; // Kallu thazhe veezhunna speed

        // Vavvalinte mele kondal Game Over
        if(stones[i].x == bat[0].x && stones[i].y >= bat[0].y && stones[i].y <= bat[0].y + box) {
            gameOver();
        }
    }

    let batX = bat[0].x;
    let batY = bat[0].y;

    if (d == "LEFT") batX -= box;
    if (d == "UP") batY -= box;
    if (d == "RIGHT") batX += box;
    if (d == "DOWN") batY += box;

    // Food kazhikkumbol
    if (batX == food.x && batY == food.y) {
        score++;
        foodCounter++;
        scoreElement.innerHTML = score;
        food = { x: Math.floor(Math.random() * 15) * box, y: Math.floor(Math.random() * 15 + 2) * box };
        
        // 5 food kazhikkumbol puthiya kallu varanam
        if(foodCounter % 5 == 0) {
            stones.push({ x: Math.floor(Math.random() * 15) * box, y: 0 });
        }
    } else {
        bat.pop();
    }

    let newHead = { x: batX, y: batY };

    // Walls, Self-Collision, Boundary Check
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
                   
