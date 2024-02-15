import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
var conn = new WebSocket("ws://192.168.0.104:8080/socket");

conn.onmessage = (msg) => {
	console.log("received", msg.data);
};
function send(message) {
	conn.send(JSON.stringify(message));
}
var peerConnection = new RTCPeerConnection({
	iceServers: [
		{
			url: "stun:stun4.1.google.com:19302",
		},
	],
});
var dataChannel = peerConnection.createDataChannel("dataChannel", {
	reliable: true,
});
dataChannel.onerror = function (error) {
	console.log("Error:", error);
};
dataChannel.onclose = function () {
	console.log("Data channel is closed");
};

const options = {
	offerToReceiveAudio: true, // Request to receive audio
	offerToReceiveVideo: false, // Request to receive video
};

try {
	const offer = await peerConnection.createOffer(options);
	await peerConnection.setLocalDescription(offer);

	send({
		event: "offer",
		data: offer,
	});
} catch (error) {
	// Handle error here
}

peerConnection.onicecandidate = function (event) {
	if (event.candidate) {
		send({
			event: "candidate",
			data: event.candidate,
		});
	}
};

conn.addEventListener("message", (event) => {
	const data = JSON.parse(event.data);

	if (data.event === "candidate") {
		// Handle the received ICE candidate
		handleReceivedIceCandidate(data.data);
	}
	if (data.event === "offer") {
		// Handle the received offer
		handleReceivedOffer(data.data);
	}
	if (data.event === "answer") {
		// Handle the received answer
		handleReceivedAnswer(data.data);
	}
	// Add other event handlers as needed
});

// Function to handle received ICE candidates from the remote peer
function handleReceivedIceCandidate(candidate) {
	// Assuming 'peerConnection' is your WebRTC peer connection object
	peerConnection
		.addIceCandidate(new RTCIceCandidate(candidate))
		.then(() => {
			console.log("ICE candidate added successfully.");
		})
		.catch((error) => {
			console.error("Error adding ICE candidate:", error);
		});
}

async function handleReceivedOffer(offer) {
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
		send({
			event: "answer",
			data: answer,
		});
	} catch (error) {
		console.error("Error handling received offer:", error);
	}
}

async function handleReceivedAnswer(answer) {
	try {
		// Set the received answer as the remote description
		await peerConnection.setRemoteDescription(
			new RTCSessionDescription(answer)
		);
	} catch (error) {
		console.error("Error handling received answer:", error);
	}
}

let c = 0;
setInterval(() => {
	console.log("Sending ");
	dataChannel.send("HI" + c);
	c++;
}, 10000);

dataChannel.onmessage = function (event) {
	console.log("Message:", event.data);
};

peerConnection.ondatachannel = function (event) {
	dataChannel = event.channel;
};
// peerConnection.createOffer()
root.render(<> </>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
