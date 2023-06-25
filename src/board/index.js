import { copy2DArray, checkInsideBoard } from "../libs/functions";
import { drNeighbor, dcNeighbor } from "../libs/variables";
import { BoardWrapper, Row, Cell, MineNumberInCell } from "./styles";

import Bomb from "../assets/bomb";
import Flag from "../assets/flag";

const numberColor = [
  "transparent",
  "#26beff",
  "#1fd125",
  "#fcdb1e",
  "#eb8602",
  "#f20f0f",
  "#ff40c2",
  "#ae57ff",
  "#ffffff",
];

const revealNeighboringCell = ({ board, row, col, rowSize, colSize }) => {
  // console.log("[debug] reveal", row, col);

  const cell = board[row][col];
  cell.isRevealed = true;

  if (cell.neighboringMines === 0) {
    revealNeighboringCells({
      board,
      row,
      col,
      rowSize,
      colSize,
    });
  }
};

const revealNeighboringCells = ({ board, row, col, rowSize, colSize }) => {
  // console.log("[debug] reveal neighbor of", row, col);

  const cell = board[row][col];
  if (cell.isMine || cell.isFlag) return;
  cell.isRevealed = true;

  for (let i = 0; i < drNeighbor.length; i++) {
    const nr = row + drNeighbor[i];
    const nc = col + dcNeighbor[i];

    if (
      !checkInsideBoard({ row: nr, col: nc, rowMax: rowSize, colMax: colSize })
    )
      continue;

    const nextCell = board[nr][nc];
    if (nextCell.isRevealed || nextCell.isFlag) continue;

    revealNeighboringCell({ board, row: nr, col: nc, rowSize, colSize });
  }
};

const onClickCell = ({
  isFirstClick,
  remakeBoard,
  setIsRunning,
  board,
  setBoardWrapper,
  row,
  col,
  rowSize,
  colSize,
}) => {
  if (board[row][col].isFlag) return;

  if (isFirstClick) board = remakeBoard({ row, col });

  let newBoard = copy2DArray(board);

  const cell = newBoard[row][col];

  if (cell.isMine) {
    for (let r = 0; r < rowSize; r++)
      for (let c = 0; c < colSize; c++)
        if (newBoard[r][c].isMine) newBoard[r][c].isRevealed = true;

    setBoardWrapper({ newBoard });
  } else if (cell.isRevealed) {
    revealNeighboringCells({ board: newBoard, row, col, rowSize, colSize });

    setBoardWrapper({ newBoard });
  } else {
    if (cell.neighboringMines === 0) {
      revealNeighboringCells({ board: newBoard, row, col, rowSize, colSize });
    }

    setBoardWrapper({ newBoard });
  }
};

const onClickCellRight = ({
  isFirstClick,
  remakeBoard,
  board,
  setBoardWrapper,
  row,
  col,
}) => {
  if (isFirstClick) board = remakeBoard({ row, col });

  if (board[row][col].isRevealed) return;

  let newBoard = copy2DArray(board);
  newBoard[row][col].isFlag = !newBoard[row][col].isFlag;
  setBoardWrapper({ newBoard, row, col });
};

const Board = ({
  rowSize,
  colSize,
  board,
  setBoardWrapper,
  isRunning,
  setIsRunning,
  isFirstClick,
  remakeBoard,
}) => {
  return (
    <BoardWrapper>
      {board?.map((row, rowIdx) => (
        <Row key={rowIdx}>
          {row?.map((col, colIdx) => {
            const isRevealed = col.isRevealed;
            const isMine = col.isMine;

            const showFlag = col.isFlag;
            const showMine = isRevealed && isMine && !showFlag;
            const showNumber = isRevealed && !showFlag && !showMine;

            return (
              <Cell
                key={colIdx}
                disabled={!isRunning}
                onClick={() => {
                  onClickCell({
                    isFirstClick,
                    remakeBoard,
                    setIsRunning,
                    board,
                    setBoardWrapper,
                    row: rowIdx,
                    col: colIdx,
                    rowSize,
                    colSize,
                  });
                }}
                onContextMenu={() => {
                  onClickCellRight({
                    board,
                    setBoardWrapper,
                    row: rowIdx,
                    col: colIdx,
                  });
                }}
                isRevealed={col.isRevealed}
              >
                {showFlag && <Flag width="1.8rem" height="1.8rem" />}
                {showMine && <Bomb width="1.2rem" height="1.2rem" />}
                {showNumber && (
                  <MineNumberInCell color={numberColor[col.neighboringMines]}>
                    {col.neighboringMines}
                  </MineNumberInCell>
                )}
              </Cell>
            );
          })}
        </Row>
      ))}
    </BoardWrapper>
  );
};

export default Board;
