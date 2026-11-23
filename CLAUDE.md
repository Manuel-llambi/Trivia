# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Estado del proyecto

Repositorio de una app móvil de trivia (nombre provisorio "Trivia confianza"), en la transición de diseño a código. La definición de producto y diseño está completa y escrita en español rioplatense (voseo). El código es solo un esqueleto: ninguna historia está implementada todavía. Remoto: `https://github.com/Manuel-llambi/Trivia` (rama `main`).

Avance del pipeline del primer flujo: 21 historias en `docs/02-historias/historias.md` (H7 y H15 se eliminaron el 21 de noviembre de 2026 junto con el promedio global del tema y el reporte de preguntas; los números de las demás no se reasignan). Las 21 están mapeadas en `docs/03-component-maps/` (23 de noviembre de 2026). Los conflictos entre mapas N1–N8 de `_consistency-report.md` están pendientes de decisión del PO. Desde el 23 de noviembre de 2026 no hay topes de apuesta: el único límite son los Pulsos disponibles.

| Archivo / carpeta | Qué es |
| --- | --- |
| `App de trivia diseño del MVP.md` | **Fuente de verdad** de reglas de producto, economía, flujos, arquitectura y casos borde (actualizado el 17 de noviembre de 2026). Incluye la sección "Primer flujo a desarrollar: jugar una partida activa". El PDF es una exportación anterior. |
| `Trivia_DS_completo.md` | Sistema de diseño "Trivia DS Suave": principios, tokens, componentes, plantillas, tabla de contraste WCAG, notas de implementación en Expo/RN y apéndices `tokens.css` y `bundle.css` (actualizado el 17 de noviembre de 2026). |
| `PRD - Trivia confianza MVP.md` | PRD del primer flujo ("Jugar una partida activa"), derivado del MVP, las referencias y el DS. Si contradice al MVP, manda el MVP. |
| `docs/02-historias/historias.md` | Historias de usuario del primer flujo, con las decisiones de producto del 17 de noviembre de 2026 y las preguntas abiertas. Las genera el agente `historias-generator`. |
| `docs/03-component-maps/` | Un `component-map-HX.md` por historia mapeada contra el DS, más `_consistency-report.md` con las resoluciones entre historias. |
| `mobile/` | App Expo SDK 58 con Expo Router y TypeScript. Por ahora: tokens del DS en `src/theme/tokens.ts`, `theme-provider.tsx`, cliente de Supabase en `src/lib/supabase.ts` y una pantalla `src/app/index.tsx` provisoria. Leer `mobile/AGENTS.md` antes de tocar APIs de Expo. |
| `supabase/` | Proyecto de Supabase CLI: solo `config.toml`. Todavía sin migraciones ni funciones. |
| `.claude/agents/` | Pipeline de agentes: `historias-generator` → `component-mapper` × N + `consistency-checker` → `implementacion-planner`. Ver su `README.md`. |
| `Referencias-y-definiciones/Pantalla-UI/` | Pantallas de referencia del primer flujo (Dashboard, Match Detail, Topic Reel, Pregunta, Fin de partida). Mandan sobre el detalle visual. |
| `Referencias-y-definiciones/Animaciones/` | Prototipos HTML independientes de la rueda de tema, el cierre de aura y la animación de fin de partida. |
| `Inspiracion UI/` | Solo inspiración visual, no es especificación. |
| `.claude/skills/folder-to-spec/` | Skill del proyecto (`/folder-to-spec <ruta>`) que convierte una carpeta en una especificación. |

## Comandos (desde `mobile/`)

```bash
npx expo start          # servidor de desarrollo
npx expo lint           # lint
npx tsc --noEmit        # chequeo de tipos
npx expo install <pkg>  # agregar dependencias (nunca npm install directo)
```

No hay pruebas todavía. Variables de entorno en `mobile/.env.local` (ignorado por git): `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

## Antes de implementar (obligatorio)

Antes de implementar cualquier pantalla, componente o regla, leer **todo** el contenido de `Referencias-y-definiciones/` (pantallas en `Pantalla-UI/`, animaciones en `Animaciones/` e imágenes sueltas como `cierre_light.png`) y respetar las definiciones que contiene. Las imágenes se miran, no se asume su contenido por el nombre del archivo.

## Prioridad entre fuentes

1. `Referencias-y-definiciones/` manda sobre el detalle visual y los textos de cada pantalla, salvo los errores de tipeo que el DS lista en "Voz y contenido".
2. El documento del MVP manda sobre reglas de producto y economía.
3. El DS manda sobre tokens y componentes.

El MVP y el DS se alinearon con las referencias el 17 de noviembre de 2026. Si aparece una discrepancia nueva, o una pantalla del flujo no tiene referencia (el MVP las lista en "Faltan en las referencias"), señalarlo en lugar de elegir o inventar en silencio.

## Arquitectura planificada (según el documento del MVP)

- **Stack:** Expo (React Native) + TypeScript; Supabase (Postgres, autenticación con OTP de 6 dígitos por email + apodo, funciones del servidor, tareas programadas). Notificaciones push: fuera del MVP, pendientes post-MVP (23 de noviembre de 2026).
- **Economía con autoridad en el servidor.** La app nunca calcula nada que afecte Pulsos. Envía respuestas y montos; el servidor controla el cronómetro de cada pregunta (20 s visibles, 22 s aceptados), resuelve las apuestas, y registra cada movimiento en un **libro de Pulsos**. La respuesta correcta nunca llega al cliente antes de responder.
- **Motor de reglas como funciones puras** (pagos, ranking) con pruebas automáticas: es donde un error rompe la economía.
- **Todos los valores ajustables viven en configuración, no en el código:** duración de la partida, preguntas por sesión, Pulsos iniciales, costo de entrada, multiplicadores de "al menos X", factor de "ganar la sesión" (0,9 × jugadores en pie; no hay pozo común), premio mayor, cortes de emblemas, tiempo por pregunta, espera de quiebra, ritmo de las sesiones y umbral de preguntas sin ver que dispara la alerta al administrador. Todos los valores de la economía son provisorios hasta correr la simulación.
- **El competidor se modela como "participante"**, para que a futuro pueda ser un usuario o un equipo.
- **"Modo rápido" solo para administrador:** juega las 5 sesiones seguidas para pruebas.
- **Simulación de la economía** (miles de partidas con jugadores de 30/60/90% de precisión) obligatoria antes de cualquier usuario real.
- **El pipeline de preguntas está fuera de la app:** una CLI local recibe PDFs/links/texto → llama a la API de Claude → genera JSON (pregunta, 4 opciones, respuesta correcta, explicación, fuente) → revisión humana del 100% → un segundo comando carga en Supabase solo las aprobadas. En el MVP los jugadores no reportan errores desde la app.

## Esenciales del sistema de diseño

- Fuentes: Urbanist 800 (títulos y números), Nunito 600 (texto), vía `@expo-google-fonts/*`. Cifras tabulares en todo valor que cambia.
- Los nombres de tokens del DS son canónicos; replicarlos en el objeto de tema de RN, elegido según `useColorScheme()`.
- Los elementos presionables tienen un "labio" duro de 4 px (`lip-*`) y se hunden 4 px al presionar; ver la sección 6 del DS para la técnica de sombra en iOS y vista hermana en Android.
- Solo cuatro variantes de botón: `brand`, `neutral`, `ghost`, `coral`. Un color fuerte por pantalla.
- **Sin estética de casino:** sin confeti, destellos, fichas, luces ni sonidos de tragamonedas. El cierre de aura (un solo pulso de 600 ms + vibración suave) es el único festejo. Respetar el movimiento reducido.
- Ganancias y pérdidas siempre con signo y color (`+12` en `brand-text`, `-8` en `danger-text`/coral); sin rojo en el cero; textos sin culpa ("te quedaste sin pulsos").
