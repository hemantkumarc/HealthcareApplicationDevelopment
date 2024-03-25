// import React from "react";
const serverip = "localhost";
export const initiateWebsocket = () => {
    const conn = new WebSocket("ws://" + serverip + "/socket");
    console.log(conn);
    conn.close();
};
export const initiateWebRTC = (conn) => {};
