import React from "react";
import "./Login.css";
import videoBg from "../../assets/bg.mp4";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useState } from "react";
import api from "../../api/axios";
import "react-toastify/dist/ReactToastify.css";

const LOGIN_URL = "/patients_register";

const PatientLogin = () => {
    const [phnumber, setPhnumber] = useState("");

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selected) {
            // alert("Please select state");
            return;
        }
        console.log(
            JSON.stringify({ phnumber: phnumber, state: selected.value })
        );
        try {
            const response = await api.post(
                LOGIN_URL,
                JSON.stringify({ phnumber: phnumber, state: selected.value }),
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            console.log(response);
            const accessToken = response?.data?.token;
            localStorage.setItem("token", accessToken);
            const role = response?.data?.role;
            if (response.status === 200) {
                navigate("/patientscalldashboard");
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
                                placeholder="Phone Number"
                                autoComplete="off"
                                value={phnumber}
                                onChange={(e) => {
                                    setPhnumber(e.target.value);
                                }}
                            />
                            <FaUser className="icon" />
                        </div>
                        <div className="label-option row align-items-center">
                            <label className="col-4">State</label>
                            <div className="state-div col-8">
                                <button
                                    className="btn state-button"
                                    onClick={() => setOpen(!open)}
                                >
                                    {selected
                                        ? selected.label
                                        : "Select an Option"}
                                </button>
                                {open && (
                                    <ul>
                                        {options.map((option) => (
                                            <li
                                                key={option.value}
                                                onClick={() =>
                                                    handleSelect(option)
                                                }
                                            >
                                                {option.label}
                                            </li>
                                        ))}
                                    </ul>
                                )}
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
