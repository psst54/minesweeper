import styled from "styled-components";

const Container = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;

  padding: 2rem 3rem;

  background: #0d0d1ff5;
  border-radius: 2rem;

  font-size: 2rem;
  font-weight: 100;
  color: white;
`;

const NewGameButton = styled.button`
  background: transparent;
  padding: 0.8rem 2rem;
  width: fit-content;

  border-radius: 1rem;
  border: 3px solid #041b83;

  font-size: 1.4rem;
  font-weight: 200;
  color: white;

  cursor: pointer;
`;

export { Container, NewGameButton };
