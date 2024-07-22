import { useReducer } from "react";

const API_URL = "http://localhost:8000/accounts";

const accountsInitialState = {
  accounts: [],
  loggedInAccount: null,
  loggedIn: false,
};

async function fetchAccounts() {
  const response = await fetch(API_URL);
  const data = await response.json();
  return data;
}

async function saveAccount(account) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
  });
  const data = await response.json();
  return data;
}

// async function updateAccount(id, updates) {
//   const response = await fetch(`${API_URL}/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(updates),
//   });
//   const data = await response.json();
//   return data;
// }

async function updateAccount(id, updates) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update account with ID ${id}: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function accountReducer(state, action) {
  switch (action.type) {
    case "fetchAccounts":
      return { ...state, accounts: action.payload };

    case "signup":
      saveAccount(action.payload);
      return {
        ...state,
        error: null,
        accounts: [...state.accounts, action.payload],
      };

    case "login":
      const account = state.accounts.find(
        (acc) =>
          acc.username === action.payload.username &&
          acc.password === action.payload.password
      );
      if (account) {
        return {
          ...state,
          loggedInAccount: account,
          loggedIn: true,
          error: null,
        };
      } else {
        return {
          ...state,
          loggedInAccount: null,
          loggedIn: false,
        };
      }

    case "exit":
      return { ...state, loggedInAccount: null, loggedIn: false };

    // case "updateScore":
    //   const updatedAccount = {
    //     ...state.loggedInAccount,
    //     score: action.payload,
    //   };

    //   // Call the asynchronous updateAccount function to update the score on the server
    //   updateAccount(updatedAccount.id, { score: action.payload })
    //     .then((response) => {
    //       console.log("Score updated successfully:", response);
    //     })
    //     .catch((error) => {
    //       console.error("Failed to update score:", error.message);
    //     });

    //   return {
    //     ...state,
    //     loggedInAccount: updatedAccount,
    //     accounts: state.accounts.map((acc) =>
    //       acc.id === updatedAccount.id ? updatedAccount : acc
    //     ),
    //   };

    case "updateScore":
      const updatedAccount = {
        ...state.loggedInAccount,
        score: action.payload,
      };

      // Call the asynchronous updateAccount function to update the score on the server
      updateAccount(String(updatedAccount.id), { score: action.payload })
        .then((response) => {
          console.log("Score updated successfully:", response);
        })
        .catch((error) => {
          console.error("Failed to update score:", error.message);
        });

      return {
        ...state,
        loggedInAccount: updatedAccount,
        accounts: state.accounts.map((acc) =>
          acc.id === updatedAccount.id ? updatedAccount : acc
        ),
      };

    default:
      throw new Error("Action unknown");
  }
}

function useAccount() {
  const [state, dispatch] = useReducer(accountReducer, accountsInitialState);

  const { accounts, loggedInAccount, loggedIn, error } = state;

  return {
    accounts,
    loggedInAccount,
    loggedIn,
    accDispatch: dispatch,
    error,
  };
}

export { fetchAccounts, saveAccount, updateAccount, useAccount };
