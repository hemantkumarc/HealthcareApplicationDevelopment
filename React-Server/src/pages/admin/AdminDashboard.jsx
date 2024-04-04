import React from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import AdminUpdateCounsellor from "./AdminUpdateCounsellor";
import AdminDisableCounsellor from "./AdminDisableCounsellor";

const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="admin-container">
      <div className="container">
        <button
          className="buttons"
          onClick={() => {
            navigate("/adminCreateCounsellor");
          }}
        >
          CREATE
        </button>
        <button
          className="buttons"
          onClick={() => {
            navigate(<AdminUpdateCounsellor />);
          }}
        >
          UPDATE
        </button>
        <button
          className="buttons"
          onClick={() => {
            navigate(<AdminDisableCounsellor />);
          }}
        >
          DISABLE
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
