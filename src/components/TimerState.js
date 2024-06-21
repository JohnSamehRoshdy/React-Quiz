import { useEffect, useState } from "react";

function TimerState({ numQuestions, Secs_Per_Question }) {
  const [secondsRemaining, setSecondsRemaining] = useState(
    numQuestions * Secs_Per_Question
  );
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  useEffect(function () {
    setInterval(() => {
      setSecondsRemaining((secondsRemaining) => secondsRemaining - 1);
    }, 1000);
  }, []);
  return (
    <div className="timer">
      {mins < 10 ? `0${mins}` : `${mins}`} :{" "}
      {secs < 10 ? `0${secs}` : `${secs}`}
    </div>
  );
}

export default TimerState;
