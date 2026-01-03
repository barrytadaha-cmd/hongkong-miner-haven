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
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&h=800&fit=crop'
    ],
    category: 'bitcoin',
    inStock: true,
    isSale: true,
    location: 'hongkong',
    description: 'The Antminer S21 Pro represents the latest advancement in Bitcoin mining technology from Bitmain. With an impressive hashrate of 234 TH/s and industry-leading efficiency of 15.1 J/TH, this miner is designed for serious mining operations seeking maximum profitability. The S21 Pro features enhanced thermal design, improved power delivery, and robust build quality for 24/7 operation.',
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
    image: 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=800&fit=crop'
    ],
    category: 'bitcoin',
    inStock: true,
    isNew: true,
    location: 'hongkong',
    description: 'The Antminer S21 XP Hyd is the most powerful hydro-cooled Bitcoin miner available. With an extraordinary 473 TH/s hashrate and exceptional 12.0 J/TH efficiency, this machine sets new standards in mining performance. Hydro cooling technology ensures silent operation and maximum thermal efficiency, making it ideal for professional mining facilities.',
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
    image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&h=800&fit=crop'
    ],
    category: 'bitcoin',
    inStock: true,
    location: 'hongkong',
    description: 'The Whatsminer M60S from MicroBT offers exceptional value for Bitcoin mining operations. Delivering 186 TH/s with 18.4 J/TH efficiency, this miner provides an excellent balance of performance and power consumption. Known for reliability and durability, the M60S is perfect for both new and experienced miners.',
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
    price: 12999,
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?w=800&h=800&fit=crop'
    ],
    category: 'litecoin',
    inStock: true,
    isNew: true,
    location: 'hongkong',
    description: 'The Antminer L9 is the most powerful Scrypt miner from Bitmain, designed for Litecoin and Dogecoin mining. With 17 GH/s hashrate, it delivers unmatched performance for Scrypt algorithm cryptocurrencies. The L9 features improved efficiency and enhanced cooling for stable long-term operation.',
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
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=800&fit=crop'
    ],
    category: 'kaspa',
    inStock: false,
    location: 'international',
    description: 'The Antminer KS5 Pro is the flagship Kaspa miner from Bitmain, optimized for the KHeavyHash algorithm. With 21 TH/s hashrate, it offers the highest performance available for Kaspa mining. This professional-grade machine is designed for maximum profitability in Kaspa mining operations.',
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
    image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=800&fit=crop'
    ],
    category: 'home',
    inStock: true,
    location: 'hongkong',
    description: 'The Bitaxe Ultra is the perfect entry point for home Bitcoin mining enthusiasts. This open-source, low-power miner runs on just 15W, making it ideal for educational purposes, lottery mining, and supporting the Bitcoin network from home. Silent operation and compact design make it suitable for any environment.',
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
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&h=800&fit=crop'
    ],
    category: 'bitcoin',
    inStock: true,
    isSale: true,
    location: 'hongkong',
    description: 'The Antminer S19k Pro offers excellent value with 120 TH/s hashrate at an affordable price point. With 23 J/TH efficiency and proven reliability, this miner is perfect for those looking to enter Bitcoin mining without breaking the bank. Currently on sale with limited stock available.',
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
    name: 'Antminer E9 Pro',
    brand: 'Bitmain',
    algorithm: 'EtHash',
    hashrate: '3.68 GH/s',
    power: '2200W',
    efficiency: '0.6 J/MH',
    price: 4599,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=800&fit=crop'
    ],
    category: 'ethereum',
    inStock: true,
    location: 'international',
    description: 'The Antminer E9 Pro is the ultimate EtHash algorithm miner, equivalent to 32 RTX 3080 graphics cards in mining performance. With 3.68 GH/s hashrate, it delivers exceptional performance for Ethereum Classic and other EtHash coins. Professional-grade reliability for continuous operation.',
    specs: {
      dimensions: '195 x 290 x 400 mm',
      weight: '14.2 kg',
      noise: '75 dB',
      temperature: '5-40°C',
      voltage: '200-240V',
      interface: 'Ethernet',
      cooling: '4 x 12038 Fans'
    },
    coins: ['Ethereum Classic', 'Ravencoin', 'Ergo']
  },
];

export const categories = [
  { id: 'all', name: 'All Miners', count: products.length },
  { id: 'bitcoin', name: 'Bitcoin Miners', count: products.filter(p => p.category === 'bitcoin').length },
  { id: 'litecoin', name: 'Litecoin Miners', count: products.filter(p => p.category === 'litecoin').length },
  { id: 'kaspa', name: 'Kaspa Miners', count: products.filter(p => p.category === 'kaspa').length },
  { id: 'home', name: 'Home Miners', count: products.filter(p => p.category === 'home').length },
  { id: 'ethereum', name: 'Ethereum Miners', count: products.filter(p => p.category === 'ethereum').length },
];

export const faqItems = [
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept bank transfers (SWIFT), cryptocurrency payments (BTC, ETH, USDT), and credit cards for orders under $5,000. For large B2B orders, we offer flexible payment terms.'
  },
  {
    question: 'How long does shipping take?',
    answer: 'Orders from our Hong Kong warehouse typically ship within 1-3 business days. Delivery to Asia takes 3-5 days, to Europe and North America 7-14 days. Express shipping is available for urgent orders.'
  },
  {
    question: 'Do you offer warranty on miners?',
    answer: 'Yes, all new miners come with manufacturer warranty (typically 6-12 months). We also offer extended warranty packages and post-warranty repair services at our Hong Kong facility.'
  },
  {
    question: 'Can I visit your showroom in Hong Kong?',
    answer: 'Absolutely! Our showroom is open Monday-Friday, 9AM-6PM. We recommend scheduling an appointment for personalized consultation. We can also arrange facility tours for B2B clients.'
  },
  {
    question: 'Do you offer hosting services?',
    answer: 'Yes, we partner with mining farms across Asia offering competitive electricity rates starting at $0.04/kWh. Contact us for customized hosting solutions for your mining operation.'
  },
  {
    question: 'What about customs and import duties?',
    answer: 'We handle all export documentation from Hong Kong. Import duties vary by country - we provide commercial invoices and can advise on customs requirements for your location.'
  },
];

export const testimonials = [
  {
    name: 'David Chen',
    company: 'Chen Mining Co.',
    location: 'Singapore',
    text: 'MinerHoalan has been our trusted supplier for 3 years. Their Hong Kong location means fast delivery to Singapore and excellent after-sales support.',
    rating: 5
  },
  {
    name: 'Michael Wong',
    company: 'Pacific Hash Ltd.',
    location: 'Australia',
    text: 'Outstanding service! They helped us set up a 500-unit operation with competitive bulk pricing and ongoing technical support.',
    rating: 5
  },
  {
    name: 'Sarah Kim',
    company: 'Home Miner',
    location: 'South Korea',
    text: 'Perfect for small-scale miners like me. The Bitaxe they recommended is quiet, efficient, and actually profitable!',
    rating: 5
  },
];
