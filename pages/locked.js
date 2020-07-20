import React, { Component, useCallback, useState } from "react";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useRouter } from "next/router";

export const Locked = () => {
  const router = useRouter();
  const logout = useCallback(async () => {
    await axios.get("/api/authorization/logout");
    router.replace("/login");
  }, []);
  const [text, setText] = useState("");

  const passwordHandle = e => {
    setText(e.target.value);
  };
  const handleSubmit = async () => {
    const {
      data: { isRight }
    } = await axios.post("/api/unlock", {
      lockPass: text
    });
    if (isRight) {
      router.push("/");
    }
  };

  return (
    <Container>
      <StyledText>Введите код-пароль</StyledText>
      <StyledInput>
        <form noValidate autoComplete="off">
          <TextField
            style={{ height: 60, width: 215 }}
            id="lockscreen"
            type="lockscreen"
            label="Код доступа"
            variant="outlined"
            autoFocus={true}
            required={true}
            onChange={e => passwordHandle(e)}
          />
        </form>
      </StyledInput>
      <StyledButton>
        <Button
          style={{ width: 215, height: 60, backgroundColor: "#2f6ea4" }}
          variant="contained"
          size="large"
          color="inherit"
          onClick={handleSubmit}
        >
          ПОДТВЕРДИТЬ
        </Button>
      </StyledButton>
      <StyledA href="" onClick={logout}>
        Выйти
      </StyledA>
    </Container>
  );
};

export default Locked;

const Container = styled.div`
  background-color: #0e1621;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const StyledText = styled.div`
  color: #e6f3fb;
  margin-bottom: 50px;
  margin-top: -225px;
  font-size: 20px;
`;
const StyledInput = styled.div`
  margin: 5px;
  color: #2f6ea4;
  > .MuiInputLabel-outlined.MuiInputLabel-shrink {
    color: #2f6ea4;
  }
  .MuiFormLabel-root.Mui-focused {
    color: #2f6ea4;
  }
  .MuiInputLabel-root {
    color: #2f6ea4;
  }
  .MuiInputLabel-formControl {
    color: #2f6ea4;
  }
  .MuiInputLabel-animated {
    color: #2f6ea4;
  }
  .MuiInputLabel-outlined {
    color: #2f6ea4;
  }
  .MuiInputBase-root {
    color: #2f6ea4;
    border-color: #2f6ea4;
  }
  .MuiOutlinedInput-root.Mui-focused {
    border-color: #2f6ea4;
  }
  .MuiOutlinedInput-notchedOutline {
    border-width: 2px;
    border-color: #2f6ea4;
  }
`;
const StyledButton = styled.div`
  margin: 5px;
  color: #e6f3fb;
`;
const StyledA = styled.a`
  margin: 5px;

  color: #2f6ea4;
`;
