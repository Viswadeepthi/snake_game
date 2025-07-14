const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const restartBtn = document.getElementById("restartBtn");
const themeToggle = document.getElementById("themeToggle");
const soundToggle = document.getElementById("soundToggle");

const clickSound = document.getElementById("clickSound");
const bgMusic = document.getElementById("bgMusic");

const box = 20;
const canvasSize = 400;

let snake, food, direction, score, speed, game;
let soundOn = true;

function initGame() {
  snake = [{ x: 9 * box, y: 9 * box }];
  food = randomFood();
  direction = null;
  score = 0;
  speed = 150;
  updateScore();
  clearInterval(game);
  game = setInterval(drawGame, speed);
}

function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
  const high = localStorage.getItem("snakeHighScore") || 0;
  if (score > high) {
    localStorage.setItem("snakeHighScore", score);
  }
  highScoreDisplay.textContent = `High Score: ${localStorage.getItem("snakeHighScore")}`;
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box,
  };
}

function drawGame() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#0f0" : "#fff";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "UP") snakeY -= box;
  if (direction === "DOWN") snakeY += box;

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    if (soundOn) clickSound.play();
    food = randomFood();
    updateScore();

    // Increase speed
    if (speed > 50) {
      speed -= 5;
      clearInterval(game);
      game = setInterval(drawGame, speed);
    }
  } else {
    snake.pop();
  }

  const newHead = { x: snakeX, y: snakeY };

  if (
    snakeX < 0 || snakeX >= canvasSize ||
    snakeY < 0 || snakeY >= canvasSize ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert("Game Over! Score: " + score);
  }

  snake.unshift(newHead);
}

function collision(head, array) {
  return array.some(segment => segment.x === head.x && segment.y === head.y);
}

function setDirection(e) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

document.addEventListener("keydown", setDirection);
restartBtn.addEventListener("click", initGame);
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
});
soundToggle.addEventListener("click", () => {
  soundOn = !soundOn;
  soundToggle.textContent = `🔊 Sound: ${soundOn ? "ON" : "OFF"}`;
  if (soundOn) bgMusic.play();
  else bgMusic.pause();
});

window.onload = () => {
  initGame();
  bgMusic.volume = 0.5;
  bgMusic.play();
};
