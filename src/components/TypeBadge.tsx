import { typeColors, typeKorean } from "@/lib/utils";

interface TypeBadgeProps {
  type: string;
  size?: "sm" | "md" | "lg";
}

export function TypeBadge({ type, size = "md" }: TypeBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  const color = typeColors[type] || "bg-gray-400";
  const koreanName = typeKorean[type] || type;

  return (
    <span
      className={`
        ${color} 
        ${sizeClasses[size]} 
        inline-flex items-center justify-center
        rounded-full font-semibold text-white
        shadow-md uppercase tracking-wide
        transition-transform hover:scale-105
      `}
    >
      {koreanName}
    </span>
  );
}
