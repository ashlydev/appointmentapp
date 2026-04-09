import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl space-y-3">
        {eyebrow ? <p className="section-kicker">{eyebrow}</p> : null}
        <div className="space-y-2">
          <h1 className="font-serif text-[2rem] leading-none text-[var(--foreground)] sm:text-[2.3rem] md:text-[2.8rem]">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] md:text-[15px]">
            {description}
          </p>
        </div>
      </div>
      {actions ? (
        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
