import React, { useEffect, useState } from "react";
import "../style/SrDrDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SrDocNavBar from "./SrDocNavBar";
import SideBar from "./SideBar";
import Counsellor from "./Counsellor";

import { jwtDecode } from "jwt-decode";
import { userLoggedIn } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";

export default function SrDrDashboard() {
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState({ specialization: [], language: [] });
  const token = localStorage.getItem("token")
  const navigate = useNavigate();
	useEffect(() => {
		const checkLoggedIn = async () => {
			const loggedIn = await userLoggedIn();
			if (loggedIn) {
				const jwtdecoded = jwtDecode(token);
				console.log("this is the jwtDecode after decoding", jwtdecoded);
				if (jwtdecoded.role !== "ROLE_SENIORDR") {
					navigate("/");
				}
			} else {
				navigate("/");
			}
			// if(loggedIn)
		};
		checkLoggedIn();
	}, []);
	// const [sorts, setSorts] = useState({ arrangeBy, sortBy });
	const [sorts, setSorts] = useState({
		arrangeBy: "ascending",
		sortBy: "name",
	});
	return (
		<div>
			<header className="srdocnavbar-header">
				<SrDocNavBar search={search} setSearch={setSearch} />
			</header>
			<main>
				<div className="outterbox">
					<div className="row">
						<div className="col-2">
							<div className="sidebar">
								<SideBar setFilters={setFilters} setSorts={setSorts} />
							</div>
						</div>
						<div className="col-10">
							<div className="counsellor-list">
								<Counsellor filters={filters} search={search} sorts={sorts} />
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
