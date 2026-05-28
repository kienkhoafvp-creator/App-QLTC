"use client";

import { TransactionMode } from "./AppTheme";

interface Props {
  value: string;
  onChange: (v: string) => void;
  mode: TransactionMode;
}

const MAX_DIGITS = 13;

export default function CustomNumpad({ value, onChange, mode }: Props) {
  const accent = mode === "chi" ? "#FF6B35" : "#00C896";

  const handleKey = (key: string) => {
    if (key === "⌫") {
      onChange(value.slice(0, -1));
      return;
    }
    if (key === "000") {
      if (!value || value === "0") return;
      const next = value + "000";
      if (next.length > MAX_DIGITS) return;
      onChange(next);
      return;
    }
    if (key === "0") {
      if (!value || value === "0") return; // prevent leading zeros
      onChange(value + "0");
      return;
    }
    if (value.length >= MAX_DIGITS) return;
    onChange(value + key);
  };

  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["000", "0", "⌫"],
  ];

  return (
    <div
      className="rounded-2xl border border-[#2A3550] overflow-hidden"
      style={{ background: "#1C2333" }}
    >
      {keys.map((row, ri) => (
        <div key={ri} className="flex border-b border-[#2A3550] last:border-b-0">
          {row.map((key, ci) => {
            const isBackspace = key === "⌫";
            const is000 = key === "000";
            return (
              <button
                key={key}
                id={`numpad-${key === "⌫" ? "del" : key}`}
                onClick={() => handleKey(key)}
                className={[
                  "flex-1 flex items-center justify-center font-black transition-all duration-100",
                  "h-14 text-xl select-none active:scale-95",
                  ci < row.length - 1 ? "border-r border-[#2A3550]" : "",
                  isBackspace
                    ? "text-[#FF6B35] active:bg-[rgba(255,107,53,0.15)]"
                    : is000
                    ? "text-[#8B9BB4] hover:text-white"
                    : "text-white hover:text-white",
                ].join(" ")}
                style={{
                  background: "transparent",
                  // Highlight on press with accent
                }}
                onMouseDown={(e) => {
                  const el = e.currentTarget;
                  el.style.background = isBackspace
                    ? "rgba(255,107,53,0.12)"
                    : `${accent}18`;
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
                onTouchStart={(e) => {
                  const el = e.currentTarget;
                  el.style.background = `${accent}18`;
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {isBackspace ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 6H8L2 12L8 18H21V6Z"
                      stroke="#FF6B35"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path d="M15 10L10 15M10 10L15 15" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
