import React, { useState, useEffect } from "react";
import api from "../api/axios.jsx";

function ImageComponent({ profile_photo }) {
  const [imageSrc, setImageSrc] = useState("");

  const DOWNLOAD_IMAGE_ENDPOINT = "/file/download";

  const downloadImage = async () => {
    try {
      const response = await api.get(DOWNLOAD_IMAGE_ENDPOINT, {
        params: {
          imagePath: profile_photo,
        },
        responseType: "arraybuffer",
      });

      const base64Data = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      setImageSrc(`data:image/png;base64,${base64Data}`);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  useEffect(() => {
    downloadImage();
  }, [profile_photo]); // Call downloadImage whenever the profile_photo prop changes

  return (
    <div>
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Downloaded Image"
          style={{ height: "100px", width: "100px" }}
        />
      )}
    </div>
  );
}

export default ImageComponent;
