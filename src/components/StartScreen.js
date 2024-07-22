function StartScreen({ numberOfQuestions, dispatch, loggedInAccount }) {
  return (
    <div className="start">
      <h2>Welcome {loggedInAccount.username} to React quiz !!</h2>
      <h3>{numberOfQuestions} questions to test your react mastery</h3>
      <button
        onClick={() => dispatch({ type: "start" })}
        className="btn btn-ui"
      >
        {" "}
        Let's Start ...
      </button>
    </div>
  );
}

export default StartScreen;
