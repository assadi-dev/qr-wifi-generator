import { useState, type BaseSyntheticEvent, type Ref } from "react"
import { Controller, useWatch, type UseFormReturn } from "react-hook-form"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  ViewIcon,
  ViewOffSlashIcon,
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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { SECURITY_OPTIONS, type Security, type WifiConfig } from "@/lib/wifi"
import { cn } from "@/lib/utils"

type WifiFormProps = {
  form: UseFormReturn<WifiConfig>
  onSubmit: (event?: BaseSyntheticEvent) => void
  headingRef: Ref<HTMLHeadingElement>
  className?: string
}

const PASSWORD_HINTS: Record<Security, string> = {
  WPA: "De 8 à 63 caractères.",
  WEP: "5, 10, 13 ou 26 caractères.",
  nopass: "",
}

export function WifiForm({
  form,
  onSubmit,
  headingRef,
  className,
}: WifiFormProps) {
  const { control, getFieldState, getValues, trigger } = form
  const [showPassword, setShowPassword] = useState(false)
  const security = useWatch({ control, name: "security" })

  // The password rules depend on the security type, so re-check it when the
  // type changes — unless it is empty and has not been flagged yet.
  function revalidatePassword() {
    if (getValues("password") || getFieldState("password").invalid) {
      void trigger("password")
    }
  }

  return (
    <Card
      className={cn(
        "rounded-3xl shadow-sm [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(8)]",
        className
      )}
    >
      <form noValidate onSubmit={onSubmit} className="contents">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            <h2 ref={headingRef} tabIndex={-1} className="outline-none">
              Votre réseau
            </h2>
          </CardTitle>
          <CardDescription className="hidden text-base sm:block">
            Renseignez les informations de connexion.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          <FieldGroup className="gap-6">
            <Controller
              name="ssid"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Nom du réseau (SSID)
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Ex. MaisonWiFi"
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    aria-invalid={fieldState.invalid}
                    aria-describedby={
                      fieldState.invalid ? `${field.name}-error` : undefined
                    }
                    className="h-12 px-4"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      id={`${field.name}-error`}
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />

            <Controller
              name="security"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Sécurité</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)
                      revalidatePassword()
                    }}
                  >
                    <SelectTrigger
                      id={field.name}
                      onBlur={field.onBlur}
                      className="h-12 w-full px-4"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SECURITY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            {security !== "nopass" && (
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Mot de passe</FieldLabel>
                    <InputGroup className="h-12">
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type={showPassword ? "text" : "password"}
                        autoComplete="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        data-1p-ignore
                        data-lpignore="true"
                        aria-invalid={fieldState.invalid}
                        aria-describedby={`${field.name}-${fieldState.invalid ? "error" : "hint"}`}
                        className="h-full px-4"
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          size="icon-sm"
                          aria-label={
                            showPassword
                              ? "Masquer le mot de passe"
                              : "Afficher le mot de passe"
                          }
                          aria-pressed={showPassword}
                          onClick={() => setShowPassword((value) => !value)}
                          className="size-10"
                        >
                          <HugeiconsIcon
                            icon={showPassword ? ViewOffSlashIcon : ViewIcon}
                            className="size-5"
                          />
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid ? (
                      <FieldError
                        id={`${field.name}-error`}
                        errors={[fieldState.error]}
                      />
                    ) : (
                      <FieldDescription id={`${field.name}-hint`}>
                        {PASSWORD_HINTS[security]}
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />
            )}

            <Controller
              name="hidden"
              control={control}
              render={({ field }) => (
                <FieldLabel htmlFor={field.name} className="rounded-2xl">
                  <Field orientation="horizontal" className="items-center">
                    <FieldContent>
                      <FieldTitle>Réseau masqué</FieldTitle>
                      <FieldDescription>
                        Le réseau n’apparaît pas dans la liste des Wi-Fi.
                      </FieldDescription>
                    </FieldContent>
                    <Switch
                      id={field.name}
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </Field>
                </FieldLabel>
              )}
            />
          </FieldGroup>
        </CardContent>

        <CardFooter className="lg:hidden">
          <Button type="submit" size="lg" className="h-12 w-full text-base">
            Voir l’aperçu
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              data-icon="inline-end"
              className="size-5"
            />
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
