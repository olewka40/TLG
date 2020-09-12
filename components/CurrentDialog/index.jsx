import React, { useState, memo, useContext, useCallback } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MessageContext } from "../../context/messages";
import { EmojiBar } from "./EmojiBar";
import { MessageLayoutContext } from "../../context/messageLayoutContext";
import { DialogsList } from "./Messages/DialogsList";
import { OpenedDialog, MainItems, Messeges } from "./styled";
import { useRouter } from "next/router";
import SocketService from "../../services/SocketService";

export const DialogContainer = memo(() => {
  const [isLayoutOpened, setLayoutOpened] = useState(false);
  const [message, setMessage] = useState("");

  const { messages } = useContext(MessageContext);
  // const data = messages.sort((a, b) => (a.time > b.time ? 1 : -1));
  const router = useRouter();

  const onSend = useCallback(
    (areaRef, setMessage) => {
      if (!areaRef.current.value) return;

      SocketService.emit("message-to-dialog", {
        dialogId: router.query.id,

        message: areaRef.current.value
      });
      areaRef.current.value = "";
      setMessage("");
    },
    [router.query.id, message]
  );
  return (
    <MessageLayoutContext.Provider
      value={{ isLayoutOpened, onSend, setLayoutOpened }}
    >
      <OpenedDialog>
        <MainItems>
          <Header />
          <Messeges>
            {messages.map(message => (
              <DialogsList key={message.id} message={message} />
            ))}
          </Messeges>
          <Footer message={message} setMessage={setMessage} />
        </MainItems>
        {isLayoutOpened && (
          <EmojiBar message={message} setMessage={setMessage} />
        )}
      </OpenedDialog>
    </MessageLayoutContext.Provider>
  );
});
