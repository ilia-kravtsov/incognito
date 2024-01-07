import s from "./MessageCreator.module.scss";
import { Button, TextField } from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import gallery from "../../style/images/gallery.png";
import { ChangeEvent, useContext, useState, KeyboardEvent } from "react";
import { AuthContext } from "../../context/AuthContext.tsx";
import { UserContext } from "../../context/UserContext.tsx";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, storage } from "../../firebase/firebase.ts";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export const MessageCreator = () => {
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const currentUser = useContext(AuthContext);
  const data = useContext(UserContext);

  const currentUserId = currentUser ? currentUser.uid : "";
  const dataId = data ? data.data.user.uid : "";

  const hangleSend = async () => {
    if (image) {
      const storageRef = ref(storage, uuidv4());

      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",

        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.data.chatId), {
              messages: arrayUnion({
                id: uuidv4(),
                text,
                senderId: currentUserId,
                date: Date(),
                img: downloadURL,
              }),
            });
          });
        },
        (error: any) => {
          console.error(error);
        },
        () => {},
      );
    } else {
      try {
        await updateDoc(doc(db, "chats", data.data.chatId), {
          messages: arrayUnion({
            id: uuidv4(),
            text,
            senderId: currentUserId,
            date: Date(),
          }),
        });
      } catch (error: any) {
        console.error("file upload or Firestore update:", error);
      }
    }

    await updateDoc(doc(db, "userChats", currentUserId), {
      [`${data.data.chatId}.lastMessage`]: { text },
      [`${data.data.chatId}.date`]: Date.now(),
    });

    await updateDoc(doc(db, "userChats", dataId), {
      [`${data.data.chatId}.lastMessage`]: { text },
      [`${data.data.chatId}.date`]: Date.now(),
    });

    setText("");
    setImage(null);
  };

  const onMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.currentTarget.value);
  };

  const onKeyMessageSender = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      hangleSend();
    }
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setImage(selectedFile || null);
  };

  return (
    <div className={s.messageCreatorContainer}>
      <TextField
        value={text}
        onChange={onMessageChange}
        onKeyDown={onKeyMessageSender}
        multiline
        rows={3}
        label={"напишите что-нибудь"}
        style={{ width: "80%", height: "100px" }}
        inputProps={{ style: { color: "#5f6c7b" }, maxLength: 300 }}
        sx={{
          "& .MuiInputLabel-root": { color: "#094067" },
          "& .MuiOutlinedInput-root": {
            "& > fieldset": { borderColor: "#094067" },
            "&:hover fieldset": { borderColor: "rgba(25,118,210,0.97)" },
          },
        }}
      />
      <div className={s.sendIconsContainer}>
        <input type="file" style={{ display: "none" }} id={"file"} onChange={onFileChange} />
        <label htmlFor={"file"}>
          <img src={gallery} alt="add image" className={s.addImage} />
        </label>
        <Button
          style={{ minWidth: "50px", minHeight: "50px", marginRight: "20px" }}
          variant={"contained"}
          onClick={hangleSend}
        >
          <TelegramIcon />
        </Button>
      </div>
    </div>
  );
};
