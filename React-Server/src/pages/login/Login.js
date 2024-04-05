import React, { useEffect } from "react";
import "./Login.css";
import videoBg from "../../assets/bg.mp4";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { useState, useContext } from "react";
import api from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userLoggedIn } from "../../utils/utils";
import { jwtDecode } from "jwt-decode";

const LOGIN_URL = "/login";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoggedIn = async () => {
            const loggedIn = await userLoggedIn();
            if (loggedIn) {
                const jwtdecoded = jwtDecode(token);
                console.log("this is the jwtDecode after decoding", jwtdecoded);
                if (jwtdecoded.role === "ROLE_COUNSELLOR") {
                    navigate("/counsellorDashboard");
                }
                else if (jwtdecoded.role === "ROLE_SENIORDR") {
                    navigate("/SrDrDashboard");
                } 
            } else {
                navigate("/");
            }
            // if(loggedIn)
        };
        checkLoggedIn();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(
                LOGIN_URL,
                JSON.stringify({ username, password }),
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            //console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.token;
            localStorage.setItem("token", accessToken);
            const role = response?.data?.role;
            console.log(role);

            // const lobbyResponse = await api.get(LOBBY_URL);
            if (role === "ROLE_COUNSELLOR") {
                // Redirect to the counsellor dashboard
                navigate("/counsellorDashboard");
            } 
            else if (role === "ROLE_SENIORDR") {
                // Redirect to the counsellor dashboard
                navigate("/SrDrDashboard");
            } 
            else {
                setUsername("");
                setPassword("");
                console.log(
                    "You are not authorized to access Counsellor Dashboard Page !"
                );
            }

            // console.log(lobbyResponse);
        } catch (err) {
            setUsername("");
            setPassword("");
            if (!err?.response) {
                console.log("No Server Response");
            } else if (err.response?.status === 400) {
                console.log("Missing Username or Password");
            } else if (err.response?.status === 401) {
                console.log("Unauthorized");
            } else {
                console.log("Login Failed");
            }
        }
    };

    return (
        <div className="main">
            <video src={videoBg} autoPlay muted loop />
            <div className="wrapper-container">
                <div className="wrapper">
                    <div className="logo">
                        <img
                            src={require("../../assets/drVolteLogo.png")}
                            alt="logo"
                            className="Logo-img"
                        />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <h1>LOGIN</h1>
                        <div className="Input-box">
                            <input
                                type="text"
                                placeholder="username"
                                autoComplete="off"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <FaUser className="icon" />
                        </div>
                        <div className="Input-box">
                            <input
                                type="password"
                                placeholder="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FaLock className="icon" />
                        </div>
                        <div className="forgot">
                            <Link to={""}>Forgot Password?</Link>
                        </div>
                        <div className="login-button">
                            <button onClick={handleSubmit}>login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Login;
