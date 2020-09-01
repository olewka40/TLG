import styled, { css } from "styled-components";

export const ListOfMesseges = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
`;
export const TextMessage = styled.div`
  display: flex;
  padding: 5px 10px;
  color: #efe9e9;
  width: 100%;
  word-break: break-word;
  white-space: pre-wrap;
`;
export const Messege = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  border: 2px solid #17212b;
  border-radius: 10px;
  color: #efe9e9;
  margin-top: 5px;
  margin-left: 10px;
  background-color: #17212b;
`;

export const Time = styled.div`
  color: grey;
  margin-right: 10px;
  display: flex;
  height: 100%;
  align-items: flex-end;
  font-size: 14px;
`;
export const Readed = styled.div`
  padding-right: 5px;
  height: 100%;
  display: flex;
  align-items: flex-end;
`;
export const ImgAvatarCurrent = styled.img`
  border-radius: 50px;
  margin: 8px 5px 5px;
  height: 30px;
  width: 30px;
`;
