import { Sparkles, CheckCircle } from 'lucide-react';

interface AIOSummaryBoxProps {
  title?: string;
  summary: string;
  bullets?: string[];
  className?: string;
}

const AIOSummaryBox = ({ 
  title = "Quick Answer", 
  summary, 
  bullets,
  className = '' 
}: AIOSummaryBoxProps) => {
  return (
    <div className={`bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-6 my-8 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-primary/20 rounded-lg">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-display font-semibold text-lg">{title}</h3>
      </div>
      
      <p className="text-foreground/90 font-medium leading-relaxed mb-4">
        {summary}
      </p>
      
      {bullets && bullets.length > 0 && (
        <ul className="space-y-2">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AIOSummaryBox;
