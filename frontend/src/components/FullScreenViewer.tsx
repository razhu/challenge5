import React from "react";

interface Props {
  imageUrl: string;
  onClose: () => void;
}

const FullScreenViewer: React.FC<Props> = ({ imageUrl, onClose }) => {
  return (
    <div className="full-screen-viewer" onClick={onClose}>
      <img src={imageUrl} alt="Full Screen" />
    </div>
  );
};

export default FullScreenViewer;
