export function SectionHeading({ step, title }: Readonly<{ step: number; title: string }>) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
        {step}
      </span>
      <h2 className="text-base font-semibold">{title}</h2>
    </div>
  )
}
