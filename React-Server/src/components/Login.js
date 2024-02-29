import React from "react";
import "../css/Login.css";
import { FaUser, FaLock } from "react-icons/fa";
import {useState} from 'react'
import axios from 'axios';
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

    const [data, setData] = useState({
        username: "",
        password: ""
      });

      const handleChange = (e) => {
        const value = e.target.value;
        setData({
          ...data,
          [e.target.name]: value
        });
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
          username: data.username,
          password: data.password
        };

        const cred = JSON.stringify(userData);
        console.log(cred);
        axios.post("http://localhost:8080/auth/generateToken", cred, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((response) => {
          if (response != "") {
            window.localStorage.setItem("auth_token", response.data)
            window.location.href = "http://localhost:3000/courseCatalog";
            
          }
          console.log(response.status, response.data);
        }
        )
        .catch((error) => {
          console.log(error.message);
          toast.error(error.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        })
      };
  return (
    
    <div className="Wrapper">
      <div className="logo">
        <img src={require("../assets/drVolteLogo.png")} alt="logo" className="Logo-img"/>
      </div>
      <form action="">
        <h1>LOGIN</h1>
        <div className="Input-box">
          <input type="text" placeholder="username" onChange={e => setData({
            ...data,
            username: e.target.value
            })} />
          <FaUser className="icon" />
        </div>
        <div className="Input-box">
          <input type="password" placeholder="password" onChange={e => setData({
            ...data,
            password: e.target.value
            })} />
          <FaLock className="icon" />
        </div>
        <div className="forgot">
          <a class="link" href="#">
            Forgot Password?
          </a>
          {/* <label htmlFor="rem">
            <input type="checkbox" id="rem" /> Remember me
          </label> */}
        </div>
        <div class="login-button">
          <button onClick={handleSubmit}>login</button>
        </div>
      </form>
    </div>
  );
};
export default Login;