import React from "react";

/**
 * Catches React render errors and shows them in the UI instead of a white screen.
 * Also logs to console.error so Tauri dev (terminal) shows the error.
 */
export class ErrorBoundary extends React.Component {
  state = { error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState((s) => ({ ...s, errorInfo }));
    console.error("[RocketView] Error boundary caught:", error, errorInfo?.componentStack);
  }

  render() {
    const { error, errorInfo } = this.state;
    const { children, fallback: Fallback, onReset } = this.props;

    if (error) {
      if (Fallback) return <Fallback error={error} errorInfo={errorInfo} onReset={onReset} />;
      return (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,10,14,0.98)",
            color: "#e0e0e0",
            fontFamily: "monospace",
            padding: "2rem",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <h2 style={{ color: "#f87171", margin: 0 }}>Something went wrong</h2>
          <pre
            style={{
              background: "rgba(0,0,0,0.5)",
              padding: "1rem",
              borderRadius: 8,
              fontSize: 12,
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {error?.message ?? String(error)}
          </pre>
          {errorInfo?.componentStack && (
            <details style={{ fontSize: 11, opacity: 0.9 }}>
              <summary>Component stack</summary>
              <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{errorInfo.componentStack}</pre>
            </details>
          )}
          {onReset && (
            <button
              type="button"
              onClick={() => {
                this.setState({ error: null, errorInfo: null });
                onReset?.();
              }}
              style={{
                padding: "0.5rem 1rem",
                background: "rgba(73, 238, 242, 0.2)",
                color: "rgba(73, 238, 242, 1)",
                border: "1px solid rgba(73, 238, 242, 0.5)",
                borderRadius: 6,
                cursor: "pointer",
                alignSelf: "flex-start",
              }}
            >
              Dismiss & try again
            </button>
          )}
        </div>
      );
    }

    return children;
  }
}
