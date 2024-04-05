import React, { useEffect, useState } from "react";
import "../style/Counsellor.css";
import Cards from "./Cards";
// import { getResponseGet } from "../../../utils/utils";
import data from "../db/data";

// let springData;
// export default function Counsellor({ filters, search, sorts }) {
// 	const [isDataLoaded, setIsDataLoaded] = useState(null);
// 	const [sortedCounsellors, setSortedCounsellors] = useState([]);

	// useEffect(() => {
	// 	console.log("i am here");
	// 	const getData = async () => {
	// 		springData = await getResponseGet("/springdatarest/counsellors");
	// 		console.log("this is spring data", springData);
	// 		if (springData?.data?._embedded?.counsellors) {
	// 			springData = springData?.data?._embedded?.counsellors;
	// 			console.log(springData);
	// 			setIsDataLoaded(true);
	// 		}
	// 	};
	// 	getData();
	// }, []);

	// useEffect(() => {
	// 	if (isDataLoaded) {
	// 		const sorted = springData
	// 			.filter((counselor) => {
	// 				const matchesSpecialization =
	// 					filters.specialization.length === 0 ||
	// 					filters.specialization.includes(counselor.specialization);
	// 				const matchesLanguage =
	// 					filters.language.length === 0 ||
	// 					counselor.languages_spoken.some((language) =>
	// 						filters.language.includes(language)
	// 					);

	// 				const matchesSearchTerm =
	// 					search === "" ||
	// 					counselor.name.toLowerCase().includes(search.toLowerCase());

	// 				return matchesSpecialization && matchesLanguage && matchesSearchTerm;
	// 			})
	// 			.sort((a, b) => {
	// 				let result = 0;

	// 				if (sorts.arrangeBy === "ascending") {
	// 					if (a[sorts.sortBy] > b[sorts.sortBy]) {
	// 						result = 1;
	// 					} else if (a[sorts.sortBy] < b[sorts.sortBy]) {
	// 						result = -1;
	// 					}
	// 				} else {
	// 					if (a[sorts.sortBy] < b[sorts.sortBy]) {
	// 						result = 1;
	// 					} else if (a[sorts.sortBy] > b[sorts.sortBy]) {
	// 						result = -1;
	// 					}
	// 				}

	// 				return result;
	// 			});

	// 		setSortedCounsellors(sorted);
	// 	}
	// }, [isDataLoaded]);

	
export default function Counsellor({ filters, search, sorts }) {
	const sortedCounsellors = data
	  .filter((counselor) => {
		const matchesSpecialization =
		  filters.specialization.length === 0 ||
		  filters.specialization.includes(counselor.specialization);
		const matchesLanguage =
		  filters.language.length === 0 ||
		  counselor.languages_spoken.some((language) =>
			filters.language.includes(language)
		  );
  
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
  

	return (
		<div className="counsellor-container">
			<section className="card-container">
				{sortedCounsellors.map((counselor) => (
					<div key={counselor.name} className="card">
						<Cards counsellor={counselor} />
					</div>
				))}
			</section>
		</div>
	);
}
