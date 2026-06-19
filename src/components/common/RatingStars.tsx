import { Star } from "lucide-react";

interface Props {
  rating: number;
  size?: number;
  showValue?: boolean;
}

export default function RatingStars({ rating, size = 14, showValue = false }: Props) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full;
          const half = i === full && hasHalf;
          return (
            <div key={i} className="relative">
              <Star
                className={`${filled || half ? "text-warn-500" : "text-slate-200"}`}
                style={{ width: size, height: size }}
                fill={filled ? "currentColor" : half ? "url(#half)" : "none"}
                strokeWidth={1.5}
              />
              {half && (
                <svg width={0} height={0}>
                  <defs>
                    <linearGradient id="half">
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              )}
            </div>
          );
        })}
      </div>
      {showValue && <span className="text-xs text-slate-600 font-semibold">{rating.toFixed(1)}</span>}
    </div>
  );
}
