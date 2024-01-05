import s from "./Message.module.scss";
import { useContext, useEffect, useRef, useState, MouseEvent, ChangeEvent, KeyboardEvent } from "react";
import { AuthContext } from "../../context/AuthContext.tsx";
import { UserContext } from "../../context/UserContext.tsx";
import { Messages } from "../Messages/Messages.tsx";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button, Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { doc, updateDoc, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase.ts";

type Props = {
  message: Messages;
  chatsId: string;
  messageIndex: number;
};

export const Message = (props: Props) => {
  const { message, chatsId, messageIndex } = props;
  let [changeMessage, setChangeMessage] = useState<string>(message.text);
  let [editMode, setEditMode] = useState<boolean>(false);

  const currentUser = useContext(AuthContext);
  const data = useContext(UserContext);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [message]);

  const currentUserId = currentUser ? currentUser.uid : "";
  const dataId = data ? data.data.user.uid : "";

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleClose = async (event: MouseEvent<HTMLLIElement>) => {
    const userChatsRef = doc(db, "userChats", dataId);
    const chatsRef = doc(db, "chats", chatsId);

    if (event.currentTarget?.innerText === "Delete") {
      console.log("Delete");

      const getUsersChat = await getDoc(userChatsRef);
      const userChatsData = getUsersChat.data();
      console.log("userChatsData: ", userChatsData);
      await updateDoc(chatsRef, {
        ["messages"]: arrayRemove(message),
      });

      // await updateDoc(userChatsRef, {
      //   [`${chatsId}`]: {
      //     ["date"]: userChatsData[chatsId].date,
      //     ["userInfo"]: userChatsData[chatsId].userInfo,
      //     ["lastMessage"]: {
      //       text: "updated_4",
      //     },
      //   },
      // });
    } else if (event.currentTarget?.innerText === "ChangeText") {
      console.log("ChangeText");
      setEditMode(true);
    }
    setAnchorEl(null);
  };

  const getTime = (dateString: string) => {
    const newDate = new Date(dateString);
    const hours = newDate.getHours();
    let minutes: number | string = newDate.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    return `${hours}:${minutes}`;
  };

  const onMessageChanger = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setChangeMessage(event.currentTarget.value);
  };

  const onMessageSaver = async () => {
    setEditMode(false);
    const messageRef = doc(db, "chats", chatsId);

    const snapshot = await getDoc(messageRef);
    const messages = snapshot.data()?.messages;

    messages[messageIndex].text = changeMessage;

    await updateDoc(messageRef, { messages })
      .then(() => {
        console.log("Object updated successfully");
      })
      .catch((error) => {
        console.error("Error updating object:", error);
      });
  };

  const onKeySaver = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      onMessageSaver();
    }
  };

  return (
    <div
      className={message.senderId === currentUserId ? s.messageContainer + " " + s.owner : s.messageContainer}
      ref={ref}
    >
      <div className={s.messageAvaContainer}>
        <img
          src={message.senderId === currentUserId ? currentUser?.photoURL! : data.data.user.photoURL}
          alt="ava"
          className={s.ava}
        />
        <span>{getTime(message.date ? message.date : "")}</span>
      </div>
      <div className={s.messageContent}>
        {message.senderId === currentUserId ? (
          <div className={s.message}>
            {editMode ? (
              <div className={s.editModeContainer}>
                <textarea
                  className={s.editModeTextarea}
                  defaultValue={changeMessage}
                  onChange={onMessageChanger}
                  onKeyDown={onKeySaver}
                  autoFocus
                  maxLength={300}
                ></textarea>
                <Button variant={"contained"} onClick={onMessageSaver}>
                  Save
                </Button>
              </div>
            ) : (
              <div className={s.messageSubContainer}>
                {changeMessage}
                <Button
                  style={{ minWidth: "10px", marginLeft: "10px" }}
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseMenu}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem onClick={handleClose}>Delete</MenuItem>
                  <MenuItem onClick={handleClose}>ChangeText</MenuItem>
                </Menu>
              </div>
            )}
          </div>
        ) : (
          <p className={s.message}>{message.text ? message.text : ""}</p>
        )}
        {message.img && <img src={message.img} alt="ava" className={s.sentImage} />}
      </div>
    </div>
  );
};
