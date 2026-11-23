# Component Map: H3 - Ver las partidas que ya jugué hoy y filtrar por pestañas

## Resumen de la historia
- **Descripción**: Como jugador, quiero ver aparte las partidas que ya jugué hoy y filtrar el inicio por pestañas, para saber qué me falta jugar y cuándo abre la próxima sesión.
- **Referencias visuales**: `Dashboard/Todas.png`. Pestañas "Te toca" y "Jugadas" seleccionadas: sin referencia.
- **Reglas de producto**: inicio con tres pestañas (*Te toca*, *Jugadas*, *Todas*); card de partida ya jugada hoy compacta, sin bloque gris ni botón; en "Todas" se agrupan bajo "Partidas completadas hoy".
- **Criterios funcionales**:
  - Control segmentado con "Te toca", "Jugadas" y "Todas".
  - En "Todas": arriba las partidas que me tocan (H2); debajo, la etiqueta "Partidas completadas hoy" y las cards compactas.
  - Card compacta: chip "Jugada hoy", "Día N de 5", título, avatares y una línea de resumen ("Vas 2º · 11 aciertos · Abre mañana 00:00"). Los aciertos son los acumulados de la partida, no los del día.
  - La hora de apertura se muestra en la hora local del jugador.
- **Autoridad del servidor**: decide qué partidas están jugadas hoy, la posición, los aciertos acumulados y la próxima apertura.
- **Experiencia**: pestaña activa en `surface` sobre la pista; vacío por pestaña sin referencia; cifras tabulares en la línea de resumen.
- **Casos borde**: cambio de día con la app abierta (una jugada pasa a "te toca" cuando abre la nueva sesión); la referencia muestra "6 de 7 aciertos" y "11 aciertos": vale el acumulado ("11 aciertos").
- **Dependencias**: H2. **Prioridad**: media.

## Referencias revisadas
- `Referencias-y-definiciones/Pantalla-UI/Dashboard/Todas.png` — encabezado `forest` con avatar, "Hola de nuevo", nombre y `AuraCounter` ("16/25"); control segmentado con "Todas" activa (`surface` sobre pista `surface-2`); `MatchCard` jugable ("Vence en 16:20:23", "Día 3 de 5", "Trivia de los viernes", "8 jugadores", bloque gris 62 / "+12 pulsos ganados" / "Posición Vas 2o", `brand` "Jugar"); etiqueta "Partidas completadas hoy"; dos cards compactas ("Los del laburo", "Trivia de la peña") con chip "Jugada hoy", "Día 2 de 5", avatares y línea de resumen que envuelve a dos renglones. La referencia escribe "Vas 2o" en la card jugable (tipeo, se corrige a "Vas 2º"); en las compactas usa "2°" / "1°".
- `Trivia_DS_completo.md` — secciones Voz y contenido, Color, Aura y pulsos, `MatchCard` (incluida la variante compacta), Carga y error, plantilla Inicio, tokens.
- `App de trivia diseño del MVP.md` — secciones citadas en la historia (flujo y pantallas; aura, emblemas y cards).
- No hay animación ni `cierre_light.png` aplicable a esta historia.
- Código: no existe `MatchCard` ni control segmentado en `mobile/src` (solo tokens y tema). Componentes verificados contra el DS, sin implementación todavía.

## Pantallas involucradas
- Inicio con pestañas "Te toca" / "Jugadas" / "Todas" — plantilla del DS: Inicio (`Dashboard/Todas.png`). Solo "Todas" tiene referencia.

## Componentes del DS a usar
- `MatchCard` (variante compacta "Jugada hoy") — cada partida jugada hoy, en "Todas" y en "Jugadas".
- `MatchCard` jugable (ganando / perdiendo / recién empieza) — partidas que te tocan, en "Te toca" y "Todas" (definidas en H2; no se rediseñan acá).
- `MatchCard` terminal ("Cerrada", "Fuera de la partida") — solo en "Todas" (N4, PO 23/11/2026). "Fuera de la partida" tiene prioridad sobre "Cerrada" cuando aplican las dos. Una partida jugada hoy en la que el jugador quedó fuera muestra "Fuera de la partida" (no la compacta) y vive solo en "Todas".
- `Button` `brand` "Jugar" — uno por `MatchCard` jugable (excepción explícita del DS a "un color fuerte por pantalla"). `neutral` "Ver ranking" si la ventana cerró. La compacta no lleva botón.
- Chips de estado: "Jugada hoy" en `surface-2` (`label`, `radius-pill`); "Vence en ..." `coral-soft` + `danger-text` en la jugable; "Cerrada" `forest` (solo en "Todas").
- Avatares apilados (parte de `MatchCard`).
- `AuraCounter` y avatar del encabezado `forest` (compartidos con H1/H2).
- `TabBar` (navegación inferior; "Inicio" activo).
- Patrón "Carga y error" — esqueletos `surface-2` con la forma de las cards y bloque de error con `neutral` "Reintentar".

## Componentes a extender
- Control segmentado — componente compartido nuevo, definido una sola vez para Inicio (H3) y Detalle de partida (H4, H5) (N1, PO 23/11/2026); ver Gaps.
- `MatchCard` compacta — solo si H2 define la tarjeta como un único componente: aceptar la línea de resumen como datos (posición, aciertos acumulados, próxima apertura ya formateada en hora local). Sin variantes nuevas.
- Ninguna otra. Si la compacta fuera presionable (ir al detalle H4), no hay referencia: ver dudas.

## Gaps
- **Control segmentado (pestañas del inicio)** — figura en la plantilla Inicio y en la referencia, pero no está en la tabla de componentes del DS.
  - **Resuelto (N1, PO 23/11/2026)**: un único componente compartido con H4 y H5: pista `surface-2` `radius-pill`; segmento activo `surface` con `shadow-soft`; texto `display` 800 (`text` en el activo, `text-muted` en los inactivos); alto mínimo `tap-min`; sin labio ni color fuerte. Accesibilidad: rol tab con estado seleccionado (`accessibilityState`), no solo por fondo.
- **Pestaña "Te toca" seleccionada** — sin referencia visual; contenido resuelto (N4): solo las `MatchCard` jugables, sin etiqueta "Partidas completadas hoy", sin compactas ni cards "Cerrada"/"Fuera de la partida".
- **Pestaña "Jugadas" seleccionada** — sin referencia visual; contenido resuelto (N4): solo las `MatchCard` compactas de las partidas jugadas hoy. Sigue sin definir si lleva la etiqueta "Partidas completadas hoy".
- **Estados vacíos por pestaña** — sin referencia (Preguntas para PO).
  - **Resolución temporal sugerida**: bloque `surface-2` con texto neutro en `text-muted`, sin rojo ni culpa, p. ej. "No tenés partidas por jugar hoy." / "Todavía no jugaste ninguna partida hoy." Provisorio; sin botón nuevo ni ilustración.
- **Error / carga del inicio** — la historia no lo dice; el DS tiene el patrón "Carga y error". Se aplica, pero ver dudas.

## Tokens relevantes
- Colores: `bg` (pantalla), `surface` (cards, pestaña activa), `surface-2` (pista del control, chip "Jugada hoy", esqueletos), `text`, `text-muted` (línea de resumen, "Día N de 5", etiqueta de grupo), `forest` + `on-forest` (encabezado), `coral-soft` + `danger-text` (chip de vencimiento), `brand-text` (+pulsos), `danger-text` (-pulsos), `brand` + `on-brand` + `lip-brand` ("Jugar"), `line` / `edge` (bordes). Avatares: `sky`, `coral`, `sun`, `violet`, `brand` con sus `on-*`.
- Tipografía: títulos y número grande en `display` (Urbanist 800), texto en `body` (Nunito 600), `label` (12/16, 800, 0.08em, mayúsculas) para chips y la etiqueta "Partidas completadas hoy". Cifras tabulares en la línea de resumen y en el cronómetro de vencimiento.
- Espaciado y radios: margen lateral `space-5`; `radius-lg` en cards; `radius-md` en botones; `radius-pill` en chips y avatares; `tap-min` (52px) en segmentos y botones.
- Sombras y labios: `shadow-soft` en cards; `lip-brand` en "Jugar" (4 px). El control segmentado no usa labio.

## Patrones de interacción y movimiento
- Cambio de pestaña: el segmento activo cambia a `surface` y su texto a `text`; contenido se intercambia sin animación obligatoria. Movimiento reducido: igual, instantáneo.
- Presión del "Jugar": hundimiento de 4 px sobre `lip-brand`. Movimiento reducido: sin desplazamiento, solo cambio de estado visual.
- Cambio de día / ventana que abre o cierra con la app abierta: la lista se actualiza sola (una jugada pasa a "te toca" cuando abre la nueva sesión; la que cierra muestra "Cerrada" `forest` y `neutral` "Ver ranking", y desde ese momento solo aparece en "Todas"). Sin animación; sin festejo.
- Cronómetro de vencimiento de la card jugable: cifras tabulares; se deriva de la hora de cierre del servidor.
- Carga: esqueletos `surface-2` sin spinner ni cifras viejas.

## Datos y autoridad del servidor
- Llega del servidor: lista de partidas con su estado para el jugador (te toca / jugada hoy / cerrada / fuera de la partida), día N de 5, título, jugadores y avatares, posición, aciertos acumulados de la partida, hora de apertura de la próxima sesión (instante absoluto), hora de cierre de la ventana, bolsa y neto (para las jugables).
- La app: convierte el instante de apertura a la hora local del jugador y formatea ("Abre mañana 00:00"); filtra por pestaña con el estado que informa el servidor según N4 ("Te toca": jugables; "Jugadas": jugadas hoy; "Todas": todas, incluidas "Cerrada" y "Fuera de la partida").
- La app nunca calcula: qué partidas están jugadas hoy, posición, aciertos acumulados, próxima apertura, netos ni Pulsos. No hay montos ni apuestas en esta historia, por lo que la eliminación de topes de apuesta (23/11/2026) no la afecta.

## Textos de pantalla
- "Te toca", "Jugadas", "Todas"
- "Partidas completadas hoy"
- "Jugada hoy"
- "Día 2 de 5"
- "Vas 2º · 11 aciertos · Abre mañana 00:00" (ordinal con `º`; referencia usa "2°"/"2o"; "11 aciertos" = acumulado). Con 1 acierto, singular: "1 acierto" (inferido de la regla de singular del DS, confirmar).
- "Vas 1º · 6 de 7 aciertos ..." de la referencia NO se copia: el dato correcto es el acumulado ("N aciertos").
- Card jugable (H2): "Vence en 16:20:23", "8 jugadores", "Posición", "Vas 2º" (corrige "Vas 2o"), "+12 pulsos ganados", "Jugar", "Hola de nuevo".
- Error: "No pudimos conectarnos. Revisá tu conexión y probá de nuevo." y "Reintentar".
- Vacíos (provisorios): "No tenés partidas por jugar hoy." / "Todavía no jugaste ninguna partida hoy."

## Riesgos y dudas
- Control segmentado: resuelto como componente compartido (N1); falta agregarlo a la tabla de componentes del DS.
- Textos de los vacíos de "Te toca" y "Jugadas": sin referencia; siguen provisorios.
- ¿"Jugadas" lleva la etiqueta "Partidas completadas hoy"? Sin definir.
- Card compacta (PO, 23/11/2026): toda la card es tocable y lleva al Detalle de partida (H4); sigue sin botón. Rol de botón con `accessibilityLabel` que nombre la partida, `tap-min` y la misma respuesta al presionar que el resto de las cards.
- Aciertos acumulados vs. "6 de 7" de la referencia: el MVP ya decidió el acumulado; la referencia queda desactualizada en ese texto.
- Formato de la próxima apertura (PO, 23/11/2026): texto relativo en la hora local del teléfono, a partir del instante que manda el servidor. Mismo día calendario: "Abre en 3 h 20 min" (cuenta regresiva, con cifras tabulares); día siguiente: "Abre mañana 00:00" (como la referencia); más adelante: "Abre el jueves 00:00". Modo rápido: ver H23.
- Error de red al cargar el inicio: se aplica el patrón "Carga y error" del DS por defecto, pero la historia no lo especifica; revisar consistencia con H1/H2.
- La línea de resumen puede envolver a dos renglones (se ve en la referencia): el avatar apilado debe mantener alineación.
