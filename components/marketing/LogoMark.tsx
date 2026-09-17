/**
 * Placeholder brand mark.
 *
 * Kept in its own module with no server imports so it is safe inside client
 * components. It is only ever used when no real logo file has been supplied —
 * `components/marketing/Logo.tsx` prefers the brand asset when one exists.
 *
 * Three stacked bars of decreasing width inside a rounded square:
 * "money, sorted into purposes".
 */
export function LogoMark({
  size = 30,
  variant = "light",
}: {
  size?: number;
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="32" rx="9" fill={isDark ? "rgba(255,255,255,0.12)" : "#1565ff"} />
      <rect x="7" y="9.2" width="18" height="3.4" rx="1.7" fill="#ffffff" />
      <rect x="7" y="14.3" width="13" height="3.4" rx="1.7" fill="#ffffff" fillOpacity="0.72" />
      <rect x="7" y="19.4" width="8" height="3.4" rx="1.7" fill="#ffffff" fillOpacity="0.46" />
    </svg>
  );
}
