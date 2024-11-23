import React, { useEffect, useState } from "react";
import ImageUpload from "./components/ImageUpload";
import ThumbnailGrid from "./components/ThumbnailGrid";
import FullScreenViewer from "./components/FullScreenViewer";
import { getImages } from "./services/api";

const App: React.FC = () => {
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchImages = async () => {
    const data = await getImages();
    setImages(data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="App">
      <ImageUpload onUpload={fetchImages} />
      <ThumbnailGrid images={images} onClick={setSelectedImage} />
      {selectedImage && (
        <FullScreenViewer
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default App;
