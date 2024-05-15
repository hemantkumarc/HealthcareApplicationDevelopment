import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import { getResponsePost } from "../../utils/utils";

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
    const send_email_response = await getResponsePost(
      SEND_MAIL_ENDPOINT + `${formData.email}`,
      JSON.stringify(formData),
      { "Content-Type": "application/json" }
    );
    const send_email_status = send_email_response?.status;
    if (send_email_status === 200) {
      toast.success(
        "You would have received a reset password email to your registered email id. Please close the current window."
      );
      setTimeout(function () {
        navigate("/");
      }, 7000);
    } else {
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
