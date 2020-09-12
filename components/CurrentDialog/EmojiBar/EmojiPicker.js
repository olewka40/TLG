import React from "react";
import { Picker } from "emoji-mart";
import { EmojiPickerContainer } from "./styled";

export const EmojiPicker = ({ message,setMessage }) => {
  console.log(message, 3213123123);
  return (
    <EmojiPickerContainer>
      <Picker
        style={{
          width: 300,
          borderRadius: 3,
          overflowY: "hidden"
        }}
        title="Pick your emoji…"
        emoji="point_up"
        set="apple"
        onSelect={emoji => setMessage(message + emoji.colons)}
      />
    </EmojiPickerContainer>
  );
};
