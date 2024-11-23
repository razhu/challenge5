import React, { useState } from "react";
import { uploadImage } from "../services/api";

interface Props {
  onUpload: () => void;
}

const ImageUpload: React.FC<Props> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    await uploadImage(file);
    onUpload();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
      />
      <button type="submit">Upload</button>
    </form>
  );
};

export default ImageUpload;
