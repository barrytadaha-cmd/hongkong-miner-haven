import { useQuery } from '@tanstack/react-query';

interface CoinPrice {
  usd: number;
  usd_24h_change: number;
}

interface CryptoPrices {
  bitcoin: CoinPrice;
  litecoin: CoinPrice;
  kaspa: CoinPrice;
  monero: CoinPrice;
  'ethereum-classic': CoinPrice;
  zcash: CoinPrice;
  alephium: CoinPrice;
  dogecoin: CoinPrice;
}

// Map algorithm to CoinGecko coin ID
export const ALGORITHM_TO_COIN: Record<string, { id: string; symbol: string; name: string }> = {
  'SHA256': { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  'SCRYPT': { id: 'litecoin', symbol: 'LTC', name: 'Litecoin' },
  'KHeavyHash': { id: 'kaspa', symbol: 'KAS', name: 'Kaspa' },
  'RandomX': { id: 'monero', symbol: 'XMR', name: 'Monero' },
  'Ethash': { id: 'ethereum-classic', symbol: 'ETC', name: 'Ethereum Classic' },
  'Equihash': { id: 'zcash', symbol: 'ZEC', name: 'Zcash' },
  'Blake3': { id: 'alephium', symbol: 'ALPH', name: 'Alephium' },
  'Scrypt': { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
};

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

const fetchCryptoPrices = async (): Promise<CryptoPrices> => {
  const coinIds = Object.values(ALGORITHM_TO_COIN).map(c => c.id).join(',');
  
  const response = await fetch(
    `${COINGECKO_API}/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true`,
    {
      headers: {
        'Accept': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch crypto prices');
  }

  return response.json();
};

export function useCryptoPrices() {
  return useQuery({
    queryKey: ['crypto-prices'],
    queryFn: fetchCryptoPrices,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refresh every minute
    retry: 2,
  });
}

export function useCoinPrice(algorithm: string) {
  const { data: prices, isLoading, error } = useCryptoPrices();
  
  const coinInfo = ALGORITHM_TO_COIN[algorithm];
  if (!coinInfo) {
    return { price: null, change24h: null, isLoading: false, error: null, coinInfo: null };
  }

  const coinData = prices?.[coinInfo.id as keyof CryptoPrices];
  
  return {
    price: coinData?.usd ?? null,
    change24h: coinData?.usd_24h_change ?? null,
    isLoading,
    error,
    coinInfo,
  };
}
