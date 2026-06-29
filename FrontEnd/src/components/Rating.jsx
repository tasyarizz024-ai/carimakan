import React from 'react';
import { FiStar } from 'react-icons/fi';

const Rating = ({ value, reviews }) => {
  return (
    <div className="flex items-center gap-1">
      <FiStar className="fill-accent text-accent" size={14} />
      <span className="font-bold text-sm">{value}</span>
      {reviews && (
        <span className="text-xs text-gray-500">({reviews})</span>
      )}
    </div>
  );
};

export default Rating;
