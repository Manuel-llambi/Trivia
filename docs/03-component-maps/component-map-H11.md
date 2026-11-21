# Component Map: H11 - Responder una pregunta poniendo confianza

## Resumen de la historia

**Descripción**: Como jugador, quiero elegir una respuesta y cuántos pulsos arriesgo antes de que se acabe el tiempo, para ganar pulsos según lo que sé.

**Referencias visuales**: `Referencias-y-definiciones/Pantalla-UI/Pregunta/Elegida.png`

**Reglas de producto**:
- 20 s visibles; el servidor acepta hasta 22 s; pasarse cuenta como error. 4 opciones en orden aleatorio. Nadie ve una pregunta que ya respondió.
- Monto 0, 1, 5, 10 o libre hasta toda la bolsa disponible (bolsa menos lo reservado en la confianza del tema). Arranca en 0 en cada pregunta. Acertar paga el doble de lo puesto; errar con el monto enviado con "Responder" lo pierde; si vence el tiempo sin tocar "Responder", cuenta como error con 0 pulsos.
- Celdas "Si acertás +N pulsos" y "Si errás -N pulsos" (la referencia dice "Si errás o vence"; no se copia).

**Criterios de aceptación funcionales**:
- Encabezado: chip "Pregunta N de 7", botón cerrar, 7 segmentos de progreso (respondidas, actual, pendientes) y barra de tiempo con cifra.
- Etiqueta del tema, enunciado, 4 opciones A a D; la elegida dice "Elegida".
- "Elegí cuántos pulsos arriesgás" con píldoras 0, 1, 5, 10 y "Otro" (no "Libre"); cada pregunta arranca con 0.
- "Otro" abre el `Overlay` de ingreso de monto de H8 ("¿Cuántos pulsos arriesgás?", "Podés arriesgar hasta N pulsos", "Guardar", "Cancelar"); al guardar, la píldora muestra el número como elegida y las celdas se recalculan; vacío o 0 vuelve a "Otro" con el 0 elegido.
- Celdas siempre visibles que cambian con el monto.
- "Responder" deshabilitado hasta elegir opción; al tocarlo envía opción y monto al servidor.
- Cerrar abre el `Overlay` "¿Salir de la sesión?" (H16).
- Siempre se ve cuánto tengo en juego.

**Autoridad del servidor**: envía pregunta y opciones mezcladas sin la respuesta correcta; el cronómetro corre en el servidor y la barra solo lo refleja; el servidor valida el tiempo (hasta 22 s) y que el monto no supere la bolsa disponible, y resuelve el resultado; la bolsa nunca queda en negativo.

**Criterios de experiencia**: con 5 s o menos barra coral y cifra roja; tiempo anunciado en 10, 5 y 0; opciones y píldoras se hunden 4 px (sin transición con movimiento reducido); cada cambio de monto se anuncia con `aria-live`; mientras se envía, el botón queda deshabilitado; cifras tabulares.

**Casos borde**: monto libre mayor que lo disponible se ajusta solo al máximo, sin rojo; disponibles menores que 1, 5 o 10 → esas píldoras no se pueden elegir (sin referencia); respuesta entre 20 y 22 s se acepta, después cuenta como error con 0 pulsos (H14); disponibles en 0 con reservas en el tema → única opción de monto 0 y el jugador sigue (no es expulsión, H18); monto elegido sin opción → "Responder" deshabilitado, y si vence cuenta como error con 0 pulsos.

**Dependencias**: H10. **Prioridad**: alta.

**Alcance de esta corrida**: H17 (resumen del día) no está disponible; tras la 7ª pregunta, la sesión vuelve al detalle de la partida como cierre provisorio. H3, H5, H7, H15, H18–H23 se tratan como no disponibles (las referencias a H18 y H16 se mencionan solo como punto de enlace).

## Referencias revisadas
- `Referencias-y-definiciones/Pantalla-UI/Pregunta/Elegida.png` — estructura completa de la pantalla: encabezado claro con chip celeste "PREGUNTA 3 DE 7" y botón cerrar cuadrado con labio; 7 pasos (2 oscuros, 1 verde, 4 vacíos); barra de tiempo verde con "0:09"; etiqueta "GEOGRAFÍA"; enunciado; 4 `AnswerCard` (la B "Amazonas" elegida, con trazo y labio verdes, disco verde en la letra y "ELEGIDA" a la derecha); etiqueta "ELEGÍ CUÁNTOS PULSOS ARRIESGAS" (sin tilde: error de tipeo); píldoras 0, 1, **5** (verde sólido), 10, "Libre"; celdas "SI ACERTÁS +5 pulsos" (verde suave) y "SI ERRÁS O VENCE -5 pulsos" (coral suave); botón "Responder" `brand` anclado abajo con labio.
- `Trivia_DS_completo.md` secciones 1, 2, 3 (`Button`, `ProgressBar`, `AnswerCard`, `ConfidenceControl`, `ResultCard`, `Overlay`), 4 (plantilla Pregunta) y 6.
- `App de trivia diseño del MVP.md`: "Primer flujo", paso 5 y "Decisiones tomadas (17/11/2026)".
- No se leyó `card_states.png` ni `cierre_light.png` (la historia no toca cards de partida ni el cierre de aura).
- Código: no hay implementación (sin `package.json` ni `.tsx`). Componentes verificados contra el DS, sin implementación todavía.

## Pantallas involucradas
- **Pregunta (estado "Elegida")** — plantilla del DS: **Pregunta**. Es la única pantalla de la historia.
- Overlays que se abren desde ella: monto "Otro" (compartido con H8/H9) y "¿Salir de la sesión?" (detalle en H16, solo se enlaza acá).

## Componentes del DS a usar
- `ProgressBar` (temporizador) — barra `surface-2` con relleno `brand` y cifra "0:09" a la derecha; con 5 s o menos, `data-tone="urgent"` (barra `coral`, cifra `danger-text`).
- `ProgressBar` (pasos) — variante de pasos para las 7 preguntas: respondidas `forest`, actual `brand`, pendientes `surface-2` (ver Componentes a extender: el DS define pasos de "5 días").
- Chip de estado (`StatPill`/chips) — "Pregunta N de 7" en `sky-soft`, `label` mayúsculas, `radius-pill`.
- `Button` `neutral` (cuadrado, ícono cerrar) — abre el `Overlay` "¿Salir de la sesión?".
- `AnswerCard` x4 — estados **reposo** y **elegida** (trazo y labio `brand-deep`, letra `brand`, palabra "Elegida" con ícono). Solo una elegida a la vez.
- `ConfidenceControl` (variante **por pregunta**) — píldoras 0, 1, 5, 10, "Otro"; la elegida en `brand` sólido; dos celdas "Si acertás" (`brand-soft`, `brand-text`) y "Si errás" (`coral-soft`, `danger-text`).
- `Overlay` — monto "Otro" ("Guardar" `brand`, "Cancelar" `ghost`).
- `Overlay` — "¿Salir de la sesión?" (botones `coral` "Salir" y `neutral` "Seguir jugando").
- `Button` `brand` "Responder" — único `brand` de la pantalla; deshabilitado (`surface-2`, sin labio) hasta elegir opción y mientras se envía.

## Componentes a extender
- `ProgressBar` — variante de pasos de la pregunta (7 segmentos) además de los 5 días; mismos colores. Estados: respondida, actual, pendiente.
- `ConfidenceControl` por pregunta — estado **píldora deshabilitada** (monto mayor que lo disponible) y recorte del máximo al guardar desde "Otro"; la píldora "Otro" muestra el número guardado como elegida.
- `AnswerCard` — nada nuevo; se usa solo reposo y elegida (los estados de resultado son de H12/H13/H14).

## Gaps
- **Píldora de monto no disponible** — con disponibles menores que 1, 5 o 10 no se pueden elegir — sin referencia.
  - **Resolución temporal sugerida**: estilo deshabilitado del DS (`surface-2`, sin labio, texto `text-muted`), sin rojo ni mensaje de reproche; `accessibilityState={{disabled:true}}`. Provisoria.
- **Píldora "Otro" con valor guardado** — se describe en texto en el DS, no hay imagen — sin referencia.
  - **Resolución temporal sugerida**: misma píldora en estilo elegida (`brand` sólido) con el número en lugar de "Otro".
- **Estado "enviando"** del botón "Responder" — la historia dice solo "deshabilitado" — sin referencia.
  - **Resolución temporal sugerida**: botón deshabilitado con el mismo rótulo, sin spinner nuevo.
- **Error de red al enviar la respuesta** — no definido — sin referencia (ver Riesgos y dudas).
  - **Resolución temporal sugerida**: ninguna que se pueda elegir sin inventar; se deja como duda.
- **Cuánto tengo en juego / pulsos disponibles** ("Siempre se ve cuánto tengo en juego") — la referencia solo muestra la celda "Si errás -5" y las píldoras; no hay chip de disponibles ni de reserva por tema — sin referencia.
  - **Resolución temporal sugerida**: considerar la celda "Si errás -N pulsos" como lo que está en juego y la ayuda "Podés arriesgar hasta N pulsos" del `Overlay` como el máximo; no agregar chip nuevo. Provisoria.
- **Cierre provisorio tras la 7ª pregunta** (H17 no disponible) — fuera de esta historia, pero la pantalla debe llevar a algún lado — sin referencia.
  - **Resolución temporal sugerida**: volver al detalle de la partida (provisorio hasta diseñar el resumen del día).
- **Pregunta sin tiempo / pregunta que ya no tiene tiempo al abrir** — H14/H16 — se trata en sus historias; acá no se resuelve.
- **Layout con enunciado u opciones largos** — la referencia ocupa casi toda la altura útil (390x844) con el botón anclado abajo; no hay definición de scroll — sin referencia.
  - **Resolución temporal sugerida**: contenido en `ScrollView` con encabezado y botón "Responder" fijos.

## Tokens relevantes
- Colores:
  - Fondo del encabezado `surface`; fondo de pantalla `bg`; opciones en `surface`.
  - Chip: `sky-soft` / `text`. Cerrar: `neutral` (`surface`, labio `line-strong`).
  - Pasos: `forest`, `brand`, `surface-2`. Barra de tiempo: pista `surface-2`, relleno `brand`; urgente `coral` y cifra `danger-text`.
  - Opción elegida: trazo `brand-deep` (3:1), letra sobre `brand` con `on-brand`, palabra "Elegida" en `brand-text`.
  - Píldora elegida: `brand` + `on-brand`; píldoras en reposo `surface` con borde `line-strong`.
  - Celdas: `brand-soft` + `brand-text` (acierto); `coral-soft` + `danger-text` (error); etiquetas en `text-muted`.
  - "Responder": `brand`, `on-brand`, `lip-brand`; deshabilitado `surface-2`.
  - `Overlay`: velo + `surface`; "Guardar" `brand`, "Cancelar" `ghost`, "Salir" `coral`, "Seguir jugando" `neutral`.
- Tipografía: etiquetas `label` (12/16, 800, mayúsculas) para el tema, "Elegí cuántos pulsos arriesgás" y las celdas; enunciado `title` o `heading` con `display` (según medida de la referencia, enunciado ~28 px: confirmar); opciones `heading`/`body`; cifras de las celdas `display` grande (`number-md` 28/32); cifra del tiempo `display`; todas con `tabular-nums`.
- Espaciado y radios: margen lateral `space-5`; separación entre bloques `space-6`; entre opciones `space-3`; `radius-md` en opciones, píldoras y botones; `radius-lg` en celdas y `Overlay`; `radius-pill` en chip, pasos y barra; alto mínimo `tap-min` (52 px) en píldoras y botón cerrar; `AnswerCard` mínimo 64 px.
- Sombras y labios: `lip-neutral` en opciones, píldoras y cerrar; `lip-brand` en "Responder" y en la opción elegida (`brand-deep`); `shadow-float` en `Overlay`; `focus-ring` 3 px.

## Patrones de interacción y movimiento
- **Presión con labio**: opciones, píldoras, cerrar y "Responder" se hunden 4 px en 100 ms y ocultan el labio. — Movimiento reducido: sin transición.
- **Selección de opción**: tocar una opción la pasa a "Elegida"; tocar otra mueve la selección; no hay deselección definida. — Movimiento reducido: cambio instantáneo.
- **Selección de monto**: una sola píldora elegida; arranca con 0 en cada pregunta (incluida la pregunta siguiente); las celdas se recalculan al instante. Poner 0 es igual de prominente que las otras.
- **Anuncio de cambios**: región `aria-live` con el nuevo resultado posible ("Si acertás +10 pulsos, si errás -5 pulsos") en cada cambio de monto.
- **Temporizador**: la barra solo refleja el reloj del servidor; urgente con 5 s o menos (barra `coral`, cifra `danger-text`); anuncio a lectores de pantalla solo en 10, 5 y 0. — Movimiento reducido: la barra puede actualizarse por pasos sin interpolar (no se define; ver dudas).
- **Overlay "Otro"**: campo numérico con foco automático; tocar el velo = "Cancelar"; lo que supere el máximo se ajusta solo, sin rojo.
- **Envío**: "Responder" deshabilitado mientras se envía; la resolución llega del servidor (H12/H13/H14).
- Sin confeti, sonidos ni festejo en esta pantalla.

## Datos y autoridad del servidor
- **Llega del servidor**: número de pregunta (N de 7), tema, enunciado, 4 opciones ya mezcladas con su letra (sin la correcta), el tiempo restante del cronómetro (desde que entrega la pregunta), pulsos disponibles (bolsa menos reservado en el tema) para los montos y el máximo de "Otro", estado de pasos (respondidas, actual, pendientes).
- **La app envía**: opción elegida y monto, al tocar "Responder".
- **La app nunca calcula**: el reloj real (solo lo muestra), la validez de la respuesta (20/22 s), el límite del monto contra la bolsa, el resultado, la bolsa. Las celdas "Si acertás +N" y "Si errás -N" son una anticipación de presentación (doble y monto) no una resolución; el servidor valida y registra en el libro de Pulsos. La respuesta correcta nunca está en el cliente antes de responder.

## Textos de pantalla
- "Pregunta 3 de 7" (chip; en mayúsculas por `label`; N dinámico)
- Cerrar: `accessibilityLabel` "Cerrar" (ícono sin texto)
- "Geografía" (etiqueta de tema, dinámica)
- "¿Cuál es el río más largo de Sudamérica?" (ejemplo de la referencia; dinámico)
- Opciones con letras A, B, C, D; "Elegida" (en la opción elegida)
- "Elegí cuántos pulsos arriesgás" (la referencia dice "ARRIESGAS" sin tilde; se corrige)
- Píldoras: "0", "1", "5", "10", "Otro" (no "Libre")
- "Si acertás" / "+5 pulsos" y "Si errás" / "-5 pulsos" (no "Si errás o vence"; N dinámico; con monto 0 las celdas muestran "+0 pulsos"/"-0 pulsos": ver dudas)
- Tiempo: "0:09" (formato m:ss, dinámico)
- "Responder"
- Overlay "Otro": "¿Cuántos pulsos arriesgás?", "Podés arriesgar hasta N pulsos", "Guardar", "Cancelar"
- Overlay cierre: "¿Salir de la sesión?", "Podés volver mientras la sesión siga abierta. El tiempo de esta pregunta sigue corriendo.", "Salir", "Seguir jugando"
- Anuncio de tiempo para lector de pantalla en 10, 5 y 0 segundos (texto exacto sin definir)

## Riesgos y dudas
- **Error de red al enviar "Responder"**: la historia no dice cómo mostrarlo (mensaje, reintento, si el botón se rehabilita). Hay una regla de producto: una respuesta que llega después de 22 s cuenta como error, pero "una mala conexión no cuesta pulsos" dentro del margen de 2 s. Falta definir el patrón visual y de reintento; no se eligió ninguno. Probable punto de inconsistencia con H8/H10, que sí definen error al confirmar.
- **Monto 0 en las celdas**: con monto 0 la historia no dice el texto de "Si acertás"/"Si errás" ("+0 pulsos"/"-0 pulsos" vs "0 pulsos"). El DS pide sin rojo en el cero y neutro; se propone "0 pulsos" en `text-muted` en ambas, igual que la tarjeta de resultado, pero es provisorio.
- **Proporción de la barra de tiempo en la referencia**: "0:09" con la barra llena ~70%; con 20 s visibles sería ~45%. Se toma como ejemplo; confirmar que el relleno es tiempo restante / 20 s.
- **Cuenta regresiva y 22 s**: la app muestra 20 s pero el servidor acepta 22; qué se ve del segundo 20 al 22 (cifra en 0:00, botón aún activo o no) no está definido. La regla dice que se acepta si llega entre 20 y 22 s, pero la UI presumiblemente bloquea en 0.
- **Cuánto tengo en juego**: ver Gaps; si el producto quiere un indicador explícito de pulsos disponibles en esta pantalla, hace falta decidirlo.
- **Pasos del `ProgressBar`**: el DS define pasos para los 5 días y la referencia usa 7 pasos de pregunta; se extiende, pero conviene dejarlo documentado en el DS.
- **Cierre tras la 7ª pregunta**: provisorio hasta H17; la navegación de salida de esta pantalla se resuelve en H12/H13/H14.
- **Cambio de opción tras elegir**: la historia no dice si se puede cambiar de opción antes de "Responder" (se asume que sí).
- **Foco/orden de lectura**: no hay referencia sobre el orden para lectores de pantalla (se propone: encabezado, tiempo, enunciado, opciones, píldoras, celdas, "Responder").
