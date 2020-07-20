import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from "react";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import SendIcon from "@material-ui/icons/Send";
import MoodIcon from "@material-ui/icons/Mood";
import styled from "styled-components";
import SocketService from "../../services/SocketService";
import { Picker, Emoji } from "emoji-mart";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import TextareaAutosize from "react-textarea-autosize";
import { MessageLayoutContext } from "../../context/messageLayoutContext";
import PropTypes from "prop-types";

import {
  Tab,
  Tabs,
  AppBar,
  Popover,
  IconButton,
  Box,
  Typography
} from "@material-ui/core";
import { EmojiBarToMessageContext } from "../../context/emojiBarToMessageContext";

const useStyles = makeStyles(theme => ({
  popover: {
    pointerEvents: "none"
  },
  popoverContent: {
    pointerEvents: "auto"
  }
}));
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{ padding: 0 }} p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};
export default () => {
  const router = useRouter();
  const areaRef = useRef();
  const [message, SetMessage] = useState("");
  const onSend = useCallback(() => {
    if (!areaRef.current.value) return;

    SocketService.emit("message-to-dialog", {
      dialogId: router.query.id,

      message: areaRef.current.value
    });
    areaRef.current.value = "";
    SetMessage("");
  }, [router.query.id]);

  const { isLayoutOpened, setLayoutOpened } = useContext(MessageLayoutContext);
  const [isHovered, setHovered] = useState(false);
  const triggerPicker = useCallback(
    event => {
      event.preventDefault();
      setLayoutOpened(!isLayoutOpened);
    },
    [isLayoutOpened, setLayoutOpened]
  );
  const onMouseOver = useCallback(() => {
    if (isLayoutOpened) {
      return;
    }
    setHovered(true);
  }, [isHovered]);
  const onMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  // const { messagee } = useContext(EmojiBarToMessageContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <MsgPlace>
      <IconButton>
        <AttachFileIcon style={{ color: "#6b757f" }} />
      </IconButton>
      <StyledTextArea>
        <TextareaAutosize
          style={{ height: 100 }}
          className="area"
          wrap="soft"
          id="name"
          type="text"
          aria-describedby="name-desc"
          value={message}
          onChange={event => SetMessage(event.target.value)}
          ref={areaRef}
        />
      </StyledTextArea>

      <IconButton onMouseMove={onMouseOver} onMouseLeave={onMouseLeave}>
        <MoodIcon style={{ color: "#6b757f" }} onClick={triggerPicker} />
        <Popover
          className={classes.popover}
          classes={{
            paper: classes.popoverContent
          }}
          open={isHovered}
          anchorReference="anchorPosition"
          anchorPosition={{ top: 875, left: 1920 }}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
        >
          <Tabs
            style={{ color: "#6b757f" }}
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            variant="standard"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab style={{ minWidth: "100px" }} label="emoji" />
            <Tab style={{ minWidth: "100px" }} label="stickers" />
            <Tab style={{ minWidth: "100px" }} label="gifs" />
          </Tabs>
          <TabPanel value={value} index={0}>
            <Picker
              style={{
                height: "600px",
                width: "300px",
                borderRadius: 3,
                overflowY: "hidden"
              }}
              title="Pick your emoji…"
              emoji="point_up"
              set="apple"
              onSelect={emoji => SetMessage(message + emoji.colons)}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            Стикеры
          </TabPanel>
          <TabPanel value={value} index={2}>
            Гифки
          </TabPanel>
        </Popover>
      </IconButton>
      <IconButton onClick={onSend}>
        <SendIcon style={{ color: "#6b757f" }} />
      </IconButton>
    </MsgPlace>
  );
};
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
