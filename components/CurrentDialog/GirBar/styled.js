import styled from "styled-components";

export const EmojiTabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  color: #0074c6;
  height: 100%;
  background: #17212b;
`;
export const EmojiPickerContainer = styled.div`
  height: calc(100% - 48px);

  .emoji-mart {
    display: flex;
    flex-direction: column-reverse;
    height: 100%;
  }
`;
