import { createContext, Dispatch, useContext, useReducer } from "react";
import { AuthContext } from "../context/AuthContext.tsx";

type User = {
  displayName: string;
  photoURL: string;
  uid: string;
};

export type Data = {
  data: {
    chatId: string;
    user: User;
  };
  dispatch: Dispatch<any> | ((action: any) => void);
};

type ActionType = {
  type: "CHANGE_USER";
  payload: User;
};
export const UserContext = createContext<Data>({
  data: {
    chatId: "null",
    user: {
      displayName: "",
      photoURL: "",
      uid: "",
    },
  },
  dispatch: () => {},
});

export const UserContextProvider = (props: any) => {
  const currentUser = useContext(AuthContext);

  const INITIAL_STATE = {
    chatId: "null",
    user: {
      displayName: "",
      photoURL: "",
      uid: "",
    },
  };
  const chatReducer = (state: typeof INITIAL_STATE, action: ActionType) => {
    switch (action.type) {
      case "CHANGE_USER":
        const userId = action ? action.payload.uid : "";
        const currentUserId = currentUser ? currentUser.uid : "";
        return {
          user: action.payload,
          chatId: currentUserId > userId ? currentUserId + userId : userId + currentUserId,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return <UserContext.Provider value={{ data: state, dispatch }}>{props.children}</UserContext.Provider>;
};
