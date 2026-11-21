# Component Map: H12 - Ver el resultado de una respuesta correcta

## Resumen de la historia
Como jugador, quiero ver que acerté, cuántos pulsos gané y la explicación, para aprender y saber cómo quedó mi bolsa.

- Referencia visual: `Pantalla-UI/Pregunta/Respondida.png`.
- Se congela el tiempo, la opción correcta (la elegida) muestra tilde y "Correcta", las demás se atenúan sin labio.
- Tarjeta de resultado: "Acertaste", movimiento con signo ("+5 pulsos") y explicación.
- "Siguiente pregunta" lleva a la próxima; después de la 7ª, el flujo vuelve al detalle de partida como cierre **provisorio** (el resumen del día H17 todavía no está diseñado).
- Monto 0: el movimiento se muestra sin rojo (texto exacto sin referencia).
- Servidor: devuelve si fue correcta, la opción correcta, la explicación y el movimiento del libro de Pulsos; la correcta llega recién después de responder.
- Experiencia: sin festejos; si la ganancia completa un aura no corre `AuraClose` (los pulsos de la bolsa no suman al contador general). Movimiento reducido: la tarjeta aparece sin transición.
- Borde: conexión cortada después de responder; al volver, se muestra el resultado registrado por el servidor.

Componentes verificados contra el DS, sin implementación todavía (no hay código en el repo).

## Referencias revisadas
- `Referencias-y-definiciones/Pantalla-UI/Pregunta/Respondida.png` — pantalla objetivo: chip "PREGUNTA 3 DE 7", botón cerrar, 7 pasos, temporizador en 0:09 con barra, etiqueta "GEOGRAFÍA", enunciado, 4 `AnswerCard` (B correcta con tilde y "CORRECTA", las otras atenuadas), `ResultCard` blanca con "Acertaste" / "+5 pulsos" y explicación, botón `brand` "Siguiente pregunta" al pie.
- `Referencias-y-definiciones/Pantalla-UI/Pregunta/Elegida.png` — estado previo (H11): contraste para ver qué desaparece (`ConfidenceControl`, celdas "Si acertás"/"Si errás", "Responder") y qué se conserva (encabezado, temporizador en 0:09).
- `Trivia_DS_completo.md` secciones 1, 2, 3 (`AnswerCard`, `ProgressBar`, `ResultCard`, `Overlay`), 4 (plantilla Pregunta).
- `App de trivia diseño del MVP.md` — flujo paso 6 y lista "Faltan en las referencias" (resumen del día).

## Pantallas involucradas
- Pregunta, estado "respondida: acierto" — plantilla del DS: **Pregunta** (rama "Al responder: tiempo congelado, `ResultCard` y botón Siguiente pregunta").
- Detalle de partida — plantilla del DS: **Detalle de partida**; destino provisorio tras la 7ª pregunta.

## Componentes del DS a usar
- `AnswerCard` (correcta) — la opción elegida: `brand-soft`, trazo y labio `brand-deep`, disco de letra `brand`, tilde y "Correcta".
- `AnswerCard` (atenuada) x3 — `surface-2`, sin labio ni borde, texto `text-muted`, letra en disco `surface`.
- `ResultCard` (estado Acierto) — "Acertaste", `+5 pulsos` en `brand-text`, explicación en `body`/`text-muted`.
- `ProgressBar` (temporizador, congelado) — barra y cifra quietas en el segundo de respuesta; tono normal (no `urgent`, salvo que se haya respondido con 5 s o menos; ver dudas). Pasos de las 7 preguntas en el encabezado.
- `Button` `brand` — "Siguiente pregunta" (único `brand` de la pantalla).
- `Button` `neutral` cuadrado (icono cerrar) — se mantiene en el encabezado; abre el `Overlay` "¿Salir de la sesión?".
- Chip "Pregunta 3 de 7" (`sky-soft`) y etiqueta del tema.

## Componentes a extender
- `AnswerCard` — ya cubre el estado correcta/atenuada; solo falta definir que, en modo resuelto, las 4 tarjetas son no interactivas (sin hundimiento al presionar).
- `ResultCard` — el DS lo define como bloque estático; falta la regla de anuncio a lector de pantalla cuando aparece (ver Patrones).

## Gaps
- Destino tras la 7ª pregunta (resumen del día H17) — sin referencia (listado en "Faltan en las referencias" del MVP).
  - **Resolución temporal sugerida**: "Siguiente pregunta" en la 7ª vuelve al Detalle de partida, como fin provisorio, hasta que se diseñe H17. Señalar como provisorio.
- Texto del movimiento con monto 0 en acierto — sin referencia (la historia dice "texto exacto sin referencia").
  - **Resolución temporal sugerida**: "0 pulsos" en `text-muted`, sin signo ni color de ganancia, igual que el estado Error con monto 0 del DS. Provisorio. Nota: con monto 0 "acertar paga el doble" da 0, o sea que hay que confirmar si el título sigue siendo "Acertaste".
- Variante del rótulo del botón en la 7ª pregunta — no existe en el DS ("Siguiente pregunta" no tiene sentido después de la última).
  - **Resolución temporal sugerida**: mantener "Siguiente pregunta" (como dice la historia) y no inventar un rótulo nuevo hasta H17.
- Error de red al pedir el resultado / reconexión tras corte — sin referencia.
  - **Resolución temporal sugerida**: no inventar patrón; ver "Riesgos y dudas".

## Tokens relevantes
- Colores: `bg` (pantalla), `surface` (tarjeta de resultado, encabezado), `surface-2` (opciones atenuadas, pista de barras), `brand-soft` + `brand-deep` (correcta), `brand` (disco de letra, botón) con `on-brand`, `brand-text` (+pulsos), `text`, `text-muted`, `sky-soft` (chip), `forest` (pasos jugados), `focus-ring`.
- Tipografía: `display` 800 para "Acertaste", cifra de pulsos, enunciado, temporizador y botones; `body` 600 para explicación y opciones; `label` en mayúsculas para "CORRECTA", etiqueta del tema y chip. Cifras tabulares en el temporizador y los pulsos.
- Espaciado y radios: margen lateral `space-5`; `radius-md` en opciones y botón, `radius-lg` en `ResultCard`, `radius-pill` en chip y barras; `tap-min` 52px; `AnswerCard` mínimo 64px.
- Sombras y labios: `lip-brand` en la correcta y en el botón; `shadow-soft` en `ResultCard`; las atenuadas sin labio.

## Patrones de interacción y movimiento
- Congelado de tiempo: el temporizador deja de correr al responder y muestra la cifra del momento de respuesta (el cronómetro real es del servidor). — Movimiento reducido: igual, no hay animación.
- Aparición de `ResultCard` y atenuado de opciones: transición suave de las tarjetas. — Movimiento reducido: la tarjeta aparece sin transición, y el cambio de estado de las opciones es instantáneo.
- Presión del botón: se hunde 4 px en 100 ms sobre `lip-brand`. — Movimiento reducido: sin transición.
- Sin `AuraClose`, sin confeti, sin sonido, sin vibración de festejo: aunque el acierto lleve la bolsa a un múltiplo de 25, no se dispara nada (la bolsa no suma al aura general).
- Accesibilidad: resultado con palabra e ícono ("Correcta" + tilde, "Acertaste" + signo), nunca solo color; `accessibilityLabel` en la opción correcta del tipo "Opción B, Amazonas, correcta"; mover el foco o anunciar el resultado al aparecer la tarjeta (`aria-live` / anuncio de RN). El anuncio del temporizador queda silenciado al congelarse.
- Navegación: "Siguiente pregunta" carga la pregunta siguiente en un estado de reposo nuevo.

## Datos y autoridad del servidor
- Llega del servidor: acierto (booleano), opción correcta, explicación, movimiento del libro de Pulsos (+N), segundo de respuesta / estado del cronómetro, bolsa actualizada, número de pregunta y si es la última.
- La app nunca calcula: si fue correcta, el pago (el doble de lo puesto), el saldo, el tiempo restante ni el cierre de aura. La opción correcta no existe en el cliente antes de responder.
- Reconexión: al volver tras un corte, la app consulta el resultado registrado y lo muestra; no reenvía ni recalcula.

## Textos de pantalla
- "Pregunta 3 de 7" (chip; la referencia lo muestra en mayúsculas por estilo `label`)
- "Geografía" (etiqueta de tema, ejemplo dinámico)
- "Correcta"
- "Acertaste"
- "+5 pulsos" (ejemplo; valor dinámico)
- Explicación (dinámica; ejemplo: "El Amazonas recorre unos 6.400 km desde los Andes peruanos hasta el Atlántico y es el río más caudaloso del mundo.")
- "Siguiente pregunta"
- Con monto 0 (provisorio): "0 pulsos"
- Cerrar: `accessibilityLabel` "Cerrar" (abre "¿Salir de la sesión?")

## Riesgos y dudas
- **Acierto con monto 0**: el pago es 0, así que no hay ganancia. No está definido si el título sigue siendo "Acertaste" ni el texto del movimiento; se propuso "0 pulsos" en `text-muted`, a confirmar.
- **Destino tras la 7ª**: provisorio al Detalle de partida hasta que exista H17; conviene decidir si el rótulo del botón cambia.
- **Error de red / reconexión**: el caso borde dice "al volver, la app muestra el resultado", pero no define cómo se muestra el estado de carga o de fallo al pedir el resultado; no se eligió patrón.
- **Temporizador congelado**: si se respondió con 5 s o menos, la referencia no aclara si el tono `urgent` (coral) persiste en el estado congelado; el DS define coral solo en el estado "tiempo vencido".
- **Botón cerrar con el resultado visible**: la referencia lo mantiene; qué pasa si se toca con la pregunta ya respondida (el "El tiempo sigue corriendo" del `Overlay` ya no aplica) no está definido.
