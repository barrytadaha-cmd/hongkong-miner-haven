export interface AlgorithmInfo {
  id: string;
  name: string;
  fullName: string;
  coins: string[];
  description: string;
  category: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  educationalIntro: string;
  buyingGuide: string[];
  faqs: { question: string; answer: string }[];
}

export const algorithms: Record<string, AlgorithmInfo> = {
  'sha256': {
    id: 'sha256',
    name: 'SHA-256',
    fullName: 'Secure Hash Algorithm 256-bit',
    coins: ['Bitcoin (BTC)', 'Bitcoin Cash (BCH)', 'Bitcoin SV (BSV)'],
    category: 'bitcoin',
    description: 'SHA-256 is the cryptographic hash function that powers Bitcoin and several other major cryptocurrencies. It produces a 256-bit hash and is known for its security and widespread adoption.',
    metaTitle: 'Best SHA-256 ASIC Miners 2025 | Bitcoin Mining Hardware',
    metaDescription: 'Shop the most powerful SHA-256 Bitcoin ASIC miners. Compare Antminer S21, Whatsminer M60S & more. Fast shipping from Hong Kong with warranty.',
    heroTitle: 'SHA-256 Bitcoin ASIC Miners',
    heroSubtitle: 'Professional-grade Bitcoin mining hardware with industry-leading hashrates and efficiency',
    educationalIntro: `SHA-256 (Secure Hash Algorithm 256-bit) is the proof-of-work algorithm that secures the Bitcoin network. Developed by the NSA, it's considered one of the most secure cryptographic functions available.

When choosing a SHA-256 miner, efficiency (measured in J/TH) is the most critical factor. Lower efficiency means lower electricity costs and higher profitability. Modern miners like the Antminer S21 Pro achieve efficiencies below 16 J/TH, a significant improvement over older generations.

Bitcoin mining difficulty adjusts every 2016 blocks (~2 weeks), so investing in the most efficient hardware ensures long-term profitability even as competition increases.`,
    buyingGuide: [
      'Efficiency (J/TH) is king - lower is better for long-term profitability',
      'Consider your electricity costs - at $0.10/kWh, efficiency matters more than raw hashrate',
      'Hydro-cooled units offer better efficiency but require infrastructure',
      'Always factor in shipping, import duties, and setup costs',
      'Check warranty terms - reputable sellers offer 180+ day coverage'
    ],
    faqs: [
      {
        question: 'What is the most profitable SHA-256 miner in 2025?',
        answer: 'The Antminer S21 XP Hyd with 473 TH/s and 12 J/TH efficiency currently offers the best profitability for SHA-256 mining. For air-cooled options, the Antminer S21 Pro (234 TH/s, 15.1 J/TH) provides excellent value.'
      },
      {
        question: 'How much electricity does a Bitcoin miner use?',
        answer: 'Modern Bitcoin miners consume between 3,000-5,700 watts depending on the model. For example, the Antminer S21 Pro uses 3,531W while delivering 234 TH/s. Monthly electricity costs range from $150-400 at typical rates.'
      },
      {
        question: 'Is Bitcoin mining still profitable in 2025?',
        answer: 'Yes, Bitcoin mining remains profitable with efficient hardware and competitive electricity rates. Miners with efficiency below 20 J/TH can be profitable at electricity costs up to $0.08/kWh. After the 2024 halving, efficiency became even more critical.'
      },
      {
        question: 'What cooling do SHA-256 miners need?',
        answer: 'Air-cooled miners require adequate ventilation with intake/exhaust capacity for the heat generated (typically 3,000-5,000W). Hydro-cooled and immersion miners offer quieter operation and better efficiency but require specialized infrastructure.'
      },
      {
        question: 'How long do ASIC miners last?',
        answer: 'Well-maintained ASIC miners typically operate for 3-5 years. Hash boards may need replacement after 2-3 years of continuous operation. Regular cleaning and proper cooling significantly extend lifespan.'
      }
    ]
  },
  'scrypt': {
    id: 'scrypt',
    name: 'Scrypt',
    fullName: 'Scrypt Algorithm',
    coins: ['Litecoin (LTC)', 'Dogecoin (DOGE)', 'Digibyte (DGB)'],
    category: 'litecoin',
    description: 'Scrypt is a memory-hard algorithm designed to be resistant to ASIC mining. However, specialized Scrypt ASICs now dominate Litecoin and Dogecoin mining.',
    metaTitle: 'Best Scrypt ASIC Miners 2025 | Litecoin & Dogecoin Mining',
    metaDescription: 'Shop top Scrypt miners for Litecoin & Dogecoin. Compare Antminer L9, L7 & more. Fast Hong Kong shipping with full warranty.',
    heroTitle: 'Scrypt ASIC Miners',
    heroSubtitle: 'Mine Litecoin, Dogecoin, and other Scrypt-based cryptocurrencies with maximum efficiency',
    educationalIntro: `Scrypt was originally designed to be more memory-intensive than SHA-256, making it resistant to specialized hardware. Today, Scrypt ASICs have evolved to efficiently mine Litecoin, Dogecoin, and other Scrypt-based coins.

One major advantage of Scrypt mining is merge-mining capability. You can mine both Litecoin and Dogecoin simultaneously with the same hardware, effectively doubling your potential returns. This makes Scrypt miners particularly attractive in the current market.

The Antminer L9 currently leads the market with 16 GH/s hashrate, though several compelling alternatives exist for different budget ranges.`,
    buyingGuide: [
      'Merge-mine LTC + DOGE for maximum returns from the same hardware',
      'Hashrate is measured in GH/s for Scrypt (not TH/s like Bitcoin)',
      'Efficiency measured in J/GH - lower is better',
      'The L7 and L9 series dominate the professional market',
      'Home miners like the VolcMiner D1 offer quieter operation for residential setups'
    ],
    faqs: [
      {
        question: 'Can I mine Dogecoin with a Litecoin miner?',
        answer: 'Yes! Scrypt miners can merge-mine both Litecoin and Dogecoin simultaneously. This means you earn both LTC and DOGE rewards without any additional power consumption.'
      },
      {
        question: 'What is the best Scrypt miner for home use?',
        answer: 'The VolcMiner D1 Mini (2.2 GH/s, 500W) and Elphapex DG Home (3.5 GH/s, 900W) are designed for home environments with lower noise levels around 45-55 dB.'
      },
      {
        question: 'How does Scrypt mining profitability compare to Bitcoin?',
        answer: 'Scrypt mining can be more profitable per dollar invested due to merge-mining capabilities. However, Bitcoin has higher liquidity. Many miners diversify across both algorithms.'
      },
      {
        question: 'What hashrate do I need for Scrypt mining?',
        answer: 'Entry-level profitability starts around 2-3 GH/s. Professional operations typically deploy 10+ GH/s miners. The Antminer L9 at 16 GH/s represents the current high-end.'
      }
    ]
  },
  'kheavyhash': {
    id: 'kheavyhash',
    name: 'KHeavyHash',
    fullName: 'kHeavyHash Algorithm',
    coins: ['Kaspa (KAS)'],
    category: 'kaspa',
    description: 'KHeavyHash is the optical-mining-resistant proof-of-work algorithm used by Kaspa. It provides fast block times and high transaction throughput.',
    metaTitle: 'Best Kaspa (KAS) ASIC Miners 2025 | KHeavyHash Mining',
    metaDescription: 'Shop Kaspa KHeavyHash miners. Compare IceRiver KS7, Antminer KS5 & more. Fast shipping from Hong Kong.',
    heroTitle: 'Kaspa KHeavyHash ASIC Miners',
    heroSubtitle: 'Mine the fastest proof-of-work cryptocurrency with cutting-edge ASIC technology',
    educationalIntro: `Kaspa (KAS) uses the KHeavyHash algorithm and features BlockDAG technology enabling 1-second block times - the fastest of any proof-of-work cryptocurrency. This makes Kaspa mining uniquely appealing for miners seeking innovation.

KHeavyHash ASICs are relatively new to the market, with major manufacturers releasing dedicated hardware in 2023-2024. Competition is lower than Bitcoin mining, potentially offering better returns for early adopters.

Kaspa's emission schedule follows a geometric pattern, reducing rewards smoothly rather than through halvings. Understanding this helps in ROI calculations.`,
    buyingGuide: [
      'Kaspa ASICs are newer technology - prices may fluctuate more than established coins',
      'Hashrate measured in TH/s or GH/s depending on model',
      'IceRiver and Bitmain dominate the market',
      'Entry-level options like IceRiver KS0 Pro offer low-cost entry points',
      'Consider KAS price volatility when calculating ROI'
    ],
    faqs: [
      {
        question: 'Is Kaspa mining profitable?',
        answer: 'Kaspa mining can be highly profitable due to lower network competition compared to Bitcoin. The IceRiver KS7 (30 TH/s) and Antminer KS5 Pro (21 TH/s) offer strong returns at current KAS prices.'
      },
      {
        question: 'What is the best entry-level Kaspa miner?',
        answer: 'The IceRiver KS0 Pro (200 GH/s, 100W) at $79 offers the lowest entry point. For more serious mining, the IceRiver KS2 (2 TH/s, 1200W) provides better efficiency.'
      },
      {
        question: 'How does Kaspa differ from Bitcoin?',
        answer: 'Kaspa uses BlockDAG architecture enabling 1-second block times vs Bitcoin\'s 10 minutes. This provides faster confirmations and higher transaction throughput while maintaining decentralization.'
      },
      {
        question: 'Will Kaspa ASICs become obsolete quickly?',
        answer: 'Kaspa\'s KHeavyHash algorithm is designed to be ASIC-friendly but resistant to sudden technology jumps. Current-generation miners should remain competitive for 2-3 years.'
      }
    ]
  },
  'equihash': {
    id: 'equihash',
    name: 'Equihash',
    fullName: 'Equihash Algorithm',
    coins: ['Zcash (ZEC)', 'Horizen (ZEN)', 'Komodo (KMD)'],
    category: 'zcash',
    description: 'Equihash is a memory-oriented proof-of-work algorithm used by privacy-focused cryptocurrencies like Zcash.',
    metaTitle: 'Best Equihash ASIC Miners 2025 | Zcash Mining Hardware',
    metaDescription: 'Shop Equihash miners for Zcash, Horizen & Komodo. Compare Antminer Z15 Pro specs & prices. Hong Kong shipping.',
    heroTitle: 'Equihash ASIC Miners',
    heroSubtitle: 'Mine privacy-focused cryptocurrencies with specialized Equihash hardware',
    educationalIntro: `Equihash is a memory-hard algorithm designed by Alex Biryukov and Dmitry Khovratovich. It powers privacy-focused coins like Zcash (ZEC), Horizen (ZEN), and Komodo (KMD).

Unlike SHA-256, Equihash requires significant memory, making ASIC development more challenging. Bitmain's Z-series miners dominate this market, with the Z15 Pro representing the current state of the art.

Privacy coin mining appeals to those who value financial privacy and decentralization. Zcash's shielded transactions provide optional complete privacy for users.`,
    buyingGuide: [
      'Hashrate measured in KSol/s (kilo-solutions per second)',
      'Bitmain Z-series are the primary options for Equihash',
      'Lower market cap coins may offer better mining returns but with higher risk',
      'Consider the regulatory environment for privacy coins in your jurisdiction',
      'Z15 Pro offers the best efficiency at 3.15 J/Sol'
    ],
    faqs: [
      {
        question: 'What is the best Zcash miner?',
        answer: 'The Antminer Z15 Pro (840 KSol/s, 2650W) is currently the most powerful Equihash miner. For budget-conscious miners, the Z11 offers good value at a lower price point.'
      },
      {
        question: 'Can I mine multiple coins with Equihash miners?',
        answer: 'Yes, Equihash miners can mine any Equihash-based coin including Zcash, Horizen, and Komodo. You can switch between coins based on profitability.'
      },
      {
        question: 'Is Zcash mining legal?',
        answer: 'Zcash mining is legal in most jurisdictions. However, some countries have restrictions on privacy coins. Check your local regulations before investing in Equihash mining hardware.'
      }
    ]
  },
  'ethash': {
    id: 'ethash',
    name: 'EtHash',
    fullName: 'Ethash Algorithm',
    coins: ['Ethereum Classic (ETC)', 'Ravencoin (RVN)', 'Ergo (ERG)'],
    category: 'ethereum',
    description: 'EtHash (formerly Ethash) is a memory-hard algorithm originally designed for Ethereum. After Ethereum moved to proof-of-stake, EtHash miners now focus on Ethereum Classic.',
    metaTitle: 'Best EtHash ASIC Miners 2025 | Ethereum Classic Mining',
    metaDescription: 'Shop EtHash miners for Ethereum Classic. Compare Antminer E9 Pro, iPollo & more. Fast Hong Kong shipping.',
    heroTitle: 'EtHash ASIC Miners',
    heroSubtitle: 'Professional Ethereum Classic mining with dedicated ASIC hardware',
    educationalIntro: `EtHash was originally designed for Ethereum but since the network moved to proof-of-stake in 2022, EtHash ASICs now mine Ethereum Classic (ETC) and other compatible coins.

Ethereum Classic continues the original Ethereum vision with proof-of-work consensus. For miners with EtHash hardware, ETC provides the primary mining opportunity with occasional algorithm-compatible alternatives.

The Antminer E9 Pro represents the pinnacle of EtHash ASIC technology, offering 3.68 GH/s of hashing power.`,
    buyingGuide: [
      'Post-merge, ETC is the primary coin for EtHash miners',
      'Hashrate measured in GH/s or MH/s',
      'GPU mining still competes in this space, affecting difficulty',
      'Consider power costs carefully - EtHash can be memory-bandwidth intensive',
      'Smaller miners like iPollo V1 Mini suit home operations'
    ],
    faqs: [
      {
        question: 'Can I mine Ethereum with an ASIC?',
        answer: 'No, Ethereum moved to proof-of-stake in September 2022 and no longer supports mining. EtHash ASICs now mine Ethereum Classic (ETC) and other compatible coins.'
      },
      {
        question: 'Is Ethereum Classic mining profitable?',
        answer: 'ETC mining profitability depends on electricity costs and ETC price. The Antminer E9 Pro can be profitable at electricity rates below $0.08/kWh. Always calculate your specific costs before investing.'
      },
      {
        question: 'What happened to Ethereum miners after the merge?',
        answer: 'Most Ethereum miners switched to Ethereum Classic, sold their hardware, or diversified to other GPU-mineable coins. ASIC miners have fewer options but ETC remains viable.'
      }
    ]
  }
};

export function getAlgorithmByCategory(category: string): AlgorithmInfo | undefined {
  return Object.values(algorithms).find(algo => algo.category === category);
}

export function getAllAlgorithms(): AlgorithmInfo[] {
  return Object.values(algorithms);
}
