// src/components/ProductList.jsx
import React from 'react';
import ProductRow from './ProductRow';

const ProductList = ({ filteredProducts, onAddToCart }) => {
  
  // Container div untuk meniru tampilan scrollable
  return (
    <div
      style={{
        height: '600px', // Menjaga tinggi seperti virtual list
        overflowY: 'auto', // Menambahkan scrollbar
        width: '100%',
      }}
    >
      {/* Menggunakan map() untuk me-render SEMUA produk */}
      {filteredProducts.map((product, index) => (
        <ProductRow
          // Key sangat penting untuk identifikasi elemen
          key={product.id || index}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductList;