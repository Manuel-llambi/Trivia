# Component Map: H14 - Ver el resultado cuando vence el tiempo

## Resumen de la historia
- **Descripción**: Como jugador, quiero saber que se me acabó el tiempo y cuál era la correcta, para entender qué pasó y seguir con la próxima pregunta.
- **Referencias visuales**: sin imagen de referencia; definido en texto y armado con `AnswerCard` y `ResultCard` como `Pregunta/Respondida.png`.
- **Reglas de producto**: pasarse del tiempo cuenta como error; el servidor acepta hasta 22 s. Si se acaba el tiempo sin tocar "Responder", el monto elegido nunca llegó al servidor: error con 0 pulsos. Una respuesta enviada con "Responder" que llega después de los 22 s también es error con 0 pulsos (una mala conexión no cuesta pulsos). Primer flujo, paso 6.
- **Criterios de aceptación**:
  - Al llegar a 0 la barra, la app deja de aceptar cambios y espera el resultado del servidor.
  - Temporizador en 0 con tono urgente (barra `coral`, cifra en `danger-text`); la correcta dice "Correcta", las otras tres se atenúan; ninguna se muestra como elegida.
  - Tarjeta con título "Se terminó el tiempo", movimiento "0 pulsos" en `text-muted` (sin pérdida aunque hubiera monto elegido) y debajo "Cuenta como error, no perdiste pulsos." seguido de la explicación.
  - Botón "Siguiente pregunta".
- **Autoridad del servidor**: el servidor decide el vencimiento (la cifra de la app es solo visual); monto elegido sin enviar no llega: error con 0 pulsos, la bolsa no cambia; respuesta enviada que llega después de los 22 s: igual.
- **Experiencia**: texto sin culpa; sin rojo en el 0.
- **Casos borde**: enviada a los 19 s y llegada a los 21 s: se acepta. Llegada después de los 22 s: error con 0 pulsos, sin perder el monto. App en segundo plano o cerrada con monto sin enviar: el tiempo siguió corriendo; al volver tarde cuenta como vencida (H16).
- **Dependencias**: H11. **Prioridad**: alta.

## Referencias revisadas
- `Referencias-y-definiciones/Pantalla-UI/Pregunta/Respondida.png` — estructura del estado respondido: encabezado con chip, 7 pasos, barra y cifra; opciones atenuadas (`surface-2`, letra en disco blanco); correcta en `brand-soft` con trazo y labio `brand-deep`, tilde y "CORRECTA"; `ResultCard` con título a la izquierda y movimiento a la derecha; botón `brand` "Siguiente pregunta" abajo. El `ConfidenceControl` y el botón "Responder" desaparecen. Ojo: la imagen muestra la barra en `brand` con 0:09; el estado a 0 no está dibujado.
- `Referencias-y-definiciones/Pantalla-UI/Pregunta/Elegida.png` — estado previo (opción elegida, píldoras de monto, celdas "Si acertás" / "Si errás o vence", "Responder"). Se usa para saber qué se reemplaza al vencer. La celda "Si errás o vence" no se copia.
- `Trivia_DS_completo.md` secciones 1 a 4 y 6 — tabla "Tiempo vencido" de `ResultCard`, `ProgressBar`, `AnswerCard`, `Overlay`, plantilla Pregunta, voz y accesibilidad.
- `App de trivia diseño del MVP.md` — reglas de tiempo por pregunta (22 s), respuesta tardía, paso 6 del primer flujo, decisión "Estados de error y tiempo vencido" (sin imagen).
- No se leyeron `card_states.png`, `cierre_light.png` ni las animaciones: la historia no toca cards de partida ni el cierre de aura.
- Código: no existe implementación; componentes verificados contra el DS, sin implementación todavía.

## Pantallas involucradas
- Pregunta, estado "tiempo vencido" — plantilla del DS: **Pregunta** ("Al vencer el tiempo: temporizador en 0, `ResultCard` de tiempo vencido y el mismo botón").
- Pregunta siguiente (H11/H12) — el botón "Siguiente pregunta" lleva a la pregunta 4 a 7. Tras la 7ª, lleva al Resumen del día (H17), cuyo `brand` "Ver partida" vuelve al Detalle de partida (plantilla **Detalle de partida**) (N2, PO 23/11/2026).

## Componentes del DS a usar
- `ProgressBar` (temporizador, tono `urgent`, valor 0) — barra `coral` y cifra "0:00" en `danger-text` con `data-tone="urgent"`.
- `ProgressBar` (pasos de las 7 preguntas) — el paso actual queda como respondido (`forest`) al seguir; mismo comportamiento que H12.
- `AnswerCard` (correcta) — la opción correcta con `brand-soft`, trazo y labio `brand-deep`, tilde y "Correcta".
- `AnswerCard` (atenuada) x3 — las otras tres opciones, `surface-2`, sin labio ni borde, texto `text-muted`, letra en disco `surface`.
- `ResultCard` (estado Tiempo vencido) — título "Se terminó el tiempo", movimiento "0 pulsos" en `text-muted`, línea "Cuenta como error, no perdiste pulsos." y explicación en `body` / `text-muted`.
- `Button` `brand` — "Siguiente pregunta", única acción fuerte de la pantalla.
- Chip "Pregunta N de 7" (`sky-soft`) y botón cerrar `neutral` cuadrado del encabezado, sin cambios; el cerrar sigue abriendo el `Overlay` de H16.

## Componentes a extender
- `ResultCard` — el estado "Tiempo vencido" ya está en la tabla del DS; falta documentar un tercer renglón de texto (la línea "Cuenta como error, no perdiste pulsos." antes de la explicación). No requiere variante nueva de componente, pero conviene que la prop de movimiento acepte el tono neutro (`text-muted`) con "0 pulsos".
- `ProgressBar` (temporizador) — definir el valor 0 en tono urgente: hoy el DS cubre "5 s o menos" pero no cómo se ve la barra vacía a 0.
- `AnswerCard` — ya admite "correcta" y "atenuada"; se necesita poder mostrarlas sin ninguna "elegida" (el estado se arma solo con la respuesta correcta del servidor).

## Gaps
- **Estado "tiempo vencido" sin imagen** — sin referencia.
  - **Resolución temporal sugerida**: armarlo como la tabla del DS (`AnswerCard` correcta + 3 atenuadas + `ResultCard`), con la composición y espaciado de `Respondida.png`. Provisorio hasta tener imagen.
- **Barra de tiempo en 0 con tono urgente** — a 0 el relleno mide 0, así que el `coral` no se ve; el criterio pide "barra `coral`". — no existe en el DS.
  - **Resolución temporal sugerida**: dejar la pista `surface-2` vacía con la cifra "0:00" en `danger-text` como único indicador visible del tono urgente (la cifra siempre se muestra). Marcar como duda.
- **Estado de espera del servidor al llegar a 0** — la historia dice que la app "espera el resultado" pero no hay diseño del intermedio (sin la correcta todavía). — sin referencia.
  - **Resolución temporal sugerida**: mantener la pantalla de pregunta con las opciones inertes (sin cambio de estilo) y el botón "Responder" deshabilitado, sin spinner nuevo, hasta que llegue el resultado; no mostrar "Se terminó el tiempo" antes de que el servidor lo confirme.
- **Error de red al pedir el resultado** — si falla la consulta tras vencer el tiempo, no hay patrón definido. — sin referencia.
  - **Resolución temporal sugerida**: ninguna; queda como duda (ver Riesgos).
- **Respuesta enviada pero tardía (más de 22 s)** — el jugador sí había tocado "Responder" y quizá vio su opción como elegida; el resultado es el mismo "Se terminó el tiempo". — sin referencia sobre cómo se muestra su opción.
  - **Resolución temporal sugerida**: mostrar exactamente el mismo estado de tiempo vencido (ninguna elegida ni incorrecta), con el texto "Cuenta como error, no perdiste pulsos.".

## Tokens relevantes
- Colores: `coral` (barra del temporizador a 0), `danger-text` (cifra del tiempo), `brand-soft` + `brand-deep` (correcta), `surface-2` / `text-muted` / `surface` (atenuadas), `surface` (tarjeta), `text` (título), `text-muted` ("0 pulsos" y textos de apoyo), `on-brand` + `brand` + `brand-deep` (botón), `bg`, `sky-soft` (chip de pregunta), `brand-text` no se usa (no hay ganancia).
- Tipografía: `display` para título "Se terminó el tiempo" y cifras; `body` para la explicación; `body-sm` para la línea "Cuenta como error..." si se separa visualmente; `label` para el chip y la etiqueta del tema. Cifras tabulares en el tiempo y en "0 pulsos".
- Espaciado y radios: `space-5` margen lateral, `space-4` relleno de la tarjeta, `space-2`/`space-3` entre opciones; `radius-md` en opciones y botón, `radius-lg` en `ResultCard`, `radius-pill` en barra y chip.
- Sombras y labios: `shadow-soft` en `ResultCard`; `lip-brand` en el botón "Siguiente pregunta"; `brand-deep` en la correcta; las atenuadas no llevan labio.

## Patrones de interacción y movimiento
- **Cierre de entrada al llegar a 0**: la app congela monto, opciones y "Responder" (no acepta cambios) y espera el resultado — Movimiento reducido: igual, no hay animación.
- **Transición a estado vencido**: las tres opciones pasan a atenuadas, la correcta a "Correcta", aparece `ResultCard`. Sin animación especial; no hay festejo ni destello (no es un acierto). Con movimiento reducido: cambio instantáneo, sin transición.
- **Presión de "Siguiente pregunta"**: se hunde 4 px sobre `lip-brand` en 100 ms — Movimiento reducido: sin transición.
- **Accesibilidad**: anunciar el tiempo a lectores de pantalla en 0 (además de 10 y 5); anunciar el resultado ("Se terminó el tiempo. Cuenta como error, no perdiste pulsos.", la correcta); la correcta lleva palabra "Correcta" e ícono de tilde, nunca solo color; táctil del botón de al menos `tap-min`.
- **Foco**: al aparecer el resultado, mover el foco al título del `ResultCard` o al botón "Siguiente pregunta" (a decidir, ver dudas).

## Datos y autoridad del servidor
- Llega del servidor: confirmación de que el tiempo venció, cuál es la opción correcta (recién ahora), la explicación, el movimiento de pulsos (siempre 0), la bolsa sin cambios y si hay más preguntas.
- La app nunca calcula: el vencimiento (la barra y la cifra son solo visuales), qué respuesta llegó a tiempo (ventana de 22 s), la resolución de pulsos ni cuál es la correcta. No decide si un monto elegido sin enviar se cobra: el servidor nunca lo recibió, así que es 0.

## Textos de pantalla
- "Se terminó el tiempo"
- "0 pulsos"
- "Cuenta como error, no perdiste pulsos."
- "Correcta"
- "Siguiente pregunta"
- "Pregunta N de 7" (chip, sin cambios), etiqueta del tema en mayúsculas, enunciado y opciones: datos de la pregunta
- Explicación de la pregunta (dato del servidor)
- Aviso de accesibilidad (provisorio): el texto de lector de pantalla para 0 segundos no está definido en las fuentes.
- Correcciones de tipeo: no aplican textos con errores de las referencias en este estado; la celda "Si errás o vence" de `Elegida.png` no aparece (los controles de monto ya no se muestran).

## Riesgos y dudas
- **Barra a 0 en `coral`**: no se ve con 0 de relleno; falta definir si se mantiene una barra completa coral o vacía con cifra roja. Es la duda visual principal.
- **Qué pasa con `ConfidenceControl` y "Responder" al vencer**: en `Respondida.png` desaparecen; se asume lo mismo. Falta confirmar si se ocultan o se deshabilitan en el instante de llegar a 0, antes de la respuesta del servidor.
- **Error de red al pedir el resultado**: no hay patrón de feedback definido; no se eligió ninguno para evitar inconsistencias con otras historias.
- **Respuesta tardía con opción elegida**: no está definido si se muestra la opción como "Elegida" un instante antes de resolver; se supone que no queda ninguna marcada.
- **Pregunta 7**: "Siguiente pregunta" lleva al Resumen del día (H17); sigue abierto si el rótulo cambia.
- **Foco y anuncio a 0 s**: el DS pide anunciar el tiempo en 10, 5 y 0, pero no dice si el anuncio de "Se terminó el tiempo" se combina con el del resultado.
- **Retorno desde H16**: si el jugador vuelve tarde, ve primero este estado y sigue; el flujo depende de H16 y no se resolvió aquí.
