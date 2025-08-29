import * as React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** accepte n'importe quelle variante, on s'en sert juste pour le style */
  variant?: "secondary" | "outline" | string;
};

export function Badge({
  children,
  className = "",
  variant,
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium";
  const look =
    variant === "outline"
      ? "border border-neutral-300 text-neutral-800 "
      : "bg-neutral-200 text-neutral-800 ";
  return (
    <span className={`${base} ${look} ${className}`} {...props}>
      {children}
    </span>
  );
}
