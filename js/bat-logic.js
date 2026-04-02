const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreVal = document.getElementById('scoreVal');
const msg = document.getElementById('status-msg');
const stick = document.getElementById('joystick-stick');
const base = document.getElementById('joyBase');

canvas.width = 280;
canvas.height = 350;

let score = 0;
let gameActive = true;
let bat = { x: 120, y: 280, w: 40, h: 40, color: "#121212" }; // Bat properties
let obstacles = [];
let speed = 4;
let velocity = { x: 0, y: 0 };
const maxRadius = 35;

// Joystick Movement Logic
base.addEventListener('touchstart', moveJoystick);
base.addEventListener('touchmove', moveJoystick);
base.addEventListener('touchend', () => {
    stick.style.transform = `translate(0px, 0px)`;
    velocity.x = 0;
    velocity.y = 0;
});

function moveJoystick(e) {
    if (!gameActive) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = base.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > maxRadius) {
        dx *= maxRadius / dist;
        dy *= maxRadius / dist;
    }

    stick.style.transform = `translate(${dx}px, ${dy}px)`;
    velocity.x = (dx / maxRadius) * speed;
    velocity.y = (dy / maxRadius) * speed;
}

// Draw the Vector Bat Shape
function drawBat(x, y, w, h) {
    ctx.fillStyle = bat.color;
    ctx.beginPath();
    
    // Head & Ears
    ctx.moveTo(x + w * 0.5, y + h * 0.25);
    ctx.lineTo(x + w * 0.45, y + h * 0.1);
    ctx.lineTo(x + w * 0.55, y + h * 0.1);
    ctx.closePath();
    
    // Body
    ctx.moveTo(x + w * 0.5, y + h * 0.25);
    ctx.lineTo(x + w * 0.4, y + h * 0.5);
    ctx.lineTo(x + w * 0.5, y + h * 0.75);
    ctx.lineTo(x + w * 0.6, y + h * 0.5);
    ctx.closePath();
    
    // Left Wing
    ctx.moveTo(x + w * 0.5, y + h * 0.25);
    ctx.bezierCurveTo(x + w * 0.2, y + h * 0.1, x, y + h * 0.4, x + w * 0.5, y + h * 0.5);
    ctx.bezierCurveTo(x + w * 0.1, y + h * 0.7, x, y + h * 0.8, x + w * 0.5, y + h * 0.5);
    ctx.closePath();
    
    // Right Wing
    ctx.moveTo(x + w * 0.5, y + h * 0.25);
    ctx.bezierCurveTo(x + w * 0.8, y + h * 0.1, x + w, y + h * 0.4, x + w * 0.5, y + h * 0.5);
    ctx.bezierCurveTo(x + w * 0.9, y + h * 0.7, x + w, y + h * 0.8, x + w * 0.5, y + h * 0.5);
    ctx.closePath();
    
    ctx.fill();
}

function update() {
    if (!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bat movement & boundaries
    bat.x += velocity.x;
    bat.y += velocity.y;
    if (bat.x < 0) bat.x = 0;
    if (bat.y < 0) bat.y = 0;
    if (bat.x > canvas.width - bat.w) bat.x = canvas.width - bat.w;
    if (bat.y > canvas.height - bat.h) bat.y = canvas.height - bat.h;

    // Obstacles
    if (Math.random() < 0.02) {
        obstacles.push({ x: Math.random() * (canvas.width - 25), y: -25, w: 25, h: 25 });
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        let o = obstacles[i];
        o.y += 3.5;

        // Collision Check
        if (bat.x < o.x + o.w && bat.x + bat.w > o.x && bat.y < o.y + o.h && bat.y + bat.h > o.y) {
            gameOver();
        }

        ctx.fillStyle = "#ff7675"; // Obstacle color
        ctx.fillRect(o.x, o.y, o.w, o.h);

        if (o.y > canvas.height) {
            obstacles.splice(i, 1);
            score++;
            scoreVal.innerText = score;
        }
    }

    // Draw the Vector Bat (Using the new function)
    drawBat(bat.x, bat.y, bat.w, bat.h);

    requestAnimationFrame(update);
}

function gameOver() {
    gameActive = false;
    msg.style.display = 'block';
    setTimeout(reset, 3000);
}

function reset() {
    score = 0;
    obstacles = [];
    velocity = { x: 0, y: 0 };
    bat = { x: 120, y: 280, w: 40, h: 40, color: "#121212" };
    scoreVal.innerText = '0';
    msg.style.display = 'none';
    gameActive = true;
    update();
}

update();
