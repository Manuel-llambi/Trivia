# Component Map: H17 - Ver el resumen del día al terminar la sesión

## Resumen de la historia
Como jugador, quiero ver un resumen al terminar la 7ª pregunta, para saber cuántas acerté, cómo me fue en la confianza del tema y cómo quedé.

- Referencias visuales: **sin referencia** (el MVP lista el resumen del día en "Faltan en las referencias").
- Criterios funcionales:
  - Muestra aciertos del día, resultado de "Al menos X de las 7", pulsos netos del día con signo, bolsa resultante y posición actual.
  - Si "ganar la sesión" ya se resolvió, muestra el resultado; si no, indica que está pendiente (texto sin referencia).
  - Ofrece una sola acción: `brand` "Ver partida", que lleva al Detalle de partida; en modo rápido el mismo botón dice "Descubrir tema" y lleva al sorteo (H6, H23) (resuelto por el PO, N2, 23/11/2026).
  - Si era el día 5, el resumen no lleva al fin de partida: avisa "Los resultados salen cuando todos terminen." (N5). El fin de partida (H19) llega cuando la partida se resuelve.
- Autoridad del servidor: todos los datos del resumen los calcula el servidor.
- Experiencia: netos con signo y color; sin rojo en el cero; sin festejos.
- Casos borde: menos de 2 jugadores jugaron la sesión (lo arriesgado en "ganar la sesión" se devuelve); empate en aciertos (gana quien tardó menos tiempo total).
- Dependencias: H12, H13, H14. Prioridad alta.
- Nota de producto (23/11/2026): no hay topes de apuesta, ni por pregunta ni por carta de tema; el único límite son los Pulsos disponibles. Esto no cambia el resumen, pero los netos pueden ser más grandes que antes (ver Riesgos).

## Referencias revisadas
- `Referencias-y-definiciones/Pantalla-UI/Match Detail/Ranking.png` — no es la referencia de esta pantalla (no existe). Se miró como base más cercana: tarjeta "Tu puesto" con neto con signo, `LeaderboardRow`, tono de encabezado `forest`.
- No hay animación aplicable. `cierre_light.png` no se revisó: el resumen no dispara `AuraClose` por sí mismo (ver Patrones).
- `Trivia_DS_completo.md` — secciones 1 (Sesiones con final, Voz, Aura y pulsos, Movimiento, Accesibilidad), 3 (`StatPill`/chips/pulsos, `MatchCard`, `LeaderboardRow`, `ResultCard`, `Button`, Carga y error) y 4 (plantilla Detalle de partida, Fin de partida).
- `App de trivia diseño del MVP.md` — "Flujo y pantallas" paso 6, "Economía de Pulsos" (reservas, "ganar la sesión", empates, tiempo vencido = 20 s) y "Faltan en las referencias".
- Código: `mobile/src/` solo tiene tema, tokens y una pantalla provisoria. Componentes verificados contra el DS, sin implementación todavía.

## Pantallas involucradas
- **Resumen del día** (nueva, tras la 7ª pregunta) — sin plantilla propia en el DS. Base provisoria: **Detalle de partida** (encabezado `forest`, tarjeta "Tu puesto", `LeaderboardRow`, un botón al pie).
- Destino de salida: **Detalle de partida** (plantilla del DS: Detalle de partida); en modo rápido, **Sorteo de tema** (H6).
- Origen: **Pregunta** (H12, botón "Siguiente pregunta" tras la 7ª).
- Posterior (fuera de alcance): **Fin de partida** (H19), solo cuando la partida se resuelve.
- Secuencia en una misma apertura (N3, PO 23/11/2026): resumen del día → hoja de expulsión (H18) → fin de partida (H19). Cada una cierra al Detalle de partida, salvo "Continuar" del fin de partida, que va al Inicio. Si la expulsión ocurre en medio de la sesión, no hay resumen: la hoja aparece directamente.

## Componentes del DS a usar
- `Button` `brand` — única acción de la pantalla: "Ver partida" (lleva al Detalle). En modo rápido: "Descubrir tema" (lleva al sorteo, H6). Sin botón secundario.
- Encabezado `forest` con chip "Día N de 5" (`brand-soft`) y título de la partida, como en Detalle de partida.
- Tarjeta "Tu puesto" (`surface`, `radius-lg`, `shadow-soft`) con posición ("3º") y neto **de la partida**, igual que en el Detalle (N8, PO 23/11/2026): `+N pulsos ganados` en `brand-text`, `-N pulsos perdidos` en `danger-text`, `sin cambios` en `text-muted`. Es parte de la plantilla Detalle, no un componente aparte. El neto **del día** va en la tarjeta de resumen.
- Cifras de pulsos (`StatPill`/pulsos, `d-coins--up` / `--down`) — neto por concepto (preguntas, "Al menos X", "Ganar la sesión").
- Chips de estado — "Pendiente" del resultado de "ganar la sesión": `surface-2` neutro, sin color de significado. `forest` solo si se reutiliza "Cerrada" cuando corresponda.
- `LeaderboardRow` (normal / "Vos" / primero / eliminado / no jugó) — opcional, ranking resumido con "Vos" resaltado; bolsa como cifra grande y "N aciertos" debajo del nombre.
- `ProgressBar` (variante pasos) — opcional, pasos de los 5 días con el día actual (solo si se decide mostrar el avance de la partida).
- Bloque "Carga y error" — esqueleto `surface-2` mientras llegan los datos y bloque de error con `neutral` "Reintentar" si falla.
- No se usa `AuraRing`/`AuraCounter`/`AuraClose` ni `MatchCard` dentro del resumen.

## Componentes a extender
- Ninguno confirmado. Se propone, para el PO, un componente de composición "tarjeta de resumen del día" armado con tarjeta `surface` + filas etiqueta/valor; no es componente del DS hoy (ver Gaps).

## Gaps
- **Pantalla Resumen del día completa** — sin referencia, sin plantilla (MVP "Faltan en las referencias").
  - **Resolución temporal sugerida (provisoria)**: reutilizar el layout de Detalle de partida: encabezado `forest` con el título y chip "Día N de 5"; texto "Listo por hoy" (principio "Sesiones con final"); tarjeta "Tu puesto" (neto de la partida) + tarjeta de resumen con filas: Aciertos "5 de 7", "Al menos X", "Ganar la sesión", "Neto de hoy", "Tu bolsa"; luego ranking con `LeaderboardRow` (opcional) y el `Button` `brand` "Ver partida".
- **Tarjeta/filas de desglose del día** — no existe un componente de lista de filas etiqueta + valor con signo. — no existe en el DS.
  - **Resolución temporal sugerida**: filas simples en `surface` con etiqueta `label` o `body` en `text-muted` a la izquierda y valor en `display` a la derecha con color/signo; separadores `line`.
- **Estado "pendiente" de "ganar la sesión"** — texto sin referencia.
  - **Resuelto (N5, PO 23/11/2026)**: fila con valor "Pendiente" en `text-muted` y una sola frase: "Los resultados salen cuando todos terminen." Es la misma frase del aviso del día 5 y de la espera en modo rápido (H23).
- **Aviso del día 5** — texto resuelto (N5): "Los resultados salen cuando todos terminen."; ubicación sin referencia.
  - **Resolución temporal sugerida**: bloque `surface-2` con texto en `text-muted`, sin `Overlay` (el `Overlay` no se usa para avisos permanentes) y sin rojo.
- **Resultado de "Al menos X" con X no alcanzado/alcanzado y devolución** — sin referencia de textos.
  - **Resolución temporal sugerida**: "Acertaste X de las 7" con el monto ganado, o "no llegaste a X" con el monto perdido sin culpa; con 0 pulsos arriesgados, "0 pulsos" neutro.
- **Caso "se devuelve lo arriesgado"** (menos de 2 jugaron) — sin texto.
  - **Resolución temporal sugerida**: "Jugaron menos de 2 personas: te devolvimos lo que pusiste." con valor "0 pulsos" neutro (texto provisorio).
- **Empate en aciertos/tiempo** — la historia no pide mostrarlo; el DS no define cómo.
  - **Resolución temporal sugerida**: no mostrar tiempos; solo resultado ("Ganaste la sesión" / "No ganaste la sesión").
- **Estado de error/carga de la pantalla** — la historia no lo dice: ver Riesgos y dudas.

## Tokens relevantes
- Colores: `forest` + `on-forest` (encabezado); `bg`, `surface`, `surface-2`; `text`, `text-muted`; `brand-text` (ganancias), `danger-text` (pérdidas); `brand-soft` (chip de día); `brand` + `on-brand` + `lip-brand` (botón); `sky-soft` + `edge` (fila "Vos"); `line` (separadores). Ni `coral` ni rojo para errores de conexión.
- Tipografía: `display` (Urbanist 800) para título, posición, aciertos y netos (`number-xl`/`number-md`); `body` (Nunito 600) para explicaciones; `label` para etiquetas cortas en mayúsculas. Cifras tabulares.
- Espaciado y radios: margen lateral `space-5`; `radius-lg` tarjetas, `radius-md` botón y bloques, `radius-pill` chips.
- Sombras y labios: `shadow-soft` en tarjetas; `lip-brand` y `lip-neutral` (4 px) solo en botones.

## Patrones de interacción y movimiento
- Presión con labio: el botón se hunde 4 px en 100 ms — Movimiento reducido: sin transición.
- Aparición de la pantalla: transición estándar de navegación, sin conteo animado de cifras ni destellos — Movimiento reducido: instantánea.
- Sin festejo: el resumen no usa `AuraClose` ni vibración. Si completar la sesión sube el aura a un múltiplo de 25 pulsos libres, el cierre de aura corresponde al momento en que la bolsa vuelve al contador (fin de partida, H19), no a este resumen. Bajar de aura no se anima.
- Carga: esqueleto `surface-2`, sin spinner ni cifras viejas.
- Después de la 7ª no se puede volver a la pregunta: el botón "volver" del sistema lleva al Detalle de partida, igual que "Ver partida" (N2/N3), nunca a la pregunta.

## Datos y autoridad del servidor
- Llega del servidor: aciertos del día (N de 7), resultado de "Al menos X" (X elegido, alcanzado o no, monto reservado y pago), estado de "ganar la sesión" (resuelta/pendiente, resultado, devolución por menos de 2 jugadores), pulsos netos del día con signo, bolsa resultante, posición, ranking con aciertos y bolsas, número de día (1 a 5), indicador de día 5, estado de la partida (si se resolvió).
- La app nunca calcula: pulsos netos, pagos de "Al menos X" ni de "ganar la sesión", empates (aciertos y tiempo total con pregunta vencida = 20 s), devolución por menos de 2 jugadores, bolsa, posición ni si la partida se resolvió. La app solo formatea (signo, color, singular/plural) lo que recibe.
- Mientras "ganar la sesión" esté pendiente, la bolsa y el neto del día que se muestran son los que informe el servidor; la app no debe sumarlos por su cuenta.
- Decisión del PO (23/11/2026): el neto del día **no** incluye la reserva de "ganar la sesión" pendiente. Muestra solo lo ya resuelto; la reserva se muestra aparte en su fila como "Pendiente" (`text-muted`), sin signo ni color. Cuando se resuelve, su resultado se suma al neto.

## Textos de pantalla
Del DS/MVP (confirmados):
- "Listo por hoy" (principio del DS "Sesiones con final")
- "Día 3 de 5" (formato del chip)
- "Tu puesto" / "3º"
- "+12 pulsos ganados" / "-8 pulsos perdidos" / "sin cambios" / "0 pulsos" ("1 pulso", "+1 pulso ganado", "-1 pulso perdido" en singular)
- "Vos", "N aciertos", "Pulsos" (bajo la cifra del ranking)
- "No pudimos conectarnos. Revisá tu conexión y probá de nuevo." y "Reintentar"
- "Ver ranking" (si el día cerró)
- "Los resultados salen cuando todos terminen." (estado pendiente de "ganar la sesión" y aviso del día 5; N5)

Provisorios, sin referencia (el PO debe confirmar):
- "Aciertos de hoy" / "5 de 7"
- "Acertar al menos X de las 7" (fila) / "Acertaste 5 de las 7" o "No llegaste a 5 de las 7"
- "Ganar la sesión" (fila) / "Pendiente" / "Ganaste la sesión" / "No ganaste la sesión"
- "Jugaron menos de 2 personas: te devolvimos lo que pusiste."
- "Neto de hoy", "Tu bolsa"
- Botón: "Ver partida" (`brand`); en modo rápido, "Descubrir tema" (N2)
- Nunca "apuesta", "apostar" ni "monedas"; usar "confianza" y "arriesgar".

## Riesgos y dudas
- Toda la pantalla es provisoria: sin referencia, el layout, el orden, la jerarquía y los textos están por definir por el PO.
- Error/carga: la historia no dice cómo mostrar un fallo al cargar el resumen. Se asume el patrón "Carga y error" del DS, pero es una duda abierta de consistencia entre historias.
- Aviso del día 5: la historia y el MVP lo piden, pero sin ubicación ni diseño; debe convivir con el caso en que la partida ya se resolvió (en ese caso el fin de partida H19 aparece al abrir).
- Sin topes de apuesta (23/11/2026): con montos libres hasta toda la bolsa, el neto y la bolsa pueden variar mucho en un día; el resumen no debería tener ancho fijo para las cifras y debe cuidar el tono sin culpa si el día deja la bolsa baja. No se muestran topes en ningún texto.
- Un jugador cuya bolsa total llega a 0 al resolverse "ganar la sesión" ve primero este resumen y después la hoja de expulsión (H18), en ese orden (N3).
- Empate de aciertos: no hay requisito de mostrar el desempate; se omite el tiempo total.
