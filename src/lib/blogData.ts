export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export const blogCategories: BlogCategory[] = [
  { id: '1', name: 'Guides', slug: 'guides', description: 'Step-by-step mining tutorials', count: 8 },
  { id: '2', name: 'Reviews', slug: 'reviews', description: 'Hardware reviews and comparisons', count: 12 },
  { id: '3', name: 'Industry', slug: 'industry', description: 'Mining industry news and analysis', count: 6 },
  { id: '4', name: 'Altcoins', slug: 'altcoins', description: 'Altcoin mining opportunities', count: 5 },
  { id: '5', name: 'Business', slug: 'business', description: 'Mining as a business', count: 4 },
  { id: '6', name: 'Analysis', slug: 'analysis', description: 'Profitability and market analysis', count: 7 },
];

export const blogTags = [
  'Bitcoin', 'ASIC', 'Home Mining', 'Profitability', 'Kaspa', 'Litecoin', 
  'Hydro Cooling', 'Solar Mining', 'Bitmain', 'MicroBT', 'Canaan', 'IceRiver',
  'Beginners', 'Advanced', 'Electricity', 'Efficiency', 'ROI', 'Heat Recovery'
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'bitcoin-mining-solar-panels-complete-guide',
    title: 'Bitcoin Mining with Solar Panels: A Complete Guide',
    excerpt: 'Learn how to combine photovoltaic systems with ASIC miners for eco-friendly and cost-effective mining operations.',
    content: `
## Introduction to Solar-Powered Mining

Bitcoin mining has evolved significantly since the early days of CPU and GPU mining. Today's ASIC miners are incredibly powerful but also consume substantial amounts of electricity. For miners looking to reduce operational costs and environmental impact, solar-powered mining presents an attractive solution.

## Why Solar Mining Makes Sense

### Cost Reduction
Electricity costs are typically the largest operational expense for miners. In many regions, solar power can reduce or eliminate this cost after the initial investment.

### Environmental Benefits
Solar mining produces clean energy, reducing the carbon footprint of your mining operation. This is increasingly important as the industry faces scrutiny over energy consumption.

### Energy Independence
With solar panels and battery storage, miners can operate independently of grid fluctuations and potential outages.

## Equipment You'll Need

1. **Solar Panels**: High-efficiency monocrystalline panels are recommended
2. **Inverters**: Convert DC to AC power for your miners
3. **Battery Storage**: For 24/7 operation or backup
4. **Charge Controllers**: Manage power flow and protect batteries
5. **ASIC Miners**: Choose efficient models like the Antminer S21 Pro

## Calculating Your Requirements

To mine Bitcoin with solar power, you need to calculate:

- **Daily power consumption**: A typical S21 Pro uses 3,531W × 24h = 84.7 kWh/day
- **Solar panel output**: Account for 4-6 peak sun hours in most locations
- **Panel capacity needed**: 84.7 kWh ÷ 5 hours = 17 kW of panels minimum

## Best Practices

1. Start with a hybrid system (grid + solar) before going fully off-grid
2. Monitor your system's performance regularly
3. Consider battery storage for night operation
4. Choose miners with high efficiency ratings
5. Plan for seasonal variations in solar output

## Conclusion

Solar mining is not just environmentally responsible—it can be economically advantageous in the right conditions. With careful planning and the right equipment, you can build a sustainable mining operation that will serve you for years to come.
    `,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=630&fit=crop',
    category: 'Guides',
    tags: ['Bitcoin', 'Solar Mining', 'Efficiency', 'Beginners'],
    author: 'Michael Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    date: 'Dec 15, 2025',
    readTime: '8 min read',
    featured: true,
  },
  {
    id: '2',
    slug: 'asic-miner-manufacturers-complete-guide-2026',
    title: 'ASIC Miner Manufacturers: The Complete Guide for 2026',
    excerpt: 'Compare Bitmain, MicroBT, Canaan, and other leading manufacturers. Learn which brand is right for your needs.',
    content: `
## The Big Three: Bitmain, MicroBT, and Canaan

The ASIC mining industry is dominated by three major manufacturers, each with their own strengths and weaknesses.

### Bitmain (Antminer)

Bitmain is the largest ASIC manufacturer, known for their Antminer series. They offer:
- Highest hashrates available
- Extensive dealer network
- Regular firmware updates
- Premium pricing

### MicroBT (Whatsminer)

MicroBT has grown to become a serious competitor to Bitmain:
- Excellent reliability ratings
- Competitive efficiency
- Good customer support
- More affordable than Bitmain

### Canaan (Avalon)

The first company to produce commercial ASIC miners:
- Focus on home mining products
- Bitcoin heaters integration
- Good entry-level options
- Innovative designs

## Emerging Manufacturers

### IceRiver
Specializing in Kaspa (KHeavyHash) miners, IceRiver has quickly become a leader in altcoin ASIC mining.

### Goldshell
Known for compact, quiet miners suitable for home use.

## How to Choose

Consider these factors:
1. **Budget**: Bitmain is premium, MicroBT is mid-range
2. **Algorithm**: Not all manufacturers cover all algorithms
3. **Use case**: Home vs. industrial mining
4. **After-sales support**: Check local dealer availability
5. **Efficiency**: Compare J/TH across models

## Conclusion

Each manufacturer has its place in the market. For most miners, we recommend starting with Bitmain or MicroBT for Bitcoin mining, and IceRiver for Kaspa.
    `,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop',
    category: 'Industry',
    tags: ['Bitmain', 'MicroBT', 'Canaan', 'ASIC'],
    author: 'Sarah Wong',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    date: 'Dec 10, 2025',
    readTime: '12 min read',
  },
  {
    id: '3',
    slug: 'antminer-s21-pro-review',
    title: 'Antminer S21 Pro Review: Is 234 TH/s Worth It?',
    excerpt: "Our hands-on review of Bitmain's latest flagship miner. Performance tests, noise levels, and profitability analysis.",
    content: `
## First Impressions

The Antminer S21 Pro arrived in Bitmain's standard packaging. Build quality is excellent, as expected from a flagship model.

## Specifications

- **Hashrate**: 234 TH/s
- **Power Consumption**: 3,531W
- **Efficiency**: 15.1 J/TH
- **Noise Level**: 75 dB
- **Dimensions**: 400 × 195 × 290 mm

## Performance Testing

We ran the S21 Pro for 30 days in our test facility. Here are our findings:

### Hashrate Stability
Average hashrate over the testing period was 232.8 TH/s, which is within 1% of the advertised rate. Very consistent performance.

### Power Consumption
Actual power draw measured at 3,498W, slightly below the rated 3,531W. Excellent efficiency in real-world conditions.

### Heat and Noise
At 75 dB, this is not a quiet miner. You'll need a dedicated space with proper ventilation.

## Profitability Analysis

At current BTC prices and average electricity costs of $0.08/kWh:
- Daily revenue: ~$28.50
- Daily electricity cost: ~$6.70
- Daily profit: ~$21.80
- Monthly profit: ~$654

## Verdict

The S21 Pro is currently the best air-cooled Bitcoin miner on the market. If you have access to affordable electricity and proper cooling, it's worth the investment.

**Rating: 4.5/5**
    `,
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=630&fit=crop',
    category: 'Reviews',
    tags: ['Bitcoin', 'Bitmain', 'ASIC', 'Profitability'],
    author: 'James Liu',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    date: 'Dec 5, 2025',
    readTime: '6 min read',
  },
  {
    id: '4',
    slug: 'home-mining-2026-still-profitable',
    title: 'Home Mining in 2026: Is It Still Profitable?',
    excerpt: 'Analysis of home mining profitability with current difficulty levels and electricity costs across different regions.',
    content: `
## The State of Home Mining

Home mining has evolved significantly. While industrial farms dominate Bitcoin mining, there are still opportunities for home miners with the right approach.

## Key Factors for Profitability

### Electricity Costs
The single most important factor. At $0.10/kWh or higher, most Bitcoin mining is unprofitable. However:
- Solar power can reduce costs to near zero
- Some regions offer rates as low as $0.03/kWh
- Time-of-use plans can help

### Hardware Choice
For home mining, consider:
- **Bitcoin heaters**: Offset heating costs in winter
- **Silent miners**: Mini ASICs and lottery miners
- **Altcoin miners**: Kaspa, Litecoin often more accessible

### Heat Recovery
Turn "waste" heat into value:
- Home heating
- Hot water systems
- Greenhouse heating
- Pool heating

## Best Home Mining Options in 2026

1. **Avalon MINI 3** - Bitcoin heater, 37.5 TH/s
2. **IceRiver KS0 Pro** - Kaspa miner, very quiet
3. **Bitaxe Gamma 601** - Open source, 1.2 TH/s lottery miner
4. **Goldshell CK-Box** - CKB miner, home-friendly

## Realistic Expectations

Home mining won't make you rich, but it can:
- Provide a small passive income stream
- Heat your home for "free"
- Support network decentralization
- Be an educational experience

## Conclusion

Home mining in 2026 is profitable under the right conditions: low electricity costs, heat utilization, and realistic expectations about returns.
    `,
    image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=1200&h=630&fit=crop',
    category: 'Analysis',
    tags: ['Home Mining', 'Profitability', 'Bitcoin', 'Heat Recovery'],
    author: 'Emma Zhang',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    date: 'Nov 28, 2025',
    readTime: '10 min read',
  },
  {
    id: '5',
    slug: 'kaspa-mining-kheavyhash-guide',
    title: 'Kaspa Mining: Why KHeavyHash Miners Are Selling Out',
    excerpt: 'Understanding the Kaspa blockchain and why miners are rushing to get KS5 and other KHeavyHash ASICs.',
    content: `
## What is Kaspa?

Kaspa is a proof-of-work cryptocurrency using the GHOSTDAG protocol, enabling high block rates while maintaining security.

## Why Kaspa Mining is Popular

1. **Fair launch**: No premine or ICO
2. **Fast blocks**: 1 block per second
3. **Active development**: Continuous improvements
4. **Growing community**: Strong grassroots support

## KHeavyHash Algorithm

Kaspa uses KHeavyHash, designed to be ASIC-friendly while maintaining memory hardness.

## Top Kaspa Miners

### Bitmain KS5 Pro
- 21 TH/s
- 3,150W
- Best efficiency

### IceRiver KS5L
- 12 TH/s
- 3,400W
- Good availability

### IceRiver KS0 Pro
- 200 GH/s
- 100W
- Perfect for home

## Getting Started

1. Choose your miner based on budget and space
2. Join a mining pool (recommended for most)
3. Set up a Kaspa wallet
4. Configure your miner
5. Monitor and optimize

## Is It Worth It?

Kaspa mining can be highly profitable, but ASIC prices are volatile. Do your research and calculate ROI carefully.
    `,
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=1200&h=630&fit=crop',
    category: 'Altcoins',
    tags: ['Kaspa', 'IceRiver', 'Bitmain', 'Altcoins'],
    author: 'David Kim',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    date: 'Nov 20, 2025',
    readTime: '7 min read',
  },
  {
    id: '6',
    slug: 'mining-farm-hong-kong-legal-guide',
    title: 'Setting Up a Mining Farm in Hong Kong: Legal Guide',
    excerpt: 'Everything you need to know about regulations, electricity contracts, and licensing for commercial mining in HK.',
    content: `
## Hong Kong's Crypto-Friendly Environment

Hong Kong has emerged as a hub for cryptocurrency activities, including mining operations.

## Legal Considerations

### Business Registration
- Register with the Companies Registry
- Obtain a Business Registration Certificate
- Consider incorporation for liability protection

### Electricity Contracts
- Industrial rates available for large operations
- Contact CLP or HK Electric for commercial contracts
- Consider dedicated transformer installation

### Building Requirements
- Proper ventilation systems
- Fire safety compliance
- Noise ordinance adherence
- Structural load assessment

## Tax Implications

- Mining income may be subject to profits tax (16.5%)
- Consult with a tax advisor familiar with crypto
- Keep detailed records of all transactions

## Operational Tips

1. **Location**: Industrial areas in New Territories offer best rates
2. **Cooling**: Consider hydro-cooled miners for HK's humidity
3. **Insurance**: Protect your investment
4. **Security**: Both physical and cybersecurity

## Conclusion

Hong Kong offers a favorable environment for mining operations, but proper planning and compliance are essential.
    `,
    image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1200&h=630&fit=crop',
    category: 'Business',
    tags: ['Business', 'Beginners', 'Advanced'],
    author: 'Grace Lee',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    date: 'Nov 15, 2025',
    readTime: '15 min read',
  },
  {
    id: '7',
    slug: 'hydro-cooling-vs-air-cooling-miners',
    title: 'Hydro Cooling vs Air Cooling: Which is Better for Your Mining Farm?',
    excerpt: 'A detailed comparison of hydro-cooled and air-cooled ASIC miners to help you make the right choice.',
    content: `
## Understanding Cooling Technologies

Modern ASIC miners generate significant heat. How you handle this heat determines efficiency, lifespan, and operational costs.

## Air-Cooled Miners

### Advantages
- Lower initial cost
- Simpler setup
- Easy maintenance
- No plumbing required

### Disadvantages
- Higher noise levels (70-80 dB)
- Less efficient in hot climates
- More dust accumulation
- Higher ambient temperatures

## Hydro-Cooled Miners

### Advantages
- Whisper quiet (35-40 dB)
- Superior efficiency
- Higher hashrates possible
- Heat recovery potential

### Disadvantages
- Higher initial investment
- Complex infrastructure
- Maintenance requirements
- Potential leak risks

## Cost Comparison

| Factor | Air-Cooled | Hydro-Cooled |
|--------|------------|--------------|
| Unit Cost | Lower | 30-50% higher |
| Efficiency | Good | Excellent |
| Noise | High | Low |
| Maintenance | Simple | Complex |

## Recommendations

- **Residential**: Hydro-cooled for noise reduction
- **Small farm**: Air-cooled for simplicity
- **Large operation**: Mixed approach based on needs

Choose based on your specific situation, not just efficiency numbers.
    `,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop',
    category: 'Guides',
    tags: ['Hydro Cooling', 'ASIC', 'Efficiency', 'Advanced'],
    author: 'Michael Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    date: 'Nov 10, 2025',
    readTime: '9 min read',
  },
  {
    id: '8',
    slug: 'litecoin-dogecoin-scrypt-mining-2026',
    title: 'Litecoin & Dogecoin Mining in 2026: Scrypt Still Pays',
    excerpt: 'Why Scrypt mining remains profitable and which miners offer the best ROI for LTC and DOGE.',
    content: `
## The Resilience of Scrypt Mining

While Bitcoin dominates headlines, Scrypt-based coins like Litecoin and Dogecoin continue to offer mining opportunities.

## Why Mine LTC/DOGE?

1. **Merged mining**: Mine both simultaneously
2. **Lower difficulty**: More accessible than Bitcoin
3. **Strong communities**: Both coins have loyal followings
4. **Exchange liquidity**: Easy to convert to fiat

## Top Scrypt Miners

### Antminer L9
- 17 GH/s
- 3,260W
- Best overall

### Elphapex DG1
- 14 GH/s
- 3,920W
- New competitor

### VolcMiner D1 Mini
- 2.2 GH/s
- 500W
- Home-friendly

## Profitability Calculation

At current prices and difficulty:
- L9 daily revenue: ~$35
- Electricity (0.08/kWh): ~$6.25
- Daily profit: ~$28.75

## Setup Guide

1. Choose your Scrypt miner
2. Configure merged mining
3. Join a pool supporting both coins
4. Set up LTC and DOGE wallets
5. Monitor and optimize

Scrypt mining offers a solid alternative to Bitcoin mining, especially for those seeking diversification.
    `,
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&h=630&fit=crop',
    category: 'Altcoins',
    tags: ['Litecoin', 'ASIC', 'Profitability', 'Beginners'],
    author: 'Sarah Wong',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    date: 'Nov 5, 2025',
    readTime: '8 min read',
  },
];

export const getRelatedPosts = (currentPost: BlogPost, limit = 3): BlogPost[] => {
  return blogPosts
    .filter(post => post.id !== currentPost.id)
    .filter(post => 
      post.category === currentPost.category || 
      post.tags.some(tag => currentPost.tags.includes(tag))
    )
    .slice(0, limit);
};

export const getPostsByCategory = (categorySlug: string): BlogPost[] => {
  const category = blogCategories.find(c => c.slug === categorySlug);
  if (!category) return [];
  return blogPosts.filter(post => post.category === category.name);
};

export const getPostsByTag = (tag: string): BlogPost[] => {
  return blogPosts.filter(post => post.tags.includes(tag));
};

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};
