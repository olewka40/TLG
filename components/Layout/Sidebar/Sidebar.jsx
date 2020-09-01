import React, { useCallback, useState, memo } from "react";
import { IconButton } from "@material-ui/core";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Menu } from "@material-ui/icons";
import { useRouter } from "next/router";
import axios from "axios";
import ListOfDialogs from "../../ListOfDialogs";
import { StyledSidebar, StyledToolbar, Header, Footer, Main } from "./styled";
import { Searcher } from "./Searcher";

export const Sidebar = memo(() => {
  const [opened, setOpen] = useState(true);

  const router = useRouter();

  const logout = useCallback(async () => {
    await axios.get("/logout");
    router.replace("/login");
  }, []);

  return (
    <StyledSidebar opened={opened}>
      <Header>
        <StyledToolbar>
          <IconButton
            color="primary"
            aria-label="menu"
            onClick={() => {
              setOpen(!opened);
            }}
          >
            <Menu />
          </IconButton>
          {opened && (
            <>
              <Searcher />

              <IconButton
                onClick={() => {
                  router.push("/locked");
                }}
              >
                <LockOpenIcon color="primary" />
              </IconButton>
            </>
          )}
        </StyledToolbar>
      </Header>
      <Main>
        <ListOfDialogs opened={opened} />
      </Main>
      <Footer>
        <IconButton size="medium">
          <ExitToAppIcon color="primary" fontSize="large" onClick={logout} />
        </IconButton>
      </Footer>
    </StyledSidebar>
  );
});
