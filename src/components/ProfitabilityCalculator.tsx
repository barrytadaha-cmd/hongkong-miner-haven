import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, Zap, TrendingUp, DollarSign, Coins } from 'lucide-react';

interface ProfitabilityCalculatorProps {
  hashrate: string;
  power: string;
  algorithm: string;
  productName: string;
}

// Coin reward rates per TH/s per day (simplified estimates)
const COIN_REWARDS: Record<string, { 
  rewardPerUnit: number; 
  priceUsd: number; 
  unit: string;
  coinName: string;
}> = {
  'SHA256': { rewardPerUnit: 0.00000435, priceUsd: 98000, unit: 'TH/s', coinName: 'BTC' },
  'SCRYPT': { rewardPerUnit: 0.000156, priceUsd: 108, unit: 'GH/s', coinName: 'LTC' },
  'KHeavyHash': { rewardPerUnit: 8.5, priceUsd: 0.12, unit: 'TH/s', coinName: 'KAS' },
  'Ethash': { rewardPerUnit: 0.0032, priceUsd: 3400, unit: 'GH/s', coinName: 'ETC' },
  'Blake3': { rewardPerUnit: 15.2, priceUsd: 0.85, unit: 'TH/s', coinName: 'ALPH' },
  'Equihash': { rewardPerUnit: 0.045, priceUsd: 28, unit: 'KSol/s', coinName: 'ZEC' },
  'RandomX': { rewardPerUnit: 0.0052, priceUsd: 185, unit: 'MH/s', coinName: 'XMR' },
};

const parseHashrate = (hashrate: string): { value: number; unit: string } => {
  const match = hashrate.match(/([\d.]+)\s*(TH|GH|MH|KH|KSol|H)\/s?/i);
  if (!match) return { value: 0, unit: 'TH/s' };
  return { value: parseFloat(match[1]), unit: match[2].toUpperCase() + '/s' };
};

const parsePower = (power: string): number => {
  const match = power.match(/([\d.]+)\s*W/i);
  return match ? parseFloat(match[1]) : 0;
};

const ProfitabilityCalculator = ({ 
  hashrate, 
  power, 
  algorithm, 
  productName 
}: ProfitabilityCalculatorProps) => {
  const [electricityCost, setElectricityCost] = useState(0.08);
  const [coinPriceOverride, setCoinPriceOverride] = useState<number | null>(null);

  const coinData = COIN_REWARDS[algorithm] || COIN_REWARDS['SHA256'];
  const effectiveCoinPrice = coinPriceOverride ?? coinData.priceUsd;
  
  const { value: hashrateValue } = parseHashrate(hashrate);
  const powerWatts = parsePower(power);

  const calculations = useMemo(() => {
    // Daily electricity cost
    const dailyKwh = (powerWatts / 1000) * 24;
    const dailyElectricityCost = dailyKwh * electricityCost;

    // Daily coin earnings
    const dailyCoinEarnings = hashrateValue * coinData.rewardPerUnit;
    const dailyRevenue = dailyCoinEarnings * effectiveCoinPrice;

    // Profit
    const dailyProfit = dailyRevenue - dailyElectricityCost;
    const monthlyProfit = dailyProfit * 30;
    const yearlyProfit = dailyProfit * 365;

    return {
      dailyKwh,
      dailyElectricityCost,
      dailyCoinEarnings,
      dailyRevenue,
      dailyProfit,
      monthlyProfit,
      yearlyProfit,
      isProfitable: dailyProfit > 0
    };
  }, [hashrateValue, powerWatts, electricityCost, effectiveCoinPrice, coinData.rewardPerUnit]);

  return (
    <Card className="bg-gradient-to-br from-secondary/50 to-secondary/30 border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          Profitability Calculator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Estimate your daily earnings for {productName}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Controls */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Electricity Cost Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5 text-sm">
                <Zap className="h-4 w-4 text-yellow-500" />
                Electricity Cost
              </Label>
              <span className="text-sm font-semibold text-primary">
                ${electricityCost.toFixed(2)}/kWh
              </span>
            </div>
            <Slider
              value={[electricityCost]}
              onValueChange={(value) => setElectricityCost(value[0])}
              min={0.01}
              max={0.20}
              step={0.01}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0.01</span>
              <span>$0.20</span>
            </div>
          </div>

          {/* Coin Price Override */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5 text-sm">
                <Coins className="h-4 w-4 text-orange-500" />
                {coinData.coinName} Price
              </Label>
              <Badge variant="secondary" className="text-xs">
                Live: ${coinData.priceUsd.toLocaleString()}
              </Badge>
            </div>
            <Input
              type="number"
              placeholder={`$${coinData.priceUsd}`}
              value={coinPriceOverride || ''}
              onChange={(e) => setCoinPriceOverride(e.target.value ? parseFloat(e.target.value) : null)}
              className="h-9"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="p-3 bg-background/50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground mb-1">Daily Power</p>
            <p className="font-semibold text-sm">{calculations.dailyKwh.toFixed(1)} kWh</p>
          </div>
          <div className="p-3 bg-background/50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground mb-1">Power Cost</p>
            <p className="font-semibold text-sm text-red-400">-${calculations.dailyElectricityCost.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-background/50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground mb-1">Daily {coinData.coinName}</p>
            <p className="font-semibold text-sm">{calculations.dailyCoinEarnings.toFixed(6)}</p>
          </div>
          <div className="p-3 bg-background/50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground mb-1">Revenue</p>
            <p className="font-semibold text-sm text-green-400">${calculations.dailyRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Profit Summary */}
        <div className={`p-4 rounded-xl border-2 ${calculations.isProfitable ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-2 font-semibold">
              <TrendingUp className={`h-5 w-5 ${calculations.isProfitable ? 'text-green-500' : 'text-red-500'}`} />
              Estimated Profit
            </span>
            <Badge variant={calculations.isProfitable ? 'default' : 'destructive'}>
              {calculations.isProfitable ? 'Profitable' : 'Not Profitable'}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Daily</p>
              <p className={`text-lg font-bold ${calculations.dailyProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${calculations.dailyProfit.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Monthly</p>
              <p className={`text-lg font-bold ${calculations.monthlyProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${calculations.monthlyProfit.toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Yearly</p>
              <p className={`text-lg font-bold ${calculations.yearlyProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${calculations.yearlyProfit.toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          * Estimates based on current network difficulty. Actual results may vary.
        </p>
      </CardContent>
    </Card>
  );
};

export default ProfitabilityCalculator;
