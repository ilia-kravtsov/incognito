import { Button } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import s from "./ChatTopBar.module.scss";
import { Data } from "../../context/UserContext.tsx";

type Props = {
  data: Data;
};

export const ChatTopBar = ({ data }: Props) => {
  return (
    <div className={s.chatTopBar}>
      <span className={s.userName}>{data?.data.user.displayName}</span>
      <div className={s.chatIcons}>
        <Button style={{ minWidth: "50px" }}>
          <VideocamIcon />
        </Button>
        <Button style={{ minWidth: "50px" }}>
          <PersonAddIcon />
        </Button>
        <Button style={{ minWidth: "50px" }}>
          <MoreVertIcon />
        </Button>
      </div>
    </div>
  );
};
