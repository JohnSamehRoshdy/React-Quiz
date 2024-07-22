function NextButton({
  dispatch,
  answer,
  index,
  numQuestions,
  points,
  accDispatch,
}) {
  if (answer === null) return null;
  if (index < numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );

  if (index === numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => {
          accDispatch({ type: "updateScore", payload: points });
          dispatch({ type: "finish" });
        }}
      >
        Finish
      </button>
    );
}

export default NextButton;
