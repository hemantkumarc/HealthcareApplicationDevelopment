import React, { useEffect } from "react";
import NavigationBar from "./NavigationBar";
import RestBody from "./RestBody";
import { userLoggedIn } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const PatientDialer = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    // use this ti check if user is logged in
    useEffect(() => {
        const checkLoggedIn = async () => {
            const loggedIn = await userLoggedIn();
            if (loggedIn) {
                const jwtdecoded = jwtDecode(token);
                console.log("this is the jwtDecode after decoding", jwtdecoded);
                if (jwtdecoded.role !== "ROLE_PATIENT") {
                    navigate("/patientlogin");
                }
                localStorage.setItem("role", jwtdecoded.role);
                localStorage.setItem("id", jwtdecoded.id);
            } else {
                navigate("/patientlogin");
            }
            // if(loggedIn)
        };
        checkLoggedIn();
    }, [navigate, token]);

    return (
        <>
            <NavigationBar />
            <RestBody />
        </>
    );
};
export default PatientDialer;
