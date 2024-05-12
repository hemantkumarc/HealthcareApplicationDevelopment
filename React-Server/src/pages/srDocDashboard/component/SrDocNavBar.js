import React from "react";
import "../style/SrDocNavBar.css";
import drVolteLogo from "../../../assets/drVolteLogo.png";
import { useNavigate } from "react-router-dom";
import SearchCounsellor from "./SearchCounsellor";
import StatusToggle from "./StatusToggle";
import SearchResult from "./SearchResult";
import { Navbar, Nav, Button, Container } from "react-bootstrap";

export default function SrDocNavBar({ setSearch }) {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.clear();
		navigate("/");
	};

	return (
		<Navbar
			collapseOnSelect
			expand="lg"
			className="bg-body-tertiary .navbar-align"
			fixed="top"
		>
			<Container>
				<Navbar.Brand href="#home">
					<img src={drVolteLogo} alt="logo" className="img-logo" />
					Dr.VoLTE
				</Navbar.Brand>

				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="ml-auto" style={{ alignItems: "center" }}>
						<Nav.Link>
							<div className="search-container">
								<StatusToggle />
								{/* <label class="inline-flex items-center cursor-pointer">
  <input type="checkbox" value="" class="sr-only peer" />
  <div class="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Large toggle</span>
</label> */}
							</div>
						</Nav.Link>
						<Nav.Link>
							<div className="search-container">
								<SearchCounsellor setSearch={setSearch} />
								{/* <SearchResult search={search} /> */}
							</div>
						</Nav.Link>
						<Nav.Link eventKey={2}>
							<Button
								onClick={handleLogout}
								variant="dark"
								className="lg-button"
							>
								Logout
							</Button>
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
