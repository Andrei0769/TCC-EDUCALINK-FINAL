
import React from 'react';
import { Info } from 'lucide-react';

export const TermosInfo: React.FC = () => {
  return (
    <div className="p-3 bg-purple-50 rounded-md text-sm text-purple-700 flex items-center">
      <Info className="h-4 w-4 mr-2 flex-shrink-0" />
      Após o cadastro, você poderá vincular o perfil do seu filho utilizando um código fornecido pela escola.
    </div>
  );
};
