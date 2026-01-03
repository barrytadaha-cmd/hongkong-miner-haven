export interface ProductSpecs {
  dimensions: string;
  weight: string;
  noise: string;
  temperature: string;
  voltage: string;
  interface: string;
  cooling: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  algorithm: string;
  hashrate: string;
  power: string;
  efficiency: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  location: 'hongkong' | 'international';
  description: string;
  specs: ProductSpecs;
  coins: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Antminer S21 Pro',
    brand: 'Bitmain',
    algorithm: 'SHA256',
    hashrate: '234 TH/s',
    power: '3531W',
    efficiency: '15.1 J/TH',
    price: 8999,
    originalPrice: 10499,
    image: 'https://asicminermarket.com/wp-content/uploads/2024/03/Antminer-S21-Pro.png',
    images: [
      'https://asicminermarket.com/wp-content/uploads/2024/03/Antminer-S21-Pro.png',
      'https://asicminermarket.com/wp-content/uploads/2024/03/Antminer-S21-Pro-side.png',
      'https://asicminermarket.com/wp-content/uploads/2024/03/Antminer-S21-Pro-back.png',
    ],
    category: 'bitcoin',
    inStock: true,
    isSale: true,
    location: 'hongkong',
    description: 'The Antminer S21 Pro represents the latest advancement in Bitcoin mining technology from Bitmain. With an impressive hashrate of 234 TH/s and industry-leading efficiency of 15.1 J/TH, this miner is designed for serious mining operations seeking maximum profitability.',
    specs: {
      dimensions: '400 x 195 x 290 mm',
      weight: '14.6 kg',
      noise: '75 dB',
      temperature: '5-40°C',
      voltage: '200-240V',
      interface: 'Ethernet',
      cooling: '4 x 12038 Fans'
    },
    coins: ['Bitcoin', 'Bitcoin Cash', 'Bitcoin SV']
  },
  {
    id: '2',
    name: 'Antminer S21 XP Hyd',
    brand: 'Bitmain',
    algorithm: 'SHA256',
    hashrate: '473 TH/s',
    power: '5676W',
    efficiency: '12.0 J/TH',
    price: 18500,
    image: 'https://asicminermarket.com/wp-content/uploads/2024/01/Antminer-S21-Hyd.png',
    images: [
      'https://asicminermarket.com/wp-content/uploads/2024/01/Antminer-S21-Hyd.png',
    ],
    category: 'bitcoin',
    inStock: true,
    isNew: true,
    location: 'hongkong',
    description: 'The Antminer S21 XP Hyd is the most powerful hydro-cooled Bitcoin miner available. With an extraordinary 473 TH/s hashrate and exceptional 12.0 J/TH efficiency, this machine sets new standards in mining performance.',
    specs: {
      dimensions: '410 x 170 x 209 mm',
      weight: '12.5 kg',
      noise: '35 dB (hydro)',
      temperature: '5-45°C',
      voltage: '323-400V',
      interface: 'Ethernet',
      cooling: 'Hydro Cooling System'
    },
    coins: ['Bitcoin', 'Bitcoin Cash', 'Bitcoin SV']
  },
  {
    id: '3',
    name: 'Whatsminer M60S',
    brand: 'MicroBT',
    algorithm: 'SHA256',
    hashrate: '186 TH/s',
    power: '3422W',
    efficiency: '18.4 J/TH',
    price: 5299,
    image: 'https://asicminermarket.com/wp-content/uploads/2024/03/Whatsminer-M60S.png',
    images: [
      'https://asicminermarket.com/wp-content/uploads/2024/03/Whatsminer-M60S.png',
    ],
    category: 'bitcoin',
    inStock: true,
    location: 'hongkong',
    description: 'The Whatsminer M60S from MicroBT offers exceptional value for Bitcoin mining operations. Delivering 186 TH/s with 18.4 J/TH efficiency, this miner provides an excellent balance of performance and power consumption.',
    specs: {
      dimensions: '390 x 155 x 240 mm',
      weight: '12.8 kg',
      noise: '75 dB',
      temperature: '0-40°C',
      voltage: '200-240V',
      interface: 'Ethernet',
      cooling: '2 x 14038 Fans'
    },
    coins: ['Bitcoin', 'Bitcoin Cash', 'Bitcoin SV']
  },
  {
    id: '4',
    name: 'Antminer L9',
    brand: 'Bitmain',
    algorithm: 'SCRYPT',
    hashrate: '17 GH/s',
    power: '3260W',
    efficiency: '191.8 J/GH',
    price: 5799,
    originalPrice: 9999,
    image: 'https://asicminermarket.com/wp-content/uploads/2024/01/Antminer-L9.png',
    images: [
      'https://asicminermarket.com/wp-content/uploads/2024/01/Antminer-L9.png',
    ],
    category: 'litecoin',
    inStock: true,
    isSale: true,
    location: 'hongkong',
    description: 'The Antminer L9 is the most powerful Scrypt miner from Bitmain, designed for Litecoin and Dogecoin mining. With 17 GH/s hashrate, it delivers unmatched performance for Scrypt algorithm cryptocurrencies.',
    specs: {
      dimensions: '400 x 195 x 290 mm',
      weight: '14.2 kg',
      noise: '75 dB',
      temperature: '5-40°C',
      voltage: '200-240V',
      interface: 'Ethernet',
      cooling: '4 x 12038 Fans'
    },
    coins: ['Litecoin', 'Dogecoin', 'Digibyte']
  },
  {
    id: '5',
    name: 'Antminer KS5 Pro',
    brand: 'Bitmain',
    algorithm: 'KHeavyHash',
    hashrate: '21 TH/s',
    power: '3150W',
    efficiency: '150 J/TH',
    price: 32000,
    image: 'https://asicminermarket.com/wp-content/uploads/2024/01/Antminer-KS5-Pro.png',
    images: [
      'https://asicminermarket.com/wp-content/uploads/2024/01/Antminer-KS5-Pro.png',
    ],
    category: 'kaspa',
    inStock: false,
    location: 'international',
    description: 'The Antminer KS5 Pro is the flagship Kaspa miner from Bitmain, optimized for the KHeavyHash algorithm. With 21 TH/s hashrate, it offers the highest performance available for Kaspa mining.',
    specs: {
      dimensions: '400 x 195 x 290 mm',
      weight: '14.5 kg',
      noise: '75 dB',
      temperature: '5-40°C',
      voltage: '200-240V',
      interface: 'Ethernet',
      cooling: '4 x 12038 Fans'
    },
    coins: ['Kaspa']
  },
  {
    id: '6',
    name: 'Bitaxe Ultra',
    brand: 'Open Source',
    algorithm: 'SHA256',
    hashrate: '500 GH/s',
    power: '15W',
    efficiency: '30 J/TH',
    price: 199,
    image: 'https://asicminermarket.com/wp-content/uploads/2024/01/Bitaxe-Ultra.png',
    images: [
      'https://asicminermarket.com/wp-content/uploads/2024/01/Bitaxe-Ultra.png',
    ],
    category: 'home',
    inStock: true,
    location: 'hongkong',
    description: 'The Bitaxe Ultra is the perfect entry point for home Bitcoin mining enthusiasts. This open-source, low-power miner runs on just 15W, making it ideal for educational purposes, lottery mining, and supporting the Bitcoin network from home.',
    specs: {
      dimensions: '80 x 60 x 35 mm',
      weight: '0.2 kg',
      noise: '25 dB',
      temperature: '0-50°C',
      voltage: '5V USB-C',
      interface: 'WiFi',
      cooling: 'Passive + Small Fan'
    },
    coins: ['Bitcoin', 'Bitcoin Cash']
  },
  {
    id: '7',
    name: 'Antminer S19k Pro',
    brand: 'Bitmain',
    algorithm: 'SHA256',
    hashrate: '120 TH/s',
    power: '2760W',
    efficiency: '23 J/TH',
    price: 1899,
    originalPrice: 2499,
    image: 'https://asicminermarket.com/wp-content/uploads/2024/01/Antminer-S19k-Pro.png',
    images: [
      'https://asicminermarket.com/wp-content/uploads/2024/01/Antminer-S19k-Pro.png',
    ],
    category: 'bitcoin',
    inStock: true,
    isSale: true,
    location: 'hongkong',
    description: 'The Antminer S19k Pro offers excellent value with 120 TH/s hashrate at an affordable price point. With 23 J/TH efficiency and proven reliability, this miner is perfect for those looking to enter Bitcoin mining without breaking the bank.',
    specs: {
      dimensions: '400 x 195 x 290 mm',
      weight: '13.8 kg',
      noise: '75 dB',
      temperature: '5-40°C',
      voltage: '200-240V',
      interface: 'Ethernet',
      cooling: '4 x 12038 Fans'
    },
    coins: ['Bitcoin', 'Bitcoin Cash', 'Bitcoin SV']
  },
  {
    id: '8',
    name: 'VolcMiner D1 Mini',
    brand: 'VolcMiner',
    algorithm: 'SCRYPT',
    hashrate: '2.2 GH/s',
    power: '500W',
    efficiency: '0.227 J/GH',
    price: 1049,
    image: 'https://asicminermarket.com/wp-content/uploads/2024/01/VolcMiner-D1.png',
    images: [
      'https://asicminermarket.com/wp-content/uploads/2024/01/VolcMiner-D1.png',
    ],
    category: 'litecoin',
    inStock: true,
    location: 'hongkong',
    description: 'The VolcMiner D1 Mini is a compact and efficient Scrypt miner perfect for home use. With 2.2 GH/s hashrate and only 500W power consumption, it offers quiet operation and low electricity costs.',
    specs: {
      dimensions: '200 x 180 x 120 mm',
      weight: '3.5 kg',
      noise: '45 dB',
      temperature: '5-40°C',
      voltage: '110-240V',
      interface: 'Ethernet',
      cooling: '2 x Silent Fans'
    },
    coins: ['Litecoin', 'Dogecoin']
  },
  {
    id: '9',
    name: 'Avalon Q',
    brand: 'Canaan',
    algorithm: 'SHA256',
    hashrate: '90 TH/s',
    power: '1674W',
    efficiency: '18.6 J/TH',
    price: 1699,
    originalPrice: 1999,
    image: 'https://asicminermarket.com/wp-content/uploads/2024/05/Avalon-Nano-3.png',
    images: [
      'https://asicminermarket.com/wp-content/uploads/2024/05/Avalon-Nano-3.png',
    ],
    category: 'home',
    inStock: true,
    isSale: true,
    location: 'hongkong',
    description: 'The Avalon Q from Canaan is designed for home miners who want solid performance with lower power consumption. At 90 TH/s and 1674W, it offers an excellent entry point into Bitcoin mining.',
    specs: {
      dimensions: '331 x 195 x 292 mm',
      weight: '10.5 kg',
      noise: '65 dB',
      temperature: '5-35°C',
      voltage: '200-240V',
      interface: 'Ethernet',
      cooling: '4 x Fans'
    },
    coins: ['Bitcoin', 'Bitcoin Cash']
  },
  {
    id: '10',
    name: 'IceRiver KS3',
    brand: 'IceRiver',
    algorithm: 'KHeavyHash',
    hashrate: '8 TH/s',
    power: '3200W',
    efficiency: '400 J/TH',
    price: 8999,
    image: 'https://asicminermarket.com/wp-content/uploads/2024/01/IceRiver-KS3.png',
    images: [
      'https://asicminermarket.com/wp-content/uploads/2024/01/IceRiver-KS3.png',
    ],
    category: 'kaspa',
    inStock: true,
    isNew: true,
    location: 'hongkong',
    description: 'The IceRiver KS3 is a powerful Kaspa miner delivering 8 TH/s hashrate. Built for serious Kaspa mining operations with reliable performance and solid build quality.',
    specs: {
      dimensions: '430 x 195 x 290 mm',
      weight: '15 kg',
      noise: '75 dB',
      temperature: '5-40°C',
      voltage: '200-240V',
      interface: 'Ethernet',
      cooling: '4 x Fans'
    },
    coins: ['Kaspa']
  },
  {
    id: '11',
    name: 'Antminer Z15 Pro',
    brand: 'Bitmain',
    algorithm: 'Equihash',
    hashrate: '840 KSol/s',
    power: '2650W',
    efficiency: '3.15 J/Sol',
    price: 4599,
    image: 'https://asicminermarket.com/wp-content/uploads/2024/01/Antminer-Z15-Pro.png',
    images: [
      'https://asicminermarket.com/wp-content/uploads/2024/01/Antminer-Z15-Pro.png',
    ],
    category: 'zcash',
    inStock: true,
    location: 'hongkong',
    description: 'The Antminer Z15 Pro is the most powerful Equihash miner on the market. Perfect for mining Zcash and other Equihash coins with 840 KSol/s hashrate.',
    specs: {
      dimensions: '400 x 195 x 290 mm',
      weight: '14 kg',
      noise: '75 dB',
      temperature: '5-40°C',
      voltage: '200-240V',
      interface: 'Ethernet',
      cooling: '4 x 12038 Fans'
    },
    coins: ['Zcash', 'Horizen', 'Komodo']
  },
  {
    id: '12',
    name: 'Avalon MINI 3',
    brand: 'Canaan',
    algorithm: 'SHA256',
    hashrate: '37.5 TH/s',
    power: '1000W',
    efficiency: '26.7 J/TH',
    price: 799,
    image: 'https://asicminermarket.com/wp-content/uploads/2024/05/Avalon-Nano-3.png',
    images: [
      'https://asicminermarket.com/wp-content/uploads/2024/05/Avalon-Nano-3.png',
    ],
    category: 'heater',
    inStock: true,
    isNew: true,
    location: 'hongkong',
    description: 'The Avalon MINI 3 doubles as a Bitcoin miner and space heater. Heat your home while earning Bitcoin with this innovative device from Canaan. Silent operation and stylish design.',
    specs: {
      dimensions: '200 x 200 x 300 mm',
      weight: '5.5 kg',
      noise: '35 dB',
      temperature: '5-35°C',
      voltage: '110-240V',
      interface: 'WiFi + Ethernet',
      cooling: 'Internal Heat Dissipation'
    },
    coins: ['Bitcoin']
  },
];

export const categories = [
  { id: 'all', name: 'All Miners', count: products.length },
  { id: 'bitcoin', name: 'Bitcoin Miners', count: products.filter(p => p.category === 'bitcoin').length },
  { id: 'litecoin', name: 'Litecoin Miners', count: products.filter(p => p.category === 'litecoin').length },
  { id: 'kaspa', name: 'Kaspa Miners', count: products.filter(p => p.category === 'kaspa').length },
  { id: 'zcash', name: 'Zcash Miners', count: products.filter(p => p.category === 'zcash').length },
  { id: 'home', name: 'Home Miners', count: products.filter(p => p.category === 'home').length },
  { id: 'heater', name: 'Bitcoin Heaters', count: products.filter(p => p.category === 'heater').length },
];

export const faqItems = [
  {
    question: 'Where is your company located?',
    answer: 'Miner Haolan is headquartered in Hong Kong, with warehousing facilities for fast shipping across Asia and worldwide.'
  },
  {
    question: 'Do I have to pay VAT?',
    answer: 'VAT and import duties vary by destination country. Orders shipped from Hong Kong may be subject to local customs duties and taxes.'
  },
  {
    question: 'Is there a warranty?',
    answer: 'Yes! All new miners come with manufacturer warranty, typically 6-12 months depending on the brand.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept bank transfers (SWIFT), cryptocurrency payments (BTC, ETH, USDT), and credit cards for orders under $5,000.'
  },
  {
    question: 'How long does shipping take?',
    answer: 'Orders from our Hong Kong warehouse typically ship within 1-3 business days. Delivery to Asia takes 3-5 days, to Europe 7-10 days.'
  },
  {
    question: 'Do you offer hosting services?',
    answer: 'Yes! We partner with mining facilities across Asia offering competitive electricity rates starting at $0.04/kWh.'
  },
];

export const testimonials = [
  {
    name: 'Dennis',
    company: 'Home Miner',
    location: 'Germany',
    text: "Top-notch service, good personal contact, and immediate help. The S19k Pro arrived way ahead of schedule and works flawlessly!",
    rating: 5
  },
  {
    name: 'Rene',
    company: 'Mining Farm',
    location: 'Netherlands',
    text: "Completely satisfied! Service was competent and friendly, delivery was lightning fast. A completely reliable provider.",
    rating: 5
  },
  {
    name: 'Tom',
    company: 'Crypto Investor',
    location: 'UK',
    text: "Very friendly and professional support. The miner was shipped on Tuesday, by Friday it was running. What more could you want?",
    rating: 5
  },
];