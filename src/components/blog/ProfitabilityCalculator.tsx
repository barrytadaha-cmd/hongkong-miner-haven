import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calculator, Zap, DollarSign, TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface MinerSpec {
  name: string;
  hashrate: number; // TH/s for BTC, MH/s for XMR, TH/s for KAS
  power: number; // Watts
  price: number; // USD
  coin: 'BTC' | 'KAS' | 'XMR';
  dailyRevenue: number; // Approximate daily revenue at current network
}

interface ProfitabilityCalculatorProps {
  miners: MinerSpec[];
  className?: string;
}

// Current approximate network revenue estimates (Jan 2026)
const COIN_METRICS = {
  BTC: { symbol: '₿', revenuePerTH: 0.12, name: 'Bitcoin' },
  KAS: { symbol: 'Ⓚ', revenuePerTH: 0.85, name: 'Kaspa' },
  XMR: { symbol: 'ɱ', revenuePerMH: 3.50, name: 'Monero' },
};

const ProfitabilityCalculator = ({ miners, className = '' }: ProfitabilityCalculatorProps) => {
  const [electricityCost, setElectricityCost] = useState(0.08);
  const [btcPrice, setBtcPrice] = useState(95000);

  const calculations = useMemo(() => {
    return miners.map(miner => {
      const dailyKWh = (miner.power / 1000) * 24;
      const dailyElectricityCost = dailyKWh * electricityCost;
      
      // Calculate daily revenue based on coin type
      let dailyRevenue = miner.dailyRevenue;
      if (miner.coin === 'BTC') {
        dailyRevenue = (miner.hashrate * COIN_METRICS.BTC.revenuePerTH * btcPrice) / 95000;
      }
      
      const dailyProfit = dailyRevenue - dailyElectricityCost;
      const monthlyProfit = dailyProfit * 30;
      const yearlyProfit = dailyProfit * 365;
      const breakEvenDays = dailyProfit > 0 ? Math.ceil(miner.price / dailyProfit) : Infinity;
      const roi = yearlyProfit > 0 ? (yearlyProfit / miner.price) * 100 : 0;
      
      return {
        ...miner,
        dailyKWh,
        dailyElectricityCost,
        dailyRevenue,
        dailyProfit,
        monthlyProfit,
        yearlyProfit,
        breakEvenDays,
        roi,
        isProfitable: dailyProfit > 0,
      };
    });
  }, [miners, electricityCost, btcPrice]);

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatDays = (days: number) => {
    if (days === Infinity) return 'Never';
    if (days > 730) return `${(days / 365).toFixed(1)} years`;
    if (days > 60) return `${Math.round(days / 30)} months`;
    return `${days} days`;
  };

  return (
    <Card className={`border-primary/20 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          Profitability Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Electricity Cost */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Electricity Cost
              </Label>
              <span className="text-sm font-medium">${electricityCost.toFixed(2)}/kWh</span>
            </div>
            <Slider
              value={[electricityCost]}
              onValueChange={([value]) => setElectricityCost(value)}
              min={0.01}
              max={0.25}
              step={0.01}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0.01</span>
              <span>$0.25</span>
            </div>
          </div>

          {/* BTC Price (for BTC miners) */}
          {miners.some(m => m.coin === 'BTC') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-orange-500" />
                  Bitcoin Price
                </Label>
                <span className="text-sm font-medium">${btcPrice.toLocaleString()}</span>
              </div>
              <Slider
                value={[btcPrice]}
                onValueChange={([value]) => setBtcPrice(value)}
                min={50000}
                max={200000}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$50k</span>
                <span>$200k</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Quick presets:</span>
          {[0.03, 0.06, 0.08, 0.10, 0.12, 0.15].map(cost => (
            <Badge
              key={cost}
              variant={electricityCost === cost ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => setElectricityCost(cost)}
            >
              ${cost}/kWh
            </Badge>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-4 pt-4 border-t">
          {calculations.map((calc, index) => (
            <div
              key={calc.name}
              className={`p-4 rounded-xl ${
                calc.isProfitable 
                  ? 'bg-green-500/10 border border-green-500/20' 
                  : 'bg-red-500/10 border border-red-500/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{calc.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {COIN_METRICS[calc.coin].name}
                  </Badge>
                </div>
                <Badge 
                  className={calc.isProfitable 
                    ? 'bg-green-500/20 text-green-600 border-green-500/30'
                    : 'bg-red-500/20 text-red-600 border-red-500/30'
                  }
                >
                  {calc.isProfitable ? 'Profitable' : 'Unprofitable'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Daily Profit</p>
                  <p className={`text-lg font-bold ${calc.dailyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {calc.dailyProfit >= 0 ? '+' : ''}{formatCurrency(calc.dailyProfit)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Monthly Profit</p>
                  <p className={`text-lg font-bold ${calc.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {calc.monthlyProfit >= 0 ? '+' : ''}{formatCurrency(calc.monthlyProfit)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Break-even
                  </p>
                  <p className="text-lg font-bold">{formatDays(calc.breakEvenDays)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Annual ROI
                  </p>
                  <p className={`text-lg font-bold ${calc.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {calc.roi.toFixed(0)}%
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                <div>
                  <span className="block">Daily Power</span>
                  <span className="font-medium text-foreground">{calc.dailyKWh.toFixed(1)} kWh</span>
                </div>
                <div>
                  <span className="block">Daily Elec. Cost</span>
                  <span className="font-medium text-foreground">${calc.dailyElectricityCost.toFixed(2)}</span>
                </div>
                <div>
                  <span className="block">Daily Revenue</span>
                  <span className="font-medium text-foreground">${calc.dailyRevenue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p>
            Projections based on current network difficulty and approximate revenue rates. 
            Actual results vary with network conditions, coin prices, and hardware performance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitabilityCalculator;
