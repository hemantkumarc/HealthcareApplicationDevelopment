import React, { useState } from "react";
import "./RestBody.css";
import DialerDial from "./DialerDial";
import { initiateWebRTC, initiateWebsocket } from "../../utils/utils";

const RestBody = () => {
    const [dial, setDial] = useState("");
    const drVoltePhnumber = "9899000123";

    const addnumber = (number) => {
        setDial((prevDial) => prevDial + number);
    };

    const decreaseNumber = () => {
        setDial((prevDial) => prevDial.slice(0, -1));
    };

    const initiateCall = () => {
        if (
            !dial.includes(drVoltePhnumber) ||
            !dial.endsWith(drVoltePhnumber)
        ) {
            alert(
                "This is not actual pHone Okay.....\nShut up and dial Tollfree number only"
            );
            return;
        }
        const conn = initiateWebsocket();
        initiateWebRTC(conn);
    };

    console.log(dial);
    return (
        <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
                <div className="container mt-5">
                    <div className="phone-dialer">
                        <input
                            type="tel"
                            id="phoneNumber"
                            className="form-control mb-3"
                            placeholder="Enter phone number"
                            value={dial}
                            onChange={(e) => setDial(e.target.value)}
                        />
                        <div className="row">
                            <DialerDial
                                number="1"
                                characters={""}
                                onclickdial={addnumber}
                            />
                            <DialerDial
                                number="2"
                                characters={"ABC"}
                                onclickdial={addnumber}
                            />
                            <DialerDial
                                number="3"
                                characters={"DEF"}
                                onclickdial={addnumber}
                            />
                        </div>
                        <div className="row">
                            <DialerDial
                                number={"4"}
                                characters={"GHI"}
                                onclickdial={addnumber}
                            />
                            <DialerDial
                                number={"5"}
                                characters={"JKL"}
                                onclickdial={addnumber}
                            />
                            <DialerDial
                                number={"6"}
                                characters={"MNO"}
                                onclickdial={addnumber}
                            />
                        </div>
                        <div className="row">
                            <DialerDial
                                number={"7"}
                                characters={"PQRS"}
                                onclickdial={addnumber}
                            />
                            <DialerDial
                                number={"8"}
                                characters={"TUV"}
                                onclickdial={addnumber}
                            />
                            <DialerDial
                                number={"9"}
                                characters={"WXYZ"}
                                onclickdial={addnumber}
                            />
                        </div>
                        <div className="row">
                            <DialerDial
                                number={""}
                                characters={"*"}
                                onclickdial={addnumber}
                            />
                            <DialerDial
                                number={"0"}
                                characters={""}
                                onclickdial={addnumber}
                            />
                            <DialerDial
                                number={""}
                                characters={"#"}
                                onclickdial={addnumber}
                            />
                        </div>
                        <div className="row">
                            <div className="col">
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={() => initiateCall()}
                                >
                                    Call
                                    <br />
                                    <i className="material-icons">call</i>
                                </button>
                            </div>
                            <div className="col">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => decreaseNumber()}
                                >
                                    Clear<br></br>
                                    <i className="material-icons">backspace</i>
                                </button>
                            </div>
                            <div className="col">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                >
                                    Exit
                                    <br />
                                    <i className="material-icons">call_end</i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-3"></div>
        </div>
    );
};

export default RestBody;
