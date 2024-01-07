import s from "./Messages.module.scss";
import { Message } from "../Message/Message.tsx";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext.tsx";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase.ts";
import React from "react";

export type Messages = {
  id: string;
  text: string;
  senderId: string;
  date: string;
  img: string;
};

export const Messages = () => {
  const [messages, setMessages] = useState<Array<Messages>>();
  const data = useContext(UserContext);

  useEffect(() => {
    const unSubscriber = onSnapshot(doc(db, "chats", data.data.chatId), (doc) => {
      const messageModel = doc.data()?.messages as Array<Messages>;
      doc.exists() && setMessages(messageModel);
    });

    return () => {
      unSubscriber();
    };
  }, [data.data.chatId]);

  const getChatData = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("en", { month: "long" });
    const dayOfMonth = date.getDate();
    return `${month} ${dayOfMonth}`;
  };

  let currentDate: string | null = null;

  return (
    <div className={s.messagesContainer}>
      {messages?.map((message, i) => {
        const messageDate = getChatData(message.date);
        const showDate = messageDate !== currentDate;
        currentDate = messageDate;

        return (
          <React.Fragment key={message.id}>
            {showDate && <p className={s.dailyChatDate}>{messageDate}</p>}
            <Message message={message} chatsId={data.data.chatId} messageIndex={i} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

