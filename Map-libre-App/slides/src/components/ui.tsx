import type { ReactNode } from "react";
import { CircleCheck, CircleX, type LucideIcon } from "lucide-react";

export type Tone = "accent" | "teal" | "amber" | "rose" | "violet" | "ink";

export function IconBox({ Icon, tone = "accent", size }: { Icon: LucideIcon; tone?: Tone; size?: "sm" | "lg" }) {
  return (
    <span className={`icon-box ${size ?? ""} ${tone === "accent" ? "" : `tone-${tone}`}`}>
      <Icon />
    </span>
  );
}

export function Kicker({ children, Icon }: { children: ReactNode; Icon?: LucideIcon }) {
  return <div className="kicker">{Icon && <Icon />}{children}</div>;
}

export function Card({ Icon, tone, title, children }: { Icon?: LucideIcon; tone?: Tone; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="card">
      {Icon && <IconBox Icon={Icon} tone={tone} />}
      <h3>{title}</h3>
      {children && <p>{children}</p>}
    </div>
  );
}

export function Callout({ Icon, tone, children, className = "" }: { Icon: LucideIcon; tone?: "teal" | "amber" | "rose"; children: ReactNode; className?: string }) {
  return (
    <div className={`callout ${tone ?? ""} ${className}`}>
      <Icon />
      <div>{children}</div>
    </div>
  );
}

export function Tag({ children, tone, Icon }: { children: ReactNode; tone?: "teal" | "amber" | "rose" | "gray"; Icon?: LucideIcon }) {
  return <span className={`tag ${tone ?? ""}`}>{Icon && <Icon />}{children}</span>;
}

export function I({ children }: { children: ReactNode }) {
  return <code className="i">{children}</code>;
}

export function WithIcon({ Icon, children }: { Icon: LucideIcon; children: ReactNode }) {
  return <span className="inline-icon"><Icon />{children}</span>;
}

export const Yes = ({ children }: { children: ReactNode }) => <span className="yes"><CircleCheck />{children}</span>;
export const No = ({ children }: { children: ReactNode }) => <span className="no"><CircleX />{children}</span>;

/** Texto com HTML simples vindo dos dados das demos (<b>, <code>). */
export function Html({ html, as: Tag = "span" }: { html: string; as?: "span" | "li" | "p" }) {
  return <Tag dangerouslySetInnerHTML={{ __html: html }} />;
}
