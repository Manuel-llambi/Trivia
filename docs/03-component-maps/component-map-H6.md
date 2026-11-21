# Component Map: H6 - Descubrir el tema del día

> Componentes verificados contra el DS, sin implementación todavía (no hay código fuente en el repositorio).

## Resumen de la historia

**Descripción**: Como jugador, quiero tocar "Descubrir tema" y ver cómo el carrete frena en el tema de hoy, para saber sobre qué voy a responder antes de decidir cuánta confianza pongo.

**Reglas de producto involucradas**:
- Tema 100% al azar, definido por el servidor y el mismo para todos los jugadores de la partida; la rueda solo lo revela.
- Primer flujo, paso 3: "Descubrí el tema de hoy" y "Un solo tema al azar para todos los jugadores de la partida."; la ventana muestra "Tema de hoy" hasta que el jugador toca "Descubrir tema"; entonces gira y frena en el tema.

**Criterios de aceptación funcionales**:
- Antes de girar: título "Descubrí el tema de hoy", bajada, ventana con "Tema de hoy" y botón "Descubrir tema".
- Al tocar, el carrete pasa temas y frena en el tema que definió el servidor.
- Con el tema revelado, debajo aparece la sección de confianza en el tema (H8, H9, H10) y el botón pasa a "Jugar la sesión".
- El tema revelado coincide siempre con el del servidor para todos los jugadores de la partida.
- Si el jugador vuelve con el tema ya revelado, lo ve sin volver a girar (una revelación por sesión).

**Autoridad del servidor**: el servidor define el tema al armar la sesión, solo entre temas con al menos 7 preguntas no vistas por ningún jugador de la partida; la app solo recibe el tema final y lo revela. Si un tema baja del umbral, el servidor alerta al administrador. La lista de temas que pasan por el carrete es decorativa.

**Criterios de experiencia**:
- Animación según `animacion_sorteo_tema.html`: desenfoque al inicio y desaceleración larga, frena en unos 2,4 a 2,5 s; triángulos verdes marcan dónde frena; solo se ve la fila del tema y los vecinos asoman difuminados.
- Al frenar, vibración suave única; la sección de confianza aparece después de que frena.
- Mientras gira, el botón queda deshabilitado.
- Movimiento reducido: el tema aparece sin giro y la sección de confianza aparece sin transición.
- Sin luces, destellos, fichas ni sonidos.
- Error al obtener el tema: el carrete no gira con un tema inventado; mensaje sin culpa y acción para reintentar.

**Casos borde**: conexión cortada al tocar "Descubrir tema" (no se revela nada hasta tener el tema del servidor); ventana que vence en esta pantalla (H22, fuera de alcance, no disponible todavía); banco sin preguntas no vistas (lo resuelve el servidor, la app no tiene estado especial).

**Dependencias**: H4. **Prioridad**: alta.

## Referencias revisadas
- `Referencias-y-definiciones/Pantalla-UI/Topic Reel/Default-1.png` — estado previo al giro: título, bajada, `TopicReel` con "Tema de hoy", triángulos `brand` y botón `brand` "Descubrir tema" anclado abajo. Sin encabezado, sin botón volver, sin TabBar.
- `Referencias-y-definiciones/Pantalla-UI/Topic Reel/Default.png` — estado con tema revelado ("Geografía"): el carrete queda en la misma posición y debajo va la sección de confianza (H8 a H10), el chip "62 pulsos disponibles" y el botón "Jugar la sesión". Su texto tiene tildes faltantes y títulos viejos de tarjetas (se corrigen, ver Textos).
- `Referencias-y-definiciones/Animaciones/animacion_sorteo_tema.html` — secuencia y duraciones: tira de 28 filas de relleno + fila final, `translateY` con `cubic-bezier(0.12, 0.7, 0.1, 1)` en 2500 ms, `blur` 0 → 3 px (12%) → 2 px (78%) → 0; `navigator.vibrate(10)` al frenar; sección de confianza entra a los 650 ms con 450 ms de fade + 14 px de desplazamiento; botón cambia a "Jugar la sesión" a los 1100 ms. Con movimiento reducido, todo a 0 ms. Es un prototipo con extras que no están en el PNG (ver Riesgos).
- `Trivia_DS_completo.md` secciones 1, 2, 3 (`TopicReel`, `TopicBetCard`, `Button`, `ConfidenceControl`), 4 (plantilla Sorteo de tema) y 6.
- `App de trivia diseño del MVP.md` — línea 30 (tema del día), línea 148 y 163 (flujo paso 3), línea 184 (faltantes), línea 219 (banco agotado).

## Pantallas involucradas
- Descubrir el tema (dos estados: "antes de girar" y "tema revelado") — plantilla del DS: **Sorteo de tema**.

## Componentes del DS a usar
- `TopicReel` (reposo con fila "Tema de hoy" / girando / frenado con el tema final) — ventana del carrete con los dos triángulos `brand`, vecinos difuminados con `surface-2`, una sola corrida por sesión.
- `Button` `brand` — "Descubrir tema"; deshabilitado (`surface-2`, sin labio) mientras gira; al frenar pasa a "Jugar la sesión". Es el único botón fuerte de la pantalla.
- `TopicBetCard` (x2: "Ganar la sesión" y "Acertar al menos X de las 7") — solo como contenedor/slot que aparece al frenar; el contenido es de H8, H9, H10 y no se mapea acá.
- `ConfidenceControl` (variante de tema) — vive dentro de `TopicBetCard`; fuera de alcance de H6.
- Chip "62 pulsos disponibles" (`surface-2`, `label`) y botón de ayuda "?" — parte del encabezado de la sección de confianza que muestra `Default.png`.

## Componentes a extender
- `TopicReel` — hace falta modelar sus estados y entradas: `idle` (fila "Tema de hoy"), `spinning`, `revealed`, `error`/`loading` (si se decide), y prop de lista decorativa + tema final. El DS ya dice que el consumidor aporta la lista y el tema final; los estados internos no están enumerados. Debe aceptar un modo `instant` (movimiento reducido) y un callback `onSettled` para disparar la vibración, el cambio de botón y la aparición de la sección de confianza.
- `Button` — no se extiende; solo se usa el estado deshabilitado existente.

## Gaps
- **Estado de espera del servidor al tocar "Descubrir tema"** — no se define si el giro empieza antes o después de tener el tema, ni qué se muestra si la respuesta tarda — sin referencia / no existe en el DS.
  - **Resolución temporal sugerida (provisoria)**: pedir el tema al servidor al tocar; mantener el botón deshabilitado y el carrete en reposo hasta tener la respuesta; recién entonces arrancar el giro. El tema final se carga en la última fila al iniciar. Así nunca gira con un tema inventado.
- **Error al obtener el tema** — la historia pide "mensaje sin culpa y acción para reintentar", pero no hay patrón de feedback de error de red — sin referencia / no existe en el DS.
  - **Resolución temporal sugerida (provisoria)**: texto sin culpa bajo la bajada (`body-sm`, `text-muted`, no rojo) y el mismo botón `brand` que vuelve a "Descubrir tema" como acción de reintento, sin segundo botón fuerte. Ver Riesgos: pendiente de decidir un patrón común.
- **Botón de ayuda "?" junto a "¿Confiás en tu conocimiento?"** — la referencia lo dibuja pero no hay contenido ni componente para lo que abre — sin referencia.
  - **Resolución temporal sugerida (provisoria)**: `Overlay` con un título y texto corto con un botón `ghost` "Cerrar"; texto a definir. Es de H8 más que de H6.
- **Revelación con tema ya revelado al volver (una revelación por sesión)** — `Default.png` sirve como estado final visual, pero no hay referencia explícita de la entrada directa a ese estado — sin referencia.
  - **Resolución temporal sugerida**: renderizar `TopicReel` ya en `revealed` (sin animación, sin vibración) con la sección de confianza visible y el botón "Jugar la sesión".
- **Feedback de la vibración y movimiento reducido** — el DS dice "sin vibración" para cualquier otro caso fuera del cierre de aura, pero la historia pide una vibración suave al frenar — contradicción menor entre fuentes.
  - **Resolución temporal sugerida**: una sola vibración de impacto ligero al frenar (equivalente a `vibrate(10)` del prototipo); omitirla con movimiento reducido para ser conservador.
- **Salida de la pantalla** — ni `Default-1.png` ni `Default.png` muestran botón volver ni encabezado — sin referencia.
  - **Resolución temporal sugerida**: no agregar nada y usar el gesto/botón atrás del sistema; confirmar con el diseño.

## Tokens relevantes
- Colores: `bg` (fondo de pantalla); `surface` (ventana del carrete); `surface-2` (degradados de vecinos difuminados, chip de pulsos, botón deshabilitado); `text` (título y tema), `text-muted` (bajada, ayudas, error); `brand` + `on-brand` + `lip-brand`/`brand-deep` (botón y triángulos del carrete); `brand-soft`/`brand-text` (chip con monto dentro de `TopicBetCard`); `line` (borde de `TopicBetCard`); `focus-ring`.
- Tipografía: título "Descubrí el tema de hoy" en `display-lg` (el PNG lo muestra algo menor que 36 px: verificar); bajada `body` o `body-sm` en `text-muted`; tema revelado en `display` (el DS menciona `display-xl` para "tema revelado", el prototipo usa 32/36 px: **verificar**); fila "Tema de hoy" en reposo (en el PNG es de tamaño de tema, no `body`; el prototipo la baja a 20 px `text-muted`); `label` para el chip de pulsos; botón en `display` 800. Cifras tabulares en el chip de pulsos.
- Espaciado y radios: margen lateral `space-5`; separación entre bloques `space-6`/`space-7`; aire de revelación `space-8`; ventana del carrete `radius-lg` (alto 112 px); botón `radius-md`; chip `radius-pill`.
- Sombras y labios: `shadow-float` (ventana del carrete, según prototipo y PNG); `shadow-soft` (tarjetas de confianza); `lip-brand` (botón).

## Patrones de interacción y movimiento
- **Presión con labio**: el botón `brand` baja 4 px en 100 ms; deshabilitado, sin labio ni hundimiento. Movimiento reducido: sin transición de presión.
- **Giro del carrete**: una sola corrida de 2,4 a 2,5 s, desenfoque al inicio, desaceleración larga, vecinos difuminados, solo una fila visible. Sin sonido, luces ni destellos. Movimiento reducido: el tema aparece en la ventana sin giro (consultar `AccessibilityInfo.isReduceMotionEnabled`).
- **Al frenar**: un solo toque de vibración suave; los triángulos `brand` se mantienen según el PNG; luego aparece la sección de confianza con fade y leve desplazamiento (~450 ms, 650 ms después de frenar según el prototipo) y el botón pasa a "Jugar la sesión". Movimiento reducido: la sección aparece sin transición y el botón cambia de inmediato.
- **Botón durante el giro**: deshabilitado. El prototipo cambia su rótulo a "Buscando tema" (no está en la historia: ver Riesgos).
- **Una vez por sesión**: al volver con el tema revelado, `TopicReel` arranca ya revelado y no repite animación ni vibración.
- **Foco y lectores de pantalla**: anunciar con `aria-live`/`accessibilityLiveRegion` el tema revelado ("Tema del día: X"); el estado "girando" no debe leerse cuadro a cuadro. Táctiles de al menos `tap-min` (52 px) en el botón y en las tarjetas.

## Datos y autoridad del servidor
- Llega del servidor: el tema final de la sesión (id y nombre), si el jugador ya lo reveló en esta sesión, los pulsos disponibles del jugador (para el chip), el multiplicador y la cantidad de jugadores de la partida (para la descripción de "Ganar la sesión"), la lista decorativa de temas (o se arma localmente), y el estado de la ventana (si sigue abierta).
- La app nunca calcula: el tema (no hay sorteo local ni semilla), la elegibilidad del tema por preguntas no vistas, ni cuántos pulsos están disponibles; la reserva real de pulsos ocurre al tocar "Jugar la sesión" y la hace el servidor. La lista que pasa por el carrete no tiene valor de producto.

## Textos de pantalla
- "Descubrí el tema de hoy"
- "Un solo tema al azar para todos los jugadores de la partida."
- "Tema de hoy" (fila del carrete antes de girar, según `Default-1.png`; el prototipo dice "Tu tema de hoy", se sigue el PNG)
- "Descubrir tema" (según PNG y DS; el prototipo dice "Descubrir el tema")
- "Jugar la sesión" (corregido: el PNG dice "Jugar la sesion")
- "¿Confiás en tu conocimiento?" (corregido: el PNG dice "Confias en tu conocimiento?")
- "Arriesgá pulsos para ganar más, todo depende de qué tanto confiás en tu conocimiento" (corregido: tildes y voseo; el prototipo agrega dos puntos, se sigue la redacción del DS)
- "62 pulsos disponibles" (cifra dinámica, `label` en mayúsculas)
- "¿Cómo querés arriesgar?" (corregido: el PNG dice "Como queres arriesgar?")
- "Ganar la sesión" / "Acertá más que el resto hoy. Paga ×5,4 con 6 jugadores." (el PNG dice "Ganar sesión" y "Arriesgás a lograr el mayor puntaje hoy entre los jugadores"; manda `Al menos X expanded.png` / DS)
- "Acertar al menos X de las 7" / "Elegí cuántas preguntas creés que vas a acertar del tema de hoy." (el PNG dice "Ganar x de las 7 sesiones")
- "Sin pulsos" (chip de las tarjetas cerradas)
- Error de obtención del tema: **texto pendiente de definir** (provisorio sugerido, sin culpa: "No pudimos traer el tema. Probá de nuevo.", con "Descubrir tema" como acción de reintento).
- Vecinos del carrete: nombres de temas (decorativos).

## Riesgos y dudas
- **Conflicto entre PNG y prototipo HTML**: el prototipo tiñe la tarjeta con el color del tema, muestra un ícono, chips "7 preguntas" / "20 s por pregunta", expande la tarjeta a 244 px, colapsa título y bajada al revelar, y muestra un `hint` con texto. `Default.png` (que manda) no tiene nada de eso: carrete con tema, sin tinte, sin ícono ni chips, y el título sigue visible. Se mapeó lo del PNG; **¿se adopta el tinte/ícono/chips o no?** Ninguno está en el DS ni en `TopicTile`, y los valores "7 preguntas" y "20 s" tendrían que venir de configuración.
- **Patrón de error de red unificado**: no hay un patrón común de feedback de error para historias de pregunta, sorteo, etc. Lo propuesto acá es provisorio y puede quedar inconsistente con las otras historias.
- **Vibración vs. "único festejo"**: el DS reserva la vibración para el cierre de aura; la historia pide una vibración al frenar. Habría que confirmar que es intencional y qué hacer con movimiento reducido.
- **Etiqueta "Buscando tema" durante el giro** (prototipo): no está en la historia ni en el DS; ¿se mantiene el rótulo "Descubrir tema" deshabilitado o se cambia?
- **Tamaño del tema revelado**: DS dice `display-xl` (56 px) para "tema revelado"; el prototipo usa 32/36 px y el PNG parece más chico que 56. Verificar con el PNG real.
- **Posición del chip de pulsos y scroll**: `Default.png` no muestra las tarjetas desplegadas dentro del espacio visible junto con el botón; no está claro si el contenido scrollea y el botón queda anclado (el prototipo lo hace con `dock`).
- **Alcance**: H7 (promedio global del tema) y H22 (ventana vencida) no están disponibles todavía; la pantalla de H6 no deja lugar visible para el promedio y no define qué pasa si la ventana vence mientras se gira o se elige confianza.
- **Salida de pantalla**: sin botón volver en las referencias; confirmar si el jugador puede salir antes de revelar y cómo.
