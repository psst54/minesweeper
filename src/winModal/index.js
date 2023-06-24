import { Container, NewGameButton } from "./styles";

const WinModal = ({ isOpen, setIsOpen }) => {
  if (!isOpen) return <></>;

  return (
    <Container>
      Congratulations!
      <NewGameButton>new game</NewGameButton>
    </Container>
  );
};

export default WinModal;
