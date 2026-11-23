# Component Map: H5 - Consultar el historial de la partida

## Resumen de la historia
- **Descripción**: Como jugador, quiero ver la pestaña Historial del detalle de la partida, para revisar lo que pasó en los días anteriores.
- **Referencias visuales**: sin referencia (contenido de la pestaña *Historial*). El contenido está definido en texto (PO, 23/11/2026).
- **Reglas de producto**: Flujo y pantallas, paso 2 (pestañas *Ranking* e *Historial*); "Faltan en las referencias: el contenido de la pestaña Historial" (contenido ya definido, sigue sin referencia visual).
- **Criterios de aceptación**: la pestaña *Historial* existe en el control segmentado del detalle; muestra una fila de resumen por día ya jugado, del más reciente al más viejo: "Día 2 · Historia · 5 de 7 aciertos · +12" (número de día, tema del día, aciertos de 7 y neto del día en pulsos con signo y color). Un día que el jugador no jugó dice "Día N · No jugaste". Las filas no se tocan en el MVP.
- **Autoridad del servidor**: todo el contenido sale del servidor y del libro de Pulsos.
- **Casos borde**: día 1 / sin días anteriores: estado vacío neutro "Todavía no hay días anteriores"; neto del día con "ganar la sesión" pendiente (no incluye la reserva); tras una expulsión, la lista termina en "Día N · Te quedaste sin pulsos".
- **Dependencias**: H4 (y la decisión de H17 sobre el neto del día). **Prioridad**: baja.
- Nota de contexto (23/11/2026): ya no hay topes de apuesta (ni por pregunta ni por carta de tema); el único límite son los Pulsos disponibles. El Historial no muestra montos arriesgados, así que no afecta.

## Referencias revisadas
- `Referencias-y-definiciones/Pantalla-UI/Match Detail/Ranking.png` — única referencia del Detalle de partida: encabezado `forest` con volver, chip "DÍA 3 DE 5", tarjeta "Tu puesto 3º", control segmentado "Ranking" / "Historial" (pestaña activa en blanco `surface` sobre pista `surface-2`; "Historial" inactiva en `text-muted`), etiqueta "POSICIONES ACTUALES" y filas de ranking. Solo muestra la pestaña Ranking; **no hay imagen de Historial**. Texto "Jugar la sesion" con error de tipeo.
- `Trivia_DS_completo.md` — secciones de plantillas (Detalle de partida), "Voz y contenido", "Carga y error", color, tokens.
- `App de trivia diseño del MVP.md` — línea de flujo paso 2 y "Faltan en las referencias".
- `docs/03-component-maps/component-map-H17.md` — filas etiqueta/valor del resumen del día y decisión del neto con "ganar la sesión" pendiente.
- `docs/03-component-maps/component-map-H22.md` — día no jugado ("No jugó N días").
- Animaciones y `cierre_light.png`: no aplican a esta historia.
- Código: `mobile/src` no tiene ningún `Historial` ni control segmentado. Componentes verificados contra el DS, sin implementación todavía.

## Pantallas involucradas
- Detalle de la partida, pestaña *Historial* — plantilla del DS: **Detalle de partida** (el DS solo define la pestaña Ranking).

## Componentes del DS a usar
- Encabezado `forest`, botón volver (`Button` `neutral` cuadrado, `accessibilityLabel` "Volver"), chip "Día N de 5" (`brand-soft`), tarjeta "Tu puesto": se mantienen idénticos a H4, no cambian al cambiar de pestaña.
- `Button` `brand` "Jugar la sesión": sigue siendo el único botón fuerte de la pantalla, si le toca jugar al jugador (decisión de H4).
- Filas etiqueta/valor del resumen del día (H17): se reutilizan tal cual dentro de una tarjeta `surface` (`radius-lg`, `shadow-soft`), una fila por día, separadas con `line`. Etiqueta a la izquierda ("Día 2 · Historia" y "5 de 7 aciertos") en `body` / `text-muted`; valor a la derecha (neto del día) en `display` con cifras tabulares. **Sin componente nuevo.**
- Estado vacío: bloque `surface-2` (`radius-lg`) con "Todavía no hay días anteriores" en `text-muted`.
- Patrón "Carga y error" (esqueletos `surface-2` sin spinner; bloque `surface-2` con `Button` `neutral` "Reintentar", sin rojo) para carga y falla de red del historial.

## Componentes a extender
- Ninguno. El Historial reutiliza las filas etiqueta/valor de H17 (Resuelto, PO 23/11/2026).

## Gaps
- **Contenido de la pestaña Historial** — sin referencia visual (listado en "Faltan en las referencias" del MVP).
  - **Resuelto (PO, 23/11/2026)**: una fila de resumen por día ya jugado, del más reciente al más viejo: "Día 2 · Historia · 5 de 7 aciertos · +12". Neto del día: `+N` en `brand-text`, `-N` en `danger-text`, `0` en `text-muted` sin signo. Mismas filas etiqueta/valor que el resumen del día (H17). Las filas no son tocables en el MVP; no se muestran respuestas correctas ni explicaciones.
- **Día no jugado** — sin referencia.
  - **Resuelto (PO, 23/11/2026)**: fila neutra "Día N · No jugaste" en `text-muted`, sin tema, sin aciertos y sin valor. Coherente con H22 ("No jugó N días").
- **Neto del día con "ganar la sesión" pendiente** — sin referencia.
  - **Resuelto (PO, 23/11/2026, coherente con H17)**: el neto del día no incluye la reserva pendiente de "ganar la sesión"; la reserva se indica aparte como "Pendiente" en `text-muted`, sin signo ni color. Cuando se resuelve, su resultado se suma al neto que informa el servidor.
- **Control segmentado "Ranking / Historial"** — no existe como componente en el DS (solo descrito en plantillas).
  - **Resuelto (N1, PO 23/11/2026)**: un único componente compartido con H3 y H4: pista `surface-2` `radius-pill`; segmento activo `surface` con `shadow-soft`; texto `display` 800 (`text` en el activo, `text-muted` en los inactivos); alto mínimo `tap-min`; rol tab con `accessibilityState.selected`; sin labio ni color fuerte. Cada segmento con `accessibilityRole="tab"`. No crear variante de `Button`.
- **Estado vacío del día 1** — sin referencia.
  - **Resuelto (PO, 23/11/2026)**: bloque `surface-2` neutro con "Todavía no hay días anteriores", sin inventar filas ni datos.
- **Feedback de error de red** — el DS define "Carga y error", el patrón único de la app (R1 del reporte de consistencia); se aplica sin cambios.

## Tokens relevantes
- Colores: `bg`, `surface` (tarjeta de filas), `surface-2` (pista del segmentado, esqueletos, estado vacío), `text`, `text-muted` (etiquetas, "No jugaste", "Pendiente", neto 0), `forest` + `on-forest` (encabezado), `brand-soft` (chip del día), `brand-text` (neto positivo), `danger-text` (neto negativo), `line` (separadores entre filas), `edge`.
- Tipografía: neto en `display` (Urbanist 800) con cifras tabulares; etiquetas en `body` (Nunito 600).
- Espaciado y radios: margen lateral `space-5`, `tap-min` 52px en cada segmento, `radius-lg` en la tarjeta de filas y el estado vacío, `radius-pill` en chips.
- Sombras y labios: el segmentado y las filas no llevan labio de 4px (no son presionables); el segmento activo y la tarjeta usan `shadow-soft`.

## Patrones de interacción y movimiento
- Cambio de pestaña Ranking/Historial: sin animación definida; cambio instantáneo — Movimiento reducido: igual.
- Filas no tocables en el MVP: sin estado presionado, sin chevron, sin `accessibilityRole="button"`. Cada fila se lee como un solo elemento de texto (`accessible` con la frase completa, ej. "Día 2, Historia, 5 de 7 aciertos, más 12 pulsos").
- Carga: esqueletos `surface-2` sin spinner — Movimiento reducido: sin pulso animado, estáticos.
- Sin celebración ni animación de pulsos en el historial (el único festejo es `AuraClose`).

## Datos y autoridad del servidor
- Llega del servidor, por cada día: número de día, tema del día, si el jugador jugó, aciertos (N de 7), neto del día en pulsos desde el libro de Pulsos (sin la reserva pendiente de "ganar la sesión") y si "ganar la sesión" sigue pendiente. El servidor entrega la lista ya ordenada, del día más reciente al más viejo.
- "Día ya jugado" incluye los días cerrados y el día actual si el jugador ya terminó su sesión: es el único caso en que "ganar la sesión" puede seguir pendiente (se resuelve, a más tardar, al cerrar la ventana del día). El día actual sin jugar no se lista. El estado vacío aparece cuando no hay ninguna fila (día 1 antes de jugar).
- La app nunca calcula: netos por día, aciertos, ni el estado de "ganar la sesión"; no suma la reserva pendiente al neto. Solo formatea (signo, color, singular/plural) lo que recibe.
- No se envían respuestas correctas ni explicaciones de días anteriores en el MVP.

## Textos de pantalla
- "Ranking" / "Historial" (pestañas del segmentado, de la referencia)
- "Jugar la sesión" (corregido de "Jugar la sesion", sin tilde en la referencia)
- "Día 2 · Historia · 5 de 7 aciertos · +12" (formato de fila; PO, 23/11/2026). Neto: "+12" / "-8" / "0".
- "Día N · No jugaste" (día no jugado; PO, 23/11/2026)
- "Pendiente" (reserva de "ganar la sesión" sin resolver; mismo texto que H17)
- "Todavía no hay días anteriores" (estado vacío; PO, 23/11/2026)
- "No pudimos conectarnos. Revisá tu conexión y probá de nuevo." y "Reintentar" (de "Carga y error" del DS)

## Riesgos y dudas
- Dónde va "Pendiente" dentro de la fila: se sugiere una segunda línea "Ganar la sesión · Pendiente" en `text-muted` bajo la etiqueta, sin tocar el neto. Sin referencia visual; confirmar en implementación.
- Día actual ya jugado (PO, 23/11/2026): entra en la lista apenas el jugador termina su sesión; en el día 1, después de jugar, se ve la fila "Día 1" en lugar del vacío.
- Expulsión (PO, 23/11/2026): la lista termina en el día de la expulsión, con la fila neutra "Día N · Te quedaste sin pulsos" (`text-muted`, sin valor ni color); los días siguientes no se listan.
