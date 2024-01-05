import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.ts";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";

export type CurrentUser = User | null;
export const AuthContext = createContext<CurrentUser>(null);

export const AuthContextProvider = (props: any) => {
  let [currentUser, setCurrentUser] = useState<CurrentUser>(null);

  useEffect(() => {
    const unSubscriber = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unSubscriber();
    };
  }, []);

  return <AuthContext.Provider value={currentUser}>{props.children}</AuthContext.Provider>;
};
