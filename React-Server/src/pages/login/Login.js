import React, { useEffect } from "react";
import "./Login.css";
import "./util.css";
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
                } else if (jwtdecoded.role === "ROLE_SENIORDR") {
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
                localStorage.setItem("role", "ROLE_COUNSELLOR");
                navigate("/counsellorDashboard");
            } else if (role === "ROLE_SENIORDR") {
                // Redirect to the counsellor dashboard
                localStorage.setItem("role", "ROLE_SENIORDR");
                navigate("/SrDrDashboard");
            } else if (role === "ROLE_ADMIN") {
                // Redirect to the Admin Dashboard
                localStorage.setItem("role", "ROLE_ADMIN");
                navigate("/adminDashboard");
            } else {
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


    //Eye Animation

    const [isEyeOpen, setIsEyeOpen] = useState(false);

    const toggleEye = () => {
        setIsEyeOpen(!isEyeOpen);
    };

    return (
        <div>
            <video id="myVideo" src={videoBg} autoPlay muted loop />
	
            <div className="container-login100">
                <div className="wrap-login100 p-l-55 p-r-55 p-t-80 p-b-30">
                    <form className="login100-form validate-form" id="loginForm">
                        <div id="logo">
                            <img
                                src={require("../../assets/drVolteLogo.png")}
                                alt="logo"
                                className="Logo-img"
                                id="logoImg"
                            />
                            <div id="title">Dr. VoLTE</div>
                        </div>
                        <span id="signIn" className="login100-form-title p-b-37">
                            Sign In
                        </span>

                        <div id="username" className="wrap-input100 validate-input m-b-20" data-validate="Enter Mobile Number">
                            <input
                                className="input100"
                                type="text"
                                placeholder="username"
                                autoComplete="off"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <img
                                src={require("../../assets/wired-lineal-21-avatar.gif")}
                                alt="User"
                                id="user"
                            />
                            <span className="focus-input100"></span>
                        </div>

                        <div className="wrap-input100 validate-input m-b-25" data-validate = "Enter password">
                            <input
                                className="input100"
                                type={isEyeOpen ? 'text' : 'password'}
                                placeholder="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {isEyeOpen ? (
                                <img
                                src={require("../../assets/Animation - 1713810100622.gif")}
                                alt="eyeGif"
                                id="eyeAnim"
                                onClick={toggleEye}
                                />
                            ) : (
                                <img
                                src={require("../../assets/eye-closed.png")}
                                alt="closedEye"
                                id="eyeClosed"
                                onClick={toggleEye}
                                />
                            )}
                            <span className="focus-input100"></span>
                        </div>
                        <div class="container-login100-form-btn">
                            <button id="submitBtn" type="submit" class="login100-form-btn">
                                Sign In
                            </button>
                        </div>
                    </form>        
                </div>
            </div>
        </div>
    );
};
export default Login;
