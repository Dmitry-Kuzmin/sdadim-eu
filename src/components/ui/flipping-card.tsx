import React from "react";
import { cn } from "@/lib/utils";

interface FlippingCardProps {
  className?: string;
  height?: number;
  width?: number;
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
}

export function FlippingCard({
  className,
  frontContent,
  backContent,
  height = 300,
  width = 350,
}: FlippingCardProps) {
  return (
    <div
      className="group/flipping-card"
      style={{ perspective: "1000px", width: width, height: height }}
    >
      <div
        className={cn(
          "relative w-full h-full rounded-xl transition-transform duration-700 group-hover/flipping-card:[transform:rotateY(180deg)]",
          className
        )}
        style={{ transformStyle: "preserve-3d", WebkitTransformStyle: "preserve-3d" }}
      >
        {/* Front Face */}
        <div 
          className="absolute inset-0 w-full h-full rounded-[inherit] bg-[#0A101A] border border-white/10 shadow-lg text-white"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {frontContent}
        </div>
        
        {/* Back Face */}
        <div 
          className="absolute inset-0 w-full h-full rounded-[inherit] bg-gradient-to-br from-blue-900/40 to-[#0A101A] border border-blue-500/20 shadow-lg text-white"
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden", 
            transform: "rotateY(180deg)" 
          }}
        >
          {backContent}
        </div>
      </div>
    </div>
  );
}
