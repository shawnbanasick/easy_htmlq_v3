import { store } from "@risingstack/react-easy-state";

const globalState = store({
  cardFontSize: 15,
  cardHeight: 100,

  checkRequiredQuestionsComplete: false,
  currentPage: "landing",
  dataLoaded: false,
  defaultCardFontSize: 15,
  displayAccessCodeWarning: false,
  displayContinueButton: false,
  displayLandingContent: false,
  displayNextButton: false,
  displayPartIdWarning: false,
  overloadedColumn: "",
  partId: "anonymous",
  presortPosCards: [],
  presortNeuCards: [],
  presortNegCards: [],
  presortCards: [],
  presortSortedStatements: 0,
  progressScore: 10,
  rating2State: {},
  requiredAnswersObj: {},
  sortFinishedModalHasBeenShown: false,
  sortGridResults: {},
  triggerLandingModal: false,
  triggerPresortModal: false,
  triggerSortModal: false,
  triggerSortingFinishedModal: false,
  triggerPostsortModal: false,
  userInputPartId: "",
  userInputAccessCode: "",
  results: {},
});

export default globalState;
