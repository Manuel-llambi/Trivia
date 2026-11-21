# Component Map: H2 - Ver la card de la partida que me toca jugar

## Resumen de la historia

**Descripción**: Como jugador, quiero ver en el inicio la card de la partida en la que me toca jugar con mi bolsa, mi resultado y mi posición, para decidir entrar a jugar la sesión del día.

**Criterios clave**:
- La card muestra: chip "Vence en HH:MM:SS" (cuenta regresiva hasta el cierre de la ventana), "Día N de 5", título, "N jugadores", avatares apilados, bolsa en número grande, neto debajo y posición.
- Estados: Ganando (62, "+12 pulsos ganados", "Vas 2º", "Jugar"), Perdiendo (42, "-8 pulsos perdidos", "Vas 2º", "Jugar"), Recién empieza (bolsa = costo de entrada, "sin cambios", "Todos 0", "Jugar"), Fuera de la partida (0, "sin pulsos", "Quedaste 4º", chip gris "Fuera de la partida", "Ver ranking").
- "Jugar" lleva al detalle de la partida (H4). "Ver ranking" lleva al detalle sin botón de jugar. La card de la partida que toca va arriba de las demás.
- Servidor: entrega bolsa, neto, posición, día actual, hora de cierre y si el jugador fue expulsado. La app no decide si la sesión sigue abierta.
- Experiencia: una sola acción principal por card (`brand` solo si toca jugar); vacío sin cards vacías; cargando y error con reintento sin cifras viejas; "Fuera de la partida" neutro; etiqueta accesible del bloque; cifras tabulares.
- Bordes: la ventana vence con el inicio abierto (la card deja de ofrecer "Jugar" cuando el servidor informa el cierre); expulsado; empates comparten puesto (los dos del 2º ven "Vas 2º").
- Dependencias: ninguna. Prioridad alta.

Alcance de esta corrida: H3, H5, H7, H15 y H17–H23 no están disponibles todavía; las referencias a ellas se tratan como pendientes.

## Referencias revisadas

Componentes verificados contra el DS, sin implementación todavía (no hay código en el repo).

- `Referencias-y-definiciones/Pantalla-UI/Dashboard/Todas.png` — plantilla Inicio: encabezado `forest`, control segmentado, card "Trivia de los viernes" en estado Ganando (62, "+12 pulsos ganados", "Vas 2o" con typo), chip "VENCE EN 16:20:23" en `coral-soft`, avatares L/J/A, botón `brand` "Jugar", y dos cards compactas "Jugada hoy" debajo de "PARTIDAS COMPLETADAS HOY". El bloque gris no tiene aro. No se ve la `TabBar` en la captura.
- `Referencias-y-definiciones/card_states.png` — los cuatro estados de la card (Ganando, Perdiendo, Recién empieza, Fuera de la partida), con chip gris "Fuera de la partida" y botón "Ver ranking" en blanco con borde y labio (neutral). Discrepa del resto: dibuja un aro dentro del bloque gris, "Bolsa inicial de 8 pulsos" y textos "+3 ganados" / "-2 perdidos". Por prioridad, el MVP y el DS (sin aro, bolsa inicial 50, "+12 pulsos ganados") y `Todas.png` mandan; ver Riesgos y dudas.
- `Trivia_DS_completo.md` — secciones 1 (voz, color, aura y pulsos, accesibilidad), 2 (tokens), 3 (`MatchCard`, `StatPill`/chips/avatares, `Button`), 4 (plantilla Inicio) y 6 (Expo / RN).
- `App de trivia diseño del MVP.md` — "Card de partida (te toca jugar)", ventana de 24 h, empates, expulsión, hora de apertura y "Faltan en las referencias".

## Pantallas involucradas

- Inicio (dashboard), pestaña "Todas" y "Te toca" — plantilla del DS: **Inicio**. H2 cubre solo la card que toca jugar; el encabezado es H1 y el control segmentado y las cards compactas son H3 (fuera de esta corrida).
- Destino de "Jugar" y "Ver ranking": Detalle de partida (H4), plantilla **Detalle de partida**, no se diseña acá.

## Componentes del DS a usar

- `MatchCard` (estado Ganando) — bolsa 62, "+12 pulsos ganados" en `brand-text`, "Vas 2º", `Button brand` "Jugar".
- `MatchCard` (Perdiendo) — "-8 pulsos perdidos" en `danger-text`, mismo botón.
- `MatchCard` (Recién empieza) — bolsa igual al costo de entrada (el DS muestra 50), "sin cambios" en `text-muted`, "Todos 0".
- `MatchCard` (Fuera de la partida) — 0, "sin pulsos" en `text-muted`, "Quedaste 4º", chip gris, `Button neutral` "Ver ranking".
- Chip de vencimiento (`StatPill`/chips, significado `coral` urgencia) — `coral-soft` con `danger-text`, texto `label` en mayúsculas.
- Chip "Fuera de la partida" — gris, forma de chip del DS (`surface-2`; el DS no fija token exacto, ver gaps).
- Avatares apilados — `avatar-sm` 32px, solape 8px, inicial en `display` sobre `brand`/`sky`/`coral`/`sun`/`violet`.
- `Button` `brand` "Jugar" (uno por pantalla; ver riesgo con varias cards que toquen jugar).

## Componentes a extender

- `MatchCard` — el DS define el chip de vencimiento pero no su comportamiento: necesita una prop de hora de cierre del servidor y un contador que se actualice cada segundo, con estado "cerrada" (la card pasa a no ofrecer "Jugar"). Es comportamiento nuevo, no una variante visual.
- `MatchCard` — estados de carga y error (ver gaps).

## Gaps

- **Estado cargando de la card** — sin referencia / no existe en el DS.
  - **Resolución temporal sugerida**: bloque `surface-2` con la misma geometría de la card y sin cifras, sin inventar números. Provisorio.
- **Error al cargar con reintento** — sin referencia / no existe en el DS. La historia exige reintento sin cifras viejas.
  - **Resolución temporal sugerida**: texto breve sin culpa dentro de una card `surface` y `Button neutral` "Reintentar". Provisorio, y depende de la decisión de patrón de error común.
- **Estado vacío del inicio (sin partidas)** — sin referencia (MVP no lo lista, la historia remite a "Preguntas para PO").
  - **Resolución temporal sugerida**: no mostrar cards vacías; texto simple en `text-muted` sin ilustración. Provisorio.
- **Card cuando la ventana ya cerró mientras se mira el inicio** — sin referencia.
  - **Resolución temporal sugerida**: sacar el botón `brand`, congelar el chip en un estado neutro y ofrecer `Button neutral` "Ver ranking", sin inventar texto de "sesión vencida". Provisorio.
- **Chip de vencimiento en estado urgente/escalado** — el DS no define variantes por tiempo restante; la referencia lo muestra siempre en `coral-soft` con 16 h restantes.
  - **Resolución temporal sugerida**: mantener un único estilo `coral-soft` / `danger-text`.
- **Expulsión detectada al abrir (después de la sesión)** — la hoja de expulsión no tiene referencia (MVP, pendiente "textos de la reflexión"). H2 solo muestra la card "Fuera de la partida".
  - **Resolución temporal sugerida**: card neutra con "Ver ranking" y sin ningún aviso extra.
- **Texto de "Día N de 5" cuando la partida ya terminó o está en espera** — sin referencia.
  - **Resolución temporal sugerida**: no mostrar la card como "te toca" y tratarlo fuera de H2.

## Tokens relevantes

- Colores: `surface` (card), `surface-2` (bloque gris y chip gris), `bg`, `text`, `text-muted`, `coral-soft` + `danger-text` (chip de vencimiento y pérdida), `brand-text` (ganancia), `brand` + `on-brand` + `lip-brand` (botón "Jugar"), `neutral` con `lip-neutral` (botón "Ver ranking"), `focus-ring`. Avatares: `brand`/`sky`/`coral`/`sun`/`violet` con sus `on-*`.
- Tipografía: `display` (bolsa en 40px según el DS, título de la partida con `heading`/`title`), `body-sm` ("8 jugadores", "Día 3 de 5", "sin cambios"), `label` en mayúsculas (chips y "Posición"). Cifras tabulares en bolsa, neto, posición y cuenta regresiva.
- Espaciado y radios: `space-4` relleno de card, `space-5` margen lateral, `space-6` entre cards, `radius-lg` card, `radius-md` bloque gris y botón, `radius-pill` chips y avatares, `avatar-sm`, `tap-min` 52px en el botón.
- Sombras y labios: `shadow-soft` en la card, `lip-brand` en "Jugar", `lip-neutral` en "Ver ranking" (se hunden 4px al presionar).

## Patrones de interacción y movimiento

- Presión con labio: "Jugar" y "Ver ranking" bajan 4px en 100 ms y ocultan el labio. Movimiento reducido: sin transición, el cambio es instantáneo.
- Cuenta regresiva: se actualiza una vez por segundo contra la hora de cierre del servidor. Movimiento reducido: no afecta, pero no anunciar cada segundo a lectores de pantalla (ver Riesgos).
- Navegación: toda la acción lleva al detalle de partida (H4); "Ver ranking" sin botón de jugar.
- Cambios de saldo o posición: las cifras se actualizan sin animación; bajar nunca se anima ni se pinta de rojo salvo el neto negativo con signo.
- Fuera de la partida: sin animación, sin rojo.

## Datos y autoridad del servidor

- Llega del servidor: id y título de la partida, cantidad de jugadores, avatares (inicial y color), día actual, hora de cierre de la ventana, bolsa, neto, posición (con empates ya resueltos: 1º, 2º, 2º, 4º), estado de expulsión y costo de entrada (para "Recién empieza").
- La app nunca calcula: la bolsa, el neto, la posición ni el empate; si el jugador está expulsado; ni si la sesión sigue abierta (solo muestra el tiempo restante contra la hora de cierre del servidor). Para "Recién empieza" muestra la bolsa tal como llega, sin derivarla del costo de entrada.

## Textos de pantalla

- "Vence en 16:20:23" (chip, formato HH:MM:SS; en la referencia aparece en mayúsculas por la clase `label`)
- "Día 3 de 5"
- "8 jugadores"
- "Posición"
- "Vas 2º" (corregido: la referencia dice "Vas 2o")
- "Todos 0"
- "Quedaste 4º"
- "+12 pulsos ganados"
- "-8 pulsos perdidos"
- "sin cambios"
- "sin pulsos"
- "Fuera de la partida" (chip)
- "Jugar"
- "Ver ranking"
- Etiqueta accesible del bloque (propuesta, no figura en referencias): por ejemplo "Tu bolsa: 62 pulsos, ganaste 12 pulsos, vas 2º". El formato exacto es provisorio.

## Riesgos y dudas

- **`card_states.png` contradice al MVP y al DS** (aro dentro del bloque, bolsa inicial 8, "+3 ganados"). Se tomó `Todas.png` + MVP + DS (sin aro). Hay que confirmar con el PO que la imagen está desactualizada; está registrado en "Preguntas para PO" de las historias.
- **Un color fuerte por pantalla**: si el jugador tiene más de una partida que le toca, habría varios `brand` "Jugar" en la misma pantalla. La referencia muestra solo una. Duda: ¿qué pasa con varias cards "te toca"?
- **Cuenta regresiva y accesibilidad**: el DS solo define anuncios de lector de pantalla para el temporizador de pregunta; para el chip de vencimiento no hay regla. Provisorio: no usar `aria-live` por segundo.
- **Chip de vencimiento siempre rojo suave** aun con 16 h restantes: la referencia lo hace así, pero puede leerse como alarma. No se cambió.
- **Botón "Ver ranking"**: el DS dice `neutral`; en `card_states.png` se ve blanco con borde y labio, consistente con `neutral`.
- **Error de red / carga**: la historia no dice cómo mostrarlo; se deja como duda de patrón común (posible inconsistencia entre historias).
- **Pestaña "Te toca" vs "Todas"**: la card es la misma, pero el comportamiento del contenedor es H3 (fuera de esta corrida).
