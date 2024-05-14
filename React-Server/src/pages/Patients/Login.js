import React, { useEffect } from "react";
import "./Login.css";
import videoBg from "../../assets/bg.mp4";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useState } from "react";
import api from "../../api/axios";
import "react-toastify/dist/ReactToastify.css";
import { userLoggedIn } from "../../utils/utils";
import { jwtDecode } from "jwt-decode";
import Select from "react-select";

const LOGIN_URL = "/patients_register";

const PatientLogin = () => {
    const [phnumber, setPhnumber] = useState("");
    const token = localStorage.getItem("token");
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("Karnataka");
    const navigate = useNavigate();

    // use this ti check if user is logged in
    useEffect(() => {
        const checkLoggedIn = async () => {
            const loggedIn = await userLoggedIn();
            if (loggedIn) {
                const jwtdecoded = jwtDecode(token);
                console.log("this is the jwtDecode after decoding", jwtdecoded);
                if (jwtdecoded.role === "ROLE_PATIENT") {
                    navigate("/patientdialer");
                }
            }
            // if(loggedIn)
        };
        checkLoggedIn();
    }, [navigate, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(JSON.stringify({ phnumber: phnumber, state: selected }));
        try {
            const response = await api.post(
                LOGIN_URL,
                JSON.stringify({ phnumber: phnumber, state: selected }),
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            console.log(response);
            const accessToken = response?.data?.token;
            const role = response?.data?.role;
            if (response.status === 200) {
                localStorage.setItem("token", accessToken);
                localStorage.setItem("state", selected);
                localStorage.setItem("phNumber", phnumber);
                navigate("/patientdialer");
            }
            console.log(role);
        } catch (err) {
            if (!err?.response) {
                console.log("No Server Response");
            } else if (err.response?.status === 400) {
                console.log("Missing phnumber or Password");
            } else if (err.response?.status >= 401) {
                console.log("Unauthorized");
            } else {
                console.log("Login Failed");
            }
        }
    };

    const options = [
        { label: "Karnataka", value: "Karnataka" },
        { label: "Gujurat", value: "Gujurat" },
        { label: "Telangana", value: "Telangana" },
        { label: "West Bengal", value: "West Bengal" },
        { label: "Chathisgarh", value: "Chathisgarh" },
        { label: "Chandigarh", value: "Chandigarh" },
        { label: "Rajasthan", value: "Rajasthan" },
    ];

    const handleSelect = (option) => {
        setSelected(option);
        console.log(option);
        setOpen(false);
    };

    return (
        <div className="main">
            <video src={videoBg} autoPlay muted loop />
            <div className="wrapper-container">
                <div className="wrapper">
                    <div className="logoU">
                        <img
                            src={require("../../assets/drVolteLogo.png")}
                            alt="logon"
                            className="Logo-img"
                        />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <h1>LOGIN</h1>
                        <div className="Input-box">
                            <input
                                type="text"
                                placeholder="Phone Number"
                                autoComplete="off"
                                value={phnumber}
                                onChange={(e) => {
                                    setPhnumber(e.target.value);
                                }}
                            />
                            <FaUser id="userIcon" className="icon" />
                        </div>
                        <div className="state-selection g-0 row align-items-center">
                            <label className="col-4">State</label>
                            <div className="state-div col-8">
                                <select
                                    name="statesDropDown"
                                    className="statesDropDown"
                                    onChange={(e) => {
                                        console.log("onchange ", e);
                                        handleSelect(e.target.value);
                                    }}
                                    defaultValue="Karnataka"
                                >
                                    {options.map((option) => (
                                        <option
                                            className="statesOption"
                                            value={option.value}
                                            // onClick={() => handleSelect(option)}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
export default PatientLogin;
