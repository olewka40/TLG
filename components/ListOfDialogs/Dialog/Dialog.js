import { useRouter } from "next/router";
import CheckIcon from "@material-ui/icons/Check";
import Emoji from "react-emoji-render";
import React from "react";
import Moment from "react-moment";
import {
  DialogContainer,
  ImgAvatar,
  DialogInfo,
  TopInfo,
  UserName,
  MsgInfo,
  Time,
  BotInfo,
  Message
} from "./styled";
import { avatarImg } from "../../constants";

export const Dialog = ({
  dialogid,
  active,
  // avatarImg,
  name,
  message,
  time,
  readed,
  opened
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
      {opened && (
        <DialogInfo>
          <TopInfo>
            <UserName>{name} </UserName>

            <MsgInfo>
              <CheckIcon color="primary" fontSize="small" />
              <Time>
                <Moment format="HH:mm">{time}</Moment>
              </Time>
            </MsgInfo>
          </TopInfo>
          <BotInfo>
            <Message>
              <Emoji text={message} />
            </Message>
          </BotInfo>
        </DialogInfo>
      )}
    </DialogContainer>
  );
};
