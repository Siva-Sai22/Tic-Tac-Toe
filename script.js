const gamecontroller = (function (playerOneName, playerTwoName) {


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
    
    clearBoard();
    const getBoard = () => board;

    const selectCell = (row, column, player) => {
      board[row][column] = player.marker;
    };

    const printBoard = () => {
      console.log(board);
    };

    return { clearBoard, getBoard, selectCell, printBoard };
  })();

  
  const players = [
    { name: playerOneName, marker: "x" },
    { name: playerTwoName, marker: "o" },
  ];

  const board = gameboard.getBoard();

  let activePlayer = players[0];
  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const boardIsFull = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; i < 3; j++) {
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
    }
    return false;
  };

  const printNewRound = () => {
    gameboard.printBoard();
    console.log(`${activePlayer.name}'s turn`);
  };

  const playRound = (row, column) => {
    gameboard.selectCell(row, column, activePlayer);

    if (checkWin(row, column)) {
      gameboard.printBoard();
      console.log(`${activePlayer.name} won.`);
      gameboard.clearBoard();
    } else if (boardIsFull()) {
      gameboard.printBoard();
      console.log("Its a draw...");
    } else {
      switchPlayer();
      printNewRound();
    }
  };

  printNewRound();

  return { playRound };
})("Giorno", "Bruno");
