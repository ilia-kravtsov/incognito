import s from "./HomePage.module.scss";
import { Sidebar } from "../Sidebar/Sidebar.tsx";
import { Chat } from "../Chat/Chat.tsx";

type Props = {};

export const HomePage = ({}: Props) => {
  return (
    <div className={s.homePageContainer}>
      <div className={s.subContainer}>
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};
