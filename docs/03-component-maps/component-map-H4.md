# Component Map: H4 - Ver el detalle de la partida y el ranking

## Resumen de la historia
Como jugador, quiero ver mi puesto, lo que llevo ganado y el ranking de la partida antes de jugar, para saber cómo estoy frente a los demás.

- Cada fila muestra puesto, avatar, nombre, aciertos de la partida y pulsos en la bolsa con la palabra "Pulsos" debajo.
- El 1º se destaca; mi fila dice "Vos" y se marca; quien no jugó se atenúa y muestra el motivo en lugar de los aciertos ("No jugó 2 días").
- "Jugar la sesión" aparece solo si me toca jugar y la ventana está abierta; lleva a descubrir el tema (H6).
- Volver regresa al inicio.
- Servidor: calcula ranking, posición, netos, aciertos y quién no jugó; informa la hora de cierre de la ventana.
- Experiencia: cargando y error con reintento; netos con signo y color (negativo con "-" y en rojo); jugador expulsado sin botón de jugar pero con el ranking visible; ningún dato depende solo del color.
- Casos borde: empate (1º, 2º, 2º, 4º); la ventana cierra con el detalle abierto (el botón deja de estar disponible); fila de jugador expulsado sin referencia.
- Dependencia: H2. Fuera de alcance en este mapa: H5 (contenido de Historial, ya definido en `component-map-H5.md`) y H6 (solo destino de navegación).

## Referencias revisadas
- `Referencias-y-definiciones/Pantalla-UI/Match Detail/Ranking.png` — encabezado `forest` con volver, chip "DÍA 3 DE 5", título "Trivia de los viernes", "6 jugadores · Cierra en 6 h"; tarjeta "TU PUESTO 3º" + "+24 pulsos ganados"; control segmentado Ranking/Historial; "POSICIONES ACTUALES"; 6 filas (1º con disco amarillo y fondo verde suave; "Vos" en celeste con borde; Camila atenuada en grises con "No jugó 2 días"); botón verde "Jugar la sesion" (sin tilde, error de tipeo).
- `Trivia_DS_completo.md` secciones 1, 2, 3 (`LeaderboardRow`, `StatPill`/chips, `Button`, `Overlay`), 4 (plantilla Detalle de partida) y 6.
- `App de trivia diseño del MVP.md` — primer flujo paso 2, ganador/premios, expulsión, empates, "Faltan en las referencias".
- Código: no existe implementación (sin `src/`, `app/` ni `components/`). Componentes verificados contra el DS, sin implementación todavía.

## Pantallas involucradas
- Detalle de partida (pestaña Ranking activa) — plantilla del DS: **Detalle de partida**.
- Estados de la misma pantalla: cargando, error con reintento, expulsado (sin botón), ventana cerrada (sin botón).
- Destinos de navegación (no se diseñan acá): Inicio (volver, H2) y Descubrir tema (H6, botón "Jugar la sesión").

## Componentes del DS a usar
- Encabezado `forest` (patrón de la plantilla; no es un componente nombrado): botón volver, título, subtítulo, chip.
- `Button` `neutral` cuadrado/icónico sobre `forest` (volver) — ver gap.
- Chip `brand-soft` "Día 3 de 5" (`StatPill`/chips, `label` mayúsculas, `radius-pill`).
- Tarjeta "Tu puesto" (`surface`, `radius-lg`, `shadow-soft`) con la cifra de posición en `display` `number-xl` y el neto como cifra de pulsos con signo (`d-coins--up` / `d-coins--down`).
- Control segmentado Ranking / Historial — componente compartido con el Inicio (H3) y H5 (N1, PO 23/11/2026); ver Gaps.
- `LeaderboardRow`, estados: normal (blanca), primero (`data-first`: `brand-soft` + disco `sun` con labio), "Vos" (`data-me`: `sky-soft` + borde `edge` 2px), eliminado/sin jugar (`data-out`: atenuada, avatar gris, motivo en texto).
- Avatares (disco con inicial en `display`, `avatar-md` 44px) dentro de cada fila.
- `Button` `brand` "Jugar la sesión" — único botón fuerte de la pantalla.
- Etiqueta de grupo "Posiciones actuales" (`label`, `text-muted`).

## Componentes a extender
- `LeaderboardRow` — la referencia solo ilustra "No jugó 2 días". Motivos resueltos (N8, PO 23/11/2026): "Sin pulsos" para el expulsado y "No jugó N días" para quien no jugó. Falta definir si la prop de motivo es texto libre del servidor o enumerado. Soportar puesto compartido (mostrar el mismo número en filas empatadas).
- `LeaderboardRow` — el disco `sun` del 1º aplica solo al primer puesto; con empate en el 1º, los empatados comparten el destaque (el MVP divide el premio entre empatados).

## Gaps
- Control segmentado (Ranking/Historial) — no existe como componente en el DS (solo descrito en plantillas).
  - **Resuelto (N1, PO 23/11/2026)**: un único componente compartido con el Inicio (H3) y H5: pista `surface-2` `radius-pill`; segmento activo `surface` con `shadow-soft`; texto `display` 800 (`text` en el activo, `text-muted` en los inactivos); alto mínimo `tap-min`; rol tab con `accessibilityState.selected`; sin labio ni color fuerte.
- Pestaña Historial (contenido) — sin referencia; es H5.
  - **Resuelto (N1; contenido, PO 23/11/2026)**: el control segmentado se muestra. El contenido de la pestaña Historial está definido en `component-map-H5.md`: una fila de resumen por día ya jugado ("Día 2 · Historia · 5 de 7 aciertos · +12"), con las filas etiqueta/valor de H17; el estado vacío neutro "Todavía no hay días anteriores" queda solo para cuando no hay días.
- Botón volver sobre `forest` — el DS tiene solo 4 variantes de `Button`; la referencia muestra un botón circular translúcido sobre `forest` — no existe en el DS.
  - **Resolución temporal sugerida**: `Button` `neutral` (o `ghost`) cuadrado/circular con ícono flecha, 52px mínimo; la referencia usa 44px aprox. y tiene fondo translúcido, no ajustarlo en silencio.
- Fila de jugador expulsado — sin referencia (la propia historia lo marca como duda para el PO).
  - **Resuelto (N8, PO 23/11/2026)**: `data-out` (atenuada, avatar en grises) con motivo "Sin pulsos", sin rojo y sin culpa; pulsos mostrados en neutro.
- Estados cargando y error con reintento — sin referencia ni patrón en el DS.
  - **Resolución temporal sugerida**: cargando con placeholders de `surface-2` en la forma de las filas; error con texto sin culpa y un `Button` `neutral` "Reintentar". Marcado como duda; no elegir patrón definitivo.
- Tarjeta "Tu puesto" cuando el jugador está expulsado o aún no tiene puesto — sin referencia.
  - **Resolución temporal sugerida**: mantener la tarjeta con el puesto congelado y el neto de la partida (N8: "Tu puesto" siempre muestra el neto de la partida), en neutro si es 0.
- Subtítulo "Cierra en 6 h" cuando la ventana ya cerró o quedan minutos — sin referencia del formato (horas/minutos/cerrada).
  - **Resolución temporal sugerida**: "Cerrada" o similar sin urgencia en rojo; formato a definir.
- Ranking con muchos jugadores (scroll) y posición propia fuera de pantalla — sin referencia (la referencia muestra 6 filas).
  - **Resolución temporal sugerida**: lista scrolleable con el botón "Jugar la sesión" fijo al pie; marcar como duda.

## Tokens relevantes
- Colores: `forest` / `on-forest` / `on-forest-muted` (encabezado); `brand-soft` + `text` (chip y 1º); `brand-text` y `danger-text` (neto con signo); `sky-soft` + `edge` (fila "Vos"); `sun`, `sun-deep`, `on-sun` (disco del 1º); `surface`, `surface-2`, `bg`, `text`, `text-muted`; `brand`, `on-brand`, `brand-deep` (botón principal); avatares sobre `brand`, `sky`, `coral`, `sun`, `violet` con sus `on-*`; `focus-ring`.
- Tipografía: `display-lg` (título), `number-xl` (posición 3º), `number-md` / `display` 26px tabulares (pulsos de cada fila), `heading` (nombres), `body-sm` (aciertos, "Pulsos", "6 jugadores · Cierra en 6 h"), `label` (chip, "TU PUESTO", "POSICIONES ACTUALES"). Cifras tabulares en puesto, neto, aciertos y pulsos.
- Espaciado y radios: margen lateral `space-5`; separación entre bloques `space-6`; relleno de tarjetas `space-4`; `radius-lg` (tarjeta y filas), `radius-pill` (chip, avatares), `radius-md` (botón); `avatar-md`, `tap-min`.
- Sombras y labios: `shadow-soft` (tarjeta de puesto); `lip-brand` (botón); `lip-sun` (disco del 1º); las filas no se presionan, no llevan labio.

## Patrones de interacción y movimiento
- Presión con labio: solo el botón "Jugar la sesión" (se hunde 4px en 100 ms) y el botón volver. Movimiento reducido: sin transición, cambio instantáneo.
- Cambio de pestaña Ranking/Historial: sin animación definida; cambio instantáneo. Movimiento reducido: igual.
- Actualización del ranking mientras la pantalla está abierta: el MVP dice que se actualiza cuando cada jugador termina su sesión; no definir animación de reordenamiento (no hay referencia). Actualizar sin animación.
- La ventana cierra mientras se mira: el botón "Jugar la sesión" desaparece sin transición y sin aviso en rojo.
- Sin festejo: ningún `AuraClose` aquí; no confeti ni destellos para el 1º.
- Foco: anillo de 3px en `focus-ring` en botón y pestañas.

## Datos y autoridad del servidor
- Llega del servidor: título de la partida; día actual (N de 5); cantidad de jugadores; hora de cierre de la ventana; puesto propio (con empates resueltos); neto propio; por cada jugador: puesto, nombre, avatar/inicial y color, aciertos de la partida, pulsos en la bolsa, estado (normal / no jugó N días / expulsado) y motivo; bandera de "me toca jugar" y "ventana abierta" (o ambas derivables); si el jugador está expulsado.
- La app nunca calcula: ranking, posiciones ni empates, netos, aciertos, quién no jugó, ni si la ventana está abierta (solo muestra el estado y la cuenta regresiva que informa el servidor). Tampoco recalcula pulsos.

## Textos de pantalla
- "Día 3 de 5" (chip; dinámico)
- "Trivia de los viernes" (título; dinámico)
- "6 jugadores · Cierra en 6 h" (dinámico)
- "Tu puesto" (etiqueta; en la referencia mayúsculas por `label`)
- "3º" (dinámico; con `º`)
- "+24 pulsos ganados" (dinámico; con signo; negativo "-N pulsos ganados" no tiene texto definido, ver dudas)
- "Ranking" / "Historial"
- "Posiciones actuales"
- "Vos"
- "17 aciertos" (dinámico)
- "Pulsos" (bajo cada cifra)
- "No jugó 2 días" (dinámico)
- "Jugar la sesión" (corrección: la referencia dice "Jugar la sesion")

## Riesgos y dudas
- **Texto del neto negativo**: "+24 pulsos ganados" no sirve con signo "-"; la historia exige "-" y rojo pero no define la etiqueta ("-8 pulsos perdidos"? "-8 pulsos"?). Necesita decisión del PO, sin culpa en el texto. Esta es la duda más importante.
- Fila de jugador expulsado sin referencia (la historia lo reconoce): se usó la resolución provisoria con `data-out` y texto neutro.
- Estados cargando y error con reintento sin patrón del DS; es un punto típico de inconsistencia entre historias, definir uno común.
- Botón volver: forma y color de la referencia no coinciden con las 4 variantes de `Button`.
- La referencia muestra el disco "1" del primero y "3" de "Vos" con avatar con anillo blanco; el DS no especifica ese anillo, tomado de la imagen.
- En la referencia, fila 6 muestra 40 pulsos con 6 jugadores: coherente con que el ranking es por bolsa; no hay conflicto, pero conviene confirmar que los aciertos no desempatan el puesto (el MVP dice que no).
- Posición de "Jugar la sesión" (fijo al pie vs. al final de la lista) no queda clara con muchos jugadores; la referencia no tiene scroll.
