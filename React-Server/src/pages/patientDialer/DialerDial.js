import React from "react";

const DialerDial = ({ number, characters, onclickdial }) => {
    return (
        <div className="col">
            <button
                type="button"
                className="btn btn-light"
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
