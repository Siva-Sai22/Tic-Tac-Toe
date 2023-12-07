const game = (function () {
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

  const gamecontroller = function (playerOneName, playerTwoName) {
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
      } else if (
        (row === 0 && column === 2) ||
        (row === 2 && column === 0) ||
        (row === 1 && column === 1)
      ) {
        if (board[0][2] === board[1][1] && board[1][1] === board[2][0])
          return true;
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

    return { playRound, getActivePlayer, switchPlayer };
  };

  const screencontroller = (function () {
    const startScreen = (() => {
      let playerOneName;
      let playerTwoName;
      const container = document.querySelector(".container");

      const form = document.createElement("form");
      form.classList.add("player-form");

      const label1 = document.createElement("label");
      label1.textContent = "Player One:";
      label1.setAttribute("for", "playerOne");
      const input1 = document.createElement("input");
      input1.type = "text";
      input1.id = "playerOne";
      input1.required = true;

      const label2 = document.createElement("label");
      label2.textContent = "Player Two:";
      label2.setAttribute("for", "playerTwo");
      const input2 = document.createElement("input");
      input2.type = "text";
      input2.id = "playerTwo";
      input2.required = true;

      const startGameBtn = document.createElement("button");
      startGameBtn.textContent = "Start Game";
      startGameBtn.type = "submit";
      startGameBtn.classList.add("form-button");

      form.appendChild(label1);
      form.appendChild(input1);
      form.appendChild(label2);
      form.appendChild(input2);
      form.appendChild(startGameBtn);

      container.appendChild(form);

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        playerOneName = input1.value.trim();
        playerTwoName = input2.value.trim();

        while (container.firstChild) {
          container.removeChild(container.lastChild);
        }

        const playerTurnDiv = document.createElement("h1");
        playerTurnDiv.classList.add("turn");
        container.appendChild(playerTurnDiv);

        const boardDiv = document.createElement("div");
        boardDiv.classList.add("board");
        container.appendChild(boardDiv);

        const winnerDiv = document.createElement("h1");
        winnerDiv.classList.add("winner");
        container.appendChild(winnerDiv);

        gameController = gamecontroller(playerOneName, playerTwoName);
        gameScreen(gameController);
      });
    })();

    const gameScreen = function (gameController) {
      const containerDiv = document.querySelector(".container");
      const playerTurnDiv = document.querySelector(".turn");
      const boardDiv = document.querySelector(".board");
      const winnerDiv = document.querySelector(".winner");

      const updateScreen = () => {
        boardDiv.textContent = "";

        const board = gameboard.getBoard();
        const activePlayer = gameController.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const cellButton = document.createElement("button");
            cellButton.classList.add("cell");

            cellButton.dataset.index = [i, j];
            cellButton.textContent = board[i][j];
            if (cellButton.textContent === "X")
              cellButton.classList.add("cell1");
            else if (cellButton.textContent === "O")
              cellButton.classList.add("cell2");
            boardDiv.appendChild(cellButton);
          }
        }
      };

      const clickHandlerBoard = (e) => {
        const selectedCell = e.target.dataset.index;

        if (!selectedCell) return;

        let a = gameController.playRound(
          parseInt(selectedCell[0]),
          parseInt(selectedCell[2])
        );
        updateScreen();

        if (a === 1 || a == 2) {
          winnerDiv.textContent =
            a === 1
              ? `${gameController.getActivePlayer().name} won.`
              : "Its a draw.";
          boardDiv.removeEventListener("click", clickHandlerBoard);
          playAgain();
        }
      };

      const clickHandlerPlayAgain = () => {
        gameboard.clearBoard();
        updateScreen();
        winnerDiv.textContent = "";
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
        gameController.switchPlayer();
      };

      boardDiv.addEventListener("click", clickHandlerBoard);
      updateScreen();
    };
  })();
})();
