const copy2DArray = (array) => {
  return array.map((innerArray) => {
    return innerArray.slice();
  });
};

const checkInsideBoard = ({ row, col, rowMax, colMax }) => {
  return 0 <= row && row < rowMax && 0 <= col && col < colMax;
};

export { copy2DArray, checkInsideBoard };
