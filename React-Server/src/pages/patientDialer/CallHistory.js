import { setSeconds } from "date-fns";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { getResponseGet, getResponsePost } from "../../utils/utils";

const CallHistory = ({ showCallHistory, setShowCallHistory }) => {
    const [isDataLoaded, setIsDataLoaded] = useState(true);
    let callHistories;
    const handleClose = () => {
        setShowCallHistory(false);
        console.log("modal falg", showCallHistory);
    };
    useEffect(() => {
        const getCallHistory = async () => {
            const id = localStorage.getItem("id");
            let response = await getResponseGet(
                `/springdatarest/callHistories/search/byids?patientid=` + id
            );
            console.log(response);
            callHistories = response?.data?._embedded?.callHistories;
            // setIsDataLoaded(true);
        };
        getCallHistory();
    }, [showCallHistory]);
    return (
        <Modal show={showCallHistory} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>CallHistory</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!isDataLoaded ? (
                    <div className="d-flex justify-content-center">
                        <div className="spinner-grow" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CallHistory;
