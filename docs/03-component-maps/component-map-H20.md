# Component Map: H20 - Ver el premio y los logros al terminar la partida

## Resumen de la historia
- **Descripción**: Como jugador, quiero ver si gané el premio y qué logros obtuve al terminar la partida, para sentir que mi esfuerzo valió aunque no haya salido primero.
- **Referencias visuales**: sin referencia propia (premio y logros en el fin de partida). Se hereda el marco de la pantalla de Fin de partida.
- **Reglas de producto**: premio para el 1º solo si la partida llega al final del día 5 con al menos 2 jugadores en pie; con empate en el primer puesto se divide (redondeo hacia abajo). Logros no monetarios: mejor día, mejor apuesta (término interno), aciertos (el título de calibración pasa a la V2, PO 23/11/2026). Flujo, paso 8: ganador, premio (si corresponde) y logros.
- **Criterios funcionales**: el fin de partida muestra el ganador, el premio si corresponde y los logros. Formato y textos pendientes de referencia.
- **Autoridad del servidor**: calcula ganador, premio (valor configurable), división por empate y logros.
- **Experiencia**: sin festejos de casino; el único festejo es `AuraClose`.
- **Casos borde**: empate en el primer puesto (se divide); partida terminada antes del día 5 por quedar un solo jugador (sin premio).
- **Dependencias**: H19. **Prioridad**: baja.
- Nota de contexto (23/11/2026): no hay topes de apuesta; el único límite son los Pulsos disponibles. No afecta a esta historia salvo el logro "mejor apuesta", cuyo valor ya no está acotado por un tope.

## Referencias revisadas
- `Referencias-y-definiciones/Pantalla-UI/Fin de partida/Gana.png` — marco de la pantalla: chip `forest` "PARTIDA TERMINADA", título, "Quedaste 2º de 4 jugadores", `AuraRing` grande con "AURA", "22 de 25 pulsos para tu 2ª aura", bloque `surface-2` "GANASTE +6" (en `brand-text`), `Button` `brand` "Continuar" anclado abajo. Hay un gran espacio vacío entre el bloque "Ganaste" y el botón: es donde el DS no define nada, y es el lugar natural (pero NO confirmado) para premio y logros.
- `Referencias-y-definiciones/Animaciones/animacion_fin_partida.html` — secuencia: 900 ms de espera, aparece el bloque "Ganaste" (400 ms), los pulsos se llenan de a uno (95 ms c/u; si se pierde, 130 ms c/u, sin animar la baja más que el vaciado), cruce de aura con pulso de 600 ms y vibración 12 ms, mensaje "Completaste tu Nª aura", botón "Continuar" aparece con fade de 400 ms al final. Escenario "aura" usa el subtítulo "Ganaste la partida" cuando el jugador es 1º (es el único texto de la referencia para el ganador). Con movimiento reducido (`D=0`) todo es instantáneo. Región `aria-live="polite"` con "Ganaste N pulsos. Ahora tenés N auras y N de 25 pulsos."
- `Referencias-y-definiciones/cierre_light.png` — no se revisó en profundidad: H20 no dispara el cierre por sí misma (lo hace H21).
- No existe imagen de premio ni de logros: confirmado en el MVP ("Faltan en las referencias": "el premio y los logros en el fin de partida").

## Pantallas involucradas
- Fin de partida — plantilla del DS: **Fin de partida** (sección 4). Se extiende con un bloque de premio y un bloque de logros sin referencia.
- (Indirecta) Perfil / Detalle de partida: los logros podrían reaparecer en la fila de ranking (`LeaderboardRow` "Reconocé logros no monetarios en el resumen"). No es alcance de H20.

## Componentes del DS a usar
- Chip `forest` "Partida terminada" — encabezado (igual que la referencia).
- `AuraRing` (grande) con "Aura" — contexto de H19/H21, sin cambios.
- Bloque `surface-2` "Ganaste +N" / "Perdiste -N" — resultado de pulsos de H19; cifras con signo y color. En esta pantalla manda la referencia sobre el formato de R9 (N7, PO 23/11/2026).
- Chip `sun` (significado fijo "premio") — rótulo "Premio" en el bloque de premio.
- Cifra de pulsos con signo `+150 pulsos` en `brand-text` — monto del premio (formato `d-coins--up`), en un bloque aparte del neto "Ganaste +N" (N7).
- `StatPill` — candidato para los logros numéricos de una sola cifra (aciertos, mejor día, tu mayor riesgo): icono/valor/etiqueta pequeños. Verificar que el formato (ícono 36px, valor 20px) encaje; el DS lo describe para racha, puntos y aura.
- `Button` `brand` "Continuar" — única acción fuerte de la pantalla.
- `AuraClose` — solo si el saldo cruza un múltiplo de 25 (H21); H20 no agrega festejo propio.

## Componentes a extender
- Ninguna variante nueva de componente. Se propone solo una composición sobre existentes: bloque de premio (`sun-soft` + chip `sun` + cifra) y lista de logros (`StatPill` / chips). Si el PO prefiere una tarjeta contenedora, sería un componente nuevo (ver Gaps).

## Gaps
- **Bloque de premio** — no hay referencia; el DS solo dice que `sun`/`sun-soft` son color de "premios y datos destacados". — sin referencia
  - **Resuelto (N7, PO 23/11/2026)**: el premio va en un bloque aparte, separado del neto "Ganaste +N"; el servidor informa si el premio está incluido en el saldo que dibuja el aro. **Formato (PO, 23/11/2026)**: bajo el bloque "Ganaste", un bloque `sun-soft` con chip `sun` "Premio" y "+150 pulsos" (valor del servidor) en `brand-text`. Si hay empate: "+37 pulsos · Premio dividido entre 4" (valores del servidor). Sin animación propia (el único festejo es `AuraClose`), sin ícono de trofeo/medalla ni adornos.
- **Lista de logros** (mejor día, tu mayor riesgo, aciertos) — sin referencia ni formato. — sin referencia
  - **Resolución temporal sugerida (provisoria)**: filas simples `label` + cifra en `display` dentro de un bloque `surface-2`, o 3 `StatPill` y un chip con el título. Sin íconos de medalla, sin colores de festejo, sin animación.
- **Estado de partida sin premio** (terminó por quedar un solo jugador) — sin referencia. — sin referencia
  - **Resolución temporal sugerida**: omitir el bloque de premio por completo (no mostrar "0 pulsos de premio" ni "sin premio" con tono de culpa). Posible texto neutro "Terminó porque quedó un solo jugador" — duda abierta. El cero y "fuera de la partida" van neutros.
- **Fin de partida para quien quedó eliminado antes** — el eliminado ve esta pantalla cuando la partida se resuelve, después de la hoja de expulsión (N3, PO 23/11/2026). Contenido (PO, 23/11/2026): la misma pantalla que los demás con su resultado real: ganador, su posición ("Quedaste 4º"), su aro sin cambios y los logros que haya sacado antes de quedar afuera; sin bloque de premio y sin texto de culpa. Sin referencia visual.
  - **Resolución temporal sugerida**: mostrar logros igual (la historia busca sostener el interés de quien queda atrás), sin rojo y sin culpa.
- **Término "mejor apuesta"** — es interno; en pantalla no puede usarse "apuesta". — no existe en el DS
  - **Resuelto (PO, 23/11/2026)**: "Tu mayor riesgo" (reemplaza "mejor apuesta"; no usar "confianza", que nombra la apuesta por tema).
- **Layout con mucho contenido** — la referencia tiene el botón anclado abajo y un hueco; no hay definición de scroll si premio + logros no entran. — sin referencia
  - **Resolución temporal sugerida**: contenido en scroll, `Button` "Continuar" anclado.
- **Estado de carga/error** al pedir el resultado final — el DS tiene "Carga y error" (esqueletos `surface-2`, bloque con "Reintentar" `neutral`, sin rojo; texto "No pudimos conectarnos. Revisá tu conexión y probá de nuevo."). La historia no dice cómo mostrarlo; se deja como duda (ver Riesgos).

## Tokens relevantes
- Colores: `sun` / `sun-soft` (`#fff1c9`, texto `text` encima) para premio; `brand-text` para `+N pulsos`; `danger-text` para `-N`; `text-muted` para cero, etiquetas y "sin cambios"; `forest` + `on-forest` para el chip de estado; `surface-2` para bloques; `brand` + `on-brand` + `lip-brand` para "Continuar".
- Tipografía: `display` (Urbanist 800) para cifras y título (cifras tabulares); `body` (Nunito 600) para frases; `label` en mayúsculas para chips y rótulos ("GANASTE", "PREMIO").
- Espaciado y radios: `space-*` de la referencia (bloque centrado, ancho ~360 px); `radius-md` en bloques, `radius-pill` en chips; `tap-min` en el botón.
- Sombras y labios: solo "Continuar" lleva labio de 4 px (`lip-brand`). Bloques informativos sin labio (no son presionables).

## Patrones de interacción y movimiento
- Entrada de bloques: sigue la secuencia de la animación de referencia; premio y logros aparecen con fade suave después del resultado de pulsos y antes de "Continuar" (orden y duraciones propuestos, provisorios). — Movimiento reducido: todo aparece de una vez, instantáneo.
- Premio: sin animación de conteo ni destello (casino). Aparece estático. — Movimiento reducido: igual.
- Cierre de aura (H21): si el saldo cruzó un múltiplo de 25, corre una sola vez con su secuencia de 1,5 s. — Movimiento reducido: número y aro instantáneos, sin pulso.
- Bajar de aura: no se anima ni usa rojo.
- Presión de "Continuar": se hunde 4 px con el labio.
- Accesibilidad: un solo anuncio `aria-live="polite"` en la pantalla (N6), el de H19; si hay premio, entra en ese mismo anuncio (redacción a definir); premio y logros nunca dependen solo del color (texto + signo); cada logro con su etiqueta textual.

## Datos y autoridad del servidor
- Llega del servidor: posición final y número de jugadores, indicador de ganador/empatados, estado de cierre de la partida (completa día 5 / último en pie), monto del premio ya dividido y redondeado (valor configurable, 150 provisorio), movimiento de pulsos final, saldos de pulsos libres antes y después (N6), si el premio está incluido en ese saldo (N7), logros (mejor día, tu mayor riesgo, aciertos).
- La app nunca calcula: ganador, premio, división por empate, redondeo, ni logros. Solo presenta lo recibido y dibuja el aro entre los dos saldos (N6).

## Textos de pantalla
- "Partida terminada" (referencia)
- "Quedaste 2º de 4 jugadores" (referencia; "º" con símbolo)
- "Ganaste la partida" (animación, escenario del primer puesto)
- "Ganaste +6" / "Perdiste -5" (referencia / animación; confirmado para esta pantalla, N7)
- "22 de 25 pulsos para tu 2ª aura" (referencia)
- "Completaste tu Nª aura" (animación / H21)
- "Continuar" (referencia)
- Provisorios sin referencia: "Premio", "+150 pulsos" (valor del servidor), "Premio dividido", "Tus logros", "Mejor día", "Tu mayor riesgo" (reemplaza "mejor apuesta"; resuelto por el PO el 23/11/2026), "Aciertos". A confirmar con el PO.
- Prohibidos en pantalla: "apuesta", "apostar", "monedas".

## Riesgos y dudas
- Formato, ubicación y textos de premio y logros no tienen referencia: todo lo anterior es provisorio.
- Título de calibración: fuera del MVP, pasa a la V2 con el perfil de calibración (PO, 23/11/2026).
- El eliminado ve la pantalla completa con su resultado real (resuelto, PO 23/11/2026). Falta referencia visual de "Pierde" (solo existe en la animación).
- Estado de error/carga al cargar el resultado final: la historia no lo define; no elegí un patrón. El DS tiene "Carga y error" general, pero hay que confirmar si aplica a esta pantalla.
- Sin código implementado de estos componentes en `mobile/src` (solo tokens del tema): componentes verificados contra el DS, sin implementación todavía.
- Redondeo hacia abajo en el empate (150/4 = 37) deja pulsos sin repartir: el servidor ya lo resuelve, pero conviene que el texto no lo cuestione.
- Premio de 150 y demás valores son configurables y provisorios hasta correr la simulación.
