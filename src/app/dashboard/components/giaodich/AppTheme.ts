// AppTheme.ts – Central token registry for the Transaction Screen
// Dark mode only (matches globals.css @media prefers-color-scheme dark)

export const AppTheme = {
  background: "#0D1117",
  surface: "#1C2333",
  surfaceElevated: "#222D42",

  primaryExpense: "#FF6B35",
  primaryExpenseLight: "rgba(255,107,53,0.15)",
  primaryExpenseBorder: "rgba(255,107,53,0.35)",
  primaryExpenseGlow: "0 0 20px rgba(255,107,53,0.4)",

  primaryIncome: "#00C896",
  primaryIncomeLight: "rgba(0,200,150,0.15)",
  primaryIncomeBorder: "rgba(0,200,150,0.35)",
  primaryIncomeGlow: "0 0 20px rgba(0,200,150,0.4)",

  textPrimary: "#FFFFFF",
  textSecondary: "#8B9BB4",
  border: "#2A3550",
  borderLight: "rgba(42,53,80,0.6)",
} as const;

export type TransactionMode = "chi" | "thu";

export const modeColor = (mode: TransactionMode) => ({
  primary: mode === "chi" ? AppTheme.primaryExpense : AppTheme.primaryIncome,
  light: mode === "chi" ? AppTheme.primaryExpenseLight : AppTheme.primaryIncomeLight,
  border: mode === "chi" ? AppTheme.primaryExpenseBorder : AppTheme.primaryIncomeBorder,
  glow: mode === "chi" ? AppTheme.primaryExpenseGlow : AppTheme.primaryIncomeGlow,
  tailwindText: mode === "chi" ? "text-[#FF6B35]" : "text-[#00C896]",
  tailwindBg: mode === "chi" ? "bg-[#FF6B35]" : "bg-[#00C896]",
  tailwindBgLight: mode === "chi" ? "bg-[rgba(255,107,53,0.15)]" : "bg-[rgba(0,200,150,0.15)]",
  tailwindBorder: mode === "chi" ? "border-[rgba(255,107,53,0.4)]" : "border-[rgba(0,200,150,0.4)]",
  tailwindGlow: mode === "chi"
    ? "shadow-[0_0_20px_rgba(255,107,53,0.35)]"
    : "shadow-[0_0_20px_rgba(0,200,150,0.35)]",
  label: mode === "chi" ? "Chi" : "Thu",
});
