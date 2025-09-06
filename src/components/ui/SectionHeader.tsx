import type { ReactNode } from "react";

type Props = {
  title: ReactNode;        // ← was string
  right?: ReactNode;
};

export default function SectionHeader({ title, right }: Props) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="text-xl font-semibold">{title}</div>
      {right}
    </div>
  );
}
