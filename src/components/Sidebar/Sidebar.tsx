import s from "./SideBar.module.scss";
import { Navbar } from "../Navbar/Navbar.tsx";
import { Search } from "../Search/Search.tsx";
import { Users } from "../Users/Users.tsx";

type Props = {};

export const Sidebar = ({}: Props) => {
  return (
    <div className={s.sideBarContainer}>
      <Navbar />
      <Search />
      <Users />
    </div>
  );
};
