import * as React from "react";

type TabsCtx = { value: string; setValue: (v: string) => void };
const Ctx = React.createContext<TabsCtx | null>(null);

export function Tabs({ value, onValueChange, children }: { value: string; onValueChange: (v: string) => void; children: React.ReactNode }) {
  return <Ctx.Provider value={{ value, setValue: onValueChange }}>{children}</Ctx.Provider>;
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="inline-flex gap-1 rounded-xl border p-1">{children}</div>;
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(Ctx)!;
  const active = ctx.value === value;
  return (
    <button onClick={() => ctx.setValue(value)}
      className={`rounded-lg px-3 py-2 text-sm ${active ? "bg-black text-white dark:bg-white dark:text-black" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>
      {children}
    </button>
  );
}

export function TabsContent({ children }: { children: React.ReactNode }) {
  return <div className="mt-3">{children}</div>;
}
