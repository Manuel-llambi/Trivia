# Component Map: H23 - Jugar las sesiones seguidas en modo rápido

## Resumen de la historia
Como administrador, quiero activar el modo rápido en una partida, para probar las 5 sesiones seguidas sin esperar un día entre cada una.

- Referencias visuales: sin referencia.
- Reglas: modo rápido (MVP, "Pruebas y métricas"): configuración que solo activa el administrador; apenas termina una sesión de 7 preguntas se revela el tema de la siguiente; el tema sigue siendo el mismo para todos; "ganar la sesión" se resuelve cuando todos la terminaron. El multiplicador de "ganar la sesión" de cada sesión queda fijo (contando los jugadores en pie) cuando el primer jugador de la partida empieza esa sesión, y es el mismo para todos. Prueba con gente real: 8 a 12 amigos en modo rápido.
- Criterios: solo un administrador activa el modo rápido; al terminar una sesión el flujo lleva a descubrir el tema de la siguiente (H6) en lugar de esperar la próxima apertura; el resto de las reglas no cambia.
- Servidor: el modo rápido y el ritmo de las sesiones son configuración del servidor.
- Experiencia: cómo se activa y cómo se indica el modo rápido: pendiente.
- Casos borde: un jugador termina antes que los demás, "ganar la sesión" queda pendiente hasta que todos terminen; una expulsión sin resolver cuando el primer jugador empieza la sesión no cambia su multiplicador y cuenta desde la sesión siguiente.
- Dependencias: H6, H17. Prioridad media.
- Nota del encargo (23/11/2026): no hay topes de apuesta (ni por pregunta ni por carta de tema); el único límite son los Pulsos disponibles del jugador.

## Referencias revisadas
- Ninguna imagen: la historia no tiene referencia visual. No se abrió ninguna pantalla de `Pantalla-UI/` ni animación como fuente de H23.
- `Trivia_DS_completo.md` — Button, StatPill/chips (significado fijo de color), Overlay, patrón de Carga y error, ProgressBar.
- `App de trivia diseño del MVP.md` — "Modo rápido (solo para pruebas)" (línea ~235), "Prueba con gente real" y decisión del 17/11 sobre el multiplicador.
- Código: `mobile/src` solo tiene tema, cliente de Supabase y pantalla provisoria. Componentes verificados contra el DS, sin implementación todavía.

## Pantallas involucradas
- Sorteo de tema (H6) — plantilla del DS: Sorteo de tema. Es el destino al terminar una sesión en modo rápido; no cambia.
- Resumen del día / fin de sesión (H17) — sin referencia; misma pantalla que H17 (base: plantilla Detalle de partida). En modo rápido, su `brand` dice "Descubrir tema" y lleva al sorteo de la siguiente sesión, en lugar de "Ver partida" (N2, PO 23/11/2026).
- Detalle de partida (H4) — plantilla del DS: Detalle de partida. Lleva el chip "MODO RÁPIDO" (PO, 23/11/2026).
- Activación del modo rápido (administrador) — sin pantalla ni plantilla en el DS.

## Componentes del DS a usar
- `TopicReel` — revelación del tema de la siguiente sesión, igual que en H6; lo decide el servidor.
- `Button` `brand` — el CTA único de cada pantalla ya existente (ej. "Jugar la sesión"); H23 no agrega botones fuertes: solo cambia el rótulo y destino del `brand` del resumen ("Descubrir tema" en lugar de "Ver partida").
- Chip de estado (`StatPill`/chips, `label` en mayúsculas, `radius-pill`) — indicación "Modo rápido" en `surface-2` (neutro, no usar `coral`, `sun` ni `brand`).
- `ProgressBar` (pasos) — los 5 pasos de la partida; en modo rápido avanzan por sesión, no por día.
- `MatchCard` y `LeaderboardRow` — sin cambios; no reciben variante de modo rápido.
- `TopicBetCard` / `ConfidenceControl` — sin cambios de diseño. Sin topes: "Otro" y las píldoras se limitan solo por Pulsos disponibles (bolsa menos reserva). El texto "Podés arriesgar hasta N pulsos" usa N = pulsos disponibles.
- `ResultCard`, `AuraClose` — sin cambios.
- Patrón de Carga y error — esqueletos `surface-2` y bloque "No pudimos conectarnos...".

## Componentes a extender
- `MatchCard` / encabezado del Detalle de partida — chip "MODO RÁPIDO", visible para todos los jugadores de la partida (PO, 23/11/2026).
- `ProgressBar` (pasos) — semántica "sesión N de 5" en lugar de "día N de 5" cuando la partida está en modo rápido (texto, no visual).
- Textos con "Abre mañana 00:00" / "Día N de 5" — en modo rápido: "Sesión N de 5" y, en lugar de "Abre…", directo el `Button` `brand` "Descubrir tema" de la sesión siguiente (PO, 23/11/2026).

## Gaps
- Control de activación del modo rápido — sin referencia; no existe en el DS (interruptor/control segmentado no está en la tabla).
  - **Resuelto (PO, 23/11/2026)**: se marca al crear la partida desde la configuración del servidor (panel de Supabase / función de administrador); sin control, botón ni `Overlay` en la app. La activación se valida en el servidor.
- Indicación de que la partida está en modo rápido — sin referencia (pendiente en la historia).
  - **Resuelto (PO, 23/11/2026)**: chip neutro `surface-2` "MODO RÁPIDO" en la `MatchCard` y en el Detalle de partida, visible para todos los jugadores de la partida. Sin rojo ni color de urgencia.
- Estados de espera: "terminé mi sesión y faltan otros" ("ganar la sesión" pendiente) — sin referencia.
  - **Resuelto (N5, PO 23/11/2026)**: reutilizar el resumen del día (H17) con la misma frase en `text-muted` que el resto de la app: "Los resultados salen cuando todos terminen."
- Orden entre ver el resumen y revelar el tema de la siguiente sesión — resuelto (N2): tras el resumen, `Button` `brand` "Descubrir tema" hacia el sorteo (H6).
- Resumen/fin de partida cuando la 5ª sesión termina antes que los demás — sin referencia (H17/H19).

## Tokens relevantes
- Colores: `surface-2` para el chip y bloques de espera; `text-muted` para líneas informativas; `brand` / `on-brand` / `lip-brand` solo en el único botón principal; `brand-text` y `danger-text` para pulsos con signo; `forest` en pasos jugados.
- Tipografía: `display` (Urbanist 800) para títulos y cifras; `body` (Nunito 600); `label` en mayúsculas para el chip; cifras tabulares.
- Espaciado y radios: `radius-pill` en chips; `tap-min` en todo elemento táctil.
- Sombras y labios: labio duro de 4 px en `Button`; botón deshabilitado `surface-2` sin labio.

## Patrones de interacción y movimiento
- Presión con labio: se hunde 4 px en los botones — Movimiento reducido: cambio instantáneo de posición.
- Transición fin de sesión a sorteo del tema: el mismo flujo de H6 sin espera; la rueda/revelación de `TopicReel` mantiene su secuencia — Movimiento reducido: revelación estática del tema (como en H6).
- `AuraClose`: el único festejo; si una sesión cruza aura, se corre una sola vez (H19/H21); bajar de aura no se anima.
- Espera a los demás jugadores: sin spinner, esqueleto `surface-2` o texto estático.

## Datos y autoridad del servidor
- Llega del servidor: bandera de modo rápido por partida y quién es administrador; sesión actual (1 a 5); tema de la sesión (sorteado por el servidor, igual para todos); multiplicador de "ganar la sesión" por sesión, fijado cuando el primer jugador empieza esa sesión; jugadores en pie en ese momento; estado "todos terminaron"; Pulsos disponibles y reservas; cronómetro de cada pregunta (20 s visibles, 22 s aceptados) y resultados.
- La app nunca calcula: quién es administrador, si el modo rápido está activo, el tema, el multiplicador de la sesión, la resolución de "ganar la sesión" ni "al menos X", Pulsos, ranking, expulsiones, cronómetro. Las vistas previas ("Si acertás", total a cobrar) usan el módulo de reglas puras con los valores del servidor; el servidor recalcula y rechaza montos inválidos (el único límite es la bolsa disponible, sin topes por pregunta ni por carta).
- La activación debe validarse en el servidor (no basta ocultar el control).

## Textos de pantalla
Los textos de H23 no están definidos, salvo los dos confirmados por el PO (N2 y N5). Provisorios, en voseo:
- "MODO RÁPIDO" (chip) y "Sesión N de 5" (PO, 23/11/2026)
- "Los resultados salen cuando todos terminen." (confirmado, N5)
- "Descubrir tema" (`brand` del resumen en modo rápido, confirmado, N2)
- Reutilizados: "Jugar la sesión", "Responder", "Siguiente pregunta", "Podés arriesgar hasta N pulsos", "Otro", "No pudimos conectarnos. Revisá tu conexión y probá de nuevo.", "Reintentar". Nunca "apuesta", "apostar" ni "monedas".

## Riesgos y dudas
- Cómo se activa y se indica el modo rápido: pendiente de PO (sin referencia).
- ¿Se activa antes de empezar la partida o también en curso?
- Quién sortea el tema si el primer jugador termina y el resto no: el servidor, pero la transición del jugador que terminó antes debe confirmarse con H6/H17.
- El multiplicador fijado por sesión puede variar entre sesiones; la tarjeta "Ganar la sesión" debe mostrar el de la sesión actual.
