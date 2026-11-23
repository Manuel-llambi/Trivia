# Component Map: H22 - Ver que la sesión venció sin jugarla

## Resumen de la historia
Como jugador, quiero saber que no jugué la sesión a tiempo y que mi bolsa no se tocó, para entender que perdí ese día sin culpa.

- Referencias visuales: sin referencia para el estado de sesión vencida. La fila "No jugó 2 días" de `Match Detail/Ranking.png` muestra cómo lo ven los demás.
- Reglas: si no la jugás a tiempo, ese día tenés cero aciertos y no se cobra ni paga ninguna apuesta; la bolsa no se toca (MVP: Reglas de la partida, Casos borde, Flujo y pantallas / estados especiales).
- Criterios: al cerrar la ventana sin haber jugado, la partida deja de ofrecer jugar ese día; la bolsa no cambia y los aciertos del día son 0; cómo se informa: pendiente de referencia. Texto sin culpa, sin rojo.
- Servidor: cierra la ventana y registra el día perdido.
- Borde: ventana que vence con la sesión empezada aplica H16. Depende de H2. Prioridad media.
- Nota del encargo (23/11/2026): no hay topes de apuesta; el único límite son los Pulsos disponibles. No afecta a H22, porque no se arriesga nada en un día perdido.

## Referencias revisadas
- `Referencias-y-definiciones/Pantalla-UI/Match Detail/Ranking.png` — fila de Camila: avatar gris, "No jugó 2 días", 40 Pulsos atenuados, sin rojo. Encabezado "Cierra en 6 h", chip "Día 3 de 5", tarjeta "Tu puesto". Botón "Jugar la sesion" (error de tipeo, va "Jugar la sesión").
- `Referencias-y-definiciones/Pantalla-UI/Dashboard/Todas.png` — `MatchCard` jugable (chip de vencimiento, bloque gris, "Vas 2o" que va "Vas 2º") y compactas "Jugada hoy".
- No hay animación ni `cierre_light.png` involucrados.
- DS: secciones Voz y contenido, MatchCard, LeaderboardRow, plantilla Detalle de partida, patrón de carga/error/ventana que cierra. MVP: Casos borde y "Faltan en las referencias".
- Código: no hay `MatchCard`/`LeaderboardRow` en `mobile/src`. Componentes verificados contra el DS, sin implementación todavía.

## Pantallas involucradas
- Inicio (card de la partida con sesión vencida, pestaña "Todas") — plantilla del DS: Inicio.
- Detalle de partida (estado posterior al cierre, sin sesión jugada hoy) — plantilla del DS: Detalle de partida.
- Ranking de la partida (cómo ven los demás al jugador que no jugó) — misma plantilla, `LeaderboardRow`.

## Componentes del DS a usar
- `MatchCard` (estado "Cerrada", ver Gaps) — Inicio: chip "Cerrada" (`forest`), sin `brand`, `neutral` "Ver ranking". Bloque gris con bolsa sin cambios y "sin cambios" en `text-muted`.
- `Button` `neutral` "Ver ranking" — acción única de la card y del Detalle; no hay `brand` porque no hay nada para jugar.
- Detalle de partida: encabezado `forest`, botón volver (`neutral` cuadrado), chip "Día N de 5", tarjeta "Tu puesto" con el neto de la partida (N8), "sin cambios" (`text-muted`) si el día perdido es el único movimiento, control segmentado Ranking/Historial (Historial: una fila por día, ver H5).
- `LeaderboardRow` (variante "no jugó", atenuada) — avatar en grises, motivo "No jugó N días" ("No jugó 1 día" / "No jugó 2 días"), pulsos de la bolsa en `text-muted`. El motivo es el mismo en la fila propia y en la de los demás (N8, PO 23/11/2026). Tu propia fila sigue siendo `data-me` ("Vos").
- Bloque de aviso `surface-2` con texto en `text-muted` (el mismo bloque del patrón de error/cierre, pero sin botón `Reintentar`) — ver Gaps.

## Componentes a extender
- `MatchCard` — formalizar estado "Cerrada sin jugar" (hoy el DS solo define "Cerrada" como transición de ventana que cierra con el Inicio abierto). Definir la línea de texto que informa el día perdido.
- `LeaderboardRow` — combinar `data-me` (Vos) con atenuación "no jugó": el DS define atenuación solo para eliminado y ejemplo de otros jugadores; la fila propia con motivo no está especificada.

## Gaps
- Aviso de "sesión vencida" para el jugador — sin referencia (el MVP lo lista como estado especial sin imagen; la historia dice "pendiente de referencia").
  - **Texto resuelto (N5, PO 23/11/2026)**: "Esta sesión cerró sin jugarse. No se movieron pulsos." (voz de R6). **Diseño provisorio**: en la `MatchCard` cerrada y en el Detalle, un bloque `surface-2` con ese texto en `text-muted`. Sin rojo, sin ícono de alerta, sin `coral`.
- Estado "Cerrada" de la `MatchCard` cuando el jugador no jugó (versus compacta "Jugada hoy", que implica que sí jugó) — sin referencia.
  - **Resolución temporal**: chip "Cerrada" (`forest`) + `neutral` "Ver ranking", como define el DS para ventana cerrada; la compacta "Jugada hoy" NO se usa porque sería falso.
- Reflejo del día perdido en "Historial" (H5) — resuelto (PO, 23/11/2026): fila neutra "Día N · No jugaste", sin tema, aciertos ni valor.
- Ubicación en pestañas de H3 — resuelto (N4, PO 23/11/2026): "Cerrada" solo aparece en "Todas". Si el jugador además quedó fuera de la partida, la card muestra "Fuera de la partida", que tiene prioridad sobre "Cerrada".
- Feedback de error al cargar el estado: no lo define la historia; ver Riesgos. Provisoriamente el patrón DS de carga/error.

## Tokens relevantes
- Colores: chip "Cerrada" fondo `forest` con `on-forest`; texto `text-muted`; bloque `surface-2`; fila atenuada con avatar en grises; `sky-soft` + borde `edge` 2px para "Vos". Nunca `danger-text`, `coral-soft` ni `coral`. No usar `brand-text` ni signo en cifras en cero: "sin cambios" / "0 pulsos" neutros. `lip-*` solo para el `neutral` "Ver ranking" (`lip-neutral`).
- Tipografía: `display` (Urbanist 800) para bolsa 40px y título; `body` (Nunito 600) para textos; `label` para chip y "Posición"; cifras tabulares.
- Espaciado y radios: `radius-lg` y `shadow-soft` en la card; `radius-md` en el bloque gris; `tap-min` para botón y volver.
- Sombras y labios: labio de 4 px y hundimiento de 4 px en "Ver ranking".

## Patrones de interacción y movimiento
- Actualización con la pantalla abierta: la card y el Detalle se actualizan solos al cerrar la ventana (chip "Cerrada", desaparece `brand`, queda `neutral`) — Movimiento reducido: el cambio es instantáneo, sin transición alguna en ambas modalidades; no se anima.
- Presión del "Ver ranking": hundimiento con labio — Movimiento reducido: cambio instantáneo de estado.
- No hay festejo, vibración, ni animación de pérdida. Un día perdido nunca activa `AuraClose` ni animación de bajada.
- Si el jugador abre la partida con día perdido, no hay pantalla intermedia ni overlay: ve directamente la card/Detalle.

## Datos y autoridad del servidor
- Llega del servidor: estado de la ventana (cerrada), día perdido registrado, aciertos del día (0), bolsa (sin cambios), posición, aciertos de la partida, estado de cada jugador en el ranking ("no jugó N días"), día N de 5, hora de apertura siguiente.
- La app nunca calcula: cierre de ventana, que el día quedó perdido, la bolsa, los pulsos (ni que no se cobró nada), aciertos, posición ni el conteo de "días sin jugar". La app no decide por reloj local que cerró: espera el estado del servidor. Sin topes de apuesta en el cliente.

## Textos de pantalla
- "Cerrada" (chip; texto del DS)
- "Ver ranking" (botón `neutral`)
- "sin cambios" (neto, `text-muted`)
- "Día 3 de 5" (formato; N dinámico)
- "Posición" / "Vas 2º" (con `º`, corrección del "2o" de la referencia)
- "No jugó 2 días" (fila de ranking, de la referencia; también en la fila propia, N8; singular "No jugó 1 día" provisorio)
- "Pulsos" (etiqueta bajo la cifra del ranking)
- "Esta sesión cerró sin jugarse. No se movieron pulsos." (confirmado, N5)
- "Jugar la sesión" (solo aparece mientras la ventana está abierta; la referencia dice "sesion", corregido)
- Patrón de error: "No pudimos conectarnos. Revisá tu conexión y probá de nuevo." / "Reintentar"

## Riesgos y dudas
- El diseño del aviso (no su texto, ya resuelto en N5) sigue sin referencia.
- Cómo se distingue el día perdido en el Detalle del propio jugador (no hay "tu fila" con motivo en referencia).
- Si el jugador dejó de jugar varios días: "No jugó N días" a terceros; no definido si el aviso propio acumula.
- No hay aviso fuera de la app del día perdido: sin notificaciones push en el MVP (PO, 23/11/2026); el jugador lo ve al abrir la app.
- Error de red al cargar el estado: no lo define la historia; se asume provisoriamente el patrón DS de carga/error (esqueleto + bloque gris con "Reintentar"), a validar en consistencia.
- Quedarse en 0 Pulsos o la expulsión por inactividad son otros casos (hoja de expulsión, H18); no mezclar con la voz de H22.
