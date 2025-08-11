
import React from 'react';
import { Pill } from 'lucide-react';

interface MedicationInfoProps {
  name: string;
}

export const MedicationInfo: React.FC<MedicationInfoProps> = ({ name }) => {
  return (
    <div className="space-y-3 text-center w-full">
      <h1 className="text-3xl font-bold text-gray-800 leading-tight tracking-tight">
        {name}
      </h1>
      
      <div className="flex items-center justify-center space-x-3 bg-gray-100 border-2 border-gray-200 rounded-2xl p-3 mx-auto">
        <Pill className="h-5 w-5 text-gray-600" />
        <span className="text-xl font-bold text-gray-800">2粒</span>
        <span className="text-lg text-gray-700">お飲みください</span>
      </div>
    </div>
  );
};
