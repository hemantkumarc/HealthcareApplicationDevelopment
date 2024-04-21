import React from "react";
import "./Cards.css";
import api from "../../../api/axios.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import ImageComponent from "../../../utils/Image.jsx";

export default function Cards({ doctor, updateDoctorStatus }) {
  const DISABLE_DOCTOR_ENDPOINT = "/springdatarest/doctors/";
  const GET_USER_DOCTOR_ENDPOINT =
    "/springdatarest/users/search/byAttribute?username=";
  const DELETE_USER_DOCTOR_ENDPOINT = "/springdatarest/users/";

  const [status, setStatus] = useState(doctor.status);

  function handleView() {
    console.log("View Button clicked !");
  }

  async function handleDisable(doctor) {
    console.log("Disable Button clicked !", doctor.resourceId);
    const obj = {
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
      hospital_name: doctor.hospital_name,
      hospital_address: doctor.hospital_address,
      qualification: doctor.qualification,
      profile_photo: doctor.profile_photo,
      date: doctor.date,
      status: doctor.status === "enabled" ? "disabled" : "enabled",
      languages: JSON.stringify(doctor.languages),
    };

    try {
      const disable_response = await api.put(
        DISABLE_DOCTOR_ENDPOINT + `${doctor.resourceId}`,
        JSON.stringify(obj),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(disable_response.status);
      if (disable_response.data.status === "disabled") {
        setStatus("disabled");
      } else {
        setStatus("enabled");
      }
      updateDoctorStatus({ ...doctor, status: obj.status });

      let doctor_id;
      try {
        // We now try to get the doctor from the users table and later on delete him/her based on the resourceId
        const get_doctor_response = await api.get(
          GET_USER_DOCTOR_ENDPOINT + `${doctor.email}`
        );
        console.log(get_doctor_response.status);
        console.log("GET USER executed successfully.");
        doctor_id = get_doctor_response?.data?.resourceId;
      } catch (err) {
        console.log(err);
        console.log("GET USER failed.");
      }

      console.log("doctor id", doctor_id);
      try {
        const delete_doctor_response = await api.delete(
          DELETE_USER_DOCTOR_ENDPOINT + `${doctor_id}`
        );
        console.log(delete_doctor_response.status);
        console.log("DELETE USER executed successfully.");
      } catch (err) {
        console.log(err);
        console.log("DELETE USER failed.");
      }
    } catch (err) {
      console.log(err);
      console.log("Disable functionality did not work !!");
    }
  }

  return (
    <div className="containers">
      <div className="card_item">
        <div className="card_inner">
          {/* <img src={doctor.profile_photo} alt="counsellor" /> */}
          <ImageComponent profile_photo="/assets/large-Smile-Guy-web.jpg" />
          <div className="name">{doctor.name}</div>
          <div className="qualification">
            Qualification : {doctor.qualification}
          </div>
          <div className="hospital_name">Hospital : {doctor.hospital_name}</div>
          <div className="specialization">
            Specialization : {doctor.specialization}
          </div>
          <div className="buttons">
            <button className="view" onClick={handleView}>
              View Details
            </button>
            {(status === "enabled" || status === "disabled") && (
              <button className="disable" onClick={() => handleDisable(doctor)}>
                {status === "enabled" ? "Disable" : "Enable"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
