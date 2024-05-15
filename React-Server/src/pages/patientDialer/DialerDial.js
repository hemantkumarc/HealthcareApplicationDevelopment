import React from "react";
import "./DialerDial.css";

const DialerDial = ({ number, characters, onclickdial }) => {
    return (
        <div className="col">
            <button
                type="button"
                className="btn btn-light dialerButttons"
                onClick={() => onclickdial(number)}
            >
                {number}
                <br />
                <span>{characters}</span>
            </button>
        </div>
    );
};

export default DialerDial;
