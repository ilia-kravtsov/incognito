import s from "./App.module.scss";
import { HomePage } from "../HomePage/HomePage.tsx";
import { RegisterPage } from "../Register/RegisterPage.tsx";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../LoginPage/LoginPage.tsx";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.tsx";

function App() {
  const currentUser = useContext(AuthContext);

  // const navigate = useNavigate();
  //
  // useEffect(() => {
  //   if (currentUser) {
  //     navigate("/");
  //   } else {
  //     navigate("/login");
  //   }
  // }, [currentUser]);

  return (
    <div className={s.appContainer}>
      <Routes>
        <Route path={"/"}>
          <Route index element={currentUser ? <HomePage /> : <LoginPage />} />
          <Route path={"login"} element={<LoginPage />} />
          <Route path={"register"} element={<RegisterPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
