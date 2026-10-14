import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-lg font-bold tracking-wide uppercase " +
  "transition-[transform,background-color,box-shadow,color] duration-150 ease-out active:scale-[0.97] " +
  "disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-ink-950 hover:bg-brand-400 hover:shadow-[var(--shadow-glow)] active:bg-brand-600",
  secondary: "bg-ink-700 text-fg ring-1 ring-white/10 hover:bg-ink-600",
  ghost: "text-fg hover:bg-white/5",
};

type CommonProps = { variant?: Variant; className?: string; children: ReactNode };

export function Button({
  variant = "primary",
  className,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  href,
  external,
  ...props
}: CommonProps & Omit<ComponentProps<typeof Link>, "href"> & { href: string; external?: boolean }) {
  const classes = cn(base, variants[variant], className);
  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        {...(props as ComponentProps<"a">)}
      />
    );
  }
  return <Link href={href} className={classes} {...props} />;
}
