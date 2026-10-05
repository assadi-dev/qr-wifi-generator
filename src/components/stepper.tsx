import { cn } from "@/lib/utils"

const STEPS = ["Réseau", "Aperçu"]

export function Stepper({ step }: { step: 1 | 2 }) {
  return (
    <nav aria-label="Étapes" className="lg:hidden">
      <ol className="flex gap-3">
        {STEPS.map((label, index) => {
          const number = index + 1
          const isCurrent = step === number
          return (
            <li
              key={label}
              aria-current={isCurrent ? "step" : undefined}
              className="flex-1"
            >
              <div
                className={cn(
                  "h-1.5 rounded-full transition-colors duration-300",
                  step >= number ? "bg-primary" : "bg-border"
                )}
              />
              <span
                className={cn(
                  "mt-2 block text-sm",
                  isCurrent
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {number}. {label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
