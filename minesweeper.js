let flags;
let board;
let boardSize = 9;
let bombCount = 10;
let uncovered;
let uncoveredCount;
let flagCount;
const flagIcon = '<i class="fa fa-flag" aria-hidden="true"></i>';
const questionIcon = '<i class="fa fa-question" aria-hidden="true"></i>';
const bombIcon = '<i class="fa fa-bomb" aria-hidden="true"></i>';
const neutralFace = '<i class="fa fa-meh-o" aria-hidden="true"></i>';
const happyFace = '<i class="fa fa-smile-o" aria-hidden="true"></i>';
const sadFace = '<i class="fa fa-frown-o" aria-hidden="true"></i>';
let seconds;
let timerRunning;
let timer;
let eventFunctions; // Stores event handler functions to allow removal

document.getElementById('easy').addEventListener('click', function () {
  document.getElementById('container').style.width = '270px';
  document.getElementById('container').style.height = '270px';
  boardSize = 9;
  bombCount = 10;
  start();
});

document.getElementById('medium').addEventListener('click', function () {
  document.getElementById('container').style.width = '350px';
  document.getElementById('container').style.height = '350px';
  boardSize = 14;
  bombCount = 30;
  start();
});

document.getElementById('hard').addEventListener('click', function () {
  document.getElementById('container').style.width = '450px';
  document.getElementById('container').style.height = '450px';
  boardSize = 18;
  bombCount = 60;
  start();
});

function fillBoard() {
  for (let i = 0; i < boardSize * boardSize; i++) {
    board.push(0);
  }
}

function getRandom() {
  let random = Math.floor(Math.random() * boardSize * boardSize);
  while (board[random] === 'B') {
    random = Math.floor(Math.random() * boardSize * boardSize);
  }
  return random;
}

function add(index) {
  if (index >= 0 && index < boardSize * boardSize && board[index] !== 'B') {
    board[index]++;
  }
}

function distributeBombs() {
  for (let i = 0; i < bombCount; i++) {
    let random = getRandom();
    board[random] = 'B';
    if (random % boardSize !== 0) {
      add(random - boardSize - 1);
      add(random - 1);
      add(random + boardSize - 1);
    }
    if ((random + 1) % boardSize !== 0) {
      add(random - boardSize + 1);
      add(random + 1);
      add(random + boardSize + 1);
    }
    add(random - boardSize);
    add(random + boardSize);
  }
}

function disableCell(i) {
  const element = document.getElementById('cell' + i);
  element.removeEventListener('click', eventFunctions[i][0]);
  element.removeEventListener('contextmenu', eventFunctions[i][1]);
}

function disableBoard() {
  for (let i = 0; i < boardSize * boardSize; i++) {
    if (!uncovered.hasOwnProperty(i)) {
      disableCell(i);
    }
  }
  clearInterval(timer);
}

function gameOver() {
  for (let i = 0; i < boardSize * boardSize; i++) {
    if (board[i] === 'B') {
      const element = document.getElementById('cell' + i);
      element.innerHTML = bombIcon;
      element.classList.remove('covered');
    }
  }
  disableBoard();
  document.getElementById('face').innerHTML = sadFace;
}

function checkWin() {
  if (uncoveredCount + bombCount === board.length && flagCount === bombCount) {
    disableBoard();
    document.getElementById('face').innerHTML = happyFace;
  }
}

function leftClick(i) {
  return function () {
    const element = document.getElementById('cell' + i);
    if (element.innerHTML !== flagIcon && element.innerHTML !== questionIcon) {
      uncover(i);
    }
  };
}

function rightClick(i) {
  return function () {
    flag(i);
  };
}

function updateTimer() {
  if (seconds < 999) {
    seconds++;
    document.getElementById('timer').innerHTML = seconds;
  }
}

function startTimer() {
  timerRunning = true;
  timer = setInterval(updateTimer, 1000);
}

function uncover(i) {
  if (!timerRunning) {
    startTimer();
  }

  if (i >= boardSize * boardSize || i < 0) return;

  const element = document.getElementById('cell' + i);
  element.classList.remove('cursor');

  if (element.innerHTML === flagIcon) {
    flagCount--;
    document.getElementById('flag-counter').innerHTML = bombCount - flagCount;
  }

  if (board[i] === 'B') {
    element.innerHTML = bombIcon;
    element.classList.add('mine');
    element.classList.remove('covered');
    gameOver();
  } else if (board[i] === 0 && !uncovered.hasOwnProperty(i)) {
    uncovered[i] = true;
    element.innerHTML = '';
    element.classList.add('uncovered');
    element.classList.remove('covered');
    disableCell(i);
    if (i % boardSize !== 0) {
      uncover(i - 1);
      uncover(i - boardSize - 1);
      uncover(i + boardSize - 1);
    }
    if (i % boardSize !== boardSize - 1) {
      uncover(i + 1);
      uncover(i - boardSize + 1);
      uncover(i + boardSize + 1);
    }
    uncover(i - boardSize);
    uncover(i + boardSize);
    uncoveredCount++;
    checkWin();
  } else if (board[i] !== 0 && !uncovered.hasOwnProperty(i)) {
    uncovered[i] = true;
    element.innerHTML = board[i];
    element.classList.add('uncovered');
    element.classList.remove('covered');
    disableCell(i);
    uncoveredCount++;
    checkWin();
  }
}

function flag(i) {
  if (!timerRunning) {
    startTimer();
  }

  const element = document.getElementById('cell' + i);

  if (element.innerHTML === '') {
    element.innerHTML = flagIcon;
    flagCount++;
  } else if (element.innerHTML === flagIcon) {
    element.innerHTML = questionIcon;
    flagCount--;
  } else {
    element.innerHTML = '';
  }

  document.getElementById('flag-counter').innerHTML = bombCount - flagCount;
  checkWin();
}

function adjustBoard() {
  const boardWidth = Number(document.getElementById('board').offsetWidth);
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell) => {
    cell.style.width = `${boardWidth / boardSize}px`;
    cell.style.height = `${boardWidth / boardSize}px`;
  });
}

function addListeners() {
  eventFunctions = {};
  for (let i = 0; i < boardSize * boardSize; i++) {
    const element = document.getElementById('cell' + i);
    eventFunctions[i] = [leftClick(i), rightClick(i)];
    element.addEventListener('click', eventFunctions[i][0], false);
    element.addEventListener('contextmenu', eventFunctions[i][1], false);
  }
}

function displayBoard() {
  document.getElementById('face').innerHTML = neutralFace;
  document.getElementById('flag-counter').innerHTML = bombCount;
  document.getElementById('timer').innerHTML = 0;

  let boardContent = '';
  for (let i = 0; i < boardSize * boardSize; i++) {
    boardContent += `<div id="cell${i}" class="cell covered cursor"></div>`;
    if ((i + 1) % boardSize === 0) {
      boardContent += '<div style="clear:both;"></div>';
    }
  }
  document.getElementById('board').innerHTML = boardContent;
  adjustBoard();
  addListeners();
}

function start() {
  flags = {};
  board = [];
  fillBoard();
  uncovered = {};
  distributeBombs();
  displayBoard();
  uncoveredCount = 0;
  flagCount = 0;
  seconds = 0;
  timerRunning = false;
  clearInterval(timer);
}

start();
