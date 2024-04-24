// import React from "react";
import api from "../api/axios";
import { SERVERIP } from "../api/axios";

let token = localStorage.getItem("token");
var conn;

export const initiateWebsocket = (sourceRole, connections) => {
    conn = new WebSocket("ws://" + SERVERIP + "/socket");
    connections.conn = conn;
    console.log(conn);
    conn.addEventListener("message", (e) => {
        let data;
        try {
            data = JSON.parse(e.data);
        } catch (error) {
            console.log("Error:", error);
            return;
        }
        console.log("recieved 1", data);
        if (data.event === "offer") {
            // Handle the received offer
            handleReceivedOffer(JSON.parse(data.data), sourceRole, connections);
        }
        if (data.event === "answer") {
            // Handle the received answer
            // console.log("this is the parsed answer:", JSON.parse(data.data));
            handleReceivedAnswer(
                JSON.parse(data.data),
                sourceRole,
                connections
            );
        }
    });

    return conn;
};

const handleReceivedOffer = async (offer, sourceRole, connections) => {
    token = localStorage.getItem("token");
    let peerConnection = connections.peerConnection;
    try {
        // Set the received offer as the remote description
        await peerConnection.setRemoteDescription(
            new RTCSessionDescription(offer)
        );

        // Create an answer
        const answer = await peerConnection.createAnswer();

        // Set the answer as the local description
        await peerConnection.setLocalDescription(answer);

        // Send the answer to the initiating peer
        send(
            conn,
            getSocketJson(
                JSON.stringify(answer),
                "answer",
                token,
                sourceRole,
                conn.destRole
            )
        );
    } catch (error) {
        console.error("Error handling received offer:", error);
    }
};

const handleReceivedAnswer = async (answer, sourceRole, connections) => {
    let peerConnection = connections.peerConnection;
    console.log(
        "This the corrent state of connection",
        peerConnection.connectionState
    );
    try {
        // Set the received answer as the remote description
        await peerConnection.setRemoteDescription(answer);
    } catch (error) {
        console.error("Error handling received answer:", error);
    }
};

/**
 * @param {WebSocket} conn The date
 * @returns {RTCPeerConnection} The created RTCPeerConnection object
 */
export const initiateWebRTC = async (socketConn, sourceRole, connections) => {
    // {
    // iceServers: [
    //     {
    //         url: "stun:stun4.1.google.com:19302",
    //     },
    // ],
    //  }
    token = localStorage.getItem("token");
    conn = socketConn;
    let peerConnection = new RTCPeerConnection();
    connections.peerConnection = peerConnection;

    peerConnection.addEventListener("negotiationneeded", () => {
        handleRenegotiation(conn, peerConnection, sourceRole);
    });

    try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        send(
            conn,
            getSocketJson(
                JSON.stringify(offer),
                "offer",
                token,
                sourceRole,
                conn.destRole
            )
        );
        console.log("Offer sent");
    } catch (error) {
        // Handle error here
        console.log("Error:", error);
    }
    console.log("ahem!!");
    handleStreamingAudio(peerConnection);
    return peerConnection;
};

/**
 * @param {WebSocket} conn The date
 * @param {RTCPeerConnection} peerconnection The date
 *
 */
export const handleRenegotiation = async (conn, peerConnection, sourceRole) => {
    console.log("Renegotiation needed, sooooooo");
    const token = localStorage.getItem("token");
    try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        send(
            conn,
            getSocketJson(
                JSON.stringify(offer),
                "offer",
                token,
                sourceRole,
                conn.destRole
            )
        );
        console.log("Offer sent");
    } catch (error) {
        // Handle error here
        console.log("Error:", error);
    }
};

export const handlePeerConnectionClose = (
    conn,
    peerConnection,
    functionToCall
) => {
    console.log(
        "inside the handlePeerConnectionClose function",
        conn,
        peerConnection,
        functionToCall
    );
    peerConnection.addEventListener("connectionstatechange", (ev) => {
        console.log("peer connection state change", ev, peerConnection);
        switch (peerConnection.connectionState) {
            case "new":
            case "connecting":
                console.log("Connecting…");
                break;
            case "connected":
                console.log("Online");
                break;
            case "disconnected":
                console.log("Disconnecting…");
            case "closed":
                console.log("Offline");
            case "failed":
                console.log("Error");
                functionToCall();
                break;
            default:
                console.log("Unknown");
                break;
        }
    });
};

/**
 * @param {RTCPeerConnection} peerconnection The Peerconnection
 */
export const handleStreamingAudio = (peerconnection) => {
    console.log("adding the local track to the peerconnection");
    navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(function (stream) {
            stream.getAudioTracks().forEach((track) => {
                console.log("this is the local track adding now", track);
                peerconnection.addTrack(track, stream);
            });
        });
};

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

export const getResponseDelete = async (url, headers) => {
    try {
        const response = await api.delete(url, {
            headers: headers,
        });
        return response;
    } catch (err) {
        return err;
    }
};

export const getResponsePut = async (url, data, headers) => {
    try {
        const response = await api.put(url, JSON.stringify(data), {
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
    //     const checkLoggedIn = async () => {
    //         const loggedIn = await userLoggedIn();
    //         if (loggedIn) {
    //             const jwtdecoded = jwtDecode(token);
    //             console.log("this is the jwtDecode after decoding", jwtdecoded);
    //             if (jwtdecoded.role !== "ROLE_COUNSELLOR") {
    //                 navigate("/");
    //             }
    //         } else {
    //             navigate("/");
    //         }
    //         // if(loggedIn)
    //     };
    //     checkLoggedIn();
    // }, []);
    console.log("this is local storage ", localStorage);
    if (localStorage.getItem("token") !== undefined) {
        // console.log("insdide the token present");
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
    } else {
        localStorage.clear();
        return false;
    }
};

export const getSocketJson = (
    data,
    event,
    token,
    source = "",
    destination = ""
) => {
    return {
        data: data,
        event: event,
        token: token,
        source: source,
        destination: destination,
    };
};

export function send(conn, message) {
    console.log("this is send fucntion data:", message, conn);
    conn.send(JSON.stringify(message));
}
