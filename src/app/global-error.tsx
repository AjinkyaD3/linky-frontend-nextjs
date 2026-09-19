"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary for errors thrown in the root layout itself. It replaces
 * the whole document, so it has to render its own <html>/<body> and cannot rely
 * on the theme provider or any app CSS variables.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1rem",
          textAlign: "center",
          background: "#faf8f4",
          color: "#1a1712",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0 }}>
          Something went wrong.
        </h1>
        <p style={{ maxWidth: "28rem", color: "#6f665a", margin: 0 }}>
          Linky failed to start up in your browser. Reloading usually fixes it.
        </p>
        {error.digest ? (
          <p style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#6f665a" }}>
            Reference: {error.digest}
          </p>
        ) : null}
        <button
          type="button"
          onClick={reset}
          style={{
            cursor: "pointer",
            borderRadius: "0.625rem",
            border: "none",
            background: "#c1631b",
            color: "#fff8f0",
            padding: "0.625rem 1.25rem",
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
