import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useStore } from '../store';

export const OrderConfirmation: React.FC = () => {
  const { currentOrder, clearCart } = useStore();

  if (!currentOrder) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="text-2xl font-semibold mt-4">Order Confirmed!</h2>
        <p className="text-gray-600 mt-2">Order ID: {currentOrder.id}</p>
      </div>

      <div className="border-t border-b py-4 my-4">
        <h3 className="font-semibold mb-2">Delivery Address:</h3>
        <p className="text-gray-600">
          {currentOrder.address.fullName}<br />
          {currentOrder.address.street}<br />
          {currentOrder.address.city}, {currentOrder.address.state}<br />
          PIN: {currentOrder.address.pincode}<br />
          Phone: {currentOrder.address.phone}
        </p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Order Summary:</h3>
        <div className="space-y-2">
          {currentOrder.items.map((item) => (
            <div key={item.id} className="flex justify-between text-gray-600">
              <span>{item.name} ({item.quantity})</span>
              <span>₹{item.price}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>Total Amount:</span>
            <span>₹{currentOrder.total}</span>
          </div>
        </div>
      </div>

      <div className="text-gray-600 mb-6">
        <p>Payment Method: {currentOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'}</p>
      </div>

      <button
        onClick={clearCart}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Place New Order
      </button>
    </div>
  );
};