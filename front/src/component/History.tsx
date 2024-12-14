import React from 'react'

const History = () => {
  return (
<div className="p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold mb-4">Lịch Sử Mua Hàng</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Đầu tiên */}
    <div className="border p-4 rounded-lg shadow-sm">
      <div className="font-medium text-gray-800">TransactionHash</div>
      <div className="text-gray-600">0x12345...67890</div>
    </div>
    
    {/* Thứ hai */}
    <div className="border p-4 rounded-lg shadow-sm">
      <div className="font-medium text-gray-800">ProductId</div>
      <div className="text-gray-600">#1234</div>
    </div>
    
    {/* Thứ ba */}
    <div className="border p-4 rounded-lg shadow-sm">
      <div className="font-medium text-gray-800">BlockNumber</div>
      <div className="text-gray-600">567890</div>
    </div>

    {/* Thứ tư */}
    <div className="border p-4 rounded-lg shadow-sm">
      <div className="font-medium text-gray-800">TransactionHash</div>
      <div className="text-gray-600">0xabcdef...12345</div>
    </div>

    {/* Thứ năm */}
    <div className="border p-4 rounded-lg shadow-sm">
      <div className="font-medium text-gray-800">ProductId</div>
      <div className="text-gray-600">#5678</div>
    </div>

    {/* Thứ sáu */}
    <div className="border p-4 rounded-lg shadow-sm">
      <div className="font-medium text-gray-800">BlockNumber</div>
      <div className="text-gray-600">123456</div>
    </div>
  </div>
</div>

  )
}

export default History