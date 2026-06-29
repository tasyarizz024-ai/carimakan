import imgNasiGoreng from '../assets/images/nasi_goreng_1782454955738.png';
import imgMieGoreng from '../assets/images/mie_goreng_1782454965613.png';
import imgSateAyam from '../assets/images/sate_ayam_1782454976079.png';
import imgGadoGado from '../assets/images/gado_gado_1782454986722.png';
import imgAyamGeprek from '../assets/images/ayam_geprek_1782454995690.png';
import imgEsCampur from '../assets/images/es_campur_1782455012726.png';
import imgSotoAyam from '../assets/images/soto_ayam_1782455023961.png';
import imgAyamBakar from '../assets/images/ayam_bakar_1782455036000.png';
import imgJusAlpukat from '../assets/images/jus_alpukat_1782455045669.png';
import imgNasiRames from '../assets/images/nasi_rames_1782455055209.png';

export const initialFoods = [
  {
    id: 1,
    name: "Nasi Goreng Spesial",
    restaurant: "Dapur Utama",
    rating: 4.8,
    reviews: 320,
    price: 35000,
    estimatedTime: "15 min",
    category: "Nasi",
    stock: 50,
    image: imgNasiGoreng,
    description: "Nasi goreng lezat dengan tambahan telur mata sapi, ayam suwir, sosis, dan kerupuk renyah. Disajikan dengan acar segar.",
    ingredients: ["Nasi Putih", "Telur", "Daging Ayam", "Sosis", "Kecap Manis", "Bawang Merah", "Bawang Putih"]
  },
  {
    id: 2,
    name: "Mie Goreng Seafood",
    restaurant: "Dapur Utama",
    rating: 4.7,
    reviews: 415,
    price: 45000,
    estimatedTime: "15 min",
    category: "Mie",
    stock: 30,
    image: imgMieGoreng,
    description: "Mie goreng gurih dengan topping udang, cumi, bakso ikan, dan sayuran segar.",
    ingredients: ["Mie Kuning", "Udang", "Cumi", "Sawi Hijau", "Kecap Asin", "Bumbu Seafood"]
  },
  {
    id: 3,
    name: "Sate Ayam Madura",
    restaurant: "Dapur Utama",
    rating: 4.9,
    reviews: 890,
    price: 40000,
    estimatedTime: "20 min",
    category: "Sate",
    stock: 100,
    image: imgSateAyam,
    description: "Sate ayam empuk dipanggang sempurna dengan bumbu kacang khas yang kental dan gurih, disajikan dengan lontong.",
    ingredients: ["Daging Ayam", "Kacang Tanah", "Kecap Manis", "Cabai Rawit", "Lontong", "Bawang Merah"]
  },
  {
    id: 4,
    name: "Gado-Gado Betawi",
    restaurant: "Dapur Utama",
    rating: 4.6,
    reviews: 210,
    price: 25000,
    estimatedTime: "10 min",
    category: "Sayur",
    stock: 20,
    image: imgGadoGado,
    description: "Salad sayur tradisional Indonesia dengan bumbu kacang lezat, tempe, tahu, telur rebus, dan kerupuk emping.",
    ingredients: ["Sayuran Rebus", "Tahu", "Tempe", "Telur Rebus", "Bumbu Kacang", "Kerupuk Emping"]
  },
  {
    id: 5,
    name: "Ayam Geprek Sambal Korek",
    restaurant: "Dapur Utama",
    rating: 4.8,
    reviews: 1250,
    price: 28000,
    estimatedTime: "15 min",
    category: "Ayam",
    stock: 40,
    image: imgAyamGeprek,
    description: "Ayam goreng tepung renyah yang digeprek hancur dengan sambal korek super pedas. Bikin nagih!",
    ingredients: ["Ayam Goreng Tepung", "Cabai Rawit Merah", "Bawang Putih", "Garam", "Minyak Panas"]
  },
  {
    id: 6,
    name: "Es Campur Segar",
    restaurant: "Dapur Utama",
    rating: 4.7,
    reviews: 530,
    price: 20000,
    estimatedTime: "5 min",
    category: "Minuman",
    stock: 50,
    image: imgEsCampur,
    description: "Minuman es pelepas dahaga dengan campuran cincau, kolang-kaling, kelapa muda, nangka, dan susu kental manis.",
    ingredients: ["Es Serut", "Cincau Hitam", "Kolang Kaling", "Kelapa Muda", "Susu Kental Manis", "Sirup"]
  },
  {
    id: 7,
    name: "Soto Ayam Lamongan",
    restaurant: "Dapur Utama",
    rating: 4.8,
    reviews: 740,
    price: 30000,
    estimatedTime: "10 min",
    category: "Sayur",
    stock: 25,
    image: imgSotoAyam,
    description: "Soto ayam dengan kuah kuning yang segar, ditaburi koya khas Lamongan yang bikin kuah makin gurih.",
    ingredients: ["Ayam Suwir", "Soun", "Telur Rebus", "Kol", "Koya", "Jeruk Nipis"]
  },
  {
    id: 8,
    name: "Ayam Bakar Madu",
    restaurant: "Dapur Utama",
    rating: 4.9,
    reviews: 620,
    price: 35000,
    estimatedTime: "20 min",
    category: "Ayam",
    stock: 30,
    image: imgAyamBakar,
    description: "Ayam bakar pilihan dengan olesan madu manis gurih meresap sampai ke dalam daging.",
    ingredients: ["Ayam Kampung", "Madu", "Kecap Manis", "Bawang Putih", "Ketumbar", "Lada"]
  },
  {
    id: 9,
    name: "Jus Alpukat",
    restaurant: "Dapur Utama",
    rating: 4.6,
    reviews: 310,
    price: 18000,
    estimatedTime: "5 min",
    category: "Minuman",
    stock: 45,
    image: imgJusAlpukat,
    description: "Jus alpukat segar dan kental dengan tambahan susu kental manis cokelat dan taburan meses.",
    ingredients: ["Alpukat", "Susu Kental Manis Cokelat", "Es Batu", "Gula Cair"]
  },
  {
    id: 10,
    name: "Nasi Rames Nusantara",
    restaurant: "Dapur Utama",
    rating: 4.7,
    reviews: 580,
    price: 32000,
    estimatedTime: "10 min",
    category: "Nasi",
    stock: 35,
    image: imgNasiRames,
    description: "Nasi putih hangat dipadu dengan rendang sapi, telur balado, sayur nangka, dan sambal hijau.",
    ingredients: ["Nasi Putih", "Rendang Sapi", "Telur Balado", "Sayur Nangka", "Sambal Hijau"]
  }
];

// Fallback for compatibility where previously used directly
export const foods = initialFoods;

export const categories = [
  { id: 1, name: "Semua", icon: "🍽️" },
  { id: 2, name: "Nasi", icon: "🍚" },
  { id: 3, name: "Mie", icon: "🍜" },
  { id: 4, name: "Sate", icon: "🍢" },
  { id: 5, name: "Ayam", icon: "🍗" },
  { id: 6, name: "Sayur", icon: "🍲" },
  { id: 7, name: "Minuman", icon: "🍹" },
];
