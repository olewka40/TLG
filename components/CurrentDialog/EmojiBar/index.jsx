import { Tab, Tabs } from "@material-ui/core";
import React, { Fragment, memo } from "react";
import PropTypes from "prop-types";
import { EmojiTabsContainer, StyledSwipeableViews } from "./styled";
import { EmojiPicker } from "./EmojiPicker";
import uuid from "react-uuid";
import styled from "styled-components";

export const EmojiBar = ({ setMessage, message }) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = index => {
    setValue(index);
  };
  return (
    <EmojiTabsContainer>
      <Tabs
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
      <StyledSwipeableViews index={value} onChangeIndex={handleChangeIndex}>
        <TabPanel value={value} index={0}>
          <EmojiPicker setMessage={setMessage} message={message} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          Стикеры
        </TabPanel>
        <TabPanel value={value} index={2}>
          Гифки
        </TabPanel>
      </StyledSwipeableViews>
    </EmojiTabsContainer>
  );
};

const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <StyledTabPanel
      key={uuid()}
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </StyledTabPanel>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

export const StyledTabPanel = styled.div`
  height: 100%;
  > div > div > div {
    height: 100%;
  }
`;
