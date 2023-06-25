import { Container, NewGameButton } from "./styles";

const WinModal = ({ isOpen, setIsOpen, initGame }) => {
  if (!isOpen) return <></>;

  return (
    <Container>
      Congratulations!
      <NewGameButton
        onClick={() => {
          initGame();
          setIsOpen(false);
        }}
      >
        new game
      </NewGameButton>
    </Container>
  );
};

export default WinModal;
