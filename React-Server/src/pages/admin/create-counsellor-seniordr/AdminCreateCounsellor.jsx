import React from "react";
import "./AdminCreateCounsellor.css";
import { useNavigate } from "react-router-dom";
import { counsellorLanguages } from "./languages.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { userLoggedIn } from "../../../utils/utils";
import { jwtDecode } from "jwt-decode";
import { getResponseGet, getResponsePost } from "../../../utils/utils";

const AdminCreateCounsellor = () => {
  const SAVE_COUNSELLOR_ENDPOINT = "/springdatarest/counsellors";
  const SAVE_SENIORDR_ENDPOINT = "/springdatarest/seniorDrs";
  const GET_DOCTORS_BY_EMAIL =
    "/springdatarest/doctors/search/byAttributes?email=";
  const SEND_MAIL = "/mail/send/";
  const UPLOAD_IMAGE = "/file/upload";

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedIn = await userLoggedIn();
      if (loggedIn) {
        const jwtdecoded = jwtDecode(token);
        console.log("this is the jwtDecode after decoding", jwtdecoded);
        if (jwtdecoded.role !== "ROLE_ADMIN") {
          navigate("/");
        }
        localStorage.setItem("role", jwtdecoded.role);
        localStorage.setItem("id", jwtdecoded.sub);
      } else {
        navigate("/");
      }
    };
    checkLoggedIn();
  }, [navigate, token]);

  const [file, setFile] = React.useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  console.log(file);

  const [updatedLanguage, setUpdatedLanguage] = React.useState([]);

  const handleLanguageChange = (language) => {
    setUpdatedLanguage(language.map((object) => object.label) || []);
    // console.log(updatedLanguage);
  };

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

  console.log(formData);

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

    const photo_upload_response = await getResponsePost(
      UPLOAD_IMAGE,
      {
        image: file,
      },
      {
        "Content-Type": "multipart/form-data",
      }
    );
    const upload_status = photo_upload_response?.status;
    console.log("Photo Upload API Response", photo_upload_response);
    if (upload_status === 200) {
      const filePath = photo_upload_response?.data?.filePath;
      const finalFormData = {
        ...formData,
        languages: JSON.stringify(updatedLanguage),
        status: formData.status.toString() === "true" ? "enabled" : "disabled",
        profile_photo:
          upload_status === 200 ? filePath : "/assets/default-image.jpg",
      };

      console.log(finalFormData);
      console.log(JSON.stringify(finalFormData));

      const doctors_email_response = await getResponseGet(
        GET_DOCTORS_BY_EMAIL + `${finalFormData.email}`
      );

      console.log("Doctors Email API Response ", doctors_email_response);

      const SEND_MAIL_ENDPOINT = SEND_MAIL + `${finalFormData.email}`;

      const check = doctors_email_response?.data?._embedded?.doctors;
      if (check !== undefined && check?.length === 0) {
        // Now we can either check if he wants to be senior doctor or not

        if (finalFormData.isSeniorDoctor) {
          delete finalFormData.isSeniorDoctor;
          const save_seniordr_response = await getResponsePost(
            SAVE_SENIORDR_ENDPOINT,
            JSON.stringify(finalFormData),
            { "Content-Type": "application/json" }
          );
          const save_seniordr_status = save_seniordr_response?.status;
          if (save_seniordr_status === 201) {
            toast.success(
              "The Senior Doctor is sent a mail and is successfully added to database !"
            );

            // Now send the mail.
            const send_email_response = await getResponsePost(
              SEND_MAIL_ENDPOINT
            );
            const send_email_status = send_email_response?.status;
            if (send_email_status === 200) {
              setTimeout(function () {
                navigate("/adminDashboard");
              }, 5000);
            } else {
              console.error("Send Email API failed", send_email_response);
            }
          } else {
            toast.error("The Senior Doctor was not added to database !");
          }
        } else {
          delete finalFormData.isSeniorDoctor;
          const save_counsellor_response = await getResponsePost(
            SAVE_COUNSELLOR_ENDPOINT,
            JSON.stringify(finalFormData),
            { "Content-Type": "application/json" }
          );
          const save_counsellor_status = save_counsellor_response?.status;
          if (save_counsellor_status === 201) {
            toast.success(
              "The Counsellor is sent a mail and is successfully added to database !"
            );
            // Now send the mail.

            const send_email_response = await getResponsePost(
              SEND_MAIL_ENDPOINT
            );
            const send_email_status = send_email_response?.status;
            if (send_email_status === 200) {
              setTimeout(function () {
                navigate("/adminDashboard");
              }, 2000);
            } else {
              console.error("Send Email API failed", send_email_response);
            }
          } else {
            toast.error("The Counsellor was not added to database !");
          }
        }
      } else {
        // This means that the doctor is already present
        toast.error("There is already another doctor with the same email !");
      }
    } else {
      console.error(photo_upload_response);
      toast.error("Uploaded Image is greater than 15MB");
    }
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
          type="file"
          id={id + "-filePath"}
          placeholder="Upload Photo"
          className="form--input"
          accept="image/jpeg, image/png"
          required
          name="profile_photo"
          onChange={handleFileChange}
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
        <button className="form--submit">Create Doctor</button>
      </form>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default AdminCreateCounsellor;
