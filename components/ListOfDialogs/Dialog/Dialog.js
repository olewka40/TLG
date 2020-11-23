import { useRouter } from "next/router";
import CheckIcon from "@material-ui/icons/Check";
import Emoji from "react-emoji-render";
import React, { useCallback, useEffect, useState } from "react";
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

export const Dialog = ({
  userId,
  dialogid,
  active,
  name,
  message,
  time,
  users,
  opened
}) => {
  const router = useRouter();
  const opponent = users.filter(e => e._id !== userId);
  return (
    <DialogContainer
      active={active}
      onClick={() => {
        router.push("/dialogs/[id]", `/dialogs/${dialogid}`);
      }}
    >
      <ImgAvatar src={`http://192.168.102:3000/api/files/${opponent.avatar}`} />
      {opened && (
        <DialogInfo>
          <TopInfo>
            <UserName>{name} </UserName>

            {message && (
              <MsgInfo>
                <CheckIcon color="primary" fontSize="small" />
                <Time>
                  <Moment format="HH:mm">{time}</Moment>
                </Time>
              </MsgInfo>
            )}
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
