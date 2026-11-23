# Reporte de consistencia entre historias mapeadas

Este reporte es informativo. Tiene dos corridas: la **Corrida 2 (23/11/2026)** va primero; la **Corrida 1 (17/11/2026)** y sus "Resoluciones (17/11/2026)" (R1 a R11, decididas por el PO y vigentes) siguen más abajo, intactas. Los mapas no se editaron con R1 a R11: quien implemente lee el mapa y aplica encima esas resoluciones. En cambio, las resoluciones N1 a N8 de la Corrida 2 (PO, 23/11/2026) ya están volcadas en los mapas afectados.

---

# Corrida 2 (23/11/2026)

Generado a partir de: component-map-H1, H2, H3, H4, H5, H6, H8, H9, H10, H11, H12, H13, H14, H16, H17, H18, H19, H20, H21, H22, H23 (21 mapas; nuevos: H3, H5, H17 a H23).
Fecha: 2026-11-23
Contexto aplicado: desde el 23/11/2026 no hay topes de apuesta (ni por pregunta ni por carta de tema); el único límite son los Pulsos disponibles. Se revisó que ningún mapa conserve un tope: ninguno lo hace (los viejos ya hablaban de "máximo = disponibles"; los nuevos lo declaran explícito).

## Conflictos detectados

### N1: Control segmentado (Te toca / Jugadas / Todas y Ranking / Historial)
- **Estado**: Resuelto (PO, 23/11/2026). Un único componente compartido por Inicio, Ranking e Historial: pista `surface-2` `radius-pill`; segmento activo `surface` con `shadow-soft`; texto `display` 800 (`text` en el activo, `text-muted` en los inactivos); alto mínimo `tap-min`; rol tab con estado seleccionado. La pestaña Historial se muestra, con un estado vacío neutro. Los textos de los vacíos siguen provisorios. Volcado en H3, H4 y H5.
- **Historias involucradas**: H3, H4, H5 (H1 y H2 lo delegan; H23 lo menciona como inexistente)
- **Qué pasa**: el gap sigue abierto (no está en la tabla del DS). H3 y H5 proponen casi lo mismo pero con diferencias; H4 propuso solo "pista `surface-2`".
- **En H3** (`component-map-H3.md`): pista `surface-2` `radius-pill`/`radius-md`, activo `surface` con `shadow-soft`, texto `display`/`body`, `tap-min`, tablist/tab; "definirlo una sola vez y reutilizar en H4".
- **En H5** (`component-map-H5.md`): pista `surface-2` `radius-pill`/`radius-lg`, activo `surface`, texto `display` 800 en `text`, inactivo `text-muted`, `tap-min`, "no inventar labio".
- **En H4** (`component-map-H4.md`): mostrar la pestaña Historial con vacío neutro o ocultar el segmentado; H5 repite la misma duda y pide que se resuelva igual en ambas.
- **Vacíos por pestaña**: H3 propone "No tenés partidas por jugar hoy." / "Todavía no jugaste ninguna partida hoy."; H5 "Todavía no hay días anteriores". Misma forma (bloque `surface-2`, `text-muted`), textos solo provisorios.
- **Por qué importa**: dos construcciones casi iguales pueden terminar en dos componentes (radio `md` vs `lg`, `body` vs `display`). Es un único componente compartido por tres pantallas.

### N2: Destino tras la 7ª pregunta y salida del resumen del día
- **Estado**: Resuelto (PO, 23/11/2026). Tras la 7ª pregunta, el Resumen del día (H17) con una sola acción: `brand` "Ver partida" -> Detalle de partida (sin `neutral` "Ir al inicio"). En modo rápido el mismo botón dice "Descubrir tema" y lleva al sorteo (H6). Volcado en H12, H13, H14, H16, H17 y H23. El rótulo de "Siguiente pregunta" en la 7ª sigue abierto (Corrida 1).
- **Historias involucradas**: H12, H13, H14, H16 (viejas) vs H17 y H23 (nuevas)
- **En H12, H13, H14, H16**: tras la 7ª (y tras "Salir" en H16) se vuelve al Detalle de partida, "provisorio hasta que exista H17".
- **En H17** (`component-map-H17.md`): existe una pantalla Resumen del día nueva después de la 7ª; base de plantilla Detalle de partida; `brand` "Ver partida" -> Detalle y `neutral` "Ir al inicio".
- **En H23** (`component-map-H23.md`): en modo rápido, tras el resumen el `brand` va al sorteo del tema siguiente (H6), y ubica al resumen en la plantilla "Pregunta/Resultado" (H17 dice Detalle de partida).
- **Por qué importa**: el mismo botón `brand` del resumen tiene dos destinos según el modo, y los mapas de H12 a H16 siguen apuntando al Detalle sin pasar por el resumen. Sigue abierto el rótulo de "Siguiente pregunta" en la 7ª (Corrida 1).

### N3: Orden entre resumen del día, hoja de expulsión y fin de partida
- **Estado**: Resuelto (PO, 23/11/2026). En una misma apertura la secuencia es resumen del día → hoja de expulsión → fin de partida. El resumen y la hoja cierran al Detalle de partida; "Continuar" del fin de partida va al Inicio. Si la expulsión ocurre en medio de la sesión no hay resumen: la hoja aparece directamente. El expulsado también ve el fin de partida cuando la partida se resuelve. Volcado en H13, H17, H18, H19 y H20.
- **Historias involucradas**: H17, H18, H19, H20, H21, H23
- **En H17**: tras la 7ª aparece el resumen; si la bolsa llega a 0 al resolverse "ganar la sesión" se vería "este resumen y luego la hoja"; orden "no definido".
- **En H18** (`component-map-H18.md`): si la bolsa llega a 0 en una pregunta, la sesión termina para ese jugador ahí (nunca llega a la 7ª ni al resumen); la hoja aparece sola o al tocar "Siguiente pregunta" (duda propia) y su cierre lleva al Detalle. Si la expulsión llega al resolverse "ganar la sesión", la hoja aparece al abrir la partida, encima del Detalle (que es justo el destino "Ver partida" de H17).
- **En H19** (`component-map-H19.md`): el fin de partida aparece al resolverse la partida (próxima apertura); "Continuar" lleva al Inicio. Para el expulsado, el aro parte del punto de partida y "Quedaste fuera de la partida" (duda propia). H18 duda si el expulsado ve "Partida terminada" o solo "Fuera de la partida".
- **En H20**: un eliminado ve igual el fin de partida con logros. H19 y H20 no coinciden en lo que ve (H19: neto "sin cambios"; H20: logros).
- **En H21**: orden entre `AuraClose`, cambio de emblema y bloque "Ganaste +N" no definido; el fin de partida con varias partidas resueltas se encola "una por vez" solo en H19.
- **Por qué importa**: el mismo jugador puede tener a la vez pendientes la hoja (H18), el resumen (H17) y el fin de partida (H19) en una sola apertura (por ejemplo, expulsado en una partida de 2 cuyo otro jugador la termina). Ningún mapa fija una secuencia, qué ve el expulsado al resolverse la partida ni cuál es el destino único de cada cierre (Detalle vs Inicio).

### N4: Estado "Cerrada" y "Fuera de la partida" en `MatchCard`, y en qué pestaña viven
- **Estado**: Resuelto (PO, 23/11/2026). "Fuera de la partida" tiene prioridad sobre "Cerrada". "Te toca" muestra solo las jugables; "Jugadas", solo las jugadas hoy; "Cerrada" y "Fuera de la partida" aparecen solo en "Todas" (una jugada hoy con expulsión muestra "Fuera de la partida" y vive solo en "Todas"). Volcado en H2, H3, H18 y H22.
- **Historias involucradas**: H2, H3, H4, H18, H22
- **En H22** (`component-map-H22.md`): formaliza "Cerrada sin jugar" como estado persistente (hoy el DS lo define solo como transición con el Inicio abierto): chip `forest` "Cerrada", bloque gris con la bolsa y "sin cambios", `neutral` "Ver ranking", y un bloque aviso. Solo en "Todas". No usa la compacta "Jugada hoy" porque "sería falso".
- **En H18**: estado "Fuera de la partida": chip gris, `0`, "sin pulsos", "Quedaste 4º", `neutral` "Ver ranking". Duda abierta: qué pasa cuando el expulsado también ve "Cerrada" (conviven los dos chips o gana uno).
- **En H3** (`component-map-H3.md`): lista "Fuera de la partida" entre las `MatchCard` "que te tocan" (en "Te toca" y "Todas"), aunque no hay nada para jugar; no ubica "Cerrada" en ninguna pestaña; duda si una jugada hoy con expulsión va a "Jugadas" o muestra "Fuera".
- **En H2/H4** (Corrida 1, R6): "Cerrada" es el chip de una ventana que vence; nada dice si es el mismo estado persistente de H22.
- **Por qué importa**: cuatro estados terminales (Cerrada, Cerrada sin jugar, Fuera de la partida, Jugada hoy) con el mismo botón `neutral` "Ver ranking" y sin regla de pestañas. Un jugador expulsado cuyo día también venció tiene dos chips candidatos. La compacta "Jugada hoy" depende de que el jugador sí haya jugado.

### N5: Textos distintos para "no se movió nada" y para "esperá a los demás"
- **Estado**: Resuelto (PO, 23/11/2026). Se sigue la voz de R6. H22: "Esta sesión cerró sin jugarse. No se movieron pulsos." Estado pendiente de "ganar la sesión" (fila del resumen, aviso del día 5 y espera en modo rápido), una sola frase: "Los resultados salen cuando todos terminen." Volcado en H17, H22 y H23.
- **Historias involucradas**: H6, H10, H16 (R6), H22; H17, H23
- **Aviso de sesión cerrada**: R6 fija "Esta sesión ya cerró. No se movieron pulsos." (H6/H10) y "La sesión cerró. Las preguntas que faltaban cuentan como error, sin pulsos." (H16). H22 propone un tercer texto, "No jugaste esta sesión. No se movieron pulsos.", y el mapa mismo avisa del choque con H16/H17.
- **Resultado pendiente de "ganar la sesión"**: H17 usa "Se resuelve cuando todos terminen o cierre la ventana." en la fila y "Los resultados finales salen cuando todos terminen." para el día 5; H23 propone "Los resultados de la sesión salen cuando todos terminen." para el mismo estado ("coordinar con el aviso del día 5").
- **Por qué importa**: son el mismo concepto con tres y dos redacciones. En modo rápido H17 y H23 dibujan el mismo bloque con otra frase.

### N6: Cruce de varias auras, cierre de aura y autoridad del servidor
- **Estado**: Resuelto (PO, 23/11/2026). El servidor envía los saldos antes y después; la app solo dibuja. Un solo anuncio para lectores de pantalla (en Fin de partida, el de H19). H21 manda sobre la secuencia del aro: un solo cierre aunque se crucen varias auras, el número salta al aura final, el aro queda en el resto real con "Seguís desde N de 25 pulsos", y en pérdida el aro no usa `coral` ni rojo. Volcado en H19, H20 y H21. Sigue abierto el alcance del cierre (solo Fin de partida o también `AuraCounter`).
- **Historias involucradas**: H19, H20, H21 (H1 por la derivación)
- **Autoridad**: H19 lista como dato del servidor los "cruces de aura" y el "aura antes y después"; H20 lista "si hubo cierre de aura"; H21 dice que llegan solo los pulsos antes y después "para derivar si cruzó múltiplo de 25", pero en la misma sección "la app nunca calcula... si se completó un aura ni el aura final". H1 y H19 derivan `floor(pulsos/25)` y `pulsos mod 25` (sigue abierto desde la Corrida 1).
- **Varios cruces**: H19 deja la definición a H21. H21 propone: un solo cierre, aro lleno de la primera cruzada, pulso, número salta al final y el aro queda en el resto (no a cero); texto "Seguís desde N de 25 pulsos". H19 no lista "Seguís desde" y mantiene la línea "N de 25 pulsos para tu Nª aura" en el mismo lugar donde H21 coloca su texto final.
- **Pérdida**: H19 vacía los tramos en `coral` cada 130 ms con cuenta -N y 400 ms después los lleva a pista; H21 dice que bajar de aura es sin animación, sin rojo y "nada de `coral`/`danger-text`" en el aro. Duraciones: H19 95 ms por tramo (animación de fin de partida), H21 90 ms (animación de cierre).
- **Anuncio accesible**: H19 "Ganaste 6 pulsos. Ahora tenés 1 aura y 22 de 25 pulsos."; H21 "Llegaste a N auras" (live region única). Dos anuncios para la misma pantalla.
- **Alcance**: H19 dispara `AuraClose` solo en Fin de partida; H21 duda si también en cualquier `AuraCounter` visible (el DS lo sugiere).
- **Por qué importa**: dos historias definen el aro del fin de partida con distinta fuente de verdad, distinto texto final, distinto vaciado y distinto anuncio.

### N7: Textos de neto, resultado y premio en el fin de partida
- **Estado**: Resuelto (PO, 23/11/2026). En el fin de partida manda la referencia ("Ganaste +N" / "Perdiste -N", cifra en `brand-text` / `danger-text`); R9 sigue en el resto de la app. El premio va en un bloque aparte, y el servidor informa si está incluido en el saldo. Volcado en H19 y H20. Siguen abiertos el formato del bloque de premio y el subtítulo del ganador ("Quedaste 1º de N jugadores" vs "Ganaste la partida").
- **Historias involucradas**: H19, H20 (y H17/H4 por el patrón de neto)
- **"Ganaste +6" / "Perdiste -5"** (H19 y H20, de la referencia) frente a "+12 pulsos ganados" / "-8 pulsos perdidos" (R9, H17, H4, MatchCard). El estado inicial de la animación muestra "+0"/"-0" (H19 lo marca).
- **Ganador**: H19 propone "Quedaste 1º de N jugadores" (con empate "(empate)"); H20 usa "Ganaste la partida" (subtítulo de la animación) y "Premio dividido" para el empate.
- **Premio**: H20 lo muestra como "+150 pulsos" en `brand-text` debajo de "Ganaste +N"; no queda dicho si el premio entra en el neto "Ganaste +N", en el saldo antes/después que dibuja el aro (H19) ni en el "neto de la partida" de H4.
- **Por qué importa**: dos cifras con signo en la misma pantalla sin saber si se suman; el mismo neto tiene tres formatos.

### N8: Motivo de la fila de ranking del eliminado y significado de "Tu puesto"
- **Estado**: Resuelto (PO, 23/11/2026). Motivo de la fila: "Sin pulsos" para el expulsado y "No jugó N días" para quien no jugó (también en la fila propia). "Tu puesto" muestra siempre el neto de la partida; el neto del día va en la tarjeta de resumen de H17. Volcado en H4, H17, H18 y H22. Sigue abierto cómo se combina `data-me` con la atenuación.
- **Historias involucradas**: H4, H17, H18, H22
- **Fila del eliminado**: H4 propone motivo "Fuera de la partida"; H18 propone "Sin pulsos"; H22 usa "No jugó N días" para terceros y duda del texto de la fila propia ("No jugaste hoy"). H18 y H22 piden combinar `data-me` con la atenuación sin que el DS lo especifique.
- **Tarjeta "Tu puesto"**: H4 y H22 muestran el neto de la partida ("+24 pulsos ganados", "sin cambios" por día perdido); H17 la reutiliza con el neto **del día**.
- **Por qué importa**: la misma fila y la misma tarjeta con distinto texto y distinta cifra.

## Violaciones de reglas del DS o del MVP
- Ninguna firme en esta corrida. Ningún mapa usa más de un `Button` `brand` por pantalla (fuera de la excepción de `MatchCard`), ni variantes fuera de `brand`/`neutral`/`ghost`/`coral`, ni "apuesta"/"apostar"/"monedas" en textos de pantalla (H20 reemplaza "mejor apuesta" por "Tu mayor riesgo"), ni festejo distinto de `AuraClose`. Ninguno conserva un tope de apuesta. Ninguno hace que la app calcule Pulsos ni reciba la respuesta antes. Todas las animaciones nuevas traen versión de movimiento reducido. Los casos dudosos van en "A confirmar".

## A confirmar
Preguntas abiertas para el PO tras las resoluciones N1 a N8 (se quitaron las que esas resoluciones responden: `coral`/`danger-text` en H19, texto de H22, destino del botón de H17 y ubicación de una jugada hoy con expulsión).

1. ~~**H19, "+0"/"-0" al inicio de la animación**~~ — Resuelto (PO, 23/11/2026): arranca en "0" neutro sin signo.
2. ~~**H18, la hoja de expulsión como `Overlay` informativo**~~ — Resuelto (PO, 23/11/2026): `Overlay` informativo con un `neutral` "Ver ranking"; tocar el velo la cierra; el DS se amplió. Contexto original: el DS lo define para decisión corta y ayuda (R8: nunca para errores); la hoja es un tercer tipo y el mapa pide confirmar si necesita componente propio. Además, tocar el velo la cierra (equivale a "cancelar" en las otras `Overlay`).
3. ~~**H18, textos de la reflexión**~~ — Resuelto (PO, 23/11/2026): la reflexión pasa a tono neutro ("Tus 3 preguntas de mayor riesgo sumaron el 80% de tu bolsa") y "pulsos" va en minúscula en todo texto de pantalla. Excepción: la etiqueta "Pulsos" bajo la cifra de `LeaderboardRow`, que viene de la referencia.
4. **Valores fijos que deberían venir de configuración**: 25 pulsos por aura (H1, H19, H21), premio 150 (H20), 20/22 s, y duraciones de animación (90/95/130 ms) — Resuelto (23/11/2026, CLAUDE.md "todos los valores ajustables viven en configuración"): van a configuración.
5. ~~**H21, vibración con movimiento reducido**~~ — Resuelto (PO, 23/11/2026): se mantiene; el reducido quita solo lo visual (DS, H19 y H21 actualizados). Queda para implementación confirmar la API de hápticos de Expo.
6. ~~**H21, alcance del cierre**~~ — Resuelto (PO, 23/11/2026): solo en Fin de partida; `AuraCounter` se actualiza sin animación (DS actualizado).
7. ~~**H3, tarjeta compacta**~~ — Resuelto (PO, 23/11/2026): tocable hacia el Detalle; próxima apertura en texto relativo con hora local ("Abre en 3 h 20 min" el mismo día, "Abre mañana 00:00", "Abre el jueves 00:00").
8. ~~**H17, neto del día con "ganar la sesión" pendiente**~~ — Resuelto (PO, 23/11/2026): no incluye la reserva; la reserva va aparte como "Pendiente".
9. ~~**H19, botón "Continuar"**~~ — Resuelto (PO, 23/11/2026): oculto hasta el final de la animación; aparece habilitado 500 ms después (coincide con H21).
10. ~~**H19, cola de fin de partida**~~ — Resuelto (PO, 23/11/2026): una por vez, cada una con su "Continuar"; el último lleva al Inicio.
11. ~~**H18/H19, push**: textos y deep link de ambas sin definir; qué abre la push de expulsión por resolución (Detalle + hoja) frente a la de fin de partida.~~ — Resuelto (PO, 23/11/2026): sin notificaciones push en el MVP; quedan pendientes post-MVP.
12. ~~**H20, premio y logros**~~ — Resuelto (PO, 23/11/2026): "Tu mayor riesgo"; título de calibración a la V2; el eliminado ve la misma pantalla con su resultado real; premio en bloque `sun-soft` aparte bajo el neto ("+150 pulsos", empate "+37 pulsos · Premio dividido entre 4"), sin animación propia.
13. ~~**H23, activación y señal del modo rápido**~~ — Resuelto (PO, 23/11/2026): se marca al crear la partida en la configuración del servidor, sin UI en la app; chip neutro "MODO RÁPIDO" visible para todos los jugadores; "Sesión N de 5" y "Descubrir tema" en lugar de "Abre…".
14. ~~**H5, contenido del Historial**~~ — Resuelto (PO, 23/11/2026): una fila por día ya jugado, del más reciente al más viejo ("Día 2 · Historia · 5 de 7 aciertos · +12", neto con signo y color, 0 neutro), con las filas etiqueta/valor de H17; "Día N · No jugaste" neutro; neto sin la reserva pendiente de "ganar la sesión" ("Pendiente" en `text-muted`); sin correctas ni explicaciones; filas no tocables; vacío "Todavía no hay días anteriores" si no hay días.
15. ~~**Patrón de error/carga (R1)**~~ — Resuelto (23/11/2026, por el DS): "Carga y error" es el patrón único para toda la app cuando se espera al servidor o falla la conexión, así que cubre H20, H21, H23 (incluida la activación del modo rápido) y las pantallas sin botón que esperan al servidor.

## Sin conflictos detectados
- Patrón de error/carga: los mapas nuevos que lo definen (H3, H5, H17, H18, H19, H22) usan el mismo texto y `neutral` "Reintentar", sin rojo; coincide con R1.
- Ordinales: todos los mapas usan "º" (y "ª" en "2ª aura"), igual que el DS ("Vas 2º"). Los "2°" y "2o" aparecen solo como errores de tipeo de las referencias (H3, H22) y los mapas los corrigen. No hay divergencia entre mapas.
- Sin topes de apuesta: H3, H5, H17 a H23 y los mapas viejos (máximo de "Otro" = disponibles; "Podés arriesgar hasta N pulsos" con N = disponibles en H11 y H23) son coherentes.
- Un solo `brand` por pantalla en H17, H19, H20, H23; hoja de H18 con un solo `neutral`.
- Autoridad del servidor en H3, H5, H17, H18, H22 y H23: coherente con "la app nunca calcula Pulsos".

## Resumen
- Historias revisadas: 21
- Conflictos: 8 (N1 a N8), todos resueltos por el PO el 23/11/2026 y volcados en los mapas
- Violaciones de reglas: 0
- A confirmar: 15 (tras quitar las respondidas por N1 a N8)

---

# Corrida 1 (17/11/2026)

Generado a partir de: component-map-H1, H2, H4, H6, H8, H9, H10, H11, H12, H13, H14, H16 (los 12 de esa corrida). Texto original, sin cambios.
Fecha: 2026-11-17

Las resoluciones del PO están en la sección "Resoluciones (17/11/2026)" al final: mandan sobre los mapas, que quedan congelados.

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
