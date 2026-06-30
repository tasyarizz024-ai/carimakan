import React from 'react';
import { FiInbox } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({ title, description, buttonText, onButtonClick, icon: Icon }) => {
  const navigate = useNavigate();
  const IconComponent = Icon || FiInbox;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gray-100 p-6 rounded-full mb-6">
        <IconComponent size={48} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 mb-8 max-w-sm">{description}</p>
      
      {buttonText && (
        <button 
          onClick={onButtonClick || (() => navigate('/'))}
          className="bg-pink-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-green-600 transition-colors shadow-lg shadow-green-200"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
