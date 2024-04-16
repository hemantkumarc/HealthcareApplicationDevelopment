import React from "react";
import api from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const SEND_MAIL_ENDPOINT = "/mail/send/";

  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    email: "",
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

    try {
      const response = await api.post(
        SEND_MAIL_ENDPOINT + `${formData.email}`,
        JSON.stringify(formData),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response?.status);
      toast.success(
        "You would have received a reset password email to your registered email id. Please close the current window."
      );
      setTimeout(function () {
        navigate("/");
      }, 7000);
    } catch (err) {
      console.error("Forgot Password request failed !");
    }
    console.log("Form submitted !");
  }

  return (
    <div className="signup-form-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 style={{ fontWeight: "bold" }}> Forgot Password ? </h2>
        <br />

        <label htmlFor={id + "-email"}>Please enter your email id :</label>
        <br />
        <input
          type="email"
          required
          id={id + "email"}
          className="form--input"
          name="email"
          onChange={handleChange}
          value={formData.email}
        />

        <br />
        <br />
        <button className="form--submit">Click Me</button>
      </form>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default ForgotPassword;
