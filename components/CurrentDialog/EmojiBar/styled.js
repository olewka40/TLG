import styled from "styled-components";
import SwipeableViews from "react-swipeable-views";

export const EmojiTabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  color: #0074c6;
  height: 100%;
  background: #17212b;
`;
export const EmojiPickerContainer = styled.div`
  height: 100%;

  .emoji-mart {
    display: flex;
    flex-direction: column-reverse;
    height: 100%;
  }
`;
export const StyledSwipeableViews = styled(SwipeableViews)`
  height: 100%;
  > .react-swipeable-view-container div {
    overflow-x: hidden;
  }
  > .react-swipeable-view-container,
  > .react-swipeable-view-container > div,
  > .react-swipeable-view-container > div > div > div {
    height: 100%;
  }
`;
