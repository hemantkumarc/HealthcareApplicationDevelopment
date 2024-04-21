import React, { useState } from "react";
import api from "../../../api/axios.jsx";

function Image() {
  const [imageSrc, setImageSrc] = useState("");

  const downloadImage = async () => {
    try {
      const response = await api.get("http://localhost/file/download", {
        params: {
          imagePath: "/assets/somerandomimage.jpeg", // Replace with the actual image path
        },
        responseType: "arraybuffer", // Set the responseType to 'arraybuffer' to receive byte data
      });

      // Convert byte data to base64-encoded string
      const base64Data = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      // Set the base64-encoded string as the image source
      setImageSrc(`data:image/png;base64,${base64Data}`);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div>
      <button onClick={downloadImage}>Download Image</button>
      {imageSrc && <img src={imageSrc} alt="Downloaded Image" />}
    </div>
  );
}

export default Image;
