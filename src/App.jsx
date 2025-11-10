// src/App.jsx
import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { products } from './data/products';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import CartSummary from './components/CartSummary';
import { getFromCache, setToCache } from './utils/searchCache'; // <--- IMPORT CACHE
const AboutPage = lazy(() => import('./components/AboutPage'));

// Helper: simpan ke localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem('pos-cart', JSON.stringify(cart));
};

// Helper: baca dari localStorage
const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('pos-cart');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.warn('Gagal memuat keranjang dari localStorage');
    return [];
  }
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('pos');
  const [cart, setCart] = useState(() => loadCartFromStorage());
  const [cacheHit, setCacheHit] = useState(false); // <--- STATE BARU UNTUK UI

  // Simpan ke localStorage setiap cart berubah
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  // Fungsi pembantu: filter produk dengan caching
  const filterProducts = (term) => {
    if (!term.trim()) {
      setCacheHit(false);
      return products;
    }

    const cacheKey = term.toLowerCase().trim();
    const cached = getFromCache(cacheKey); // Cek cache
    
    // --- CACHE HIT ---
    if (cached) {
      setCacheHit(true);
      console.log('🎯 Cache hit:', cacheKey);
      return cached; // Ambil dari cache
    }

    // --- CACHE MISS (Lakukan Filtering) ---
    setCacheHit(false);
    console.log('🔍 Cache miss, filtering:', cacheKey);

    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(cacheKey) ||
      p.brand.toLowerCase().includes(cacheKey) ||
      p.category.toLowerCase().includes(cacheKey)
    ); // Lakukan filtering

    setToCache(cacheKey, filtered); // Simpan hasil ke cache
    return filtered;
  };

  // Gunakan useMemo untuk memastikan fungsi filterProducts hanya dipanggil saat searchTerm berubah
  const filteredProducts = useMemo(() => {
    return filterProducts(searchTerm);
  }, [searchTerm]);

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1>🛒 Point of Sales (POS)</h1>
      
      {/* Tombol Navigasi */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setView('pos')}>POS</button>
        <button onClick={() => setView('about')} style={{ marginLeft: '10px' }}>Tentang</button>
      </div>

      {/* Conditional Rendering dan Code Splitting */}
      {view === 'pos' ? (
        <>
          <CartSummary cart={cart} />
          <SearchBar onSearch={setSearchTerm} />
          
          {/* Tampilkan Indikator Cache di UI */}
          {searchTerm && (
            <small style={{ color: cacheHit ? 'green' : 'gray', display: 'block', marginBottom: '8px' }}>
              {cacheHit ? '✅ Hasil dari cache' : '🔍 Hasil baru dihitung'}
            </small>
          )}

          <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            <ProductList
              filteredProducts={filteredProducts}
              onAddToCart={handleAddToCart}
            />
          </div>
        </>
      ) : (
        // Halaman About dimuat secara lazy
        <Suspense fallback={<div>Loading...</div>}>
          <AboutPage />
        </Suspense>
      )}
    </div>
  );
}

export default App;