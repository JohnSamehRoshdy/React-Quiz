import { useEffect } from "react";

function FinishScreen({
  points,
  maxPossiblePoints,
  highScore,
  dispatch,
  updateAccount,
  loggedInAccount,
  accDispatch,
}) {
  // useEffect(
  //   function () {
  //     // updateAccount(loggedInAccount.id, { score: points });
  //     accDispatch({ type: "updateScore", payload: points });
  //   },
  //   [points, accDispatch]
  // );

  const percentage = (points / maxPossiblePoints) * 100;
  let emoji;
  if (percentage === 100) emoji = "🥇";
  if (percentage >= 80 && percentage < 100) emoji = "🥈";
  if (percentage >= 50 && percentage < 80) emoji = "🥉";
  if (percentage > 0 && percentage < 50) emoji = "⛔";
  if (percentage === 0) emoji = "🤦‍♂️";
  return (
    <>
      <p className="result">
        {emoji} you scored <strong>{points}</strong> out of {maxPossiblePoints}{" "}
        ({Math.ceil(percentage)} %)
      </p>
      <p className="highscore">(High score : {highScore} points)</p>
      <button
        className="btn btn-ui"
        onClick={() => {
          dispatch({ type: "restart" });
          accDispatch({ type: "exit" });
        }}
      >
        Restart Quiz
      </button>
      {/* <button
        className="btn btn-ui"
        onClick={() => {
          accDispatch({ type: "exit" });
        }}
      >
        Exit
      </button> */}
    </>
  );
}

export default FinishScreen;
