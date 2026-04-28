import { Link } from "react-router-dom";
import "@material/web/button/filled-button.js";
import "@material/web/icon/icon.js";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-filled-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "md-icon": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "hsl(var(--md-sys-color-background))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "448px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <md-icon
            style={{
              fontSize: "96px",
              color: "hsl(var(--md-sys-color-primary))",
            }}
          >
            error_outline
          </md-icon>
        </div>
        <h1
          style={{
            fontSize: "72px",
            fontWeight: "700",
            color: "hsl(var(--md-sys-color-primary))",
            marginBottom: "16px",
            lineHeight: "1",
          }}
        >
          404
        </h1>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "500",
            color: "hsl(var(--md-sys-color-on-surface))",
            marginBottom: "16px",
            lineHeight: "1.33",
          }}
        >
          Page Not Found
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "hsl(var(--md-sys-color-on-surface-variant))",
            marginBottom: "32px",
            lineHeight: "1.5",
          }}
        >
          The page you're looking for doesn't exist or hasn't been created yet.
        </p>
        <Link to="/" style={{ textDecoration: "none" }}>
          <md-filled-button>Back to Home</md-filled-button>
        </Link>
      </div>
    </div>
  );
}
