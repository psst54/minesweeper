import styled, { keyframes, css } from "styled-components";

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

const BoardWrapper = styled.div`
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

export { BoardWrapper, Row, Cell, MineNumberInCell };
