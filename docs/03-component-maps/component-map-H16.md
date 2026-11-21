# Component Map: H16 - Salir o perder la conexión a mitad de la sesión

## Resumen de la historia
Como jugador, quiero saber qué pasa si cierro la sesión o se corta la conexión a mitad de las preguntas, para no perder lo que ya respondí.

- El botón cerrar de la pregunta abre el `Overlay` "¿Salir de la sesión?" con el texto "Podés volver mientras la sesión siga abierta. El tiempo de esta pregunta sigue corriendo." y los botones "Salir" (`coral`) y "Seguir jugando" (`neutral`).
- Lo respondido antes de salir queda registrado.
- Al volver dentro de la ventana de 24 h, se retoma en el estado que informa el servidor, sin pantalla intermedia: directo a la pregunta que estaba en pantalla si todavía tiene tiempo (con el tiempo restante) o a la siguiente pendiente; si la que dejó venció, primero se ve en el estado de tiempo vencido (H14) y después sigue la próxima.
- Las preguntas no mostradas no vencen mientras el jugador está afuera. Si la ventana cierra con preguntas sin mostrar, cuentan como error sin pulsos arriesgados y "al menos X" se resuelve con los aciertos registrados.
- Sin conexión: mensaje sin culpa y acción para reintentar; nunca se muestra un resultado que el servidor no confirmó.
- Casos borde: respuesta enviada justo antes de cortarse (al reconectar se muestra lo que registró el servidor); monto elegido sin enviar que vence afuera: error con 0 pulsos, no se pierde el monto.
- Dependencia: H11. Fuera de alcance en esta corrida (no disponibles todavía): H3, H5, H7, H15, H17–H23. Tras la 7ª pregunta la sesión vuelve al detalle de partida como cierre provisorio hasta que se diseñe el resumen del día (H17).

## Referencias revisadas
- `Referencias-y-definiciones/Pantalla-UI/Pregunta/Elegida.png` — encabezado de la pregunta: chip "PREGUNTA 3 DE 7", botón cerrar cuadrado `neutral` con "X" arriba a la derecha, 7 pasos, temporizador (barra + "0:09"), tema, enunciado, 4 `AnswerCard`, `ConfidenceControl`, celdas de ganancia/pérdida y botón "Responder" (`brand`). Es la única referencia: el `Overlay` y los estados sin conexión no tienen imagen.
- `Trivia_DS_completo.md` — secciones 1 (voz, color, movimiento, accesibilidad), 2.7 (sombras/labios), 3 (`Button`, `ProgressBar`, `ResultCard`, `Overlay`), 4 (plantilla Pregunta) y 6 (Expo/RN).
- `App de trivia diseño del MVP.md` — casos borde de sesión interrumpida, ventana de 24 h y "Faltan en las referencias" (el resumen del día no tiene referencia).
- Código: no existe implementación; componentes verificados contra el DS, sin implementación todavía.

## Pantallas involucradas
- Pregunta (con el botón cerrar y el `Overlay` "¿Salir de la sesión?" encima) — plantilla del DS: Pregunta.
- Pregunta en estado de tiempo vencido, al retomar tarde — plantilla del DS: Pregunta (`ResultCard` de tiempo vencido).
- Pregunta al retomar con tiempo restante o siguiente pendiente — plantilla del DS: Pregunta.
- Estado sin conexión / error al reanudar — sin plantilla (gap).
- Detalle de partida, como cierre provisorio de la sesión y destino de "Salir" — plantilla del DS: Detalle de partida.

## Componentes del DS a usar
- `Overlay` "Salir de la sesión" — velo + tarjeta `surface`, `radius-lg`, `shadow-float`; título en `display`, texto en `body`, dos botones.
- `Button` `coral` "Salir" — destructiva; el DS define `coral` como "abandonar".
- `Button` `neutral` "Seguir jugando" — secundaria.
- `Button` `neutral` cuadrado (icon button, "X") — botón cerrar del encabezado de la pregunta, según `Elegida.png` y la plantilla.
- `ProgressBar` (temporizador) — al retomar muestra el tiempo restante que informa el servidor; tono `urgent` con 5 s o menos; con tiempo 0, en `coral`.
- `ProgressBar` (pasos de las 7 preguntas) — refleja las ya registradas al reanudar.
- `ResultCard` (estado tiempo vencido) — al volver tarde: "Se terminó el tiempo", "0 pulsos" en `text-muted`, "Cuenta como error, no perdiste pulsos." y explicación.
- `AnswerCard` (correcta + 3 atenuadas) — dentro del estado de tiempo vencido.
- `Button` `brand` "Siguiente pregunta" — único botón fuerte de la pantalla en el estado vencido.
- `Button` `brand` "Responder" — en la pregunta retomada; un solo `brand` por pantalla.
- `ConfidenceControl` (por pregunta) y `AnswerCard` en reposo — pregunta retomada con tiempo, sin selección previa (lo elegido sin enviar no llegó al servidor).

## Componentes a extender
- `Overlay` — hoy lo documentan dos usos (monto "Otro" y salir). Hace falta definir de forma explícita el comportamiento de tocar el velo en "Salir de la sesión": el DS dice "equivale a cancelar", o sea "Seguir jugando".
- `Button` (icon button cuadrado) — el DS lo usa en la plantilla y en `bundle.css` (`d-iconbtn`) pero no está listado como variante propia; hay que confirmar que es `neutral` con forma cuadrada de `tap-min`, sin sumar una quinta variante. Requiere `accessibilityLabel` ("Cerrar").

## Gaps
- Aviso de sin conexión / error al reanudar — la historia pide "mensaje sin culpa y acción para reintentar", pero no hay componente ni referencia — sin referencia / no existe en el DS.
  - **Resolución temporal sugerida (provisoria)**: reutilizar `Overlay` de un solo botón `brand` "Reintentar" y texto sin culpa, o un bloque `surface` dentro de la pantalla con `Button` `neutral` "Reintentar". Dejar la decisión a diseño (ver Riesgos).
- Estado de espera mientras se consulta al servidor al volver (cargando) — no hay patrón de carga en el DS; la historia dice "sin pantalla intermedia" — no existe en el DS.
  - **Resolución temporal sugerida (provisoria)**: mantener la pantalla anterior o la barra de pasos sin contenido; mostrar la pregunta solo cuando el servidor confirmó el estado. No inventar splash.
- Resumen del día tras la 7ª pregunta — sin referencia y fuera de alcance (H17).
  - **Resolución temporal sugerida (provisoria)**: volver al detalle de partida (`Detalle de partida`) con "Jugar la sesión" ya no disponible; sin diseño nuevo.
- Estado de la pregunta "ya registrada" al reconectar tras una respuesta enviada justo antes del corte — reutiliza `ResultCard` acierto/error (sin referencia para error, ver DS); el DS lo define textual, no hay imagen — sin referencia.
  - **Resolución temporal sugerida (provisoria)**: mostrar el `ResultCard` correspondiente con lo que registró el servidor, mismo armado que la plantilla.
- Comportamiento si la ventana de 24 h ya cerró al volver — la historia no lo define visualmente — sin referencia.
  - **Resolución temporal sugerida (provisoria)**: ir al detalle de partida con la sesión como terminada; la partida se ve según lo que informe el servidor.

## Tokens relevantes
- Colores: `bg` (velo oscurecido sobre la pantalla; el DS no nombra el token del scrim), `surface` (tarjeta del `Overlay`), `text` y `text-muted` (cuerpo del aviso y "0 pulsos"), `coral` / `on-coral` / `coral-deep` (botón "Salir" y su labio), `surface` + `lip-neutral` + `line-strong` (botón cerrar y "Seguir jugando"), `brand` / `on-brand` / `lip-brand` ("Responder", "Siguiente pregunta"), `danger-text` (cifra del temporizador en urgente), `focus-ring`.
- Tipografía: título del `Overlay` en `display` 800; texto en `body` (Nunito 600); botones en `display` 800; cifra del temporizador con cifras tabulares.
- Espaciado y radios: margen lateral `space-5`; tarjeta del `Overlay` `radius-lg`; botones `radius-md`; barras `radius-pill`; alto mínimo de botones `tap-min` (52 px).
- Sombras y labios: `shadow-float` (tarjeta del `Overlay`), `lip-coral`, `lip-neutral`, `lip-brand`.

## Patrones de interacción y movimiento
- Presión con labio: los dos botones del `Overlay` y el botón cerrar se hunden 4 px en 100 ms — Movimiento reducido: sin transición, cambio de estado inmediato.
- Apertura y cierre del `Overlay`: el DS no especifica animación; abrir con el velo sin animación elaborada — Movimiento reducido: aparición instantánea.
- Tocar el velo = cancelar = "Seguir jugando"; el foco inicial debería ir al botón menos destructivo.
- Temporizador: sigue corriendo mientras el `Overlay` está abierto; se muestra el valor que informa el servidor al reanudar. Anuncio a lectores de pantalla solo en 10, 5 y 0 s.
- Retomar: sin pantalla intermedia; si la pregunta venció, se entra directo al `ResultCard` de tiempo vencido (sin animación de festejo ni de pérdida).
- Sin `AuraClose` ni animaciones de pérdida en este flujo.

## Datos y autoridad del servidor
- Llega del servidor: estado de la sesión (preguntas respondidas, pregunta en pantalla, pendientes), tiempo restante de la pregunta en pantalla, resultado de cada respuesta ya registrada (correcta, pulsos, explicación), ventana vigente o cerrada, resolución de "al menos X" cuando corresponde.
- La app nunca calcula: pulsos ganados o perdidos, vencimiento, cronómetro (no reanuda ningún tiempo local), resolución de "al menos X", ni si una respuesta llegó a tiempo. Nunca muestra un resultado que el servidor no confirmó. Una pregunta empieza a correr solo cuando el servidor la entrega. El monto elegido sin tocar "Responder" no se envía ni se persiste como pérdida.

## Textos de pantalla
- "¿Salir de la sesión?"
- "Podés volver mientras la sesión siga abierta. El tiempo de esta pregunta sigue corriendo."
- "Salir"
- "Seguir jugando"
- accessibilityLabel del botón cerrar: "Cerrar" (propuesto, no está en la referencia)
- "Pregunta 3 de 7" (chip, de la referencia; en el componente va con `label` en mayúsculas)
- "Se terminó el tiempo"
- "0 pulsos"
- "Cuenta como error, no perdiste pulsos."
- "Siguiente pregunta"
- "Responder"
- "Si errás" (celda de pérdida; la referencia dice "Si errás o vence", corregido según el DS)
- "Otro" (píldora de monto libre; la referencia dice "Libre", corregido según el DS)
- Mensaje sin conexión y botón de reintento: sin texto definido (propuesta provisoria para validar: "No pudimos conectarnos. Tus respuestas están a salvo." / "Reintentar"). La frase de "a salvo" afirma algo del servidor y debe validarse con producto antes de usarla.

## Riesgos y dudas
- **Feedback de sin conexión sin definir**: la historia no dice si va como `Overlay`, bloque en pantalla o banner. Es un punto típico de inconsistencia entre historias (H11, H12, H13 y otras también piden "reintentar"); conviene un único patrón decidido por diseño. No se eligió uno.
- Tocar el velo del `Overlay` equivale a cancelar según el DS, pero con "Salir" destructiva conviene confirmar que no sale por accidente (aquí no sale: cancelar = "Seguir jugando").
- Cuando "Salir" se confirma, el destino no está especificado en la historia; se asumió el detalle de partida (provisorio, igual que el cierre tras la 7ª pregunta hasta que exista H17).
- El texto "El tiempo de esta pregunta sigue corriendo" aparece también cuando el jugador sale tras haber elegido monto sin enviar: no avisa que ese monto no se pierde si vence. Evaluar si el aviso debería aclararlo (hoy se respeta el texto de la historia).
- No hay token documentado para el velo (scrim) del `Overlay`; hay que definirlo en el DS.
- Reintento tras un reporte duplicado u otras historias no se cruzan aquí; la consistencia con H11 (respuesta enviada) y H14 (tiempo vencido) la revisa el `consistency-checker`.
