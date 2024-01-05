import s from "./Navbar.module.scss";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase.ts";
import { useContext } from "react";
import { AuthContext, CurrentUser } from "../../context/AuthContext.tsx";
import { Button } from "@mui/material";

type Props = {};

export const Navbar = ({}: Props) => {
  const currentUser: CurrentUser = useContext(AuthContext);
  const firebaseLogout = () => {
    signOut(auth);
  };

  return (
    <div className={s.navBarContainer}>
      <span className={s.logo}>Инкогнито</span>
      <div className={s.user}>
        <img src={currentUser?.photoURL!} alt="ava" />
        <span>{currentUser?.displayName}</span>
        <Button onClick={firebaseLogout} variant={"contained"}>
          logout
        </Button>
      </div>
    </div>
  );
};
