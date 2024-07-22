import { useEffect } from "react";
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
import { Secs_Per_Question, useQuestion } from "../reducers/questionReducer";
import {
  useAccount,
  saveAccount,
  fetchAccounts,
  updateAccount,
} from "../reducers/accountReducer";
import Signup from "./Signup";

export default function App() {
  const { accounts, loggedInAccount, loggedIn, accDispatch } = useAccount();

  const {
    questions,
    status,
    index,
    answer,
    points,
    highScore,
    secondsRemaining,
    dispatch,
  } = useQuestion();
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
    [restart, dispatch]
  );
  return (
    <div className="app">
      {loggedIn === false ? (
        <Signup
          saveAccount={saveAccount}
          fetchAccounts={fetchAccounts}
          dispatch={accDispatch}
          loggedIn={loggedIn}
        />
      ) : (
        <>
          <Header />
          <Main>
            {status === "loading" ? <Loader /> : null}
            {status === "error" ? <Error /> : null}
            {status === "ready" ? (
              <StartScreen
                loggedInAccount={loggedInAccount}
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
                    points={points}
                    accDispatch={accDispatch}
                  />
                  <Timer
                    dispatch={dispatch}
                    secondsRemaining={secondsRemaining}
                  />
                  {/* <TimerState
                    numQuestions={numberOfQuestions}
                    Secs_Per_Question={Secs_Per_Question}
                  /> */}
                </Footer>
              </>
            ) : null}
            {status === "finished" && (
              <FinishScreen
                points={points}
                maxPossiblePoints={maxPossiblePoints}
                highScore={highScore}
                dispatch={dispatch}
                updateAccount={updateAccount}
                loggedInAccount={loggedInAccount}
                accDispatch={accDispatch}
              />
            )}
          </Main>
        </>
      )}
    </div>
  );
}
