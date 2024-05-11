import React, { useEffect, useState } from "react";
import "../style/Counsellor.css";
import Cards from "./Cards";
import { getResponseGet } from "../../../utils/utils";

export default function Counsellor({
	filters,
	search,
	sorts,
	makeConnections,
}) {
	const [sortedCounsellors, setSortedCounsellors] = useState([]);
	const [springData, setSpringData] = useState([]);
	const [docStatus, setDocStatus] = useState([]);
	const [onlineCounselorIds, setOnlineCounselorIds] = useState(new Set());
	const [inCallCounselorIds, setInCallCounselorIds] = useState(new Set());

	useEffect(() => {
		console.log("i am here");
		const fetchData = async () => {
			try {
				const response = await getResponseGet("/springdatarest/counsellors");
				console.log("this is spring data", response);
				const fetchedData = response?.data?._embedded?.counsellors;
				if (fetchedData) {
					setSpringData(fetchedData);
					// setSortedCounsellors(fetchedData);
					console.log("counsellor", fetchedData);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, []);

	const updateCounselorStatus = (updatedCounselor) => {
		setSortedCounsellors((prevCounselors) =>
			prevCounselors.map((counselor) =>
				counselor.email === updatedCounselor.email
					? updatedCounselor
					: counselor
			)
		);
	};

	useEffect(() => {
		const onlineCounsellors = async () => {
			try {
				const response = await getResponseGet("/onlinestatus");
				const onlineIds = response?.data?.ROLE_COUNSELLOR_online || [];
				const inCallIds = response?.data?.ROLE_COUNSELLOR_incall || [];

				setOnlineCounselorIds(new Set(onlineIds));
				setInCallCounselorIds(new Set(inCallIds));

				// 	const { ROLE_COUNSELLOR_incall, ROLE_COUNSELLOR_online } = response?.data;
				// 	const incallSet = new Set(ROLE_COUNSELLOR_incall);
				// 	const onlineSet = new Set(ROLE_COUNSELLOR_online);
				console.log("spring response", response);
				console.log("Incall Counsellors:", inCallIds);
				console.log("Online Counsellors:", onlineIds);

				const updatedSpringData = springData.map((counselor) => ({
					...counselor,
					status: onlineIds.includes(counselor.resourceId)
						? "Online"
						: inCallIds.includes(counselor.resourceId)
						? "In-Call"
						: "Offline",
				}));
				console.log(updatedSpringData);
				setSpringData(updatedSpringData);
			} catch (error) {
				console.error("Error fetching online status:", error);
			}
		};

		const intervalId = setInterval(onlineCounsellors, 10000);
		return () => clearInterval(intervalId);
	}, [springData]);

	useEffect(() => {
		const sorted = springData
			.filter((counselor) => {
				const matchesSpecialization =
					filters.specialization.length === 0 ||
					filters.specialization.includes(counselor.specialization);
				const languages = JSON.parse(counselor.languages);
				const matchesLanguage =
					filters.language.length === 0 ||
					languages.some((language) => filters.language.includes(language));

				const matchesSearchTerm =
					search === "" ||
					counselor.name.toLowerCase().includes(search.toLowerCase());

				return matchesSpecialization && matchesLanguage && matchesSearchTerm;
			})
			// .sort((a, b) => {
			// 	let result = 0;

			// 	if (sorts.arrangeBy === "ascending") {
			// 		if (a[sorts.sortBy] > b[sorts.sortBy]) {
			// 			result = 1;
			// 		} else if (a[sorts.sortBy] < b[sorts.sortBy]) {
			// 			result = -1;
			// 		}
			// 	} else {
			// 		if (a[sorts.sortBy] < b[sorts.sortBy]) {
			// 			result = 1;
			// 		} else if (a[sorts.sortBy] > b[sorts.sortBy]) {
			// 			result = -1;
			// 		}
			// 	}

			// 	return result;
			// });
			.sort((a, b) => {
				const statusOrder = ["In-Call", "Online", "Offline"];

				const statusIndexA = statusOrder.indexOf(a.status);
				const statusIndexB = statusOrder.indexOf(b.status);

				if (statusIndexA !== statusIndexB) {
					return statusIndexA - statusIndexB;
				} else {
					const sortBy = sorts.sortBy;
					const arrangeBy = sorts.arrangeBy === "ascending" ? 1 : -1;

					if (a[sortBy] < b[sortBy]) {
						return -1 * arrangeBy;
					} else if (a[sortBy] > b[sortBy]) {
						return 1 * arrangeBy;
					} else {
						return 0;
					}
				}
			});

		setSortedCounsellors(sorted);
	}, [springData, filters, search, sorts]);

	return (
		<div className="counsellor-container">
			<section className="card-container">
				{sortedCounsellors.map((counselor) => (
					<div key={counselor.name} className="card">
						<Cards
							counsellor={counselor}
							updateCounselorStatus={updateCounselorStatus}
							makeConnections={makeConnections}
						/>
					</div>
				))}
			</section>
		</div>
	);
}
