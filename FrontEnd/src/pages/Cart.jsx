import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiTrash2, FiMinus, FiPlus, FiShoppingCart, FiTag } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { OrderContext } from '../context/OrderContext';
import { MenuContext } from '../context/MenuContext';
import EmptyState from '../components/EmptyState';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice } = useContext(CartContext);
  const { placeOrder } = useContext(OrderContext);
  // Hapus reduceStock dari MenuContext - tidak perlu di frontend

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [loading, setLoading] = useState(false); // 🔥 TAMBAHKAN STATE LOADING

  const tax = totalPrice * 0.11;
  
  let discount = 0;
  if (appliedPromo === 'DISKON50') {
    discount = totalPrice * 0.5;
  } else if (appliedPromo === 'HEMAT') {
    discount = 15000;
  }

  if (discount > totalPrice) discount = totalPrice;

  const finalPrice = totalPrice + tax - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'DISKON50') {
      setAppliedPromo('DISKON50');
      setPromoError('');
    } else if (promoCode.toUpperCase() === 'HEMAT') {
      setAppliedPromo('HEMAT');
      setPromoError('');
    } else {
      setAppliedPromo(null);
      setPromoError('Kode promo tidak valid!');
    }
  };

  // 🔥 PERBAIKI HANDLECHECKOUT
  const handleCheckout = async () => {
    // Validasi cart
    if (!cart || cart.length === 0) {
      alert('Keranjang kosong!');
      return;
    }

    setLoading(true);
    
    try {
      console.log('🛒 Memesan dengan data:', { cart, finalPrice });
      
      // Format data untuk backend
      const orderItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      // Panggil placeOrder dengan await
      const result = await placeOrder(orderItems, finalPrice, "Meja 01", promoCode, discount, tax);
      
      console.log('📦 Hasil pesanan:', result);
      
      if (result) {
        alert(`✅ Pesanan berhasil diproses! ID: ${result.slice(-6)}\nSilakan tunggu di Meja 01.`);
        clearCart();
        navigate('/');
      } else {
        alert('❌ Gagal memesan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('❌ Error checkout:', error);
      alert('❌ Terjadi kesalahan saat memesan: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-white px-4 py-4 sticky top-0 z-50 shadow-sm flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <FiChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Keranjang Saya</h1>
        </div>
        <div className="pt-20">
          <EmptyState 
            icon={FiShoppingCart}
            title="Keranjang masih kosong"
            description="Yuk, cari makanan enak dan tambahkan ke keranjangmu!"
            buttonText="Mulai Pesan"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-56">
      <div className="bg-white px-4 py-4 sticky top-0 z-50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <FiChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Keranjang Saya</h1>
        </div>
        <button onClick={clearCart} className="text-sm text-red-500 font-medium px-2 py-1 hover:bg-red-50 rounded">
          Hapus Semua
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="space-y-4 mb-6">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl"
              />
              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{item.restaurant}</p>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-primary">
                    Rp {item.price.toLocaleString('id-ID')}
                  </span>
                  
                  <div className="flex items-center gap-3 bg-gray-50 px-2 py-1 rounded-lg">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-gray-600 shadow-sm border border-gray-200"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-md bg-pink-500 text-white flex items-center justify-center shadow-sm"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo Section */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-2 mb-3 text-gray-800 font-bold">
            <FiTag className="text-primary" />
            <h2>Makin hemat pakai promo!</h2>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Masukkan kode promo (Cth: DISKON50)" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-grow border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent uppercase"
            />
            <button 
              onClick={handleApplyPromo}
              className="bg-pink-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors"
            >
              Gunakan
            </button>
          </div>
          {promoError && <p className="text-red-500 text-xs mt-2">{promoError}</p>}
          {appliedPromo && <p className="text-green-600 text-xs mt-2 font-semibold">Promo {appliedPromo} berhasil digunakan!</p>}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t border-gray-100 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold">Rp {totalPrice.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="text-gray-500">Pajak (11%)</span>
            <span className="font-semibold">Rp {tax.toLocaleString('id-ID')}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between items-center mb-2 text-sm text-green-600 font-semibold">
              <span>Diskon ({appliedPromo})</span>
              <span>- Rp {discount.toLocaleString('id-ID')}</span>
            </div>
          )}
          <div className="flex justify-between items-center mb-4 border-t border-gray-100 pt-3 mt-1">
            <span className="font-bold text-gray-800">Total Pembayaran</span>
            <span className="font-bold text-xl text-primary">
              Rp {finalPrice.toLocaleString('id-ID')}
            </span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={loading}
            className={`w-full text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 transition-colors ${
              loading ? 'bg-gray-400' : 'bg-pink-500 hover:bg-green-600'
            }`}
          >
            {loading ? 'Memproses...' : 'Pesan Sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;