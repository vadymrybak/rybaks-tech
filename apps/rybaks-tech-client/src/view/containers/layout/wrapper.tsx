import { styled } from 'styled-components';

export const Wrapper = styled.div<{ $offsetTop: number; $offsetBottom: number }>`
  position: relative;
  width: 100%;
  height: 100%;
  margin-top: ${({ $offsetTop }) => $offsetTop}px;
  margin-bottom: ${({ $offsetBottom }) => $offsetBottom}px;
`;
