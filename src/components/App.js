import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import TimerState from "./TimerState";
const Secs_Per_Question = 30;
const initialState = {
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
function reducer(state, action) {
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
        ...initialState,
        highScore: state.highScore,
        questions: state.questions,
        status: "ready",
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

export default function App() {
  const [
    { questions, status, index, answer, points, highScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numberOfQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );
  let restart = false;
  useEffect(
    function () {
      fetch("http://localhost:8000/questions")
        .then((res) => res.json())
        .then((data) => dispatch({ type: "dataReceived", payload: data }))
        .catch((err) => dispatch({ type: "dataFailed" }));
    },
    [restart]
  );
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" ? <Loader /> : null}
        {status === "error" ? <Error /> : null}
        {status === "ready" ? (
          <StartScreen
            numberOfQuestions={numberOfQuestions}
            dispatch={dispatch}
          />
        ) : null}
        {status === "active" ? (
          <>
            <Progress
              index={index}
              numQuestions={numberOfQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numberOfQuestions}
              />
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <TimerState
                numQuestions={numberOfQuestions}
                Secs_Per_Question={Secs_Per_Question}
              />
            </Footer>
          </>
        ) : null}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
