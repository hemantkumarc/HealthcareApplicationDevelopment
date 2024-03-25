import React, { useEffect } from "react";
import NavigationBar from "./NavigationBar";
import RestBody from "./RestBody";
import { userLoggedIn } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
const PatientDialer = () => {
    const navigate = useNavigate();

    // use this ti check if user is logged in
    useEffect(() => {
        console.log(
            "this is what i got",
            userLoggedIn().then((loggedIn) => {
                if (loggedIn) {
                } else {
                    localStorage.clear();
                    navigate("/patientlogin");
                }
            })
        );
    }, []);

    return (
        <>
            <NavigationBar />
            <RestBody />
        </>
    );
};
export default PatientDialer;
