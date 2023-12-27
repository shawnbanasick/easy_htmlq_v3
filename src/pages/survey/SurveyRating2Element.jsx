import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { v4 as uuid } from "uuid";
import ReactHtmlParser from "react-html-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useStore from "../../globalState/useStore";
import useLocalStorage from "../../utilities/useLocalStorage";
import flatten from "lodash/flatten";
import countBy from "lodash/countBy";

const getResults = (state) => state.resultsSurvey;
const getSetResultsSurvey = (state) => state.setResultsSurvey;
const getCheckReqQsComplete = (state) => state.checkRequiredQuestionsComplete;
const getRequiredAnswersObj = (state) => state.requiredAnswersObj;
const getSetRequiredAnswersObj = (state) => state.setRequiredAnswersObj;

const SurveyRatings2Element = (props) => {
  // HELPER FUNCTIONS
  const getOptionsArray = (options) => {
    let array = options.split(";;;");
    array = array.filter(function (e) {
      return e;
    });
    return array;
  };

  // PROPS
  const optsArray = getOptionsArray(props.opts.options);
  const rows = optsArray.length;
  const questionId = `qNum${props.opts.qNum}`;

  // GLOBAL STATE
  const results = useStore(getResults);
  const setResultsSurvey = useStore(getSetResultsSurvey);
  const checkRequiredQuestionsComplete = useStore(getCheckReqQsComplete);
  const requiredAnswersObj = useStore(getRequiredAnswersObj);
  const setRequiredAnswersObj = useStore(getSetRequiredAnswersObj);

  // PERSISTENT STATE
  const answersStorage =
    JSON.parse(localStorage.getItem("answersStorage")) || {};
  let [checkedState, setCheckedState] = useLocalStorage(
    questionId,
    Array.from({ length: rows }, () => Array.from({ length: 2 }, () => false))
  );

  // LOCAL STATE
  let [testValue, setTestValue] = useState(5);
  const [formatOptions, setFormatOptions] = useState({
    bgColor: "whitesmoke",
    border: "none",
  });
  const [localStore, setLocalStore] = useState({});

  // register default results if no input
  useEffect(() => {
    let array = props.opts.options.split(";;;");
    array = array.filter(function (e) {
      return e;
    });
    const length = array.length;
    for (let i = 0; i < length; i++) {
      results[`qNum${props.opts.qNum}-${i + 1}`] = "no response";
    }
    setResultsSurvey(results);
  }, [props, setResultsSurvey, results]);

  useEffect(() => {
    const rating2State = localStore;
    console.log("rating2state", rating2State);
    const testArray = Object.keys(rating2State);
    const conditionalLength = testArray.length;
    setTestValue(optsArray.length - conditionalLength);
    console.log("show yellow", optsArray.length - conditionalLength);
  }, [localStore, optsArray.length]);

  // ****** GET SCALE ARRAY *******
  const getScaleArray = (options) => {
    let array = options.split(";;;");
    return array;
  };
  const scaleArray = getScaleArray(props.opts.scale);

  // ****** ON CHANGE  *******
  const handleChange = (selectedRow, column, e) => {
    let name = e.target.name;
    let value = e.target.value;
    // needed for required question check
    const newObj = localStore;
    newObj[name] = value;
    setLocalStore(newObj);
    answersStorage[questionId] = newObj;
    // update local state with radio selected
    const newArray = [];
    const newCheckedState = checkedState.map(function (row, index) {
      if (selectedRow === index) {
        row.map(function (item, index) {
          if (column === index) {
            newArray.push(true);
            return null;
          } else {
            newArray.push(false);
            return null;
          }
        });
        return newArray;
      } else {
        return row;
      }
    });
    console.log("newCheckedState", newCheckedState);
    setCheckedState(newCheckedState);
    answersStorage[questionId]["checkedState"] = [...newCheckedState];
    localStorage.setItem("answersStorage", JSON.stringify(answersStorage));
    // record if answered or not
    if (newCheckedState.length > 0) {
      requiredAnswersObj[questionId] = "answered";
    } else {
      requiredAnswersObj[questionId] = "no response";
    }
    setRequiredAnswersObj(requiredAnswersObj);
    results[name] = +value;
    setResultsSurvey(results);
    const rating2State = localStore;
    const testArray = Object.keys(rating2State);
    const conditionalLength = testArray.length;
    setTestValue(optsArray.length - conditionalLength);
    console.log(optsArray.length - conditionalLength);
  }; // end handleChange

  if (questionId in answersStorage) {
    const keys2 = Object.keys(answersStorage[questionId]);
    // skip check for "all answered" if not required
    if (props.opts.required === true || props.opts.required === "true") {
      let objLen = keys2.length - 1;
      if (objLen >= rows) {
        testValue = 0;
        requiredAnswersObj[questionId] = "answered";
        setRequiredAnswersObj(requiredAnswersObj);
      } else {
        testValue = 1;
        requiredAnswersObj[questionId] = "no response";
        setRequiredAnswersObj(requiredAnswersObj);
      }
    }
    keys2.forEach((item, index) => {
      if (item !== "checkedState") {
        results[item] = answersStorage[questionId][item];
      }
    });
    // checkedState = [...answersStorage[questionId]["checkedState"]];
  }

  // ****** CHECK IF ALL PARTS ANSWERED *******
  let setYellow = false;
  let arrayLen = checkedState.length;
  let flattenedCheckedState = flatten([...checkedState]);
  let count = countBy(flattenedCheckedState);
  let objTestValue = count[true] || 0;
  if (objTestValue < arrayLen) {
    setYellow = true;
  }

  useEffect(() => {
    // if is a required question, check if all parts answered
    if (
      (props.opts.required === true || props.opts.required === "true") &&
      checkRequiredQuestionsComplete === true &&
      setYellow
    ) {
      setFormatOptions({ bgColor: "#fde047", border: "3px dashed black" });
    } else {
      setFormatOptions({
        bgColor: "whitesmoke",
        border: "none",
      });
    }
  }, [
    checkRequiredQuestionsComplete,
    testValue,
    setYellow,
    props.opts.required,
  ]);

  const RadioItems = () => {
    const radioList = optsArray.map((item, index) => {
      const itemText = ReactHtmlParser(decodeHTML(item));
      return (
        <ItemContainer indexVal={index} key={uuid()}>
          <OptionsText key={uuid()}>{itemText}</OptionsText>
          <RadioInput
            key={uuid()}
            id={`Q-${index}`}
            type="radio"
            value={1}
            name={`qNum${props.opts.qNum}-${index + 1}`}
            onChange={(e) => handleChange(index, 0, e)}
            checked={checkedState[index][0]}
          />
          <RadioInput
            key={uuid()}
            id={`Q2-${index}`}
            type="radio"
            value={2}
            name={`qNum${props.opts.qNum}-${index + 1}`}
            onChange={(e) => handleChange(index, 1, e)}
            checked={checkedState[index][1]}
          />
        </ItemContainer>
      );
    });
    return <div>{radioList}</div>;
  };

  const labelText = ReactHtmlParser(decodeHTML(props.opts.label));

  return (
    <Container bgColor={formatOptions.bgColor} border={formatOptions.border}>
      <TitleBar>
        <div>{labelText}</div>
      </TitleBar>
      <RadioContainer>
        <RatingTitle>
          <div />
          <ScaleDiv>
            <div>{ReactHtmlParser(decodeHTML(scaleArray[0]))}</div>
          </ScaleDiv>
          <ScaleDiv>
            <div>{ReactHtmlParser(decodeHTML(scaleArray[1]))}</div>
          </ScaleDiv>
        </RatingTitle>
        <RadioItems />
      </RadioContainer>
    </Container>
  );
};

export default SurveyRatings2Element;

const Container = styled.div`
  width: 90vw;
  padding: 20px;
  margin-left: 20px;
  margin-right: 20px;
  max-width: 1300px;
  min-height: 200px;
  background-color: ${(props) => props.bgColor};
  outline: ${(props) => props.border};
  outline-offset: -3px;
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  padding: 5px;
  font-size: 18px;
  text-align: center;
  background-color: lightgray;
  width: 100%;
  border-radius: 3px;
`;

const RadioContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: left;
  padding: 20px;
  vertical-align: center;
  margin-top: 0px;
  height: auto;
  min-height: 50px;
  font-size: 16px;
  background-color: white;
  width: 100%;
  border-radius: 3px;
  border: 2px solid lightgray;

  input {
    margin-top: 8px;
  }

  label {
    margin-left: 8px;
  }
`;

const ItemContainer = styled.div`
  display: inline-grid;
  grid-template-columns: minmax(30%, 900px) 100px 100px 150px;
  margin-bottom: 17px;
  padding-left: 5px;
  padding-bottom: 8px;
  height: 40px;
  align-items: end;
  background-color: ${(props) => (props.indexVal % 2 ? "white" : "#ececec")};
  &:hover {
    background-color: rgba(131, 202, 254, 0.4);
  }
`;

const RatingTitle = styled.div`
  display: inline-grid;
  grid-template-columns: minmax(30%, 900px) 100px 100px 150px;
  margin-bottom: 7px;
`;

const ScaleDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RadioInput = styled.input`
  display: flex;
  justify-self: center;
  align-self: center;
  border: 0px;
  width: 100%;
  height: 1.4em;
`;

const OptionsText = styled.span`
  margin-bottom: 2px;
  padding-left: 5px;
`;
