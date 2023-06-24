import react from "react";
import "./App.css";
import styled, { keyframes, css } from "styled-components";

import Bomb from "./assets/bomb";
import Flag from "./assets/flag";

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
const cellTemplate = {
  isMine: false,
  isRevealed: false,
  isFlag: false,
  neighboringMines: 0,
};

function copy2DArray(array) {
  return array.map((innerArray) => {
    return innerArray.slice();
  });
}

const trembleAnimation = keyframes`
  0% {
    transform: scale(1, 1) rotate(0);
    background: #4442;
  }
  20% {
    transform: scale(1.15, 0.85) rotate(-1deg);
    background: #5552;
  }
  40% {
    transform: scale(0.85, 1.15) rotate(1deg);
    background: #6662;
  }
  60% {
    transform: scale(1.15, 0.85) rotate(-1deg);
    background: #5552;
  }
  80% {
    transform: scale(0.85, 1.15) rotate(1deg);
    background: #5552;
  }
  100% {
    transform: scale(1, 1) rotate(0);
  }
`;

const animation = () =>
  css`
    ${trembleAnimation} 0.1s 1;
  `;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-width: 100vw;
  min-height: 100vh;

  background: rgb(11, 9, 51);
  background: linear-gradient(
    344deg,
    rgba(11, 9, 51, 1) 12%,
    rgba(4, 27, 131, 1) 42%,
    rgba(67, 2, 181, 1) 68%,
    rgba(149, 7, 245, 1) 98%
  );
`;

const Board = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;
const Cell = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border: ${({ isRevealed }) =>
    isRevealed ? "4px outset #0003" : "4px outset #2225"};

  background: ${({ isRevealed }) => (isRevealed ? "#1114" : "#bbb2")};

  display: flex;
  align-items: center;
  justify-content: center;

  transition: transform 0.1s ease-in-out;

  &:hover {
    background: ${({ isRevealed }) => (isRevealed ? "#1114" : "#5552")};

    animation: ${({ isRevealed }) => (isRevealed ? "none" : animation)};
  }
`;

const MineNumberInCell = styled.p`
  color: ${({ color }) => color};
  font-size: 1.4rem;
  font-weight: 400;
`;

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

  const dr = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
  const dc = [-1, 0, 1, -1, 0, 1, -1, 0, 1];

  while (placedMineCnt < totalMineNum) {
    const r = Math.floor(Math.random() * rowSize);
    const c = Math.floor(Math.random() * colSize);

    if (newBoard[r][c].isMine) continue;

    if (row !== undefined) {
      let placeMineFlag = true;
      for (let i = 0; i < dr.length; i++) {
        const nr = r + dr[i];
        const nc = c + dc[i];

        if (nr === row && nc === col) placeMineFlag = false;
      }
      if (!placeMineFlag) continue;
    }

    newBoard[r][c].isMine = true;
    placedMineCnt++;
  }

  return newBoard;
};

const countNeighboringMines = ({ board, r, c, rowSize, colSize }) => {
  const dr = [-1, 0, 1, 1, 1, 0, -1, -1];
  const dc = [-1, -1, -1, 0, 1, 1, 1, 0];

  let cnt = 0;
  for (let i = 0; i < dr.length; i++) {
    const nr = r + dr[i];
    const nc = c + dc[i];
    if (nr < 0 || nr >= rowSize || nc < 0 || nc >= colSize) continue;

    if (board[nr][nc].isMine) cnt++;
  }

  return cnt;
};

const calculateNeighboringMines = ({ board, rowSize, colSize }) => {
  for (let r = 0; r < rowSize; r++) {
    for (let c = 0; c < colSize; c++) {
      if (!board[r][c].isMine) {
        board[r][c].neighboringMines = countNeighboringMines({
          board,
          r,
          c,
          rowSize,
          colSize,
        });
      }
    }
  }

  return board;
};

function revealNeighboringCells({ board, row, col, rowSize, colSize }) {
  const dr = [-1, 0, 1, 1, 1, 0, -1, -1];
  const dc = [-1, -1, -1, 0, 1, 1, 1, 0];

  for (let i = 0; i < dr.length; i++) {
    const nr = row + dr[i];
    const nc = col + dc[i];

    if (nr < 0 || nr >= rowSize || nc < 0 || nc >= colSize) continue;
    const cell = board[nr][nc];

    if (!cell.isRevealed) {
      cell.isRevealed = true;

      if (cell.neighboringMines === 0) {
        revealNeighboringCells({
          board,
          row: nr,
          col: nc,
          rowSize,
          colSize,
        });
      }
    }
  }
}

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
  if (isFirstClick) board = remakeBoard({ row, col });

  const cell = board[row][col];

  if (cell.isRevealed || cell.isFlag) return;
  let newBoard = copy2DArray(board);

  if (cell.isMine) {
    setIsRunning(false);
    alert("GAME OVER!!");

    for (let r = 0; r < rowSize; r++)
      for (let c = 0; c < colSize; c++)
        if (newBoard[r][c].isMine) newBoard[r][c].isRevealed = true;

    setBoardWrapper({ newBoard, row, col });
    return;
  }

  newBoard[row][col].isRevealed = true;

  if (cell.neighboringMines === 0) {
    revealNeighboringCells({ board: newBoard, row, col, rowSize, colSize });
  }

  setBoardWrapper({ newBoard, row, col });
};

const setFlag = ({
  isFirstClick,
  remakeBoard,
  board,
  setBoardWrapper,
  row,
  col,
}) => {
  if (isFirstClick) board = remakeBoard({ row, col });

  let newBoard = copy2DArray(board);

  newBoard[row][col].isFlag = !newBoard[row][col].isFlag;
  setBoardWrapper({ newBoard, row, col });
};

function App() {
  const rowSize = 8;
  const colSize = 10;
  const totalMineNum = 10;

  const initBoard = ({ rowSize, colSize, totalMineNum }) => {
    let board = makeBoard({ rowSize, colSize });
    board = placeMines({ board, totalMineNum, rowSize, colSize });
    board = calculateNeighboringMines({ board, rowSize, colSize });

    return board;
  };

  const [board, setBoard] = react.useState([]);
  const [flagNum, setFlagNum] = react.useState(0);
  const [isFirstClick, setIsFirstClick] = react.useState(true);
  const [isRunning, setIsRunning] = react.useState(true);

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

  const setBoardWrapper = ({ newBoard }) => {
    if (!isRunning) return;

    setBoard(newBoard);

    let endFlag = true;
    for (let r = 0; r < rowSize; r++)
      for (let c = 0; c < colSize; c++)
        if (board[r][c].isMine ^ newBoard[r][c].isFlag) endFlag = false;

    if (endFlag) {
      setIsRunning(false);

      let endBoard = copy2DArray(newBoard);
      for (let r = 0; r < rowSize; r++)
        for (let c = 0; c < colSize; c++)
          if (!endBoard[r][c].isMine) {
            endBoard[r][c].isRevealed = true;
          }
      setBoard(endBoard);
    }
  };

  react.useEffect(() => {
    setBoard(initBoard({ rowSize, colSize, totalMineNum }));
  }, []);

  react.useEffect(() => {
    if (board.length < rowSize) return;

    let cnt = 0;

    for (let r = 0; r < rowSize; r++)
      for (let c = 0; c < colSize; c++)
        if (!board[r][c].isRevealed && board[r][c].isFlag) cnt++;

    setFlagNum(cnt);
  }, [board]);

  return (
    <Container>
      <div style={{ color: "white", marginBottom: "1rem" }}>
        {totalMineNum - flagNum}
      </div>

      <Board>
        {board?.map((row, rowIdx) => (
          <Row key={rowIdx}>
            {row?.map((col, colIdx) => {
              const showFlag = col.isFlag;

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
                    setFlag({
                      board,
                      setBoardWrapper,
                      row: rowIdx,
                      col: colIdx,
                    });
                  }}
                  isRevealed={col.isRevealed}
                >
                  {col.isRevealed ? (
                    col.isMine ? (
                      <Bomb width="1.2rem" height="1.2rem" />
                    ) : (
                      <MineNumberInCell
                        color={numberColor[col.neighboringMines]}
                      >
                        {col.neighboringMines}
                      </MineNumberInCell>
                    )
                  ) : showFlag ? (
                    <Flag width="1.8rem" height="1.8rem" />
                  ) : (
                    ""
                  )}
                </Cell>
              );
            })}
          </Row>
        ))}
      </Board>
    </Container>
  );
}

export default App;
