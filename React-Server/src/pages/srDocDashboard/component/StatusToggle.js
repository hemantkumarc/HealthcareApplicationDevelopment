// import React from "react";
// import "../style/StatusToggle.css";

// export default function StatusToggle() {
// 	return (
// 		// <>
// 		// 	<input type="checkbox" id="vehicle1" name="vehicle1" onClick={console.log("Heyy it's working")}/>
// 		// 	<label for="vehicle1">I have a bike</label>
// 		// </>
// 		<label className="switch">
// 			<input type="checkbox" />
// 			<span className="slider" />
// 		</label>
// 	);
// }

import React from "react";

function StatusToggle() {
	const handleClick = () => {
		// Add your logic here to handle the click event
		console.log("Checkbox clicked");
	};
	return (
		<label className="switch">
			<input type="checkbox" onClick={handleClick} />
			{/* <input type="checkbox" name="free" value="mon09" onClick=" "/> */}
			<span className="slider" />
		</label>
	);
}

export default StatusToggle;
