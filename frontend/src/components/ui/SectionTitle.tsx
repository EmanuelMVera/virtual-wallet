import type { ReactNode } from "react";

export default function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
      {children}
    </h3>
  );
}
