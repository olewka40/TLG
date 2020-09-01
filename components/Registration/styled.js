import styled from "styled-components";
import { Button, Link } from "@material-ui/core";

export const Title = styled.div`
   {
    font-size: 24px;
    margin: 10px;
    font-weight: 400;
  }
`;
export const Container = styled.div`
   {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;
export const StyledLink = styled(Link)`
   {
    margin: 15px !important;
  }
`;
export const StyledButton = styled(Button)`
   {
    margin-top: 10px !important;
    margin-bottom: 10px !important;
  }
`;
export const RegistrationForm = styled.div`
   {
    margin-top: 100px;
    width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;
