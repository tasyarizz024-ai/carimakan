import React, { useState, useEffect } from 'react';

import imgBannerDiskon from '../assets/images/banner_diskon_1782455077532.png';
import imgBannerMenuBaru from '../assets/images/banner_menu_baru_1782455087466.png';
import imgBannerHemat from '../assets/images/banner_hemat_1782455097431.png';

const HeroBanner = () => {
  const slides = [
    {
      id: 1,
      title: "Diskon Kilat 50%",
      desc: "Gunakan kode promo DISKON50 untuk menu favoritmu hari ini!",
      img: imgBannerDiskon,
      bg: "bg-pink-500",
      gradient: "from-green-600",
      btnText: "Pesan Sekarang",
      btnColor: "text-primary"
    },
    {
      id: 2,
      title: "Menu Baru Spesial",
      desc: "Cobain sensasi Nasi Goreng Seafood dengan resep rahasia chef kami.",
      img: imgBannerMenuBaru,
      bg: "bg-pink-500",
      gradient: "from-pink-600",
      btnText: "Coba Sekarang",
      btnColor: "text-pink-600"
    },
    {
      id: 3,
      title: "Makan Siang Hemat",
      desc: "Gunakan kode HEMAT (potongan 15rb). Berlaku jam 11:00 - 14:00.",
      img: imgBannerHemat,
      bg: "bg-orange-500",
      gradient: "from-orange-600",
      btnText: "Klaim Kupon",
      btnColor: "text-orange-600"
    }
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full h-44 md:h-56 rounded-2xl overflow-hidden my-4 shadow-md group">
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full flex items-center transition-opacity duration-1000 ${slide.bg} ${index === current ? 'opacity-100 z-20' : 'opacity-0 z-10'}`}
        >
          <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r ${slide.gradient} to-transparent z-10`}></div>
          
          <div className="relative z-20 p-6 md:p-8 text-white w-2/3 transform transition-transform duration-700 delay-100">
            <h2 className={`text-xl md:text-3xl font-bold mb-2 transition-transform duration-700 ${index === current ? 'translate-x-0' : '-translate-x-10'}`}>{slide.title}</h2>
            <p className={`text-sm md:text-base text-white/90 mb-4 line-clamp-2 transition-transform duration-700 delay-75 ${index === current ? 'translate-x-0' : '-translate-x-10'}`}>
              {slide.desc}
            </p>
            <button className={`bg-white ${slide.btnColor} text-sm font-bold px-5 py-2 rounded-full hover:scale-105 transition-transform shadow-lg`}>
              {slide.btnText}
            </button>
          </div>
          
          <div className="absolute right-0 top-0 h-full w-1/2 md:w-1/3 object-cover">
            <img 
              src={slide.img} 
              alt={slide.title} 
              className={`w-full h-full object-cover rounded-l-full opacity-90 transition-transform duration-[4000ms] ease-out ${index === current ? 'scale-110' : 'scale-100'}`}
            />
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === current ? 'bg-white w-6' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
