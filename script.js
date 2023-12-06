const gameboard = (function () {
  const rows = 3;
  const columns = 3;
  let board = [];

  const clearBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(" ");
      }
    }
  };

  const getBoard = () => board;

  const selectCell = (row, column, player) => {
    board[row][column] = player.marker;
  };

  const printBoard = () => {
    console.log(board);
  };

  clearBoard();

  return { clearBoard, getBoard, selectCell, printBoard };
})();

const gamecontroller = (function (playerOneName, playerTwoName) {
  const players = [
    { name: playerOneName, marker: "X" },
    { name: playerTwoName, marker: "O" },
  ];

  const board = gameboard.getBoard();

  let activePlayer = players[0];

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const boardIsFull = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == " ") return false;
      }
    }
    return true;
  };

  const checkWin = (row, column) => {
    if (board[row][0] === board[row][1] && board[row][1] === board[row][2])
      return true;
    else if (
      board[0][column] === board[1][column] &&
      board[1][column] === board[2][column]
    )
      return true;
    else if (row === column) {
      if (board[0][0] === board[1][1] && board[1][1] === board[2][2])
        return true;
    }else if ((row===0&&column===2) || (row===2&&column===0)||(row===1&&column===1)){
      
    }
    return false;
  };

  const printNewRound = () => {
    gameboard.printBoard();
    console.log(`${activePlayer.name}'s turn`);
  };

  const playRound = (row, column) => {
    if (board[row][column] != " ") return;
    gameboard.selectCell(row, column, activePlayer);

    if (checkWin(row, column)) {
      gameboard.printBoard();
      console.log(`${activePlayer.name} won.`);
      return 1;
    } else if (boardIsFull()) {
      gameboard.printBoard();
      console.log("Its a draw...");
      return 2;
    } else {
      switchPlayer();
      printNewRound();
    }
    return 0;
  };

  printNewRound();

  return { playRound, getActivePlayer };
})("Giorno", "Bruno");

const screencontroller = (function () {
  const containerDiv = document.querySelector(".container");
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const winnerDiv = document.querySelector(".winner");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = gameboard.getBoard();
    const activePlayer = gamecontroller.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");

        cellButton.dataset.index = [i, j];
        cellButton.textContent = board[i][j];
        if (cellButton.textContent === "X") cellButton.classList.add("cell1");
        else if (cellButton.textContent === "O")
          cellButton.classList.add("cell2");
        boardDiv.appendChild(cellButton);
      }
    }
  };

  
  const clickHandlerBoard = (e) => {
    const selectedCell = e.target.dataset.index;
    
    if (!selectedCell) return;

    let a = gamecontroller.playRound(
      parseInt(selectedCell[0]),
      parseInt(selectedCell[2])
      );
      updateScreen();
      
      if (a === 1) {
        winnerDiv.textContent = `${gamecontroller.getActivePlayer().name} won.`;
        boardDiv.removeEventListener("click", clickHandlerBoard);
      playAgain();
    } else if (a === 2) {
      winnerDiv.textContent = "Its a draw.";
      boardDiv.removeEventListener("click", clickHandlerBoard);
      playAgain();
    }
  };
  
  const clickHandlerPlayAgain = () => {
    gameboard.clearBoard();
    updateScreen();
    winnerDiv.textContent="";
    boardDiv.addEventListener("click", clickHandlerBoard);
    const playAgainBtn = document.querySelector(".playagain");
    containerDiv.removeChild(playAgainBtn);
  };
  
  const playAgain = () => {
    const playAgainBtn = document.createElement("button");
    playAgainBtn.classList.add("playagain");
    playAgainBtn.textContent = "Play Again";
    containerDiv.append(playAgainBtn);
    playAgainBtn.addEventListener("click", clickHandlerPlayAgain);
  };

  boardDiv.addEventListener("click", clickHandlerBoard);
  updateScreen();
})();
