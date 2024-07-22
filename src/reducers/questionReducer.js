import { useReducer } from "react";

const Secs_Per_Question = 30;
const questionInitialState = {
  questions: [],

  //"loading" , "error" , "ready" , "active" , "finished"
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
};
let restart = false;

function questionReducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      // console.log("done");
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      // console.log("Error  while fetching data");
      return { ...state, status: "error" };

    case "start":
      return {
        ...state,
        points: 0,
        status: "active",
        secondsRemaining: state.questions.length * Secs_Per_Question,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highscore,
      };
    case "restart":
      restart = !restart;
      return {
        ...questionInitialState,
        highScore: state.highScore,
        questions: state.questions,
        status: "ready",
        points: state.points,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Action unknown");
  }
}

function useQuestion() {
  const [state, dispatch] = useReducer(questionReducer, questionInitialState);

  const {
    questions,
    status,
    index,
    answer,
    points,
    highScore,
    secondsRemaining,
  } = state;

  return {
    questions,
    status,
    index,
    answer,
    points,
    highScore,
    secondsRemaining,
    dispatch,
  };
}
export {
  questionReducer,
  Secs_Per_Question,
  questionInitialState,
  useQuestion,
};
