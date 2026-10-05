import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type BaseSyntheticEvent,
} from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { HugeiconsIcon } from "@hugeicons/react"
import { Wifi01Icon } from "@hugeicons/core-free-icons"

import { QrPreview } from "@/components/qr-preview"
import { Stepper } from "@/components/stepper"
import { ThemeToggle } from "@/components/theme-toggle"
import { WifiForm } from "@/components/wifi-form"
import { createQrMatrix } from "@/lib/qr"
import {
  buildWifiPayload,
  DEFAULT_VALUES,
  wifiSchema,
  type WifiConfig,
} from "@/lib/wifi"
import { cn } from "@/lib/utils"

type Step = 1 | 2

// Matches Tailwind's `lg` breakpoint, where both panels show side by side.
const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches

export function App() {
  const [step, setStep] = useState<Step>(1)

  const form = useForm<WifiConfig>({
    resolver: zodResolver(wifiSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
  })

  // Live values drive the preview; the QR code only exists once they validate.
  const values = useWatch({ control: form.control }) as WifiConfig
  const matrix = useMemo(() => {
    const parsed = wifiSchema.safeParse(values)
    return parsed.success ? createQrMatrix(buildWifiPayload(parsed.data)) : null
  }, [values])

  const formHeadingRef = useRef<HTMLHeadingElement>(null)
  const previewHeadingRef = useRef<HTMLHeadingElement>(null)
  const pendingFocus = useRef<Step | null>(null)

  // After a step change, move focus to the new panel's heading.
  useEffect(() => {
    if (pendingFocus.current !== step) return
    pendingFocus.current = null
    const heading = step === 1 ? formHeadingRef : previewHeadingRef
    heading.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0 })
  }, [step])

  function goToStep(next: Step) {
    pendingFocus.current = next
    setStep(next)
  }

  function onValid() {
    if (!isDesktop()) goToStep(2)
  }

  // Invalid submits are handled by react-hook-form: errors appear and the
  // first invalid field gets focus.
  function handleSubmit(event?: BaseSyntheticEvent) {
    return form.handleSubmit(onValid)(event)
  }

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center px-4 py-6 sm:px-8 sm:py-16">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="flex w-full max-w-4xl flex-col gap-6 sm:gap-8">
        <header className="flex flex-col items-center gap-3 text-center sm:gap-4">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground sm:size-14">
            <HugeiconsIcon icon={Wifi01Icon} className="size-7" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-4xl">
            QR Code Wi-Fi
          </h1>
          <p className="hidden max-w-md text-base text-balance text-muted-foreground sm:block">
            Vos invités scannent, ils sont connectés. Sans rien saisir.
          </p>
        </header>

        <Stepper step={step} />

        <div className="grid gap-6 lg:grid-cols-2">
          <WifiForm
            form={form}
            onSubmit={handleSubmit}
            headingRef={formHeadingRef}
            className={cn(
              "motion-reduce:animate-none max-lg:animate-in max-lg:duration-300 max-lg:fade-in max-lg:slide-in-from-left-4 lg:order-2",
              step !== 1 && "max-lg:hidden"
            )}
          />
          <QrPreview
            matrix={matrix}
            config={values}
            onEdit={() => goToStep(1)}
            headingRef={previewHeadingRef}
            className={cn(
              "motion-reduce:animate-none max-lg:animate-in max-lg:duration-300 max-lg:fade-in max-lg:slide-in-from-right-4 lg:order-1",
              step !== 2 && "max-lg:hidden"
            )}
          />
        </div>
      </div>
    </main>
  )
}

export default App
