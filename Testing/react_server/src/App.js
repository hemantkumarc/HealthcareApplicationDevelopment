import "./App.css";

function App() {
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

	// Cleanup the interval when the component is unmounted
	return () => clearInterval(intervalId);
}

export default App;
