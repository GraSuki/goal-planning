import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";
import { auth, db } from "../connectFB/firebase";
import Navbar from "../components/Navbar";
import "../style.scss";
import { WalletContext } from "../context/WalletContextProvider";
import { collection, getDocs, query, where } from "firebase/firestore";
const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const publicKey = useContext(WalletContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("publicKey", "==", publicKey),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size === 0) {
        setErr("Email not correct");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err,
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Login success",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/mess");
      }
    } catch (err) {
      setErr(err.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err,
      });
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Tuna Chat</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <button>Sign in</button>
          {<span style={{ color: "red" }}>{err}</span>}
        </form>
      </div>
    </div>
  );
};

export default Login;
