import React from "react";
import "./AdminCreateCounsellor.css";
import api from "../../../api/axios.jsx";
import { useNavigate } from "react-router-dom";
import { counsellorLanguages } from "./languages.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const AdminCreateCounsellor = () => {
  const SAVE_COUNSELLOR_ENDPOINT = "/springdatarest/counsellors";
  const SAVE_SENIORDR_ENDPOINT = "/springdatarest/seniorDrs";
  const GET_DOCTORS_BY_EMAIL =
    "/springdatarest/doctors/search/byAttributes?email=";
  const SEND_MAIL = "/mail/send/";

  const [updatedLanguage, setUpdatedLanguage] = React.useState([]);

  const handleLanguageChange = (language) => {
    setUpdatedLanguage(language.map((object) => object.label) || []);
    // console.log(updatedLanguage);
  };

  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    name: "",
    date: "",
    qualification: "",
    specialization: "",
    hospital_name: "",
    hospital_address: "",
    languages: [],
    email: "",
    isSeniorDoctor: true,
    profile_photo: "",
    status: true,
  });

  const id = React.useId();

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const finalFormData = {
      ...formData,
      languages: JSON.stringify(updatedLanguage),
      status: formData.status.toString() === "true" ? "enabled" : "disabled",
    };

    const doctors_email_response = await api.get(
      GET_DOCTORS_BY_EMAIL + `${finalFormData.email}`
    );

    const SEND_MAIL_ENDPOINT = SEND_MAIL + `${finalFormData.email}`;

    const check = doctors_email_response?.data?._embedded?.doctors;
    if (check !== undefined && check?.length === 0) {
      // Now we can either check if he wants to be senior doctor or not

      if (finalFormData.isSeniorDoctor) {
        delete finalFormData.isSeniorDoctor;
        try {
          const response = await api.post(
            SAVE_SENIORDR_ENDPOINT,
            JSON.stringify(finalFormData),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          console.log(response?.status);
        } catch (err) {}
        toast.success(
          "The Senior Doctor is sent a mail and is successfully added to database !"
        );
      } else {
        delete finalFormData.isSeniorDoctor;
        try {
          const response = await api.post(
            SAVE_COUNSELLOR_ENDPOINT,
            JSON.stringify(finalFormData),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          console.log(response?.status);
        } catch (err) {
          console.error("ERROR !!", err);
        }
        toast.success(
          "The doctor is sent a mail to change password and is successfully added to database !"
        );
      }

      try {
        const response = await api.post(SEND_MAIL_ENDPOINT);
        console.log(response?.status);
      } catch (err) {
        console.error(err);
      }
      setTimeout(function () {
        navigate("/adminDashboard");
      }, 6000);
    } else {
      // This means that the doctor is already present
      toast.error("There is already another doctor with the same email !");
    }
    console.log(JSON.stringify(finalFormData));
    console.log("Form Submitted");
  }

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2 style={{ fontWeight: "bold" }}> Counsellor / Sr. Doctor Details</h2>
        <br />

        <label htmlFor={id + "-name"}>
          Enter Counsellor / Senior Doctor Name :
        </label>
        <input
          type="text"
          id={id + "-name"}
          placeholder="Full Name"
          className="form--input"
          name="name"
          onChange={handleChange}
          value={formData.name}
        />

        <br />

        <label htmlFor={id + "-dateofbirth"}>
          Enter Counsellor / Senior Doctor DoB :
        </label>
        <br />
        <input
          type="date"
          id={id + "-dateofbirth"}
          placeholder="YYYY-MM-DD"
          className="form--input"
          name="date"
          onChange={handleChange}
          value={formData.date}
        />

        <br />

        <label htmlFor={id + "-qualification"}>
          Enter Counsellor / Senior Doctor Qualification :
        </label>
        <input
          type="text"
          id={id + "-qualification"}
          placeholder="Qualification"
          className="form--input"
          name="qualification"
          onChange={handleChange}
          value={formData.qualification}
        />

        <br />

        <label htmlFor={id + "-specialization"}>
          Enter Counsellor / Senior Doctor Specialization :
        </label>
        <input
          type="text"
          id={id + "-specialization"}
          placeholder="Specialization"
          className="form--input"
          name="specialization"
          onChange={handleChange}
          value={formData.specialization}
        />

        <br />

        <label htmlFor={id + "-hospitalName"}>
          Enter his / her partner hospital name :
        </label>
        <input
          type="text"
          id={id + "-hospitalName"}
          placeholder="Enter Hospital Name"
          className="form--input"
          name="hospital_name"
          onChange={handleChange}
          value={formData.hospital_name}
        />

        <br />

        <label htmlFor={id + "-hospitalAddress"}>
          Enter his / her partner hospital address :
        </label>
        <br />
        <textarea
          placeholder="Address"
          id={id + "-hospitalAddress"}
          className="form--textarea"
          onChange={handleChange}
          name="hospital_address"
          value={formData.hospital_address}
        />

        <br />

        <label htmlFor={id + "-emailAddress"}>
          Enter his / her partner email address :
        </label>
        <input
          type="email"
          id={id + "-emailAddress"}
          placeholder="Email Address"
          className="form--input"
          name="email"
          onChange={handleChange}
          value={formData.email}
        />

        <br />

        {/* Profile Photo */}
        <label htmlFor={id + "-filePath"}>
          Enter his / her latest photograph :
        </label>
        <br />
        <input
          type="text"
          id={id + "-filePath"}
          placeholder="File"
          className="form--input"
          name="profile_photo"
          onChange={handleChange}
          value={formData.profile_photo}
        />

        <br />

        <label htmlFor={id + "-languages"}>
          Select all languages counsellor is comfortable with (if any) :
        </label>
        <Select
          isMulti
          name="languages"
          options={counsellorLanguages}
          className="basic-multi-select"
          onChange={handleLanguageChange}
          classNamePrefix="select"
        />
        <br />

        <label htmlFor={id + "-isSeniorDoctor"}>
          Is he / she a Senior Doctor or not ?
        </label>
        <input
          name="isSeniorDoctor"
          type="checkbox"
          className="form--checkbox"
          checked={formData.isSeniorDoctor}
          onChange={handleChange}
          id={id + "-isSeniorDoctor"}
        />
        <br />
        <button className="form--submit">CREATE</button>
      </form>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default AdminCreateCounsellor;
