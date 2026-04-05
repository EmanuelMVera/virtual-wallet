import type { ReactNode } from "react";

type Props = { className?: string; children: ReactNode; onClick?: () => void };

export default function Card({ className = "", children, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={
        "rounded-2xl bg-white shadow-sm ring-1 ring-black/5 hover:shadow-md transition-all duration-200 " +
        (onClick ? "cursor-pointer active:scale-[0.98] hover:shadow-lg " : "") +
        className
      }
    >
      {children}
    </div>
  );
}
