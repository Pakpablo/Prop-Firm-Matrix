"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/ranking", label: "Ranking" },
  { href: "/compare-with-dt", label: "Compare with DT" },
  { href: "/compare-any", label: "Compare Any" },
];

export default function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-[#eee] bg-white">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? "border-[#D42B3F] text-[#0B0B0D]"
                  : "border-transparent text-[#999] hover:text-[#333]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
