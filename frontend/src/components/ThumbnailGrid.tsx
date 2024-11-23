import React from "react";

interface Props {
  images: { name: string; url: string }[];
  onClick: (url: string) => void;
}

const ThumbnailGrid: React.FC<Props> = ({ images, onClick }) => {
  return (
    <div className="thumbnail-grid">
      {images.map((image) => (
        <img
          key={image.name}
          src={image.url}
          alt={image.name}
          onClick={() => onClick(image.url)}
        />
      ))}
    </div>
  );
};

export default ThumbnailGrid;
