import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Trash2, TrendingUp } from "lucide-react";

interface BetLeg {
  id: string;
  selection: string;
  market: string;
  odds: number;
  game: string;
  league: string;
}

// Convert decimal odds to American odds format
function toAmericanOdds(decimal: number): string {
  if (decimal >= 2.0) {
    const american = Math.round((decimal - 1) * 100);
    return `+${american}`;
  } else {
    const american = Math.round(-100 / (decimal - 1));
    return `${american}`;
  }
}

// Get quality label based on BKS score
function getBKSQuality(score: number): { label: string; color: string } {
  if (score >= 85) return { label: "Exceptional", color: "text-win" };
  if (score >= 70) return { label: "Strong", color: "text-accent" };
  if (score >= 50) return { label: "Fair", color: "text-warning" };
  return { label: "Risky", color: "text-destructive" };
}

export function BetSlip() {
  const [betLegs, setBetLegs] = useState<BetLeg[]>([
    {
      id: "1",
      selection: "Los Angeles Lakers",
      market: "Moneyline",
      odds: 1.85,
      game: "Lakers vs Warriors",
      league: "NBA"
    },
    {
      id: "2",
      selection: "Over 225.5",
      market: "Total Points",
      odds: 1.90,
      game: "Lakers vs Warriors",
      league: "NBA"
    },
    {
      id: "3",
      selection: "LeBron James Over 25.5",
      market: "Player Points",
      odds: 1.75,
      game: "Lakers vs Warriors",
      league: "NBA"
    }
  ]);

  const [stake, setStake] = useState<number>(50);

  const handleRemoveAll = () => {
    setBetLegs([]);
  };

  // Calculate overall odds (multiply all individual odds)
  const overallOddsDecimal = betLegs.reduce((acc, leg) => acc * leg.odds, 1);
  const overallOdds = toAmericanOdds(overallOddsDecimal);

  const bksScore = 87; // Proprietary BKS score
  const toWin = stake * (overallOddsDecimal - 1);
  const bksQuality = getBKSQuality(bksScore);

  // Calculate circle progress for gauge (score out of 100)
  const circumference = 2 * Math.PI * 60; // radius of 60
  const progress = (bksScore / 100) * circumference;

  return (
    <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-lg">
      {/* Header */}
      <div className="p-4 bg-primary/10 rounded-t-lg border-b border-border">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Bet Slip</span>
          <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/30">
            Parlay
          </Badge>
        </div>
      </div>

      {/* Game Info with Overall Odds */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          {/* Circle indicator */}
          <div className="relative flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary ring-2 ring-primary/30 shrink-0"></div>
            <div className="absolute left-1/2 top-full w-0.5 h-6 bg-primary/30 -translate-x-1/2"></div>
          </div>

          <div className="flex items-center justify-between flex-1 gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs border-primary/30">NBA</Badge>
                <span className="text-sm">Lakers vs Warriors</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                October 12, 2025 · 7:30 PM ET
              </div>
            </div>

            <div className="shrink-0">
              <div className="text-lg text-accent">{overallOdds}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bet Legs */}
      <div className="px-4 py-3 space-y-4 border-b border-border">
        <div className="text-sm text-muted-foreground">Selections ({betLegs.length})</div>
        {betLegs.map((leg, index) => (
          <div key={leg.id} className="flex items-start gap-3">
            {/* Circle indicator with connecting line */}
            <div className="relative flex items-center pt-1">
              <div className="w-3 h-3 rounded-full bg-primary ring-2 ring-primary/30 shrink-0"></div>
              {index < betLegs.length - 1 && (
                <div className="absolute left-1/2 top-full w-0.5 h-12 bg-primary/30 -translate-x-1/2"></div>
              )}
            </div>

            <div className="flex items-start justify-between gap-2 flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{leg.selection}</div>
                <div className="text-xs text-muted-foreground">{leg.market}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
                  {toAmericanOdds(leg.odds)}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Remove All Selections */}
      {betLegs.length > 0 && (
        <div className="px-4 py-3 border-b border-border">
          <button
            onClick={handleRemoveAll}
            className="flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm">Remove All Selections</span>
          </button>
        </div>
      )}

      {/* BKS Featured Section */}
      <div className="px-4 py-6 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border-b border-border">
        <div className="flex flex-col items-center gap-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Preliminary BKS Score
          </div>

          {/* Circular Gauge */}
          <div className="relative">
            {/* Background circle */}
            <svg className="w-40 h-40 -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/30"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r="60"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00B3A4" />
                  <stop offset="50%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#22C55E" />
                </linearGradient>
              </defs>
            </svg>

            {/* Score in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl bg-gradient-to-br from-primary via-accent to-win bg-clip-text text-transparent">
                {bksScore}
              </div>
              <div className="text-xs text-muted-foreground mt-1">/ 100</div>
            </div>
          </div>

          {/* Quality Badge */}
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${bksQuality.color}`} />
            <span className={`text-sm ${bksQuality.color}`}>
              {bksQuality.label} Bet
            </span>
          </div>

          <p className="text-xs text-center text-muted-foreground max-w-xs">
            Based on historical data, odds value, and risk analysis
          </p>
        </div>
      </div>

      {/* Stake, To Win, and Place Bet */}
      <div className="px-4 py-4">
        <div className="flex items-end gap-3">
          {/* Stake Input */}
          <div className="flex-1 space-y-2">
            <label htmlFor="stake" className="text-sm text-muted-foreground">
              Stake
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="stake"
                type="number"
                value={stake}
                onChange={(e) => setStake(Number(e.target.value))}
                className="pl-7 bg-input-background border-input"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* To Win */}
          <div className="flex-1 space-y-2">
            <label className="text-sm text-muted-foreground">
              To Win
            </label>
            <div className="h-10 flex items-center px-3 rounded-md bg-win/10 border border-win/30">
              <span className="text-win">${toWin.toFixed(2)}</span>
            </div>
          </div>

          {/* Place Bet Button */}
          <Button className="px-6 bg-primary hover:bg-primary/90 text-primary-foreground">
            Place Bet
          </Button>
        </div>
      </div>
    </div>
  );
}
