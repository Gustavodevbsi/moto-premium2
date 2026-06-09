import { cn } from "@/lib/utils";

interface MotoIconProps {
  className?: string;
  strokeWidth?: number;
}

/** SVG de moto vetorial — substitui o emoji em toda a aplicação */
export function MotoIcon({ className, strokeWidth = 1.5 }: MotoIconProps) {
  return (
    <svg
      viewBox="0 0 64 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-6 h-6", className)}
      aria-hidden="true"
    >
      {/* Roda traseira */}
      <circle cx="12" cy="29" r="9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="12" cy="29" r="3" fill="currentColor" opacity={0.25} />

      {/* Roda dianteira */}
      <circle cx="52" cy="29" r="9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="52" cy="29" r="3" fill="currentColor" opacity={0.25} />

      {/* Quadro / chassi */}
      <path
        d="M12 29 L22 12 L36 12 L44 20 L52 29"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Tanque */}
      <path
        d="M26 12 C26 12 30 7 38 9 L44 20 L34 22 L26 12Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity={0.12}
      />

      {/* Guidão */}
      <path
        d="M44 14 L50 12 M44 14 L44 20"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Assento */}
      <path
        d="M26 12 Q32 10 36 12"
        stroke="currentColor"
        strokeWidth={strokeWidth + 0.5}
        strokeLinecap="round"
      />

      {/* Motor (bloco central) */}
      <rect
        x="24"
        y="20"
        width="14"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="currentColor"
        fillOpacity={0.08}
      />

      {/* Escapamento */}
      <path
        d="M24 26 Q18 28 14 29"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
