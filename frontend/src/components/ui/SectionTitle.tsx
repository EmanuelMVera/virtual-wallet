import type { ReactNode } from "react";

export default function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-base font-semibold text-gray-900">{children}</h3>;
}
