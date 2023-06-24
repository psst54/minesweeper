import { copy2DArray, checkInsideBoard } from "./libs/functions";
import { dr, dc, drNeighbor, dcNeighbor } from "./libs/variables";

const cellTemplate = {
  isMine: false,
  isRevealed: false,
  isFlag: false,
  neighboringMines: 0,
};

const makeBoard = ({ rowSize, colSize }) => {
  const ret = [];
  for (let i = 0; i < rowSize; i++) {
    ret[i] = [];
    for (let j = 0; j < colSize; j++) {
      ret[i][j] = { ...cellTemplate };
    }
  }

  return ret;
};

const placeMines = ({ board, totalMineNum, rowSize, colSize, row, col }) => {
  let placedMineCnt = 0;
  let newBoard = copy2DArray(board);

  while (placedMineCnt < totalMineNum) {
    const r = Math.floor(Math.random() * rowSize);
    const c = Math.floor(Math.random() * colSize);

    if (newBoard[r][c].isMine) continue;

    if (row !== undefined) {
      let placeMineFlag = true;

      // console.log("[debug]---------------", row, col);
      for (let i = 0; i < dr.length; i++) {
        const nr = r + dr[i];
        const nc = c + dc[i];

        // console.log("[debug]", nr, nc);
        if (nr === row && nc === col) placeMineFlag = false;
        // console.log("[debug]", placeMineFlag);
      }
      if (!placeMineFlag) continue;
    }

    newBoard[r][c].isMine = true;
    placedMineCnt++;
  }

  return newBoard;
};

const countNeighboringMines = ({ board, r, c, rowSize, colSize }) => {
  let cnt = 0;

  for (let i = 0; i < drNeighbor.length; i++) {
    const nr = r + drNeighbor[i];
    const nc = c + dcNeighbor[i];
    if (
      !checkInsideBoard({ row: nr, col: nc, rowMax: rowSize, colMax: colSize })
    )
      continue;

    if (board[nr][nc].isMine) cnt++;
  }

  return cnt;
};

const calculateNeighboringMines = ({ board, rowSize, colSize }) => {
  for (let r = 0; r < rowSize; r++)
    for (let c = 0; c < colSize; c++)
      if (!board[r][c].isMine)
        board[r][c].neighboringMines = countNeighboringMines({
          board,
          r,
          c,
          rowSize,
          colSize,
        });

  return board;
};

export { makeBoard, placeMines, calculateNeighboringMines };
