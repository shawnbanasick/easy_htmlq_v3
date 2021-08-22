import React from "react";
import { view } from "@risingstack/react-easy-state";
// import getGlobalState from "../../globalState/getGlobalState";
// import setGlobalState from "../../globalState/setGlobalState";
import styled from "styled-components";
import LogInSubmitButton from "./LogInSubmitButton";

const LogInScreen = () => {
  const langObj = JSON.parse(localStorage.getItem("langObj"));

  const handleLogIn = () => {
    console.log("log in");
  };

  const handleAccess = () => {
    console.log("code");
  };

  return (
    <Container>
      <div>
        <h2>{langObj.loginHeaderText}</h2>
        <StyledHr />
      </div>
      <div>
        <h3>{langObj.loginPartIdText}</h3>
        <StyledInput onChange={handleLogIn} type="text" />
      </div>
      <div>
        <h3>{langObj.accessInputText}</h3>
        <StyledInput onChange={handleAccess} type="text" />
      </div>
      <LogInSubmitButton />
    </Container>
  );
};

export default view(LogInScreen);

const Container = styled.div`
  display: grid;
  grid-template-rows: 23% 28% 28% 1fr;
  margin-top: 50px;
  width: 50vw;
  padding: 1.5vw;
  min-height: 400px;
  margin-bottom: 200px;
  border: 2px solid black;
  justify-self: center;
  background-color: whitesmoke;
`;

const StyledHr = styled.hr`
  margin-top: 5px;
  margin-bottom: 30px;
`;

const StyledInput = styled.input`
  margin-top: 5px;
  width: 400px;
  height: 30px;
  font-size: 1.4em;
  padding-left: 5px;
`;
