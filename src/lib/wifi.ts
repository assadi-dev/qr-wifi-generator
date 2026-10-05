import * as z from "zod"

export const SECURITIES = ["WPA", "WEP", "nopass"] as const

export type Security = (typeof SECURITIES)[number]

export const SECURITY_OPTIONS: { value: Security; label: string }[] = [
  { value: "WPA", label: "WPA / WPA2 / WPA3" },
  { value: "WEP", label: "WEP" },
  { value: "nopass", label: "Aucune (réseau ouvert)" },
]

const WEP_KEY_LENGTHS = [5, 10, 13, 26]

export const wifiSchema = z
  .object({
    ssid: z
      .string()
      .refine((value) => value.trim().length > 0, "Saisissez le nom du réseau.")
      .refine(
        (value) => new TextEncoder().encode(value).length <= 32,
        "Le nom du réseau est limité à 32 octets."
      ),
    security: z.enum(SECURITIES),
    password: z.string(),
    hidden: z.boolean(),
  })
  .superRefine(({ security, password }, ctx) => {
    const fail = (message: string) =>
      ctx.addIssue({ code: "custom", path: ["password"], message })

    if (security === "WPA") {
      if (!password) fail("Saisissez le mot de passe.")
      else if (password.length < 8 || password.length > 63)
        fail("Le mot de passe doit contenir de 8 à 63 caractères.")
    } else if (security === "WEP") {
      if (!password) fail("Saisissez la clé WEP.")
      else if (!WEP_KEY_LENGTHS.includes(password.length))
        fail("Une clé WEP contient 5, 10, 13 ou 26 caractères.")
    }
  })

export type WifiConfig = z.infer<typeof wifiSchema>

export const DEFAULT_VALUES: WifiConfig = {
  ssid: "",
  password: "",
  security: "WPA",
  hidden: false,
}

// The Wi-Fi QR format reserves \ ; , : and " — each must be backslash-escaped.
const escapeField = (value: string) => value.replace(/([\\;,:"])/g, "\\$1")

export function buildWifiPayload({
  ssid,
  password,
  security,
  hidden,
}: WifiConfig) {
  const fields = [`T:${security}`, `S:${escapeField(ssid)}`]
  if (security !== "nopass") fields.push(`P:${escapeField(password)}`)
  if (hidden) fields.push("H:true")
  return `WIFI:${fields.join(";")};;`
}
