import React from 'react';

const StatCard = ({ title, value, icon, bgColor }) => {
  return (
    <div className={`${bgColor} p-6 rounded-lg shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;