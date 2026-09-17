"use client";

import "./globals.css";

/**
 * Last-resort boundary: renders when the root layout itself fails, so it has to
 * supply its own <html>/<body> and cannot rely on the design-system components.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f7fb",
          color: "#141c2e",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "32rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 650,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#8d97ab",
              margin: 0,
            }}
          >
            Dispense
          </p>
          <h1 style={{ fontSize: "1.75rem", lineHeight: 1.15, margin: "1rem 0 0" }}>
            The site could not load.
          </h1>
          <p style={{ marginTop: "1rem", lineHeight: 1.65, color: "#59637a" }}>
            An unexpected problem stopped the page from rendering. Reloading often fixes it.
          </p>
          {error.digest ? (
            <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", color: "#8d97ab" }}>
              Reference: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: "2rem",
              background: "#1565ff",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "0.8125rem 1.375rem",
              fontSize: "0.9375rem",
              fontWeight: 650,
              cursor: "pointer",
            }}
          >
            Reload the site
          </button>
        </div>
      </body>
    </html>
  );
}
