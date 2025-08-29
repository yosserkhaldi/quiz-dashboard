import * as React from "react";

type SelectRootProps = {
  value?: string;
  onValueChange?: (v: string) => void;
  children?: React.ReactNode;
};

type Ctx = {
  value?: string;
  setValue: (v: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  placeholder?: string;
};

const SelectCtx = React.createContext<Ctx | null>(null);

export function Select({ value, onValueChange, children }: SelectRootProps) {
  const [internal, setInternal] = React.useState<string | undefined>(value);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => { setInternal(value); }, [value]);

  const setValue = (v: string) => {
    setInternal(v);
    onValueChange?.(v);
    setOpen(false);
  };

  return (
    <SelectCtx.Provider value={{ value: internal, setValue, open, setOpen, placeholder: "All categories" }}>
      <div className="relative inline-block">{children}</div>
    </SelectCtx.Provider>
  );
}

export function SelectTrigger(
  { className = "", children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  const ctx = React.useContext<Ctx | null>(SelectCtx);
  if (!ctx) return null;
  return (
    <button type="button" onClick={() => ctx.setOpen(!ctx.open)} className={`select-trigger ${className}`} {...props}>
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = React.useContext<Ctx | null>(SelectCtx);
  if (!ctx) return null;
  const label = ctx.value ?? placeholder ?? "Select…";
  return <span className="opacity-80">{label}</span>;
}

export function SelectContent({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext<Ctx | null>(SelectCtx);
  if (!ctx || !ctx.open) return null;
  return <div className="select-menu">{children}</div>;
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext<Ctx | null>(SelectCtx);
  if (!ctx) return null;
  const active = ctx.value === value;
  return (
    <div role="option" aria-selected={active} className={`select-item ${active ? "select-item--active" : ""}`} onClick={() => ctx.setValue(value)}>
      {children}
    </div>
  );
}
