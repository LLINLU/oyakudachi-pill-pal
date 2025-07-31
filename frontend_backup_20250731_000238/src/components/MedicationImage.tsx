
import React, { useState } from 'react';

interface MedicationImageProps {
  image: string;
  name: string;
}

export const MedicationImage: React.FC<MedicationImageProps> = ({ image, name }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="relative mx-auto w-48 h-48 bg-red-300 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden border-4 border-white">
      {!imageError ? (
        <img 
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-3xl transition-transform duration-300 hover:scale-105"
          onError={handleImageError}
        />
      ) : (
        <div className="w-32 h-32 bg-gray-300 rounded-full shadow-lg flex items-center justify-center">
          <div className="w-20 h-12 bg-white rounded-full opacity-80"></div>
        </div>
      )}
    </div>
  );
};
