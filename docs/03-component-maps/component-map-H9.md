# Component Map: H9 - Poner confianza en "Al menos X de las 7"

## Resumen de la historia

- **Descripción**: Como jugador, quiero elegir un umbral de aciertos y cuántos pulsos arriesgo a alcanzarlo, para respaldar cuánto sé del tema de hoy.
- **Reglas de producto**: multiplicadores fijos 4 o más ×1,3; 5 o más ×2; 6 o más ×4; las 7 ×8 (pago total, incluye lo arriesgado; provisorios). X solo puede ser 4, 5, 6 o 7. Pago redondeado hacia abajo (5 × 1,3 = 6,5 → 6). Lo arriesgado se reserva de la bolsa al tocar "Jugar la sesión".
- **Criterios clave**: tarjeta cerrada "Acertar al menos X de las 7" con descripción, chip del monto ("Sin pulsos" por defecto) y chevron. Abierta, en orden: etiqueta "ELEGÍ CUÁNTAS PREGUNTAS VAS A ACERTAR" con píldoras 4, 5, 6, 7 (por defecto 4); etiqueta "ELEGÍ CUÁNTOS PULSOS ARRIESGÁS" con 0, 1, 5, 10 y "Otro"; celda "SI ACERTÁS 6 · (×4)" con "+15 pulsos" y "Cobrás 20 total"; botón "Guardar" (`neutral`). "Otro" abre el `Overlay` de H8; la suma de las dos tarjetas nunca supera la bolsa; el chip de pulsos disponibles baja al guardar. Solo una tarjeta abierta a la vez; 0 es válido.
- **Servidor**: multiplicadores y redondeo son configuración del servidor; reserva el monto al confirmar y resuelve al terminar las 7 preguntas, o al cerrar la ventana si no se retomó una sesión interrumpida.
- **Casos borde**: pago con decimales; sesión interrumpida (H16); pulsos disponibles en 0 con reservas en el tema (sigue con monto 0); ventana vencida sin jugar (no se cobra ni paga).
- **Dependencias**: H6 (sorteo de tema). Coordina con H8 (misma pantalla, mismo `Overlay`, mismo chip de disponibles) y H10 (botón "Jugar la sesión", fuera del alcance funcional de H9).

## Referencias revisadas

- `Referencias-y-definiciones/Pantalla-UI/Topic Reel/Al menos X expanded.png` — tarjeta abierta: etiquetas, píldoras de X (la imagen muestra 1 al 7; valen solo 4 a 7), píldoras de monto, celda "SI ACERTÁS 6 · (×4)", "Guardar" y "Jugar la sesión". Manda sobre el detalle visual y los textos.
- `Referencias-y-definiciones/Pantalla-UI/Al menos X expanded.png` — misma pantalla con los textos con tildes correctos ("¿Confiás...", "Jugar la sesión"); es la versión que sirve de base para los textos.
- `Referencias-y-definiciones/Pantalla-UI/Topic Reel/Default.png` — tarjeta cerrada, chip "Sin pulsos", chevron. Sus textos tienen errores (sin tildes, "Ganar x de las 7 sesiones") que no se copian.
- `Trivia_DS_completo.md` secciones 1, 2, 3 (`TopicBetCard`, `ConfidenceControl`, `Overlay`, `Button`), 4 (Sorteo de tema) y 6.
- `App de trivia diseño del MVP.md`: economía de Pulsos (pagos de "al menos X"), flujo paso 4, casos borde y decisiones del 17 de noviembre.
- Código: no hay implementación todavía (búsqueda de `TopicBetCard`, `ConfidenceControl`, `AnswerCard` sin resultados). Componentes verificados contra el DS, sin implementación todavía.

## Pantallas involucradas

- Sorteo de tema, estado "tema revelado" con la tarjeta "Acertar al menos X de las 7" cerrada y abierta — plantilla del DS: **Sorteo de tema**.
- `Overlay` de monto "Otro" sobre esa pantalla (misma de H8).

## Componentes del DS a usar

- `TopicBetCard` (cerrada y abierta; la segunda de las dos tarjetas) — contenedor de todo el flujo de H9. Una sola abierta a la vez, compartido con la tarjeta "Ganar la sesión" (H8).
- Chip del monto dentro de `TopicBetCard` — "Sin pulsos" en `surface-2`, o "5 pulsos" en `brand-soft` con `brand-text`.
- `ConfidenceControl` (variante de tema) — píldoras de monto 0, 1, 5, 10, "Otro": elegida en `brand-soft` con trazo y labio `brand-deep`; celda única "Si acertás" en `brand-soft`.
- `Overlay` (monto "Otro") — "¿Cuántos pulsos arriesgás?" con campo numérico, ayuda, "Guardar" (`brand`) y "Cancelar" (`ghost`).
- `Button` `neutral` — "Guardar" con tilde, dentro de la tarjeta.
- `Button` `brand` — "Jugar la sesión" (único botón `brand` de la pantalla; pertenece a H10).
- Chip de pulsos disponibles ("62 pulsos disponibles": `surface-2`, `label`) y botón de ayuda del encabezado "¿Confiás en tu conocimiento?" — se comparten con H8; en el DS son parte de la plantilla pero el botón de ayuda no tiene contenido definido (ver gaps).

## Componentes a extender

- `ConfidenceControl` (variante de tema) — agregar el modo "Al menos X": una fila previa de píldoras de umbral (4, 5, 6, 7) con el mismo estilo de elegida, y la celda "Si acertás" con formato "SI ACERTÁS {X} · (×{mult})". El DS ya describe esto dentro de `TopicBetCard`, pero no lo define como pieza reutilizable; conviene decidir si el selector de X es una variante propia de `ConfidenceControl` o un subcomponente de `TopicBetCard`.
- `TopicBetCard` — el chip cerrado muestra solo el monto; el DS no dice si debe reflejar también el X elegido (ver dudas).

## Gaps

- **Selector de umbral X (píldoras 4–7)** — el DS lo describe en texto dentro de `TopicBetCard` pero no existe como componente ni con estados definidos — no existe en el DS como pieza.
  - **Resolución temporal sugerida**: reutilizar el estilo de las píldoras de `ConfidenceControl` de tema (mismos tokens, `radius-md`, `border-w`, labio `brand-deep` al elegir) con cuatro píldoras iguales que reparten el ancho.
- **Altura de las píldoras de la referencia** — en `Al menos X expanded.png` las píldoras miden unos 47 pt de alto y 40 pt de ancho (con 7), por debajo de `tap-min` (52). Con solo 4 píldoras hay espacio para respetar `tap-min` — referencia vs. DS.
  - **Resolución temporal sugerida**: implementar con alto `tap-min` y ancho repartido; aplica a la fila de monto también.
- **Celda "Si acertás" con monto 0** — no hay referencia de qué dice la celda cuando se arriesgan 0 pulsos (¿"+0 pulsos", "Cobrás 0 total", oculta?) — sin referencia.
  - **Resolución temporal sugerida**: mostrarla igual con "0 pulsos" en `text-muted` y "Cobrás 0 total", neutra, sin verde ni signo, para que el 0 siga siendo igual de prominente.
- **Contenido del botón de ayuda "?"** — el MVP y las historias no dicen qué explica — sin referencia.
  - **Resolución temporal sugerida**: marcarlo como pendiente (es compartido con H8); no inventar contenido ni un componente nuevo.
- **Píldoras de monto que superan los pulsos disponibles** — no se dice si se deshabilitan o se ajustan solo (el `Overlay` ajusta al máximo) — sin referencia.
  - **Resolución temporal sugerida**: dejar las píldoras fijas habilitadas y ajustar el valor al máximo al elegir, sin rojo ni reproche, igual que en el `Overlay`.
- **Cálculo del disponible máximo con monto ya guardado en esta tarjeta** — al reabrir la tarjeta con 5 pulsos guardados, el límite de "Otro" debería incluir esos 5 (están descontados del chip) — no definido.
  - **Resolución temporal sugerida**: límite = disponibles + monto ya guardado en esta misma tarjeta; confirmarlo con producto.
- **Estado sin referencia de la celda "Si acertás" mientras el servidor valida** — no hay estado de carga ni error si el servidor no entrega el multiplicador — sin referencia.
  - **Resolución temporal sugerida**: ver "Riesgos y dudas"; no elegir un patrón de error en silencio.

## Tokens relevantes

- Colores: `bg`, `surface`, `surface-2` (chip "Sin pulsos" y chip de disponibles), `line` (borde de la tarjeta y separador), `line-strong` (reposo de píldoras), `brand-soft` y `brand-deep` (píldora elegida, chip con monto, celda "Si acertás"), `brand-text` (ganancia "+15 pulsos"), `text` y `text-muted`, `brand` / `on-brand` / `lip-brand` ("Jugar la sesión"), `focus-ring`. Para "Guardar": `surface` con `lip-neutral` (variante `neutral`).
- Tipografía: `display` 800 para título de tarjeta, números de las píldoras y "Guardar"; `body` / `body-sm` para descripción y "Cobrás 20 total"; `label` (12/16, 800, 0,08em, mayúsculas) para las dos etiquetas y "SI ACERTÁS 6 · (×4)"; `title` para "¿Confiás en tu conocimiento?". Cifras tabulares en pulsos, X y multiplicador.
- Espaciado y radios: `radius-lg` en tarjeta y celda, `radius-md` en píldoras y "Guardar", `radius-pill` en chips; `space-4` de relleno de la tarjeta, `space-2` entre píldoras, `space-5` de margen lateral, `tap-min` en cada control táctil.
- Sombras y labios: `shadow-soft` de la tarjeta; `lip-neutral` en píldoras en reposo y en "Guardar"; `brand-deep` como labio de la elegida; `shadow-float` y scrim del `Overlay`.

## Patrones de interacción y movimiento

- **Abrir / cerrar la tarjeta**: tocar la tarjeta alterna y cierra la otra abierta (una sola a la vez). Chevron cambia de dirección. — Movimiento reducido: se despliega sin transición.
- **Elegir X o monto**: la píldora se hunde 4 px al presionar (100 ms) y queda elegida con labio `brand-deep`. La celda "Si acertás" se recalcula en cada cambio. — Movimiento reducido: sin transición, la presión solo cambia el estado.
- **"Otro"**: abre el `Overlay` con foco automático y teclado numérico; tocar el velo equivale a "Cancelar"; vacío o 0 vuelve a "Otro" con 0 elegido.
- **Guardar**: cierra la tarjeta, deja el monto en el chip y baja el chip de pulsos disponibles al instante; cambiar o pasar a 0 lo recalcula. La reserva real ocurre en H10.
- **Anuncio `aria-live`**: cada cambio de X o de monto anuncia el nuevo resultado posible (X, multiplicador, ganancia y total). Ningún resultado depende solo del color: ganancia con signo y palabra.
- **Accesibilidad**: píldoras con `accessibilityRole` de opción/radio y estado seleccionado; la tarjeta como botón expandible con estado abierto/cerrado; etiqueta accesible del chevron y del "?".

## Datos y autoridad del servidor

- Llega del servidor: multiplicadores por umbral (4 → ×1,3; 5 → ×2; 6 → ×4; 7 → ×8, configurables), regla de redondeo, bolsa y pulsos disponibles, y las cifras de la celda ("+15 pulsos", "Cobrás 20 total") calculadas o validadas por el servidor.
- Llega del servidor al confirmar (H10): reserva del monto; la resolución ocurre al terminar las 7 preguntas, o al cerrar la ventana si no se retomó.
- La app nunca calcula: la ganancia ni el redondeo definitivos, la reserva de la bolsa, ni la resolución según aciertos. Solo envía X y monto al confirmar. Cualquier cálculo local de la celda es una anticipación visual; el servidor paga con el multiplicador que el jugador vio.
- No se muestra nunca un pozo ni montos de otros jugadores.

## Textos de pantalla

- "Descubrí el tema de hoy"
- "Un solo tema al azar para todos los jugadores de la partida."
- "¿Confiás en tu conocimiento?" (la referencia `Default.png` dice "Confias" sin tilde)
- "Arriesgá pulsos para ganar más, todo depende de qué tanto confiás en tu conocimiento" (tildes corregidas)
- "62 pulsos disponibles" (cifra dinámica; mostrado en `label` en mayúsculas)
- "¿Cómo querés arriesgar?"
- "Acertar al menos X de las 7" (no "Ganar x de las 7 sesiones")
- "Elegí cuántas preguntas creés que vas a acertar del tema de hoy." (no "Arriesgás a ganar x de las 7 sesiones de la tematica de hoy")
- "Sin pulsos" / "5 pulsos" (chip)
- "ELEGÍ CUÁNTAS PREGUNTAS VAS A ACERTAR"
- Píldoras: "4", "5", "6", "7" (la referencia muestra del 1 al 7; no se copia)
- "ELEGÍ CUÁNTOS PULSOS ARRIESGÁS"
- Píldoras: "0", "1", "5", "10", "Otro"
- "SI ACERTÁS 6 · (×4)" (X y multiplicador dinámicos)
- "+15 pulsos" (dinámico, `brand-text`)
- "Cobrás 20 total" (dinámico)
- "Guardar"
- "Jugar la sesión" (`Default.png` dice "Jugar la sesion")
- `Overlay`: "¿Cuántos pulsos arriesgás?", "Podés arriesgar hasta N pulsos", "Guardar", "Cancelar"

## Riesgos y dudas

- **Fin provisorio de sesión**: no aplica directamente a H9; la resolución de "al menos X" depende de terminar las 7 preguntas, y el resumen del día (H17) no existe todavía. Quien implemente debe tratar "lo resuelto" como pendiente de la pantalla de cierre.
- **Feedback de error de red** al guardar o al validar el multiplicador con el servidor: ni la historia ni el DS dicen cómo mostrarlo. No se eligió un patrón; es un punto típico de inconsistencia con H8 y H10, hay que definirlo en una sola decisión compartida.
- **El chip cerrado solo muestra el monto, no el X elegido**: tras guardar y cerrar, el jugador no ve qué umbral dejó. Dudo si debería aparecer (por ejemplo "6 de 7 · 5 pulsos") o si basta con reabrir la tarjeta; el DS no lo define.
- **Selección de X con monto 0**: poner X con monto 0 es válido pero no tiene ninguna consecuencia económica; hay que confirmar si se envía/guarda o se descarta ese X.
- **Inconsistencia de la referencia**: en `Al menos X expanded.png` el chip de disponibles dice 62 aunque ambas tarjetas muestran 5 pulsos guardados (debería bajar a 52). Se asume que es de ejemplo; se sigue la regla escrita (el chip descuenta lo guardado).
- **Resolución con X inalcanzable**: la historia no dice qué pasa si el jugador ya no puede alcanzar X en mitad de la sesión (ej. 4 errores seguidos con X = 4); no se muestra seguimiento en esta historia, y es una decisión de producto para la pregunta.
