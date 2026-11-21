# Reporte de consistencia entre historias mapeadas

Generado a partir de: component-map-H1, H2, H4, H6, H8, H9, H10, H11, H12, H13, H14, H16 (los 12 de esta corrida; no hay otros mapas en la carpeta).
Fecha: 2026-11-17

Este reporte es informativo. No elige resoluciones ni modifica los mapeos. Las resoluciones del PO están en la sección "Resoluciones (17/11/2026)" al final: mandan sobre los mapas, que quedan congelados.

## Conflictos detectados

### Conflicto 1: Patrón de error de red, reintento y carga (el más amplio)
- **Historias involucradas**: H1, H2, H4, H6, H8, H9, H10, H11, H12, H13, H14, H16 (las 12)
- **Qué pasa**: cada mapa propuso (o dejó sin proponer) una solución distinta para el mismo problema. Todas se declaran provisorias y piden una decisión común.
- **Error + reintento**:
  - H1: la pastilla `AuraCounter` sin cifras, con ícono de reintento o tocando la pastilla; botón `ghost`; texto "No pudimos cargar tu aura. Reintentar".
  - H2: texto breve dentro de una card `surface` + `Button neutral` "Reintentar".
  - H4: texto sin culpa + `Button neutral` "Reintentar".
  - H6: texto `body-sm`/`text-muted` bajo la bajada y el mismo botón `brand` vuelve a "Descubrir tema" como reintento ("No pudimos traer el tema. Probá de nuevo.").
  - H10: texto `body-sm`/`text-muted` sobre el botón y el mismo `brand` "Jugar la sesión" como reintento ("No pudimos empezar la sesión. Tus montos siguen guardados, probá de nuevo.").
  - H16: dos alternativas, un `Overlay` de un solo botón `brand` "Reintentar" o un bloque `surface` con `neutral` "Reintentar" ("No pudimos conectarnos. Tus respuestas están a salvo.").
  - H8, H9, H11, H12, H13, H14: no proponen nada ("no se eligió patrón"). H8 solo dice "dejar el monto sin guardar".
- **Carga**:
  - H1: pastilla con pista vacía, sin número ni "/25", con `accessibilityLabel` "Cargando tu aura".
  - H2: bloque `surface-2` con la geometría de la card, sin cifras.
  - H4: placeholders `surface-2` con la forma de las filas.
  - H8: placeholder estático en la descripción y la celda.
  - H14: opciones inertes con "Responder" deshabilitado y sin spinner, sin mostrar "Se terminó el tiempo" hasta que confirme el servidor.
  - H16: mantener la pantalla anterior, sin splash.
  - H10 y H11: botón deshabilitado con el mismo rótulo, sin spinner.
- **Por qué importa**: la variante del botón de reintento (`ghost` / `neutral` / `brand` reutilizado / `brand` en `Overlay`), el lugar del mensaje (card, texto suelto, `Overlay`, bloque) y el texto no coinciden. Además hay tres códigos distintos de "sin culpa". Es la decisión que más historias bloquea.

### Conflicto 2: Texto y estado cuando el monto es 0
- **Historias involucradas**: H8, H9, H11, H12 (con H13 y H14 alineados con el DS)
- **Celda "Si acertás" con monto 0**:
  - H8: celda neutra `surface-2`, "+0 pulsos" en `text-muted` y sin "Cobrás N total", o directamente ocultarla.
  - H9: mostrarla siempre, con "0 pulsos" en `text-muted` y "Cobrás 0 total", sin signo ni verde.
  - H11: su sección Textos dice "+0 pulsos" / "-0 pulsos", pero Riesgos propone "0 pulsos" en `text-muted` en ambas celdas (contradicción interna).
- **Movimiento de `ResultCard`**:
  - H12: acierto con monto 0, "0 pulsos" en `text-muted`; duda si el título sigue siendo "Acertaste".
  - H13 y H14: "0 pulsos" en `text-muted`, consistente con el DS (tabla de `ResultCard`).
- **Por qué importa**: hay tres textos para lo mismo ("+0 pulsos", "0 pulsos", celda oculta). Con 0 el DS pide neutro, sin signo ni rojo. Queda sin definir si la celda se muestra, si lleva "Cobrás 0 total" y si el título de H12 es "Acertaste".

### Conflicto 3: Vista previa de pulsos en el cliente vs. "la app nunca calcula"
- **Historias involucradas**: H8, H9, H10, H11 (también H1 por la derivación del aura)
- **En H8**: la sección de datos dice "la app nunca calcula lo que se cobra" y que la celda muestra lo que el servidor entrega o valida. Pero el chip de disponibles baja "en el momento" (62 a 57) al guardar, y Riesgos admite la tensión: no resuelve si la celda se recalcula al instante o espera al servidor.
- **En H9**: la celda se "recalcula en cada cambio" y cualquier cálculo local es "una anticipación visual". Calcula localmente el límite de "Otro" (disponibles + monto ya guardado).
- **En H10**: el chip de disponibles es "una anticipación local de resta".
- **En H11**: "Si acertás +N" y "Si errás -N" son "anticipación de presentación (doble y monto)". Eso implica que el cliente multiplica por 2.
- **En H1**: el cliente deriva `aura = floor(saldo/25)` y `tramos = saldo mod 25` (declarado como derivación para dibujar).
- **Por qué importa**: no hay una regla única. H8 asume cifras que entrega el servidor, mientras H9, H10 y H11 asumen cálculo local (multiplicar, restar). Hay que decidir si estas vistas previas son aceptables. Si no lo son, cada cambio de monto necesita pedirle la cifra al servidor, con su latencia, carga y error.

### Conflicto 4: Temporizador en 0 y congelado con 5 s o menos
- **Historias involucradas**: H11, H12, H13, H14, H16
- **En H14**: a 0 el relleno mide 0, así que el `coral` no se ve. Deja la pista vacía con la cifra "0:00" en `danger-text` como único indicador. Es la duda visual principal. El DS (tabla de `ResultCard`) dice "En 0, en `coral`".
- **En H12**: congelado, tono normal salvo que se haya respondido con 5 s o menos. Dice que "el DS define coral solo en el estado tiempo vencido" y no aclara si el `urgent` persiste.
- **En H13**: criterio "conservador", mantener el tono que tenía al responder (puede quedar `coral`).
- **En H11**: no define qué se ve del segundo 20 al 22 (cifra en 0:00, botón activo o no). También duda si la barra puede actualizarse por pasos con movimiento reducido.
- **En H16**: al retomar, con tiempo 0 en `coral` y `urgent` con 5 s o menos.
- **Por qué importa**: congelado con 5 s o menos hay dos criterios opuestos (H12 tono normal, H13 mantener `coral`). El 0 vencido y el tramo 20–22 s no tienen apariencia definida. En H14 el "ocultar vs deshabilitar" `ConfidenceControl` y "Responder" al llegar a 0 sigue sin decidir.

### Conflicto 5: Píldoras de monto que superan lo disponible
- **Historias involucradas**: H8, H9, H11
- **En H8**: se deshabilitan las píldoras cuyo monto supera lo disponible (`surface-2`, sin labio) y 0 queda activa.
- **En H11**: igual que H8, píldora deshabilitada (`surface-2`, `text-muted`).
- **En H9**: se dejan habilitadas y se ajusta el valor al máximo al elegir, "igual que en el `Overlay`".
- **Por qué importa**: es el mismo componente `ConfidenceControl` con dos comportamientos. Las historias H8 y H9 comparten pantalla y estado.

### Conflicto 6: Ventana que vence mientras se mira la pantalla
- **Historias involucradas**: H2, H4, H10 (H6 la deja sin resolver)
- **En H2**: sacar el `brand`, congelar el chip en neutro y ofrecer `Button neutral` "Ver ranking".
- **En H4**: el botón "Jugar la sesión" desaparece sin transición, y el subtítulo "Cierra en 6 h" pasa a "Cerrada" o similar (formato a definir).
- **En H10**: tratarlo como error de confirmación con texto neutro y sin reintento útil.
- **En H6**: no define nada (H22 fuera de alcance).
- **Por qué importa**: el mismo evento tiene tres resoluciones. Falta saber qué texto se ve y si queda un botón alternativo.

### Conflicto 7: Contenido y botón del aviso de ayuda "?"
- **Historias involucradas**: H6, H8, H9, H10
- **En H6**: `Overlay` con título, texto corto y botón `ghost` "Cerrar".
- **En H8**: `Overlay` informativo con un solo botón `neutral`.
- **En H9 y H10**: lo marcan pendiente y no proponen nada.
- **Por qué importa**: la variante del botón de cierre difiere (`ghost` vs `neutral`) y nadie define el texto. H6 dice que es de H8; H8 espera una definición.

### Conflicto 8: Texto del neto negativo y singular/plural
- **Historias involucradas**: H2, H4 (también H8, H9, H11, H12, H13 por el singular)
- **En H2**: "-8 pulsos perdidos" y "+12 pulsos ganados" (de las referencias).
- **En H4**: la tarjeta "Tu puesto" usa "+24 pulsos ganados" y deja sin texto el caso negativo. Pregunta si es "-8 pulsos perdidos" o "-8 pulsos", sin culpa. Lo marca como "la duda más importante".
- **En H13**: duda si se singulariza "-1 pulso", y el DS siempre dice "pulsos". El resto de las historias usa "N pulsos" sin plantear el 1.
- **Por qué importa**: el mismo concepto (neto de la partida) tiene un texto en H2 y ninguno en H4. El singular del 1 afecta a todas las cifras con "pulsos".

### Conflicto 9: Botón de ícono cuadrado (volver / cerrar)
- **Historias involucradas**: H4, H11, H12, H13, H14, H16
- **En H4**: botón volver sobre `forest`, `neutral` "o `ghost`", sin decidir; la referencia usa translúcido de unos 44 px.
- **En H11, H12, H13, H14 y H16**: `Button neutral` cuadrado de `tap-min` con `accessibilityLabel` "Cerrar". H16 señala que el ícono cuadrado no figura como variante en el DS.
- **Por qué importa**: es el mismo patrón con dos o tres resoluciones. Corre riesgo de abrir una quinta variante de botón.

## Violaciones de reglas del DS o del MVP
- **H6**: vibración al frenar el carrete. El DS reserva la vibración suave para el cierre de aura ("único festejo"). La historia la pide y el mapa la marca como contradicción. Provisoriamente la omite con movimiento reducido (DS sección 1, Movimiento; CLAUDE.md "Sin estética de casino").
- **H11**: la celda "Si errás" va siempre en `coral-soft` con `danger-text`, y con monto 0 muestra "0 pulsos" (o "-0 pulsos" en Textos). Es color de pérdida con cero, una forma de "rojo en el cero" (DS sección 1, Aura y pulsos; CLAUDE.md "sin rojo en el cero"). H13 y H14 sí resuelven el cero en `text-muted`.
- **H2**: varias cards "te toca" generarían varios `Button brand` "Jugar" en el Inicio ("un color fuerte por pantalla"). El mapa lo marca como duda y no resuelve.

## A confirmar
- `Overlay` con botón fuerte sobre una pantalla que ya tiene `brand` o `coral` (H8, H9 y H11 "Guardar" `brand` sobre "Jugar la sesión" / "Responder"; H11 y H16 "Salir" `coral`). El DS lo prevé para el `Overlay`, pero conviene confirmar que el velo cuenta como pantalla aparte.
- "Guardar" `neutral` en `TopicBetCard` vs `brand` en el `Overlay`: H8 y H9 coinciden, no hay conflicto. El DS dice `neutral` en la tarjeta (la referencia lo dibuja blanco con borde) y `brand` en el `Overlay`.
- Valores fijos que deberían venir de configuración: la constante 25 pulsos por aura (H1; el MVP no la lista), las píldoras 0/1/5/10, el umbral X de 4 a 7, y los 20 s / 22 s.
- Rótulo del botón "Siguiente pregunta" en la 7ª (H12, H13, H14 coinciden en volver al Detalle de partida; solo H12 y H13 dudan del rótulo).
- "Acertaste" con monto 0 (H12): el pago es 0.
- H11 no muestra chip de pulsos disponibles y usa la celda "Si errás" como lo que está en juego, mientras que H8, H9 y H10 sí usan el chip. "Siempre se ve cuánto tengo en juego" queda sin resolver de forma común.
- Qué pasa con una tarjeta de tema abierta con cambios sin guardar al tocar "Jugar la sesión" (H10 propone confirmar solo lo guardado), y si el monto guardado persiste al salir (H8). H9 duda si el X se envía con monto 0.
- Control segmentado ("Te toca/Jugadas/Todas" en H1/H2, "Ranking/Historial" en H4): solo H4 lo resuelve, con una pista `surface-2`. No hay componente nombrado en el DS.
- El chip de la tarjeta cerrada de H9 muestra solo el monto, no el X elegido.
- Referencias desactualizadas (la imagen de estados de la card, `card_states.png`, eliminada el 17/11/2026 por desactualizada; chip de disponibles en 62 con montos guardados en H8 y H9): los mapas siguen el MVP y el DS.
- Texto "Tus respuestas están a salvo" propuesto en H16: afirma algo que solo sabe el servidor.
- Aviso a lectores de pantalla en 0 s (H14) y orden de lectura/foco al aparecer el resultado (H11, H12, H14): no definidos.

## Sin conflictos detectados
- Tema revelado, "Jugar la sesión" como único `brand` y textos corregidos de las referencias (tildes, "Otro", "Si errás"): consistentes entre H6, H8, H9 y H10.
- Destino tras la 7ª pregunta (Detalle de partida, provisorio): igual en H11, H12, H13, H14 y H16.
- Expulsado: card neutra en H2 y fila `data-out` en H4, ambas sin rojo.
- Nadie usa "apuesta"/"monedas" en textos de pantalla.
- La respuesta correcta nunca llega antes de responder: coherente en H11 a H16.

## Resumen
- Historias revisadas: 12
- Conflictos: 9
- Violaciones de reglas: 3
- A confirmar: 13

## Resoluciones (17/11/2026)

Decididas por el PO. Esta sección manda sobre los mapas de componentes (que no se editan): quien implemente lee el mapa y aplica estas resoluciones encima. Ya están volcadas en `Trivia_DS_completo.md`, `App de trivia diseño del MVP.md`, `docs/02-historias/historias.md` y `PRD - Trivia confianza MVP.md`.

### Conflictos

- **Conflicto 1 (carga, error y reintento) → R1.** Patrón único "Carga y error" del DS para toda la app. Carga: esqueletos `surface-2` con la forma del contenido, sin spinner; un botón que espera al servidor queda deshabilitado con el estilo deshabilitado del DS (`surface-2`, sin labio) y el mismo rótulo. Error: un bloque donde iría el contenido, o justo encima del botón que falló, en `surface-2`, con "No pudimos conectarnos. Revisá tu conexión y probá de nuevo." en `text-muted` y `neutral` "Reintentar". Sin rojo. En "Responder" y "Jugar la sesión" la app reintenta sola 2 veces antes de mostrar el bloque. Reemplaza todas las variantes propuestas (`ghost` en H1, `brand` reutilizado en H6 y H10, `Overlay` en H16) y sus textos.
- **Conflicto 2 (monto 0) → R3.** Por pregunta, "Si acertás" y "Si errás" siguen visibles y dicen "0 pulsos" en `text-muted`, sin signo ni color. En la tarjeta de tema, la celda "Si acertás" se oculta con monto 0 (el chip ya dice "Sin pulsos"), así que no hay "Cobrás 0 total". `ResultCard` mantiene su título ("Acertaste" / "No era esa") con "0 pulsos" en `text-muted`. Nunca "+0" ni rojo.
- **Conflicto 3 (vistas previas) → R2.** La app calcula las vistas previas ("Si acertás", total a cobrar, chip de disponibles, máximo de "Otro", el doble) con el mismo módulo de reglas puras que usa el servidor para los pagos reales; el servidor entrega los valores (multiplicadores, factor, bolsa disponible, reservas), siempre recalcula y rechaza montos inválidos. Las vistas previas no mueven pulsos, así que es consistente con "la app nunca calcula nada que afecte Pulsos". La derivación del aura de H1 (`floor(saldo/25)`, `saldo mod 25`) no está nombrada en R2: **sigue abierto**.
- **Conflicto 4 (temporizador) → R4.** En 0: barra vacía (solo la pista `surface-2`) y la cifra "0" en `danger-text` (tono urgente del temporizador, no un monto de pulsos: "sin rojo en el cero" aplica a los montos de pulsos). Congelado con 5 s o menos: mantiene el tono urgente (barra `coral`, cifra `danger-text`), como proponía H13. Del segundo 20 al 22 no cambia nada en pantalla: en 0 "Responder" se deshabilita y se espera el veredicto, que llega como tiempo vencido; la app nunca deja responder después de 0. **Siguen abiertos:** si `ConfidenceControl` se oculta o se deshabilita en 0 (H14) y si la barra puede avanzar por pasos con movimiento reducido (H11).
- **Conflicto 5 (píldoras por encima de lo disponible) → R5.** Deshabilitadas (estilo deshabilitado del DS: `surface-2`, sin labio; accesibilidad "No disponible"). "Otro" sigue disponible para cualquier monto hasta el máximo. Reemplaza la propuesta de H9.
- **Conflicto 6 (ventana que vence con la pantalla abierta) → R6.** H2 y H4: se actualizan solos; chip "Cerrada" (`forest`), desaparece el `brand` y queda `neutral` "Ver ranking". H6 y H10 antes de confirmar: el servidor rechaza "Jugar la sesión" y aparece el bloque de R1 con "Esta sesión ya cerró. No se movieron pulsos." y `neutral` "Volver a la partida". H11 a H16 en medio de las preguntas: las que faltan cuentan como error sin pulsos y aparece el bloque "La sesión cerró. Las preguntas que faltaban cuentan como error, sin pulsos." con "Volver a la partida".
- **Conflicto 7 (ayuda "?") → R8.** Botón de ícono `ghost` con `accessibilityLabel` "Cómo funciona la confianza". Abre un `Overlay` titulado "¿Cómo funciona la confianza?" con tres líneas: "Ganar la sesión: si hoy acertás más que el resto, cobrás tu monto por el multiplicador." / "Acertar al menos X de las 7: elegí cuántas creés que vas a acertar; cuanto más alto, más paga." / "Los pulsos que pongas se reservan al tocar Jugar la sesión. Poner 0 también vale." Un solo botón `neutral` "Entendido". El `Overlay` se usa para decisiones del jugador y para ayuda, nunca para errores.
- **Conflicto 8 (neto y singular) → R9.** En todos lados, incluida la tarjeta "Tu puesto" de H4: "+12 pulsos ganados" (`brand-text`), "-8 pulsos perdidos" (`danger-text`), "sin cambios" (`text-muted`), como `MatchCard`. Singular: "1 pulso", "+1 pulso ganado", "-1 pulso perdido".
- **Conflicto 9 (botón de ícono cuadrado) → R7.** `neutral` cuadrado según la plantilla Pregunta del DS; el mismo botón es el "volver" del Detalle de partida (H4). Un solo estilo de botón de ícono de navegación (cerrar, volver) en toda la app (no es una quinta variante); el "?" de ayuda es informativo y queda `ghost` (R8).

### Violaciones

- **H6, vibración al frenar el carrete → R10a.** Se elimina: la vibración queda reservada para `AuraClose`.
- **H11, "Si errás" con 0 en `coral-soft`/`danger-text` → R10b (cubierto por R3).** Con 0, "0 pulsos" en `text-muted`, sin signo ni color.
- **H2, varios `brand` "Jugar" en el Inicio → R10c.** Excepción explícita a "un `brand` por pantalla": si hay varias cards jugables, cada una lleva su propio `brand` "Jugar". Está escrita en el DS (`MatchCard`, `Button` y el principio "Un color fuerte por pantalla"); no se vuelve a marcar como violación.

### A confirmar

- `Overlay` con botón fuerte sobre una pantalla con `brand` o `coral` → **R11**: el `Overlay` es una capa aparte con su propia acción principal. Confirmado.
- "Guardar" `neutral` en `TopicBetCard` vs `brand` en el `Overlay` → **R11**: confirmado, no hay quinta variante.
- Valores fijos que deberían venir de configuración (25 pulsos por aura, píldoras 0/1/5/10, umbral X 4 a 7, 20 s / 22 s): **sigue abierto**.
- Rótulo de "Siguiente pregunta" en la 7ª: **sigue abierto**.
- "Acertaste" con monto 0 (H12) → **R3**: el título se mantiene, movimiento "0 pulsos" en `text-muted`.
- H11 sin chip de disponibles y "siempre se ve cuánto tengo en juego": **sigue abierto**.
- Tarjeta de tema abierta con cambios sin guardar al tocar "Jugar la sesión", persistencia del monto guardado al salir (H8) y si X se envía con monto 0 (H9): **sigue abierto**.
- Control segmentado sin componente en el DS: **sigue abierto**.
- Chip de la tarjeta cerrada de H9 sin el X elegido: **sigue abierto**.
- Referencias desactualizadas: `card_states.png` se **eliminó** de `Referencias-y-definiciones/` por desactualizada; la contradicción se resuelve a favor del MVP, el DS y `Dashboard/Todas.png` (card sin aro, bolsa de 50, "+12 pulsos ganados" / "-8 pulsos perdidos"). El chip de disponibles en 62 con montos guardados (H8, H9): **sigue abierto** (los mapas ya siguen el MVP y el DS).
- Texto "Tus respuestas están a salvo" (H16) → **R1**: se reemplaza por el texto estándar del bloque de error.
- Aviso a lectores de pantalla en 0 s (H14) y orden de lectura y foco al aparecer el resultado (H11, H12, H14): **sigue abierto**.
