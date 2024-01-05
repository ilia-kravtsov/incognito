import s from "../Register/RegisterPage.module.scss";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase.ts";
import { TextField } from "@mui/material";

type Props = {};

export const LoginPage = ({}: Props) => {
  let [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const email = event.target[0].value;
    const password = event.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setError(true);
      console.error(error);
    }
  };

  return (
    <div className={s.registerContainer}>
      <div className={s.registerFormContainer}>
        <h4 className={s.title}>Login</h4>
        <form className={s.registerForm} onSubmit={handleSubmit}>
          <TextField type="email" label={"email"} variant={"filled"} />
          <TextField type="password" label={"password"} variant={"filled"} />
          <button>Sign in</button>
          {error && <span>Something went wrong</span>}
        </form>
        <p>
          Don't you have an account? <Link to={"/register"}>Register</Link>
        </p>
      </div>
    </div>
  );
};
