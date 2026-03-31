// Firebase Configuration with your actual keys
const firebaseConfig = {
  apiKey: "AIzaSyACOaNcjw96eamzv0Ja7vMvpETleysfcqQ",
  authDomain: "multiplayer-bingo-e27fd.firebaseapp.com",
  databaseURL: "https://multiplayer-bingo-e27fd-default-rtdb.firebaseio.com",
  projectId: "multiplayer-bingo-e27fd",
  storageBucket: "multiplayer-bingo-e27fd.firebasestorage.app",
  messagingSenderId: "768320492362",
  appId: "1:768320492362:web:25382f8c9aee76cf4167b3",
  measurementId: "G-PQCML4RCSL"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("tictactoe/game_data");

// Game Variables
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let mode = ""; 
let difficulty = "normal";

// Menu Logic
function showMenu(menuId) {
    document.querySelectorAll('.menu, .game-area').forEach(m => m.classList.add('hidden'));
    document.getElementById(menuId).classList.remove('hidden');
}

function startMode(m) {
    mode = m;
    if (mode === 'ai') {
        showMenu('ai-menu');
    } else {
        showMenu('game-screen');
        resetGame();
        if(mode === 'online') initOnline();
    }
}

function setDifficulty(d) {
    difficulty = d;
    showMenu('game-screen');
    resetGame();
}

// Play Logic
function handleMove(index) {
    if (board[index] !== "" || !gameActive) return;
    
    if (mode === 'online') {
        sendOnlineMove(index);
    } else {
        makeMove(index);
        if (mode === 'ai' && gameActive) {
            setTimeout(computerMove, 600);
        }
    }
}

function makeMove(index) {
    board[index] = currentPlayer;
    updateUI();
    
    if (checkWinner()) {
        document.getElementById('status').innerText = "Winner: " + currentPlayer;
        gameActive = false;
    } else if (!board.includes("")) {
        document.getElementById('status').innerText = "Draw!";
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        document.getElementById('status').innerText = "Turn: " + currentPlayer;
    }
}

function updateUI() {
    const cells = document.querySelectorAll('.cell');
    board.forEach((val, i) => {
        cells[i].innerText = val;
        cells[i].className = "cell " + val.toLowerCase();
    });
}

// AI Logic
function computerMove() {
    let move = getSmartMove() || getRandomMove();
    if (move !== undefined) makeMove(move);
}

function getRandomMove() {
    let available = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    return available[Math.floor(Math.random() * available.length)];
}

function getSmartMove() {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let p of wins) {
        let line = p.map(i => board[i]);
        if (line.filter(v => v === "O").length === 2 && line.filter(v => v === "").length === 1) return p[line.indexOf("")];
    }
    for (let p of wins) {
        let line = p.map(i => board[i]);
        if (line.filter(v => v === "X").length === 2 && line.filter(v => v === "").length === 1) return p[line.indexOf("")];
    }
    return null;
}

function checkWinner() {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return wins.some(p => board[p[0]] && board[p[0]] === board[p[1]] && board[p[0]] === board[p[2]]);
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    document.getElementById('status').innerText = "Turn: X";
    updateUI();
    if(mode === 'online') db.set({board, turn: "X"});
}

// Online Logic
function initOnline() {
    db.on("value", (snap) => {
        const data = snap.val();
        if (data) {
            board = data.board;
            currentPlayer = data.turn;
            updateUI();
            if (checkWinner()) {
                document.getElementById('status').innerText = "Game Over!";
                gameActive = false;
            }
        }
    });
}

function sendOnlineMove(index) {
    if(board[index] !== "" || !gameActive) return;
    board[index] = currentPlayer;
    let nextTurn = currentPlayer === "X" ? "O" : "X";
    db.set({ board: board, turn: nextTurn });
}

