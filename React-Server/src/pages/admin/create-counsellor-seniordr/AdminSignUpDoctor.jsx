import React from "react";
import api from "../../../api/axios.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminSignUpDoctor.css";

const AdminSignUpDoctor = () => {
  const [formData, setFormData] = React.useState({
    password: "",
    confirmPassword: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }

  console.log(formData);

  const id = React.useId();

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("Button clicked !");

    if (formData.password === formData.confirmPassword) {
      console.log("Passwords are matching !");
    } else {
      toast.error("Passwords arent't matching !");
    }
    // const finalFormData = {
    //   ...formData,
    //   languages: JSON.stringify(updatedLanguage),
    //   status: formData.status.toString() === "true" ? "enabled" : "disabled",
    // };

    // const doctors_email_response = await api.get(
    //   GET_DOCTORS_BY_EMAIL + `${finalFormData.email}`
    // );

    // const SEND_MAIL_ENDPOINT = SEND_MAIL + `${finalFormData.email}`;

    // const check = doctors_email_response?.data?._embedded?.doctors;
    // if (check !== undefined && check?.length === 0) {
    //   // Now we can either check if he wants to be senior doctor or not

    //   if (finalFormData.isSeniorDoctor) {
    //     delete finalFormData.isSeniorDoctor;
    //     try {
    //       const response = await api.post(
    //         SAVE_SENIORDR_ENDPOINT,
    //         JSON.stringify(finalFormData),
    //         {
    //           headers: { "Content-Type": "application/json" },
    //         }
    //       );
    //       console.log(response?.status);
    //     } catch (err) {}
    //     toast.success(
    //       "The Senior Doctor is sent a mail and is successfully added to database !"
    //     );
    //   } else {
    //     delete finalFormData.isSeniorDoctor;
    //     try {
    //       const response = await api.post(
    //         SAVE_COUNSELLOR_ENDPOINT,
    //         JSON.stringify(finalFormData),
    //         {
    //           headers: { "Content-Type": "application/json" },
    //         }
    //       );
    //       console.log(response?.status);
    //     } catch (err) {}
    //     toast.success(
    //       "The Counsellor is sent a mail and is successfully added to database !"
    //     );
    //   }
    // } else {
    //   // This means that the doctor is already present
    //   toast.error("There is already another doctor with the same email !");
    // }
    // console.log(JSON.stringify(finalFormData));
    // console.log("Form Submitted");
  }

  return (
    <div className="signup-form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2 style={{ fontWeight: "bold" }}> Sign Up </h2>
        <br />

        <label htmlFor={id + "-password"}>Please enter your password :</label>
        <br />
        <input
          type="password"
          autoComplete="off"
          required
          minLength={8}
          id={id + "password"}
          className="form--input"
          name="password"
          onChange={handleChange}
          value={formData.password}
        />

        <br />
        <br />

        <label htmlFor={id + "-confirmPassword"}>
          Please confirm your password :
        </label>
        <br />
        <input
          type="password"
          autoComplete="off"
          required
          minLength={8}
          id={id + "confirmPassword"}
          className="form--input"
          name="confirmPassword"
          onChange={handleChange}
          value={formData.confirmPassword}
        />

        <br />
        <br />
        <button className="form--submit">CREATE</button>
      </form>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default AdminSignUpDoctor;
