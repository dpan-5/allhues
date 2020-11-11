import Axios from "axios";
import React, { useState, useContext } from "react";
import Modal from "react-modal";
import AuthContext from "../../utils/AuthContext";
import UserContext from "../../utils/UserContext";
import { useHistory } from "react-router-dom";
import "./auth.css";
Modal.setAppElement("#root");

const Login = () => {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setJwt } = useContext(AuthContext);
  const { setId } = useContext(UserContext);
  const history = useHistory();
  const [incompleteError, setIncompleteError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleEmailInput = (e) => {
    const { value } = e.target;
    setEmail(value);
  };

  const handlePasswordInput = (e) => {
    const { value } = e.target;
    setPassword(value);
  };

  const handleLoginSubmit = (e, email, password) => {
    setIncompleteError(false);
    e.preventDefault();

    // if (!email || !password) {
    //   setIncompleteError(true);
    // } 
      Axios.post("/login", { email, password }).then((res) => {
        setJwt(res.data.token);
        setId(res.data.user.id);
        localStorage.setItem("token", res.data.token);
        history.push("/");
      }).catch((err) => {
        // if (err.message == "Request failed with status code 400") {
        //   setIncompleteError(true);
        // }
        if (email && password) {
          setEmailError(true);
        } else {
          setIncompleteError(true);
        }
        console.log(err.message)

      })
    
  };

  const handleCloseBtnClick = () => {
    setModalIsOpen(false);
    let path = "/";
    history.push(path);
  };

  return (
    <div>
      <button onClick={() => setModalIsOpen(true)}>Open modal</button>
      <Modal
        isOpen={modalIsOpen}
        style={{
          overlay: {
            backgroundColor: "#e8d3c4",
          },
          content: {
            color: "#46483b",
            top: "40px",
            left: "40px",
            right: "40px",
            bottom: "40px",
            border: "1px solid #46483b",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "10px",
            outline: "none",
            padding: "50px",
          },
        }}
      >
        <h2>Login</h2>
        <hr />
        <form>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              onChange={handleEmailInput}
              //   value={authState.email}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="password"
              onChange={handlePasswordInput}
              //   value={authState.password}
              className="form-control"
            />
          </div>
          <button
            className="buttons"
            type="submit"
            onClick={(e) => {
              handleLoginSubmit(e, email, password);
            }}
          >
            Submit
          </button>
          <button className="buttons" onClick={handleCloseBtnClick}>
            Close
          </button>
          {incompleteError && <div className="alert alert-danger" role="alert">
            Please fill out all fields</div>}
          {emailError && <div className="alert alert-danger" role="alert">
            The email address you entered is not associated with an account or the password you have entered is incorrect.</div>}
        </form>
      </Modal>
    </div>
  );
};

export default Login;
