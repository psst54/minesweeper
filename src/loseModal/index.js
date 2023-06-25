import { Container, NewGameButton } from "../styles/modal";

const LoseModal = ({ isOpen, setIsOpen, initGame }) => {
  if (!isOpen) return <></>;

  return (
    <Container>
      You Lost!
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

export default LoseModal;
