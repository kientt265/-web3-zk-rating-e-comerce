import React from 'react';
import ao01 from '../assets/data/ao01.webp';
import ao02 from '../assets/data/ao02.jpg';
import quan01 from '../assets/data/quan01.webp';
import quan02 from '../assets/data/quan02.jpg';

export const InteractPrivateChain = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-4">
      <div className="border rounded-lg p-4 shadow-lg hover:shadow-2xl transition-shadow">
        <img src={ao01} alt="Áo 01" className="w-full h-64 object-cover rounded-lg mb-4" />
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-800">Giá: 100.000</div>
          <div className="text-sm text-gray-600">Số lượng: 15</div>
        </div>
      </div>

      <div className="border rounded-lg p-4 shadow-lg hover:shadow-2xl transition-shadow">
        <img src={ao02} alt="Áo 02" className="w-full h-64 object-cover rounded-lg mb-4" />
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-800">Giá: 100.000</div>
          <div className="text-sm text-gray-600">Số lượng: 15</div>
        </div>
      </div>

      <div className="border rounded-lg p-4 shadow-lg hover:shadow-2xl transition-shadow">
        <img src={quan01} alt="Quần 01" className="w-full h-64 object-cover rounded-lg mb-4" />
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-800">Giá: 100.000</div>
          <div className="text-sm text-gray-600">Số lượng: 15</div>
        </div>
      </div>

      <div className="border rounded-lg p-4 shadow-lg hover:shadow-2xl transition-shadow">
        <img src={quan02} alt="Quần 02" className="w-full h-64 object-cover rounded-lg mb-4" />
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-800">Giá: 100.000</div>
          <div className="text-sm text-gray-600">Số lượng: 15</div>
        </div>
      </div>
    </div>
  );
};

export default InteractPrivateChain;
