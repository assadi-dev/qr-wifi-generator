import { useEffect, useMemo, useState, type Ref } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Download01Icon,
  QrCode01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { downloadQrPng, qrToSvgPath, type QrMatrix } from "@/lib/qr"
import { SECURITY_OPTIONS, type WifiConfig } from "@/lib/wifi"
import { cn } from "@/lib/utils"

type QrPreviewProps = {
  matrix: QrMatrix | null
  config: WifiConfig
  onEdit: () => void
  headingRef: Ref<HTMLHeadingElement>
  className?: string
}

function fileName(ssid: string) {
  const slug = ssid
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return `wifi-${slug || "reseau"}.png`
}

export function QrPreview({
  matrix,
  config,
  onEdit,
  headingRef,
  className,
}: QrPreviewProps) {
  const [downloaded, setDownloaded] = useState(false)

  useEffect(() => {
    if (!downloaded) return
    const timer = setTimeout(() => setDownloaded(false), 2000)
    return () => clearTimeout(timer)
  }, [downloaded])

  const svg = useMemo(() => (matrix ? qrToSvgPath(matrix) : null), [matrix])
  const securityLabel = SECURITY_OPTIONS.find(
    (option) => option.value === config.security
  )?.label

  async function handleDownload() {
    if (!matrix) return
    await downloadQrPng(matrix, fileName(config.ssid))
    setDownloaded(true)
  }

  return (
    <Card
      className={cn(
        "rounded-3xl shadow-sm [--card-spacing:--spacing(4)] sm:[--card-spacing:--spacing(8)]",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          <h2 ref={headingRef} tabIndex={-1} className="outline-none">
            Aperçu
          </h2>
        </CardTitle>
        <CardDescription className="hidden text-base sm:block">
          Le QR code se met à jour en temps réel.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col items-center justify-center gap-4 sm:gap-6">
        <div className="aspect-square w-full max-w-72">
          {svg ? (
            <svg
              viewBox={`0 0 ${svg.side} ${svg.side}`}
              role="img"
              aria-label={`QR code Wi-Fi du réseau ${config.ssid}`}
              shapeRendering="crispEdges"
              className="size-full overflow-hidden rounded-3xl ring-1 ring-foreground/10"
            >
              <rect width={svg.side} height={svg.side} fill="#ffffff" />
              <path d={svg.path} fill="#000000" />
            </svg>
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-border bg-muted/40 p-8 text-center text-muted-foreground">
              <HugeiconsIcon icon={QrCode01Icon} className="size-10" />
              <p className="text-balance">
                Complétez le formulaire pour générer votre QR code.
              </p>
            </div>
          )}
        </div>

        <div className="flex max-w-full min-w-0 flex-col items-center gap-1 text-center">
          <p
            title={config.ssid}
            className="max-w-full truncate font-heading text-lg font-semibold"
          >
            {config.ssid.trim() ? config.ssid : "Nom du réseau"}
          </p>
          <p className="text-muted-foreground">
            {securityLabel}
            {config.hidden && " · Réseau masqué"}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 sm:gap-3">
        <Button
          size="lg"
          className="h-11 w-full text-base sm:h-12"
          disabled={!matrix}
          onClick={handleDownload}
        >
          <HugeiconsIcon
            icon={downloaded ? CheckmarkCircle02Icon : Download01Icon}
            data-icon="inline-start"
            className="size-5"
          />
          {downloaded ? "Téléchargé" : "Télécharger en PNG"}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="h-11 w-full text-base sm:h-12 lg:hidden"
          onClick={onEdit}
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            data-icon="inline-start"
            className="size-5"
          />
          Modifier le réseau
        </Button>
        <span role="status" className="sr-only">
          {downloaded ? "QR code téléchargé" : ""}
        </span>
      </CardFooter>
    </Card>
  )
}
