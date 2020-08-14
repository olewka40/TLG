import styled, { css } from "styled-components";

export const StyledSidebar = styled.div`
  display: flex;
  flex-direction: column;
  width: ${p => (p.opened ? 400 : 60)}px;
  height: 100%;
  background: #17212b;
  transition: 0.3s;
  border-right: 1px solid black;
`;
export const Header = styled.div`
  background: #17212b;
  display: flex;
  justify-content: flex-start;
`;
export const OpenHidden = styled.div`
  ${p =>
    !p.opened &&
    css`{
display: none;
`}
`;
export const Main = styled.div`
  height: 95vh;
  overflow-y: auto;
`;
export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  background: #17212b;
  min-height: 50px;
`;
export const StyledToolbar = styled.div`
  display: flex;
  padding-left: 5px;
`;
export const SearchInput = styled.input`
  width: 100%;
  height: 30px;
  border-radius: 5px;
  margin-top: 10px;
  border: 0;
  background-color: #232f3d;
  color: white;
`;