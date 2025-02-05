import { styled } from 'styled-components';

export const Footer = styled.footer<{ $height: number }>`
  position: fixed;
  z-index: 1;
  bottom: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: ${({ $height }) => $height}px;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--border-color);
  box-shadow: 0 -2px 5px var(--border-color);
`;
