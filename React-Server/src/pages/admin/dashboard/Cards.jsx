import React from "react";
import "./Cards.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import ImageComponent from "../../../utils/Image.jsx";
import {
  getResponseGet,
  getResponseDelete,
  getResponsePut,
} from "../../../utils/utils";

export default function Cards({ doctor, updateDoctorStatus }) {
  const DISABLE_DOCTOR_ENDPOINT = "/springdatarest/doctors/";
  const GET_USER_DOCTOR_ENDPOINT =
    "/springdatarest/users/search/byAttribute?username=";
  const DELETE_USER_DOCTOR_ENDPOINT = "/springdatarest/users/";

  const [status, setStatus] = useState(doctor.status);

  // function handleView() {
  //   console.log("View Button clicked !");
  // }

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

    const disable_status_response = await getResponsePut(
      DISABLE_DOCTOR_ENDPOINT + `${doctor.resourceId}`,
      obj,
      { "Content-Type": "application/json" }
    );
    const disable_status_status = disable_status_response?.status;
    if (disable_status_status === 200) {
      if (disable_status_response.data.status === "disabled") {
        setStatus("disabled");
      } else {
        setStatus("enabled");
      }
      updateDoctorStatus({ ...doctor, status: obj.status });
      let doctor_id;
      // We now try to get the doctor from the users table and later on delete him/her based on the resourceId
      const get_doctor_response = await getResponseGet(
        GET_USER_DOCTOR_ENDPOINT + `${doctor.email}`
      );
      const get_doctor_status = get_doctor_response?.status;
      if (get_doctor_status === 200) {
        console.log("Doctor could be fetched successfully.");
        doctor_id = get_doctor_response?.data?.resourceId;

        // Now we try to delete this doctor from the users table as well.
        const delete_doctor_user_response = await getResponseDelete(
          DELETE_USER_DOCTOR_ENDPOINT + `${doctor_id}`
        );
        const delete_doctor_user_status = delete_doctor_user_response?.status;
        if (delete_doctor_user_status === 200) {
          console.log("Doctor User was successfully deleted ");
        } else {
          console.error(
            "Doctor User was not deleted successfully",
            delete_doctor_user_response
          );
        }
      } else {
        console.error(
          "Doctor could not be fetched from the Doctors table",
          get_doctor_response
        );
      }
    } else {
      console.error("Doctor was not disabled", disable_status_response);
    }
  }

  return (
    <div className="containers">
      <div className="card_item">
        <div className="card_inner_doctor">
          <ImageComponent profile_photo={doctor.profile_photo} />
          <div className="name">{doctor.name}</div>
          <div className="qualification">
            Qualification : {doctor.qualification}
          </div>
          <div className="hospital_name">Hospital : {doctor.hospital_name}</div>
          <div className="specialization">
            Specialization : {doctor.specialization}
          </div>
          <div className="buttons">
            {/* <button className="view" onClick={handleView}>
              View Details
            </button> */}
            {(status === "enabled" || status === "disabled") && (
              <button
                className={status === "enabled" ? "disable" : "enable"}
                onClick={() => handleDisable(doctor)}
              >
                {status === "enabled" ? "Disable" : "Enable"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
