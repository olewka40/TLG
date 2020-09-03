import React, { memo, useCallback, useContext, useRef, useState } from "react";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import SendIcon from "@material-ui/icons/Send";
import MoodIcon from "@material-ui/icons/Mood";
import styled from "styled-components";
import SocketService from "../../services/SocketService";
import { useRouter } from "next/router";
import TextareaAutosize from "react-textarea-autosize";
import { MessageLayoutContext } from "../../context/messageLayoutContext";

import { Popover, IconButton } from "@material-ui/core";
import { EmojiBar } from "./EmojiBar";

export const Footer = memo(() => {
  const router = useRouter();
  const areaRef = useRef();
  const [message, setMessage] = useState("");
  const onSend = useCallback(() => {
    if (!areaRef.current.value) return;

    SocketService.emit("message-to-dialog", {
      dialogId: router.query.id,

      message: areaRef.current.value
    });
    areaRef.current.value = "";
    setMessage("");
  }, [router.query.id]);

  const { isLayoutOpened, setLayoutOpened } = useContext(MessageLayoutContext);
  const [isHovered, setHovered] = useState(false);
  const triggerPicker = useCallback(() => {
    setHovered(false);

    setLayoutOpened(isLayoutOpened => !isLayoutOpened);
    console.log(isLayoutOpened, "LO");
    console.log(isHovered, "H");
  }, [setLayoutOpened, setHovered, isLayoutOpened]);
  const onMouseOver = useCallback(() => {
    if (isLayoutOpened === true) {
      return null;
    } else {
      setHovered(true);
    }
  }, [isHovered, setHovered]);
  const onMouseLeave = useCallback(() => {
    setHovered(false);
  }, [setHovered]);
  return (
    <MsgPlace>
      <IconButton>
        <AttachFileIcon color="primary" />
      </IconButton>
      <StyledTextArea>
        <TextareaAutosize
          className="area"
          wrap="soft"
          id="name"
          type="text"
          aria-describedby="name-desc"
          value={message}
          onChange={event => setMessage(event.target.value)}
          ref={areaRef}
        />
      </StyledTextArea>
      <IconButton
        onMouseMove={onMouseOver}
        onMouseLeave={onMouseLeave}
        onClick={triggerPicker}
      >
        <MoodIcon color="primary" />
        {isHovered && (
          <EmojiWrapper>
            <EmojiBar setMessage={setMessage} message={message} />
          </EmojiWrapper>
        )}
      </IconButton>
      <IconButton onClick={onSend}>
        <SendIcon color="primary" />
      </IconButton>
    </MsgPlace>
  );
});

const EmojiWrapper = styled.div`
  position: absolute;
  height: 740px;
  bottom: 58px;
  right: -38px;
`;

const MsgPlace = styled.div`
  display: flex;
  background: #17212b;
  align-items: flex-end;
  max-height: 100%;
`;

const StyledTextArea = styled.div`
  width: 100%;
  > .area {
    flex-grow: 1;
    outline: none;
    background-color: transparent;
    border: 0;
    font-size: 16px;
    font-family: Roboto, sans-serif;
    width: 100%;
    min-height: 30px;
    color: #efe9e9;
    overflow: hidden;
    resize: vertical;
  }
`;
