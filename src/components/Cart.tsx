import React from 'react';
import { Trash2, IndianRupee } from 'lucide-react';
import { useStore } from '../store';
import { CheckoutForm } from './CheckoutForm';
import { OrderConfirmation } from './OrderConfirmation';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, clearCart, checkoutStep } = useStore();
  
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (checkoutStep === 'confirmation') {
    return <OrderConfirmation />;
  }

  if (checkoutStep === 'address' || checkoutStep === 'payment') {
    return <CheckoutForm />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Shopping Cart</h2>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            Clear Cart
          </button>
        )}
      </div>
      
      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.quantity}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span>₹{item.price}</span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center font-semibold">
              <span>Total:</span>
              <div className="flex items-center gap-1">
                <IndianRupee size={16} />
                <span>{total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => useStore.getState().setCheckoutStep('address')}
              className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};