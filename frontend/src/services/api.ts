import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axios.post(`${API_BASE_URL}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.url;
};

export const getImages = async (): Promise<{ name: string; url: string }[]> => {
  const response = await axios.get(`${API_BASE_URL}/images`);
  return response.data.images;
};
