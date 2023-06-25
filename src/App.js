import react from "react";
import "./App.css";

import { copy2DArray } from "./libs/functions";
import {
  makeBoard,
  placeMines,
  calculateNeighboringMines,
} from "./makingBoardFunctions";

import Header from "./header";
import Board from "./board";
import WinModal from "./winModal";
import LoseModal from "./loseModal";

function App() {
  const rowSize = 8;
  const colSize = 10;
  const totalMineNum = 10;

  const [board, setBoard] = react.useState([]);
  const [flagNum, onClickCellRightNum] = react.useState(0);
  const [isFirstClick, setIsFirstClick] = react.useState(true);
  const [isRunning, setIsRunning] = react.useState(true);
  const [showWin, setShowWin] = react.useState(false);
  const [showLose, setShowLose] = react.useState(false);

  const initGame = () => {
    setIsFirstClick(true);
    setIsRunning(true);
    setBoard(makeBoard({ rowSize, colSize }));
  };

  const setBoardWrapper = ({ newBoard }) => {
    if (!isRunning) return;

    setBoard(newBoard);

    let winFlag = true;
    let loseFlag = false;

    for (let r = 0; r < rowSize; r++)
      for (let c = 0; c < colSize; c++) {
        if (newBoard[r][c].isMine ^ newBoard[r][c].isFlag) winFlag = false;
        if (newBoard[r][c].isMine && newBoard[r][c].isRevealed) loseFlag = true;
      }

    console.log("[debug] winFlag", winFlag);
    console.log("[debug] loseFlag", loseFlag);

    if (winFlag) {
      setIsRunning(false);

      let endBoard = copy2DArray(newBoard);
      for (let r = 0; r < rowSize; r++)
        for (let c = 0; c < colSize; c++)
          if (!endBoard[r][c].isMine) endBoard[r][c].isRevealed = true;

      setShowWin(true);
      setBoard(endBoard);
    } else if (loseFlag) {
      setIsRunning(false);

      let endBoard = copy2DArray(newBoard);
      for (let r = 0; r < rowSize; r++)
        for (let c = 0; c < colSize; c++)
          if (endBoard[r][c].isMine) endBoard[r][c].isRevealed = true;

      setShowLose(true);
      setBoard(endBoard);
    }
  };

  const remakeBoard = ({ row, col }) => {
    setIsFirstClick(false);

    const initialBoard = calculateNeighboringMines({
      board: placeMines({
        board: makeBoard({ rowSize, colSize }),
        totalMineNum,
        rowSize,
        colSize,
        row,
        col,
      }),
      rowSize,
      colSize,
    });

    setBoard(initialBoard);
    return initialBoard;
  };

  react.useEffect(() => {
    initGame();
  }, []);

  react.useEffect(() => {
    if (board.length < rowSize) return;

    let cnt = 0;

    for (let r = 0; r < rowSize; r++)
      for (let c = 0; c < colSize; c++)
        if (!board[r][c].isRevealed && board[r][c].isFlag) cnt++;

    onClickCellRightNum(cnt);
  }, [board]);

  return (
    <div className="background">
      <Header totalMineNum={totalMineNum} flagNum={flagNum} />

      <Board
        rowSize={rowSize}
        colSize={colSize}
        board={board}
        setBoardWrapper={setBoardWrapper}
        isRunning={isRunning}
        isFirstClick={isFirstClick}
        remakeBoard={remakeBoard}
      />

      <WinModal isOpen={showWin} setIsOpen={setShowWin} initGame={initGame} />
      <LoseModal
        isOpen={showLose}
        setIsOpen={setShowLose}
        initGame={initGame}
      />
    </div>
  );
}

export default App;
