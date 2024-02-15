import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
var conn = new WebSocket("ws://192.168.0.104:8080/socket");
let c = 0;

const intervalId = setInterval(() => {
	console.log("sending " + c);
	conn.send("hello" + c);
	c++;
}, 10000);

conn.onmessage = (msg) => {
	console.log("received", msg.data);
};

root.render(<> </>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
