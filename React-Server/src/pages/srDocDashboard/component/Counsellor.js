import React, { useEffect, useState } from "react";
import "../style/Counsellor.css";
import Cards from "./Cards";
import { getResponseGet } from "../../../utils/utils";
// import data from "../db/data";

// let springData;
export default function Counsellor({ filters, search, sorts }) {
	const [sortedCounsellors, setSortedCounsellors] = useState([]);
	const [springData, setSpringData] = useState([]);
	useEffect(() => {
		console.log("i am here");
		const fetchData = async () => {
			try {
				const response = await getResponseGet("/springdatarest/counsellors");
				console.log("this is spring data", response);
				const fetchedData = response?.data?._embedded?.counsellors;
				if (fetchedData) {
					setSpringData(fetchedData);
					setSortedCounsellors(fetchedData);
					console.log(response);
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
		const sorted = springData
			.filter((counselor) => {
				const matchesSpecialization =
					filters.specialization.length === 0 ||
					filters.specialization.includes(counselor.specialization);
				// const matchesLanguage =
				// 	filters.language.length === 0 ||
				// 	counselor.languagues.some((language) =>
				// 		filters.language.includes(language)
				// 	);

				// const matchesLanguage =
				// 	filters.language.length === 0 ||
				// 	filters.language.some((language) =>
				// 		counselor.languagues.includes(language)
				// 	);

				const languages = JSON.parse(counselor.languages);
				const matchesLanguage =
					filters.language.length === 0 ||
					languages.some((language) => filters.language.includes(language));

				const matchesSearchTerm =
					search === "" ||
					counselor.name.toLowerCase().includes(search.toLowerCase());

				return matchesSpecialization && matchesLanguage && matchesSearchTerm;
			})
			.sort((a, b) => {
				let result = 0;

				if (sorts.arrangeBy === "ascending") {
					if (a[sorts.sortBy] > b[sorts.sortBy]) {
						result = 1;
					} else if (a[sorts.sortBy] < b[sorts.sortBy]) {
						result = -1;
					}
				} else {
					if (a[sorts.sortBy] < b[sorts.sortBy]) {
						result = 1;
					} else if (a[sorts.sortBy] > b[sorts.sortBy]) {
						result = -1;
					}
				}

				return result;
			});

		setSortedCounsellors(sorted);
	}, [sortedCounsellors, filters, search, sorts]);

	return (
		<div className="counsellor-container">
			<section className="card-container">
				{sortedCounsellors.map((counselor) => (
					<div key={counselor.name} className="card">
						<Cards
							counsellor={counselor}
							updateCounselorStatus={updateCounselorStatus}
						/>
					</div>
				))}
			</section>
		</div>
	);
}
