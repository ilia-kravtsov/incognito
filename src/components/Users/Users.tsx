import s from "./Users.module.scss";
import { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase.ts";
import { AuthContext } from "../../context/AuthContext.tsx";
import { UserContext } from "../../context/UserContext.tsx";

type Props = {};

type UserData = {
  date: number;
  lastMessage: {
    text: string;
  };
  userInfo: {
    displayName: string;
    photoURL: string;
    uid: string;
  };
};

type User = [string, UserData];

export const Users = ({}: Props) => {
  let [users, setUsers] = useState<User[]>([]);
  console.log("users: ", users);
  const currentUser = useContext(AuthContext);
  const contextValue = useContext(UserContext);

  const dispatch = contextValue ? contextValue.dispatch : () => {};
  const currentUserId = currentUser ? currentUser.uid : "";

  useEffect(() => {
    const getUsers = () => {
      const unSubscriber = onSnapshot(doc(db, "userChats", currentUserId), (doc) => {
        const docData = doc.data() as User[];
        if (docData) {
          console.log("docData: ", docData);
          setUsers(docData);
        }
      });

      return () => {
        unSubscriber();
      };
    };

    currentUserId && getUsers();
  }, [currentUserId]);

  const handleSelect = (user: { displayName: string; uid: string; photoURL: string }) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  return (
    <div className={s.usersContainer}>
      {Object.entries(users)
        ?.sort((a, b) => {
          const [userIdA, userDataA] = a;
          const [userIdB, userDataB] = b;
          console.log(userIdA, userIdB);
          const isUserData = (data: any): data is UserData => {
            return typeof data === "object";
          };

          if (isUserData(userDataB) && isUserData(userDataA)) {
            return userDataB.date - userDataA.date;
          } else {
            return 0;
          }
        })
        .map((user) => {
          const [userId, userData] = user;

          const isUserData = (data: any): data is UserData => {
            return typeof data === "object";
          };

          if (isUserData(userData)) {
            const userDataProved: UserData = userData;
            if (userDataProved.userInfo && userDataProved.lastMessage && userDataProved.date) {
              const preparedLastMessage =
                userDataProved?.lastMessage.text.length < 40
                  ? userDataProved?.lastMessage.text
                  : userDataProved?.lastMessage.text.substring(0, 40) + "...";
              return (
                <div className={s.userChat} key={userId} onClick={() => handleSelect(userDataProved?.userInfo)}>
                  <img
                    src={userDataProved?.userInfo.photoURL}
                    alt="ava"
                    className={s.userAva}
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                  <div className={s.userChatInfo}>
                    <span>{userDataProved?.userInfo.displayName}</span>
                    {userDataProved.lastMessage && <p>{preparedLastMessage}</p>}
                  </div>
                </div>
              );
            }
          }
        })}
    </div>
  );
};
