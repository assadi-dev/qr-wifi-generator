# QR Code Wi-Fi

Générateur de QR code pour se connecter à un réseau Wi-Fi, avec aperçu en temps réel et export PNG.

- Bureau : aperçu à gauche, formulaire à droite.
- Mobile : formulaire en 2 étapes (1. Réseau, 2. Aperçu).

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix, style Maia) · react-hook-form · zod · qrcode

## Démarrer

```bash
npm install
npm run dev
```

Autres scripts : `npm run build`, `npm run lint`, `npm run typecheck`.

## Structure

- `src/lib/wifi.ts` : schéma zod, valeurs par défaut et construction de la chaîne `WIFI:T:…;S:…;P:…;;`
- `src/lib/qr.ts` : matrice QR, tracé SVG et export PNG (zone de silence de 4 modules, ≥ 1024 px)
- `src/components/wifi-form.tsx` : formulaire (react-hook-form + `Controller`)
- `src/components/qr-preview.tsx` : aperçu et téléchargement
- `src/components/ui/` : composants shadcn/ui

Ajouter un composant shadcn : `npx shadcn@latest add <composant>`.
