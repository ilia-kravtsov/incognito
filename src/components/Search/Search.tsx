import s from "./Search.module.scss";
import { ChangeEvent, useState, KeyboardEvent, useContext } from "react";
import { db } from "../../firebase/firebase.ts";
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext.tsx";
import { UserContext } from "../../context/UserContext.tsx";
import { TextField } from "@mui/material";

type Props = {};

export type User = {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
};

export const Search = ({}: Props) => {
  let [userName, setUserName] = useState<string>("");
  let [user, setUser] = useState<User | null>(null);
  let [error, setError] = useState<any>(false);
  const contextValue = useContext(UserContext);
  const dispatch = contextValue ? contextValue.dispatch : () => {};

  const currentUser = useContext(AuthContext);

  const userSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.currentTarget.value);
  };

  const searching = async () => {
    const q = query(collection(db, "users"), where("displayName", "==", userName));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        const user = doc.data() as User;
        setUser(user);
      });
    } catch (error: any) {
      setError(true);
    }
  };

  const userSearchActivateKey = (event: KeyboardEvent<HTMLInputElement>) => {
    event.code === "Enter" && searching();
  };

  const selectUser = async (sideBarUser: User | null) => {
    //check whether the group(chats in firestore) exists, if not create new one
    const userId = user ? user.uid : "";
    const currentUserId = currentUser ? currentUser.uid : "";
    const combinedId = currentUserId > userId ? currentUserId + userId : userId + currentUserId;
    try {
      const response = await getDoc(doc(db, "chats", combinedId));
      if (!response.exists()) {
        // create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUserId), {
          [combinedId + ".userInfo"]: {
            uid: userId,
            displayName: user?.displayName,
            photoURL: user?.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", userId), {
          [combinedId + ".userInfo"]: {
            uid: currentUserId,
            displayName: currentUser?.displayName,
            photoURL: currentUser?.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {}
    dispatch({ type: "CHANGE_USER", payload: sideBarUser });
    setUser(null);
    setUserName("");
  };

  return (
    <div className={s.searchContainer}>
      <div className={s.searchForm}>
        <TextField
          label={"Найди собеседника"}
          onChange={userSearch}
          value={userName}
          onKeyDown={userSearchActivateKey}
          variant="filled"
          style={{ width: "100%" }}
          inputProps={{ style: { color: "#3b5998" } }}
          sx={{
            "& .MuiInputLabel-root": { color: "#5f6c7b" },
            "& .MuiOutlinedInput-root": {
              "& > fieldset": { borderColor: "#3b5998" },
              "&:hover fieldset": {
                borderColor: "#3b5998",
              },
            },
          }}
        />
      </div>
      {error && <span>User not found</span>}
      {user && (
        <div className={s.userChat} onClick={() => selectUser(user)}>
          <img src={user.photoURL} alt="ava" />
          <div className={s.userChatInfo}>
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};
