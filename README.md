# Trivia confianza

Product and design docs live at the repo root (see `CLAUDE.md`). The app lives in `mobile/` (Expo + TypeScript + expo-router) and the local backend in `supabase/`.

## Run locally

Requirements: Node 24+, Docker running.

```bash
# 1. Start the local Supabase stack (from the repo root)
npx supabase start
npx supabase status   # shows Project URL, Studio and the publishable key

# 2. Configure the app (first time only)
cp mobile/.env.example mobile/.env.local
# fill EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY with the values from `supabase status`

# 3. Start the app
cd mobile
npm install
npx expo start
```

Local URLs: API `http://127.0.0.1:54321`, Studio `http://127.0.0.1:54323`, Mailpit (auth emails) `http://127.0.0.1:54324`.

### Notes

- **Android emulator:** `127.0.0.1` points to the emulator itself, not your machine. Use `http://10.0.2.2:54321` in the emulator, or your machine's LAN IP when testing on a physical device.
- **Windows:** Supabase analytics requires the Docker daemon exposed on `tcp://localhost:2375`; without it the CLI prints a warning and the rest of the stack works.
- Stop the stack with `npx supabase stop`.

## Checks

```bash
cd mobile
npx tsc --noEmit
npx expo-doctor
```
