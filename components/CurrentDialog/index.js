import React, { useState } from "react";
import styled, { css } from "styled-components";
import Header from "./header";
import Footer from "./footer";
import { MessageContext } from "../../context/messages";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import { UserContext } from "../../context/user";
import Emoji from "react-emoji-render";
import EmojiBar from "./emojiBar";
import { MessageLayoutContext } from "../../context/messageLayoutContext";

const avatarImg =
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d58c388e-ba39-4c44-b7cc-f946935e8cd5/d6flm7g-21fac699-362f-4190-b39d-85749643e55e.png/v1/fill/w_581,h_581,strp/biggrin_3d_by_alchemlst_d6flm7g-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTgxIiwicGF0aCI6IlwvZlwvZDU4YzM4OGUtYmEzOS00YzQ0LWI3Y2MtZjk0NjkzNWU4Y2Q1XC9kNmZsbTdnLTIxZmFjNjk5LTM2MmYtNDE5MC1iMzlkLTg1NzQ5NjQzZTU1ZS5wbmciLCJ3aWR0aCI6Ijw9NTgxIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.YQ05nFF8ssGlta8WheOeLw52XcP_tmlv7Dhdvg-sgTY";

export const DialogContainer = () => {
  const [isLayoutOpened, setLayoutOpened] = useState(false);

  return (
    <MessageLayoutContext.Provider value={{ isLayoutOpened, setLayoutOpened }}>
      <OpenedDialog>
        <MainItems>
          <Header />
          <Messeges>
            <UserContext.Consumer>
              {({ userId }) => (
                <MessageContext.Consumer>
                  {({ messages }) =>
                    messages &&
                    messages.map(message => {
                      return (
                        <ListOfMesseges
                          isSender={message.senderId === userId}
                          key={message.id}
                        >
                          <ImgAvatarCurrent src={avatarImg} />
                          <Messege>
                            <TextMessage>
                              <Emoji
                                // options={{
                                //   baseUrl:
                                //     "cdn.jsdelivr.net/npm/emoji-mart@3.0.0/data/apple.json",
                                //   protocol: "https"

                                // }}
                                text={message.text}
                              />
                            </TextMessage>

                            <Time>
                              {message.time
                                ? message.time.format("H:mm")
                                : null}
                            </Time>
                            <Readed>
                              {/*<CheckIcon color={"primary"} />*/}
                              <DoneAllIcon color="primary" />
                            </Readed>
                          </Messege>
                        </ListOfMesseges>
                      );
                    })
                  }
                </MessageContext.Consumer>
              )}
            </UserContext.Consumer>
          </Messeges>
          <Footer />
        </MainItems>

        <EmojiBar />
      </OpenedDialog>
    </MessageLayoutContext.Provider>
  );
};

const OpenedDialog = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
`;
const MainItems = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;
const Messeges = styled.div`
  height: 95vh;
  background: #0e1621;
  overflow-y: auto;
  padding: 10px;
`;
const ListOfMesseges = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  ${p =>
    p.isSender &&
    css`
      ${ImgAvatarCurrent} {
        display: none;
      }
      justify-content: flex-end;
    `}
`;

const TextMessage = styled.div`
  display: flex;
  padding: 5px 10px;
  color: #efe9e9;
  width: 100%;
  word-break: break-word;
  white-space: pre-wrap;
`;
const Messege = styled.div`
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
const ImgAvatarCurrent = styled.img`
  border-radius: 50px;
  margin: 5px;
  height: 25px;
  margin-top: 10px;
  width: 25px;
`;

const Time = styled.div`
  color: grey;
  margin-right: 10px;
  display: flex;
  height: 100%;
  align-items: flex-end;
  font-size: 14px;
`;
const Readed = styled.div`
  padding-right: 5px;
  height: 100%;
  display: flex;
  align-items: flex-end;
`;
