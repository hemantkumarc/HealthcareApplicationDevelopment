import { setSeconds } from "date-fns";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { getResponseGet, getResponsePost } from "../../utils/utils";

const CallHistory = ({ apiOption }) => {
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [callHistories, setCallHistories] = useState(null);
    const id = localStorage.getItem("id");
    useEffect(() => {
        const getCallHistory = async () => {
            let response = await getResponseGet(
                `/springdatarest/callHistories/search/byids?patientid=` + id
            );
            console.log(response);
            setCallHistories(response?.data?._embedded?.callHistories);
            setTimeout(() => {
                setIsDataLoaded(true);
            }, 1000);
        };
        getCallHistory();
    }, []);

    const getDuration = (startTime, endTime) => {
        console.log("this is call history", callHistories, startTime, endTime);
        const callEnd = new Date(endTime);
        const callStart = new Date(startTime);

        const timeDifferenceMs = callEnd - callStart;

        // Convert milliseconds to hours, minutes, and seconds
        const hours = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
        const minutes = Math.floor(
            (timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeDifferenceMs % (1000 * 60)) / 1000);

        // Format the result
        const formattedTimeDifference = `${hours}:${minutes}:${seconds}`;

        console.log(formattedTimeDifference); // Output: "24:0:0"
        return formattedTimeDifference;
    };

    const getDateTime = (dateString) => {
        const dateObj = new Date(dateString);

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");

        const hours = String(dateObj.getHours()).padStart(2, "0");
        const minutes = String(dateObj.getMinutes()).padStart(2, "0");
        const seconds = String(dateObj.getSeconds()).padStart(2, "0");

        const formattedDate = `${year}-${month}-${day}`;
        const formattedTime = `${hours}:${minutes}:${seconds}`;

        console.log("Date:", formattedDate);
        console.log("Time:", formattedTime);

        return `${formattedDate} ${formattedTime}`;
    };

    return (
        <>
            {isDataLoaded ? (
                callHistories.map((call) => (
                    <div key={call.callId}>
                        {id} - {getDuration(call.callStart, call.callEnd)} -{" "}
                        {getDateTime(call.callStart)}
                        <hr /> <br />
                    </div>
                ))
            ) : (
                <lord-icon
                    src="https://cdn.lordicon.com/rqptwppx.json"
                    trigger="loop"
                    state="loop-cycle"
                    style={{ width: "250px", height: "250px" }}
                ></lord-icon>
            )}
        </>
    );
};

export default CallHistory;
