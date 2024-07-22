import { useEffect, useState } from "react";
import Header from "./Header";

function Signup({ saveAccount, fetchAccounts, dispatch, loggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(
    function () {
      async function getAccounts() {
        const accounts = await fetchAccounts();
        await dispatch({ type: "fetchAccounts", payload: accounts });
      }
      getAccounts();
    },
    [dispatch, fetchAccounts]
  );

  const handleSignup = async () => {
    if (!username || !password) {
      setErrorMessage("Please Enter user name and password");
      return;
    }
    const newAccount = { id: Date.now(), username, password, score: 0 };
    await saveAccount(newAccount);
    const updatedAccounts = await fetchAccounts();
    dispatch({ type: "fetchAccounts", payload: updatedAccounts });
    setUsername("");
    setPassword("");
    setErrorMessage("");
    setMessage("Registered successfully, please login to start your quiz");
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage("Please Enter user name and password");
      setMessage("");
      return;
    }
    dispatch({ type: "login", payload: { username, password } });
    setUsername("");
    setPassword("");
    setErrorMessage("");
    if (!loggedIn) setErrorMessage("Wrong user name or Password");
  };

  return (
    <>
      <Header />
      <div className="signup">
        <h2>Signup/Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMessage ? <p className="errorMessage">{errorMessage}</p> : null}
        {message ? <p className="signupMessage">{message}</p> : null}
        <div className="buttons">
          <button className="btn" onClick={handleSignup}>
            Signup
          </button>
          <button className="btn" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </>
  );
}

export default Signup;
