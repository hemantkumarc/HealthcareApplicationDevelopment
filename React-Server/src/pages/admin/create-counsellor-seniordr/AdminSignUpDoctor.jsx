import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminSignUpDoctor.css";
import { getResponsePost } from "../../../utils/utils";

const AdminSignUpDoctor = () => {
  const CHANGE_PASSWORD_ENDPOINT = "/mail/changePassword";

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

  function getQueryParam(name) {
    const url = window.location.href;
    const params = new URLSearchParams(url.split("?")[1]);
    return params.get(name);
  }

  console.log(formData);

  const id = React.useId();

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("Button clicked !");

    if (formData.password === formData.confirmPassword) {
      // Getting the token from the URL and setting it in the localStorage
      const token = getQueryParam("token");
      localStorage.setItem("token", token);
      // Adding the token to the request body
      formData.token = token;
      // Removing confirmPassword from the finalFormData
      delete formData.confirmPassword;
      console.log(formData);

      const change_password_response = await getResponsePost(
        CHANGE_PASSWORD_ENDPOINT,
        JSON.stringify(formData),
        { "Content-Type": "application/json" }
      );
      const change_password_status = change_password_response?.status;
      if (change_password_status === 200) {
        toast.success(
          "You have successfully reset password. Please close current window."
        );
      } else {
        console.error("Change Password request failed !");
        toast.error("Something went wrong while changing passwords");
      }
    } else {
      toast.error("Passwords arent't matching !");
    }
    console.log("Form submitted !");
  }

  return (
    <div className="signup-form-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 style={{ fontWeight: "bold" }}> Reset Password </h2>
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
        <button className="form--submit">Reset</button>
      </form>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default AdminSignUpDoctor;
