import React, { useCallback, useEffect } from "react";
import styled, { css } from "styled-components";
import { useRouter } from "next/router";
import { DialogsContext } from "../../context/listDialogs";
import CheckIcon from "@material-ui/icons/Check";
import SocketService from "../../services/SocketService";
import Emoji from "react-emoji-render";

const ListOfDialogs = props => {
  const {
    opened,
    context: { dialogs, updateDialog }
  } = props;

  const onMessage = useCallback(data => {
    const { dialogId, senderId, ...props } = data;

    updateDialog(dialogId, props);
  }, []);
  useEffect(() => {
    SocketService.on("messageFromOpenChat", onMessage);
  }, []);
  const router = useRouter();
  const { id } = router.query;

  return (
    <List opened={opened}>
      {dialogs.map(({ _id, avatar, name, message, time, readed }) => (
        <Dialog
          active={(id, _id)}
          key={_id}
          avatarImg={avatar}
          name={name}
          dialogid={_id}
          message={message}
          time={time}
          readed={readed}
        />
      ))}
    </List>
  );
};

export default props => {
  return (
    <DialogsContext.Consumer>
      {context => {
        return <ListOfDialogs {...props} context={context} />;
      }}
    </DialogsContext.Consumer>
  );
};

const List = styled.div`
  ${p =>
    !p.opened &&
    css`${TopInfo},${BotInfo}{
    display: none;
}${DialogContainer}{
justify-content: center;
}

`}
`;
export const Dialog = ({
  dialogid,
  active,
  avatarImg,
  name,
  message,
  time,
  readed
}) => {
  const router = useRouter();
  return (
    <DialogContainer
      active={active}
      onClick={() => {
        router.push("/dialogs/[id]", `/dialogs/${dialogid}`);
      }}
    >
      <ImgAvatar src={avatarImg} />
      <DialogInfo>
        <TopInfo>
          <UserName>{name} </UserName>

          <MsgInfo>
            <CheckIcon style={{ color: "#6b757f" }} fontSize="small" />
            <Time>{time.format("H:m")}</Time>
          </MsgInfo>
        </TopInfo>
        <BotInfo>
          <Message>
            <Emoji
              // options={{
              //   baseUrl:
              //     "cdn.jsdelivr.net/npm/emoji-mart@3.0.0/data/apple.json",
              //   protocol: "https"

              // }}
              text={message}
            />
          </Message>
        </BotInfo>
      </DialogInfo>
    </DialogContainer>
  );
};
const ImgAvatar = styled.img`
  border-radius: 50px;
  height: 48px;
  width: 48px;
`;

const UserName = styled.div`
  font-size: 14px;
  color: #efe9e9;
  display: flex;
  align-items: flex-end;
`;
const Message = styled.div`
  color: grey;
  font-size: 13px;
  display: flex;
  align-items: flex-end;
  border-bottom: 1px solid gray;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
`;
const DialogContainer = styled.div`
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
const DialogInfo = styled.div`
  display: flex;
  width: 30vh;
  max-height: 60px;
  flex-direction: column;
  margin-left: 16px;
`;
const TopInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const BotInfo = styled.div`
  width: 100%;
  display: flex;
`;
const Time = styled.div`
  color: grey;
  margin-right: 10px;
  font-size: 14px;
`;
const MsgInfo = styled.div`
  display: flex;
  justify-content: flex-end;
`;

/*
${p =>
    p.active &&
    css`
      ${DialogContainer} {
  background-color: #2b5279;
}
`}*/
