# Component Map: H10 - Confirmar la confianza en el tema y empezar la sesión

## Resumen de la historia
Como jugador, quiero ver cuántos pulsos me quedan disponibles después de la confianza en el tema y confirmar con "Jugar la sesión", para empezar las preguntas sabiendo lo que tengo en juego.

- No hay resumen aparte del total arriesgado: el chip de pulsos disponibles ya descuenta lo guardado en las dos tarjetas (H8). La reserva real ocurre al tocar "Jugar la sesión".
- "Jugar la sesión" envía los montos de tema al servidor y, con su confirmación, lleva a la primera pregunta (H11).
- Después de confirmar, los montos de tema no se pueden cambiar y quedan reservados de la bolsa; los pulsos disponibles en las preguntas son la bolsa menos esa reserva.
- Si no se arriesgó nada, "Jugar la sesión" igual arranca la sesión.
- Servidor: valida los montos contra la bolsa, los reserva, los registra en el libro de Pulsos, abre la sesión e inicia el cronómetro de la primera pregunta.
- Experiencia: mientras se envía, el botón queda deshabilitado (evita doble envío). Error al confirmar: la sesión no empieza, se conservan los montos y hay acción para reintentar, con texto sin culpa.
- Casos borde: total mayor que la bolsa (el servidor rechaza); ventana vencida entre la revelación y el toque (el servidor no abre la sesión; ver H22, fuera de alcance en esta corrida); doble toque o reintento (el servidor no registra dos veces los mismos montos).
- Dependencias: H8, H9. Prioridad: alta.

Nota de alcance: H22 y H17 no están disponibles todavía. El caso "ventana vencida" queda como gap/duda; la pantalla de fin de sesión no entra en esta historia.

## Referencias revisadas
- `Referencias-y-definiciones/Pantalla-UI/Topic Reel/Default.png` — pantalla con tema revelado ("Geografía"), chip "62 PULSOS DISPONIBLES", dos `TopicBetCard` cerradas con "SIN PULSOS" y botón `brand` "Jugar la sesión" anclado abajo, con espacio vacío entre las tarjetas y el botón. Los textos tienen errores de tipeo (sin tildes ni signos de apertura) que no se copian.
- `Referencias-y-definiciones/Pantalla-UI/Topic Reel/Al menos X expanded.png` — tarjeta "Acertar al menos X de las 7" abierta (píldoras de X y de monto, celda "SI ACERTÁS 6 · (×4)", "Guardar") y botón "Jugar la sesión" debajo de las tarjetas. El selector de X muestra del 1 al 7; el DS fija solo 4, 5, 6 y 7. Chips de las tarjetas en `brand-soft` ("5 PULSOS") en esta imagen.
- `Trivia_DS_completo.md` — secciones 1 (voz, color, movimiento, accesibilidad), 2 (tokens), 3 (`Button`, `TopicBetCard`, `ConfidenceControl`, `TopicReel`), 4 (plantilla Sorteo de tema) y 6 (Expo / RN).
- `App de trivia diseño del MVP.md` — "Flujo y pantallas" pasos 4 y 5 y "Primer flujo a desarrollar" paso 4 (vía el resumen de la historia) y la lista "Faltan en las referencias".
- Código: no hay implementación todavía; componentes verificados contra el DS, sin implementación todavía.

## Pantallas involucradas
- Sorteo de tema, estado "tema revelado" con las dos `TopicBetCard` — plantilla del DS: **Sorteo de tema**. H10 cubre el botón "Jugar la sesión", el chip de pulsos disponibles y los estados de envío y error.
- Transición a Pregunta (H11) — plantilla del DS: **Pregunta**. Solo el pasaje; el diseño de la pregunta no es de esta historia.

## Componentes del DS a usar
- `Button` variante `brand` — "Jugar la sesión", la única acción fuerte de la pantalla; anclado abajo, ancho completo (referencia), alto mínimo `tap-min`.
- `Button` estado deshabilitado (`surface-2`, sin labio) — mientras se envía.
- `StatPill` / chip de pulsos disponibles (`surface-2`, `label`) — "N pulsos disponibles"; muestra lo que queda tras lo guardado. En H10 solo se lee.
- `TopicBetCard` (cerradas, con monto guardado o "Sin pulsos") — "Ganar la sesión" y "Acertar al menos X de las 7"; el chip con el monto es lo que el jugador revisa antes de confirmar.
- `TopicReel` (ya revelado, sin movimiento) — encabezado fijo con el tema.
- `Button` `neutral` o `ghost` para "Reintentar" — ver Gaps (no hay patrón de error en el DS).

## Componentes a extender
- `TopicBetCard` — estado **bloqueado/solo lectura** una vez confirmada la sesión (o mientras se envía): sin chevron interactivo, sin abrirse. Mientras la pantalla está enviando, también debe estar bloqueada para que no se pueda cambiar un monto en vuelo. El DS no define este estado.
- `Button` — estado de **envío en curso** (deshabilitado con indicación de que está trabajando). El DS solo define el deshabilitado; si hace falta un indicador de actividad, es una extensión.

## Gaps
- **Error al confirmar la sesión** — no hay patrón de error ni de reintento en el DS ni referencia — sin referencia / no existe en el DS.
  - **Resolución temporal sugerida**: mensaje corto en `body-sm` `text-muted` sobre el botón (sin rojo, sin `coral-soft`) y el mismo `Button` `brand` "Jugar la sesión" como reintento; los montos siguen visibles en las tarjetas. Provisorio; ver duda de consistencia con otros errores de red.
- **Estado de envío en curso del botón** — el DS solo define el deshabilitado — no existe en el DS.
  - **Resolución temporal sugerida**: botón deshabilitado (`surface-2`, sin labio) con el mismo rótulo, y `accessibilityState` de ocupado; sin spinner nuevo.
- **Estado bloqueado de `TopicBetCard`** — durante el envío y tras confirmar; no existe en el DS ni en la referencia.
  - **Resolución temporal sugerida**: dejar la tarjeta cerrada, con el chip de monto visible, y no responder al toque; aplica solo mientras dura el envío, porque tras confirmar la pantalla se abandona.
- **Sesión no abierta por ventana vencida (H22)** — no hay pantalla ni texto; H22 fuera de alcance — sin referencia.
  - **Resolución temporal sugerida**: tratarlo como error de confirmación con un texto neutro y sin reintento útil; el diseño real queda para H22.
- **Rechazo del servidor por total mayor que la bolsa** — no hay texto ni patrón — sin referencia. Con el chip y H8 limitando los montos, no debería ocurrir salvo desincronización.
  - **Resolución temporal sugerida**: mismo patrón que el error de confirmación, con el chip de pulsos actualizado desde el servidor.
- **Contenido del botón de ayuda "?" junto a "¿Confiás en tu conocimiento?"** — la referencia lo dibuja, el DS no define qué abre — sin referencia (pertenece a H8, se anota por estar en la misma pantalla).
- **Transición a la primera pregunta** — no hay definición de transición ni de pantalla de carga entre la confirmación y H11 — sin referencia.
  - **Resolución temporal sugerida**: navegación directa, sin animación, cuando el servidor confirma.

## Tokens relevantes
- Colores: `bg` fondo de pantalla; `surface` tarjetas; `surface-2` chip de pulsos disponibles y botón deshabilitado; `brand` con `on-brand` y `brand-deep` para "Jugar la sesión"; `brand-soft` con `brand-text` para el chip de monto guardado; `text` y `text-muted`; `focus-ring` en el botón.
- Tipografía: `display` 800 en el botón y en el título de las tarjetas; `label` mayúsculas con cifras tabulares en el chip de pulsos disponibles; `display-lg` en "Descubrí el tema de hoy"; `display-xl` en el tema revelado; `body` y `body-sm` para bajadas y mensaje de error.
- Espaciado y radios: margen lateral `space-5`; separación entre bloques `space-6`; `radius-md` en el botón; `radius-lg` en tarjetas; `radius-pill` en chips; `tap-min` 52px.
- Sombras y labios: `lip-brand` en "Jugar la sesión" (se hunde 4px al presionar); `shadow-soft` en tarjetas.

## Patrones de interacción y movimiento
- Presión con labio: `Button` `brand` baja 4px en 100 ms y oculta el labio — Movimiento reducido: sin transición, el cambio es instantáneo.
- Envío: al tocar, el botón pasa a deshabilitado de inmediato y recién se rehabilita si el servidor devuelve error; el doble toque no genera segundo envío (el servidor además lo ignora) — Movimiento reducido: no aplica.
- Éxito: navegación a la primera pregunta cuando el servidor confirma; el cronómetro lo inicia el servidor al abrir la sesión, no la app — Movimiento reducido: igual, sin animación.
- Error: el mensaje aparece sin animación y se conserva el estado de las tarjetas; el anuncio debería ir por región `aria-live` (a confirmar).
- Una sola tarjeta abierta a la vez (regla de `TopicBetCard`); si queda una abierta al tocar "Jugar la sesión", confirmar igual con los montos **guardados**; lo no guardado no cuenta (ver duda).
- Accesibilidad: el botón anuncia su estado (habilitado, ocupado); el chip de pulsos disponibles con `accessibilityLabel` del tipo "62 pulsos disponibles"; ningún resultado depende solo del color.

## Datos y autoridad del servidor
- Llega del servidor: tema de la sesión; bolsa y pulsos disponibles; multiplicadores y cantidad de jugadores de "Ganar la sesión"; confirmación de sesión abierta con los montos reservados; primera pregunta con el cronómetro ya iniciado; error si no se pudo abrir.
- La app envía: los montos de tema guardados (y el X elegido en "Acertar al menos X de las 7").
- La app nunca calcula: la reserva real, la validación contra la bolsa, el registro en el libro de Pulsos, la apertura de la sesión ni el cronómetro. El chip de pulsos disponibles es solo una anticipación local de resta; la verdad la fija el servidor al confirmar. Tampoco calcula pagos finales de "Ganar la sesión" ni de "Al menos X" (los muestra el servidor).

## Textos de pantalla
- "Descubrí el tema de hoy" y "Un solo tema al azar para todos los jugadores de la partida." (de la referencia).
- "¿Confiás en tu conocimiento?" (corregido: la referencia dice "Confias en tu conocimiento?")
- "Arriesgá pulsos para ganar más, todo depende de qué tanto confiás en tu conocimiento" (corregido: sin tildes en la referencia)
- "62 pulsos disponibles" (chip, `label` en mayúsculas; el número es dinámico)
- "¿Cómo querés arriesgar?" (corregido: la referencia dice "Como queres arriesgar?")
- "Ganar la sesión" / "Acertá más que el resto hoy. Paga ×5,4 con 6 jugadores." (según `Al menos X expanded.png`; `Default.png` dice "Ganar sesión")
- "Acertar al menos X de las 7" / "Elegí cuántas preguntas creés que vas a acertar del tema de hoy." (según `Al menos X expanded.png`; `Default.png` dice "Ganar x de las 7 sesiones")
- Chips de tarjeta: "Sin pulsos" o "5 pulsos".
- "Jugar la sesión" (corregido: `Default.png` dice "Jugar la sesion")
- Error al confirmar (provisorio, sin referencia): sugerencia "No pudimos empezar la sesión. Tus montos siguen guardados, probá de nuevo." con el botón "Jugar la sesión" como reintento. Texto a validar.

## Riesgos y dudas
- **Error de confirmación sin patrón**: es el punto típico de inconsistencia entre historias que envían al servidor (H8, H11, H12). Definir un único patrón de feedback de error de red antes de implementar; acá queda como duda abierta, no se eligió uno.
- Dos referencias conflictivas en la misma pantalla: `Default.png` (textos con errores y chips "SIN PULSOS" en gris) y `Al menos X expanded.png` (textos correctos, chips `brand-soft` con monto). Se siguió el DS, que declara a la segunda como la que manda.
- Cuando el jugador deja una tarjeta abierta con cambios sin guardar y toca "Jugar la sesión": la historia no dice si se guarda solo o se descarta. Propuesta conservadora: confirmar solo lo guardado (el chip de pulsos coincide con eso). A confirmar con producto.
- El botón en `Default.png` está anclado abajo con espacio vacío arriba, pero en la versión desplegada queda debajo de las tarjetas. No está definido si es fijo o va al final del contenido con scroll cuando la tarjeta abierta es alta.
- La ventana vencida (H22) y el fin de la sesión (H17) están fuera de alcance de esta corrida; el flujo de H10 queda incompleto en esos bordes.
- La reserva real y la apertura de la sesión pueden tardar; no hay definición del tiempo máximo de espera ni de si hay indicador de carga más allá del botón deshabilitado.
