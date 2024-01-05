import s from "./RegisterPage.module.scss";
import addAvatarIcon from "../../style/images/gallery.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../../firebase/firebase.ts";
import { Link, useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";

type Props = {};

export const RegisterPage = ({}: Props) => {
  let [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();
  const registerSubmit = async (event: any) => {
    event.preventDefault();
    const displayName = event.target[0].value;
    const email = event.target[1].value;
    const password = event.target[2].value;
    const file = event.target[3].files[0];
    console.log(displayName, email, password, file);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",

        () => {},
        (error: any) => {
          setError(true);
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(response.user, {
              displayName,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", response.user.uid), {
              uid: response.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userChats", response.user.uid), {
              uid: response.user.uid,
            });
            navigate("/login");
          });
        },
      );
    } catch (error) {
      setError(true);
      console.error(error);
    }
  };

  return (
    <div className={s.registerContainer}>
      <div className={s.registerFormContainer}>
        <h4 className={s.title}>Register</h4>
        <form onSubmit={registerSubmit} className={s.registerForm}>
          <TextField type="text" label={"display name"} variant={"filled"} />
          <TextField type="email" label={"email"} variant={"filled"} />
          <TextField type="password" label={"password"} variant={"filled"} />
          <input type="file" id={"file"} style={{ display: "none" }} />
          <label htmlFor={"file"} className={s.labelContainer}>
            <img src={addAvatarIcon} alt={"addAvatarIcon"} className={s.addAvatarIcon} />{" "}
            <p className={s.addAvatarIconLabel}>Add your avatar</p>
          </label>
          <button>Sign up</button>
          {error && <span>Something went wrong</span>}
        </form>
        <p>
          Have you got an account? <Link to={"/login"}>Login</Link>
        </p>
      </div>
    </div>
  );
};

/*
 createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
 */
