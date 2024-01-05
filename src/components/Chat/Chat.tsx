import s from "./Chat.module.scss";
import { Messages } from "../Messages/Messages.tsx";
import { MessageCreator } from "../MessageCreator/MessageCreator.tsx";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext.tsx";
import { ChatTopBar } from "../ChatTopBar/ChatTopBar.tsx";
import { AuthContext, CurrentUser } from "../../context/AuthContext.tsx";

type Props = {};

export const Chat = ({}: Props) => {
  const data = useContext(UserContext);
  const currentUser: CurrentUser = useContext(AuthContext);
  if (data.data.chatId === "null" || data.data.user.displayName === currentUser?.displayName) {
    return (
      <div className={s.chatContainerPlug}>
        <h1>Найдите собеседника слева</h1>
      </div>
    );
  } else {
    return (
      <div className={s.chatContainer}>
        <ChatTopBar data={data} />
        <Messages />
        <MessageCreator />
      </div>
    );
  }
};
