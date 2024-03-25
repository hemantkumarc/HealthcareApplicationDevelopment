// import React from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const serverip = "localhost";
const httpserverurl = "http://localhost";

export const initiateWebsocket = () => {
    const conn = new WebSocket("ws://" + serverip + "/socket");
    console.log(conn);
    conn.close();
};
export const initiateWebRTC = (conn) => {};

export const getResponsePost = async (url, data, headers) => {
    try {
        const response = await api.post(url, JSON.stringify(data), {
            headers: headers,
        });
        return response;
    } catch (err) {
        return err;
    }
};

export const getResponseGet = async (url, headers) => {
    try {
        const response = await api.get(url, {
            headers: headers,
        });
        return response;
    } catch (err) {
        return err;
    }
};

export const userLoggedIn = () => {
    // // use this below useeffect to check if user is logged in
    // useEffect(() => {
    //     console.log(
    //         "this is what i got",
    //         userLoggedIn().then((loggedIn) => {
    //             if (loggedIn) navigate("/patientdialer");
    //             else localStorage.clear();
    //         })
    //     );
    // }, []);
    console.log("this is local storage ", localStorage);
    if (localStorage.getItem("token") !== undefined) {
        console.log("insdide the token present");
        let response = getResponseGet("/hello");
        return response.then(
            (response) => {
                console.log("successs response ", response);
                if (response?.status === 200) return true;
                else {
                    localStorage.clear();
                    return false;
                }
            },
            (err) => {
                localStorage.clear();
                console.log("response error", err);
                return false;
            }
        );
    }
};
