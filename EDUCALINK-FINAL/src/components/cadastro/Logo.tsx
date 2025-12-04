
import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 mb-2">
        <div className="w-10 h-10 rounded bg-white flex items-center justify-center text-purple-700 font-bold text-lg">E</div>
        <span className="text-2xl font-bold text-white">EducaLink</span>
      </div>
      <p className="text-black font-medium">Plataforma de comunicação escola-família</p>
    </div>
  );
};
