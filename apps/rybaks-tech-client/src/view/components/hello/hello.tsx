import { styled } from 'styled-components';

export const HelloWorld = styled.div<{ size: number }>`
  margin-top: -400px;
  margin-left: -50px;
  width: 300px;
  font-size: ${({ size }) => size}px;
`;
