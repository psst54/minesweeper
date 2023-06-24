import { Container } from "./styles.js";

const Header = ({ totalMineNum, flagNum }) => {
  return <Container>{totalMineNum - flagNum}</Container>;
};

export default Header;
