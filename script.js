document.addEventListener("DOMContentLoaded", () => {
  const ROWS = 6;
  const COLS = 7;
  const board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const boardEl = document.getElementById("board");
  const statusEl = document.getElementById("status");
  const restartBtn = document.getElementById("restart");

  let currentPlayer = "red";
  let gameOver = false;

  // Create board UI
  function renderBoard() {
    boardEl.innerHTML = "";
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if (board[r][c]) {
          cell.classList.add(board[r][c]);
        }
        cell.dataset.col = c;
        boardEl.appendChild(cell);
      }
    }
  }

  // Drop piece
  function dropPiece(col) {
    if (gameOver) return;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!board[r][col]) {
        board[r][col] = currentPlayer;
        renderBoard();
        if (checkWin(r, col)) {
          statusEl.textContent = `${capitalize(currentPlayer)} wins!`;
          gameOver = true;
        } else {
          currentPlayer = currentPlayer === "red" ? "yellow" : "red";
          statusEl.textContent = `${capitalize(currentPlayer)}'s turn`;
        }
        return;
      }
    }
  }

  // Check win
  function checkWin(row, col) {
    function countDir(dr, dc) {
      let r = row + dr, c = col + dc, count = 0;
      while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
        count++;
        r += dr; c += dc;
      }
      return count;
    }

    const directions = [[0,1],[1,0],[1,1],[1,-1]];
    return directions.some(([dr,dc]) => 1 + countDir(dr,dc) + countDir(-dr,-dc) >= 4);
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // Click handler
  boardEl.addEventListener("click", e => {
    if (e.target.classList.contains("cell")) {
      dropPiece(parseInt(e.target.dataset.col));
    }
  });

  restartBtn.addEventListener("click", () => {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        board[r][c] = null;
      }
    }
    currentPlayer = "red";
    gameOver = false;
    statusEl.textContent = "Red's turn";
    renderBoard();
  });

  renderBoard();
});

