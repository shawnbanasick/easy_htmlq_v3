import React, { useEffect, Suspense } from "react";
import setGlobalState from "../../globalState/setGlobalState";
import styled, { keyframes } from "styled-components";
import { view } from "@risingstack/react-easy-state";
import ReactHtmlParser from "react-html-parser";
import decodeHTML from "../../utilities/decodeHTML";
import getGlobalState from "../../globalState/getGlobalState";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import LandingModal from "../landing/LandingModal";
import LogInScreen from "./LogInScreen";
import PartIdScreen from "./PartIdScreen";

const langObj = JSON.parse(localStorage.getItem("langObj"));
const configObj = JSON.parse(localStorage.getItem("configObj"));
const welcomeTextHtml = decodeHTML(langObj.welcomeText);
let startTime;

// const initialScreen = setLandingInitialScreen();

const LandingPage = () => {
  useEffect(() => {
    setTimeout(() => {
      setGlobalState("progressScore", 10);
    }, 100);
    setGlobalState("currentPage", "landing");
    localStorage.setItem("progressScore", 10);
  }, []);

  // calc time on page
  useEffect(() => {
    startTime = Date.now();
    return () => {
      calculateTimeOnPage(startTime, "landingPage", "landingPage");
    };
  }, []);

  // check for complete
  const dataLoaded = getGlobalState("dataLoaded");
  const displayLandingContent = getGlobalState("displayLandingContent");
  let displayLogInScreen = false;
  let displayPartIdScreen = false;

  const initialScreenSetting = configObj.initialScreen;
  if (
    initialScreenSetting === "partId-access" &&
    displayLandingContent === false
  ) {
    displayLogInScreen = true;
  }
  if (initialScreenSetting === "partId" && displayLandingContent === false) {
    displayPartIdScreen = true;
  }
  // if ()

  return (
    <Suspense fallback={<h2>Loading...</h2>}>
      {dataLoaded && (
        <React.Fragment>
          <SortTitleBar>{langObj.landingHead}</SortTitleBar>
          <LandingModal />
          <ContainerDiv>
            {displayLogInScreen && <LogInScreen />}
            {displayPartIdScreen && <PartIdScreen />}
            {displayLandingContent && (
              <ContentDiv>{ReactHtmlParser(welcomeTextHtml)}</ContentDiv>
            )}
          </ContainerDiv>
        </React.Fragment>
      )}
    </Suspense>
  );
};

export default view(LandingPage);

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const ContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 70px;
  padding-top: 50px;
  transition: 0.3s ease all;

  img {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  iframe {
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;

const ContentDiv = styled.div`
  width: 75vw;
  font-size: 1.25em;
  visibility: ${(props) => (props.view ? "hidden" : "visible")};
  animation: ${(props) => (props.view ? fadeOut : fadeIn)} 0.5s linear;
  transition: visibility 0.5s linear;
`;

const SortTitleBar = styled.div`
  width: calc(100vw-4px);
  padding-left: 1.5vw;
  padding-right: 1.5vw;
  padding-top: 5px;
  min-height: 50px;
  background-color: black;
  display: flex;
  justify-content: center;
  align-content: center;
  color: white;
  font-weight: bold;
  font-size: 28px;
`;
