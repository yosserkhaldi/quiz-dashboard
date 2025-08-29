import * as React from "react";

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

type TriggerProps = {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
};
/** Stub très simple : ignore la logique “asChild” mais accepte la prop */
export function TooltipTrigger({ children, className }: TriggerProps) {
  return <span className={`inline-flex ${className ?? ""}`}>{children}</span>;
}

export function TooltipContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border bg-white p-2 text-xs shadow dark:bg-neutral-900">
      {children}
    </div>
  );
}
