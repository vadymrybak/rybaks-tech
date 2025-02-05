import { styled } from 'styled-components';

export const Header = styled.header<{ $height: number }>`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: ${({ $height }) => $height}px;
  align-items: center;
  justify-content: center;
  background-color: var(--header-color);
`;
