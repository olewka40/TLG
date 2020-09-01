import styled, { css } from "styled-components";

export const ImgAvatar = styled.img`
  border-radius: 50px;
  height: 48px;
  width: 48px;
`;
export const DialogContainer = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 7px 16px;
  ${p =>
    p.active &&
    css`
      background-color: #2b5279;
    `}
`;
export const UserName = styled.div`
  font-size: 14px;
  color: #efe9e9;
  display: flex;
  align-items: flex-end;
`;
export const Message = styled.div`
  color: grey;
  font-size: 13px;
  display: flex;
  align-items: flex-end;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const DialogInfo = styled.div`
  display: flex;
  width: 100%;
  max-height: 60px;
  flex-direction: column;
  margin-left: 16px;
`;
export const TopInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const BotInfo = styled.div`
  width: 100%;
  display: flex;
`;
export const Time = styled.div`
  color: grey;
  margin-right: 10px;
  font-size: 14px;
`;
export const MsgInfo = styled.div`
  display: flex;
  justify-content: flex-end;
`;
