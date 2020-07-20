import React, { useContext, useState } from "react";
import { Picker } from "emoji-mart";
import styled from "styled-components";
import { MessageLayoutContext } from "../../context/messageLayoutContext";
import { Tab, Tabs, AppBar, Box, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { EmojiBarToMessageContext } from "../../context/emojiBarToMessageContext";

const TabPanel = props => {
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
};
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

const EmojiBar = () => {
  const { isLayoutOpened } = useContext(MessageLayoutContext);
  const [value, setValue] = React.useState(0);
  const [messagee, SetMessage] = useState("");


  if (!isLayoutOpened) {
    return null;
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <EmojiBarToMessageContext.Provider value={messagee}>
      <Container>
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
          <StyledPicker>
            <Picker
              style={{
                height: "100%",
                width: "300px",
                borderRadius: 3,
                overflowY: "hidden"
              }}
              title="Pick your emoji…"
              emoji="point_up"
              set="apple"
              onSelect={emoji => SetMessage(messagee + emoji.colons)}
            />
          </StyledPicker>
        </TabPanel>
        <TabPanel value={value} index={1}>
          Стикеры
        </TabPanel>
        <TabPanel value={value} index={2}>
          Гифки
        </TabPanel>
      </Container>
    </EmojiBarToMessageContext.Provider>
  );
};

export default EmojiBar;

const Container = styled.div`
  color: #6b757f;
  width: 300px;
  height: 100vh;
`;

const StyledPicker = styled.div`
  > .emoji-mart {
    display: flex;
    flex-direction: column-reverse;
    .emoji-mart-search {
      display: none;
    }
    .emoji-mart-scroll {
      height: calc(90vh);
    }
    .MuiTab-root {
      min-width: 100px;
    }
  }
`;
