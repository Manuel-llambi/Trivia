# Component Map: H18 - Quedar fuera de la partida cuando la bolsa llega a cero

## Resumen de la historia
Como jugador, quiero entender qué pasó y qué sigue cuando me quedo sin pulsos en una partida, para reflexionar sobre cuánto arriesgué y seguir jugando mis otras partidas.

Criterios funcionales:
- Después del resultado de la pregunta que deja la bolsa total en 0, aparece la hoja de expulsión; la sesión termina para ese jugador y no ve más preguntas.
- Si la bolsa total llega a 0 después de la sesión (al resolverse "ganar la sesión"), la hoja aparece la próxima vez que abre esa partida (sin notificaciones push en el MVP).
- Con 0 pulsos disponibles y pulsos reservados en el tema no aparece la hoja: sigue la sesión con monto 0.
- La card del inicio pasa a "Fuera de la partida" con 0, "sin pulsos", la posición final y "Ver ranking".
- En el detalle sigue viendo el ranking y no tiene botón para jugar.

Criterios de experiencia: texto sin culpa, siempre hay una acción posible, sin rojo en el 0.
Casos borde: expulsión en partida de 2 (el otro gana sin premio); bolsa en 0 al resolverse "ganar la sesión" después de la sesión; 0 libres sin partidas activas activa la quiebra total (fuera de este flujo).
Decisión pendiente en el MVP: textos de la reflexión tras la expulsión. Depende de H2, H13.

## Referencias revisadas
- `Referencias-y-definiciones/Pantalla-UI/Dashboard/Todas.png` — estructura de la `MatchCard` (chip, "Día N de 5", título, avatares, bloque gris sin aro, "Posición", botón). No hay imagen del estado "Fuera de la partida"; ese estado sale del DS y del MVP.
- `Referencias-y-definiciones/Pantalla-UI/Match Detail/Ranking.png` — Detalle de partida: tarjeta "Tu puesto", ranking, fila atenuada (Camila, "No jugó 2 días") como patrón de fila atenuada. El botón "Jugar la sesión" de la imagen no va para el expulsado.
- `Trivia_DS_completo.md` — `MatchCard` (fila "Fuera de la partida" y nota de tono neutro), `LeaderboardRow` (`data-out`), `Overlay`, "Carga y error", plantillas Detalle de partida y Pregunta, Voz y contenido.
- `App de trivia diseño del MVP.md` — Economía de Pulsos, Expulsión; "Cuando te expulsan"; casos borde; decisión pendiente de textos de reflexión.
- No hay referencia visual de la hoja de expulsión. Animaciones y `cierre_light.png` no aplican: no hay festejo ni animación al perder o bajar de aura.
- Código: sin implementación (`mobile/src` solo tiene tokens, tema, cliente de Supabase y una pantalla provisoria). Componentes verificados contra el DS, sin implementación todavía.

## Pantallas involucradas
- Pregunta (justo después del `ResultCard` de la pregunta que vacía la bolsa) — plantilla del DS: Pregunta.
- Hoja de expulsión (sobre la pantalla donde se dispara: Pregunta o Detalle de partida al abrir) — sin plantilla; ver Gaps.
- Inicio (card en estado "Fuera de la partida") — plantilla: Inicio.
- Detalle de partida (ranking sin botón de jugar) — plantilla: Detalle de partida.
- Entrada a la hoja tras una expulsión al resolverse "ganar la sesión": solo al abrir esa partida (Detalle de partida con la hoja encima). Sin notificaciones push en el MVP (PO, 23/11/2026).
- Secuencia en una misma apertura (N3, PO 23/11/2026): resumen del día (H17) → hoja de expulsión → fin de partida (H19). Cada una cierra al Detalle de partida, salvo "Continuar" del fin de partida, que va al Inicio. Si la expulsión ocurre en medio de la sesión no hay resumen: la hoja aparece directamente. El expulsado también ve el fin de partida cuando la partida se resuelve.

## Componentes del DS a usar
- `MatchCard` (estado "Fuera de la partida") — Inicio, solo en la pestaña "Todas" (N4): chip gris "Fuera de la partida", `0` en `display` 40px, "sin pulsos" en `text-muted`, "Posición" con "Quedaste 4º" y `Button` `neutral` "Ver ranking". Textos en `text-muted`, sin rojo. Sin `AuraRing`.
- `Button` `neutral` — "Ver ranking" en la card.
- `Overlay` (adaptado, provisorio) — contenedor de la hoja de expulsión; ver Gaps.
- `Button` `neutral` — acción única de la hoja ("Ver ranking"). Sin `brand` ni `coral`.
- Detalle de partida: encabezado `forest` con botón volver `neutral` cuadrado, chip de día, título, tarjeta "Tu puesto" con resultado en `text-muted` o signo y color según corresponda, control segmentado Ranking/Historial, `LeaderboardRow`. La fila propia ("Vos") va en estado `data-out` (atenuada, avatar en grises, motivo en texto).
- `ResultCard` — se ve primero con el resultado de la pregunta que vacía la bolsa (`-N pulsos` en `danger-text`, signo y palabra); luego aparece la hoja.
- `ProgressBar` (pasos de los días) — no se usa en la hoja.
- "Carga y error" (patrón) — error de red al pedir el estado o los datos de reflexión: bloque `surface-2` "No pudimos conectarnos. Revisá tu conexión y probá de nuevo." con `neutral` "Reintentar". Es el patrón único del DS, no hay que elegir otro.

## Componentes a extender
- `LeaderboardRow` — el DS define `data-out` con "motivo en texto" pero no fija el texto para un expulsado. Motivo resuelto (N8, PO 23/11/2026): "Sin pulsos". Aplicar también a la fila "Vos" expulsada, manteniendo el borde `edge` de "Vos" o solo la atenuación (a decidir).
- `Overlay` — hoy cubre decisiones cortas y ayuda y está definido como "aviso" para una decisión corta. La hoja de expulsión necesita un tercer tipo de contenido (título, párrafo "qué pasó", lista "qué sigue", bloque de reflexión, un botón). Es una extensión de contenido, no una variante de botón.
- `MatchCard` — sin cambios de estructura; solo se confirma el chip gris "Fuera de la partida" (el DS lo describe en texto, no hay imagen). "Fuera de la partida" tiene prioridad sobre "Cerrada": si la ventana vence para un expulsado, la card sigue en "Fuera de la partida" (N4).

## Gaps
- Hoja de expulsión con reflexión — sin referencia (MVP: "decisión pendiente", textos pendientes) / no existe como componente en el DS.
  - **Resuelto (PO, 23/11/2026)**: usar `Overlay` con el velo y la tarjeta `surface` (`radius-lg`, `shadow-float`), título en `display`, tres bloques de texto en `body` y un solo `Button` `neutral` "Ver ranking". Tocar el velo la cierra (equivale a cancelar) y deja al jugador en el Detalle de partida. Sin rojo, sin íconos de alarma, sin animación.
- Textos de la reflexión — pendientes en el MVP.
  - **Resolución temporal sugerida**: usar solo los textos que cita el MVP ("Te quedaste sin pulsos en esta partida", "Tus 3 preguntas de mayor riesgo sumaron el 80% de tu bolsa") y las tres líneas de "qué sigue" derivadas del MVP; marcarlos como provisorios hasta que el PO los cierre.
- Estado "Fuera de la partida" de `MatchCard` y de `LeaderboardRow` — sin imagen de referencia (el MVP lista la imagen anterior como eliminada por desactualizada).
  - **Resolución temporal sugerida**: seguir la descripción textual del DS.
- Ranking de la partida cuando termina por quedar un solo jugador en pie — la pantalla de fin de partida corresponde a H19; fuera del alcance de esta historia salvo el caso borde.
- Feedback de error al cargar la hoja — la historia no lo dice; ver Riesgos y dudas.

## Tokens relevantes
- Colores: `forest` y `on-forest` (encabezado del Detalle); `surface`, `surface-2` (bloque gris de la card, bloque de reflexión provisorio), `line`, `text`, `text-muted` (todo el estado de expulsión), `brand-soft`/`sky-soft` solo en filas del ranking que no cambian. `danger-text` y `coral-soft` solo en el `ResultCard` de error de la pregunta previa, nunca en el 0, el chip ni la hoja. `lip-neutral` para el botón.
- Tipografía: `display` (Urbanist 800) para título de la hoja y el `0` grande de la card (40px, cifras tabulares); `body` (Nunito 600) para los párrafos; `label` en mayúsculas para etiquetas de la card ("Posición").
- Espaciado y radios: margen lateral `space-5`; `radius-lg` en `Overlay` y `MatchCard`; `radius-md` en el bloque gris y el botón; `tap-min` 52px en el botón y filas táctiles.
- Sombras y labios: `shadow-soft` en la card, `shadow-float` en la hoja, `lip-neutral` en el botón (labio duro de 4px, se hunde 4px al presionar).

## Patrones de interacción y movimiento
- Aparición de la hoja: cuando el jugador toca "Siguiente pregunta" (o directamente tras el resultado) después del `ResultCard` que vacía la bolsa, sin pasar por el resumen del día (N3); no interrumpe la lectura del resultado ni su explicación. Aparece con fundido breve del velo — Movimiento reducido: aparece instantánea.
- Presión con labio en el botón `neutral` (hunde 4 px) — Movimiento reducido: sin transición.
- Sin festejo ni animación en la pérdida: no hay `AuraClose`, ni vibración, ni sonido. Bajar de aura no se anima.
- Cierre de la hoja: el botón o el velo llevan al Detalle de partida (ranking); no hay forma de volver a la sesión.
- Re-apertura: la hoja se muestra una vez al abrir la partida y no se vuelve a abrir sola; después queda solo el estado de la card y de la fila. Falta fijar cuándo se marca como vista (en el servidor).
- Card en Inicio: se actualiza sola cuando el servidor informa la expulsión.
- Accesibilidad: la hoja recibe foco y se anuncia con su título; lectores de pantalla leen el bloque "qué pasó, qué sigue, reflexión" en orden. `accessibilityLabel` de la card con resultado, bolsa y posición ("Fuera de la partida, 0 pulsos, quedaste 4º"). Nada depende solo del color.

## Datos y autoridad del servidor
- Llega del servidor: bandera de expulsión y momento (durante la sesión o al resolverse "ganar la sesión"); bolsa total final (0); posición final con empate; estado de la partida (si terminó por un solo jugador en pie); datos de la reflexión ya calculados (porcentaje de la bolsa arriesgada y cantidad de preguntas, o equivalente); si la hoja ya fue vista; jugadores y ranking congelado.
- La app nunca calcula: la bolsa total ni la expulsión (la evalúa el servidor sobre la bolsa total una vez resueltas las reservas), la reflexión (porcentaje arriesgado y cantidad de preguntas), la posición final, el fin de la partida cuando queda un solo jugador, ni si "0 disponibles con reservas" es expulsión. Desde el 23/11/2026 no hay topes de apuesta por pregunta ni por carta de tema; el único límite es el de pulsos disponibles. La reflexión por eso puede mostrar porcentajes altos y no hay que explicar topes.

## Textos de pantalla
Card y detalle (DS):
- "Fuera de la partida" (chip gris)
- "0"
- "sin pulsos"
- "Posición"
- "Quedaste 4º" (con `º`; no "4o")
- "Ver ranking"
- Fila propia en el ranking: "Vos"; motivo del eliminado: "Sin pulsos" (N8)

Hoja de expulsión (citados por el MVP):
- "Te quedaste sin pulsos en esta partida"
- "Tus 3 preguntas de mayor riesgo sumaron el 80% de tu bolsa" (cifras dinámicas del servidor)

Hoja de expulsión (provisorios, derivados del MVP; pendientes de PO):
- Qué sigue: "Seguís viendo el ranking.", "No jugás los días que faltan." y "Tus otras partidas siguen."
- Botón: "Ver ranking"

Palabras que no deben aparecer: "apuesta", "apostar", "monedas", "perdiste todo". Usar "arriesgar" y "pulsos".

## Riesgos y dudas
- Los textos de la reflexión están pendientes en el MVP; todo lo marcado provisorio debe validarse.
- La hoja de expulsión no tiene referencia visual. Decisión del PO (23/11/2026): va en `Overlay` como aviso informativo, sin componente propio; el DS ya incluye este uso.
- Feedback de error al cargar la hoja o al abrir la partida: la historia no lo dice. El DS tiene el patrón "Carga y error", propuesto como opción; confirmar para mantener consistencia entre historias.
- Momento exacto de la hoja durante la sesión: ya está fijado que va directamente, sin resumen del día (N3); falta decidir si aparece sola tras el resultado o al tocar "Siguiente pregunta".
- Cuántas veces se muestra la hoja (una vez, y si el jugador cierra la app antes de verla) y cuándo se marca como vista.
- El DS menciona el 0 sin rojo; la pérdida de la pregunta previa sí lleva `danger-text` en el `ResultCard`. Confirmar que ese contraste es intencional.
- Quiebra total (0 libres y sin partidas activas) queda fuera de este flujo.
