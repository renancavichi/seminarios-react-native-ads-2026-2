import { Github } from "lucide-react";
export type ProviderName =
  "Google" | "GitHub" | "Apple" | "LinkedIn" | "Facebook";
export function Provider({
  name,
  label = false,
}: {
  name: ProviderName;
  label?: boolean;
}) {
  return (
    <span className={`provider provider-${name.toLowerCase()}`}>
      <span className="provider-mark" aria-hidden="true">
        {name === "Google" ? (
          <svg viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.6a4.8 4.8 0 0 1-2.1 3.1v2.6h3.4c2-1.8 3.1-4.4 3.1-7.6Z"
            />
            <path
              fill="#34A853"
              d="M12 22c2.8 0 5.1-.9 6.9-2.5l-3.4-2.6c-.9.6-2 .9-3.5.9-2.7 0-5-1.8-5.8-4.3H2.7v2.7A10.4 10.4 0 0 0 12 22Z"
            />
            <path
              fill="#FBBC05"
              d="M6.2 13.5a6.3 6.3 0 0 1 0-4V6.8H2.7a10.4 10.4 0 0 0 0 9.4l3.5-2.7Z"
            />
            <path
              fill="#EA4335"
              d="M12 5.2c1.5 0 2.8.5 3.8 1.5L18.7 4A10 10 0 0 0 12 1.5a10.4 10.4 0 0 0-9.3 5.3l3.5 2.7C7 7 9.3 5.2 12 5.2Z"
            />
          </svg>
        ) : name === "GitHub" ? (
          <Github />
        ) : name === "Apple" ? (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 12.7c0-2 1.6-3 1.7-3.1-1-1.4-2.5-1.6-3.1-1.6-1.3-.2-2.5.7-3.2.7-.6 0-1.6-.7-2.6-.7-1.4 0-2.7.8-3.4 2-1.5 2.5-.4 6.3 1 8.3.6 1 1.4 2 2.5 2s1.4-.6 2.7-.6 1.6.6 2.7.6 1.8-1 2.4-2c.8-1.1 1.1-2.2 1.1-2.2-.1 0-2-.8-2-3.4ZM14.9 6.5c.5-.7 1-1.6.9-2.5-.8 0-1.9.6-2.4 1.2-.5.6-1 1.6-.9 2.5.9.1 1.8-.5 2.4-1.2Z" />
          </svg>
        ) : name === "LinkedIn" ? (
          <b className="linkedin-symbol">in</b>
        ) : (
          <b className="facebook-symbol">f</b>
        )}
      </span>
      {label && <span>{name}</span>}
    </span>
  );
}
