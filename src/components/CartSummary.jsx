// src/components/CartSummary.jsx
import React from 'react';

const CartSummary = ({ cart }) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#1a9c13ff',
        borderRadius: '8px',
        marginBottom: '20px',
      }}
    >
      <h3>Keranjang</h3>
      <p>Item: {totalItems}</p>
      <p>Total: Rp{totalPrice.toLocaleString('id-ID')}</p>
    </div>
  );
};

export default CartSummary;