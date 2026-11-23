# Component Map: H19 - Ver el fin de partida con mi aura

## Resumen de la historia
**Descripción**: Como jugador, quiero ver cómo quedé y cómo cambió mi aura cuando termina la partida, para cerrar la experiencia con la consecuencia clara de lo que arriesgué.

**Reglas de producto involucradas**: la bolsa final vuelve completa al contador general; "Fin de partida" (aro del contador general con el Aura actual, marca del punto de partida, "22 de 25 pulsos para tu 2ª aura", lo ganado o perdido, cambio de emblema si lo hubo); aparece cuando la partida se resuelve (el último jugador en pie termina el día 5, cierra la ventana del día 5 o queda uno solo), no cuando el jugador termina su propio día 5; se ve la próxima vez que el jugador abre la app.

**Criterios de aceptación**:
- Solo se muestra cuando el servidor informa que la partida se resolvió (próxima apertura de la app).
- Chip "Partida terminada", título de la partida y "Quedaste Nº de N jugadores" (con empate, puesto compartido).
- Aro grande con el aura actual, "Aura" debajo del número y marca del punto de partida (pulsos libres antes de la partida).
- "N de 25 pulsos para tu Nª aura".
- Bloque "Ganaste +N" (verde) o "Perdiste -N" (rojo).
- Si se completó un aura durante la animación, corre `AuraClose` (H21) una sola vez aunque se crucen varias, y aparece "Completaste tu Nª aura".
- Botón "Continuar" al final de la animación, lleva al inicio.

**Autoridad del servidor**: cierra la partida, devuelve la bolsa, registra el movimiento y entrega posición, neto y saldo antes/después (todos finales).

**Experiencia**: secuencia de `animacion_fin_partida.html`; bajar de aura sin animación especial ni rojo en el número; movimiento reducido = estado final sin transición; texto accesible "Ganaste 6 pulsos. Ahora tenés 1 aura y 22 de 25 pulsos.".

**Casos borde**: queda un solo jugador (gana sin premio); expulsado (resultado 0, nada que devolver); cambio de emblema sin referencia; quien terminó antes ve el resumen (H17) y este fin recién al resolverse.

**Dependencias**: H17. **Prioridad**: alta.

## Referencias revisadas
- `Referencias-y-definiciones/Pantalla-UI/Fin de partida/Gana.png` — layout: chip `forest` "PARTIDA TERMINADA", título "Partida con la barra", subtítulo "Quedaste 2º de 4 jugadores", aro grande (aura 1, "AURA" bajo el número, 22 tramos llenos, marca radial gris en el tramo 16, tramos 22-25 en pista), "22 de 25 pulsos / para tu 2ª aura", bloque `surface-2` "GANASTE +6" en `brand-text`, botón `brand` "Continuar" anclado abajo con labio. Cuerpo vacío entre el bloque y el botón.
- `Referencias-y-definiciones/Animaciones/animacion_fin_partida.html` — secuencia y tiempos (ver Patrones). Tres escenarios de demo: Gana (S=16, +6), Pierde (S=16, -5, "Quedaste 4º de 4 jugadores"), Completa un aura (S=20, +9, "Ganaste la partida", mensaje "Completaste tu 2ª aura"). Incluye `aria-live` y reducción de movimiento (duración 0).
- `Referencias-y-definiciones/cierre_light.png` — `AuraClose`: 1 faltan 5, 2 se completa (centro `brand-soft`), 3 un solo pulso (aro +6%, 600 ms, vibración suave), 4 aura nueva (número 2, aro vacío). Tiempos: 0-450 ms tramos, 650 ms centro y pulso, 1250 ms número, 1500 ms aro a cero.

## Pantallas involucradas
- Fin de partida — plantilla del DS: "Fin de partida" (sección 4). Pantalla completa sin `TabBar` ni encabezado forest (la referencia no los muestra).
- Destino de "Continuar": Inicio (plantilla Inicio), fuera del alcance de esta historia.
- Secuencia en una misma apertura (N3, PO 23/11/2026): resumen del día (H17) → hoja de expulsión (H18) → fin de partida. El resumen y la hoja cierran al Detalle de partida; "Continuar" del fin de partida va al Inicio. El expulsado también ve esta pantalla cuando la partida se resuelve.

## Componentes del DS a usar
- Chip `forest` "Partida terminada" (chip de estado, color de significado fijo; en el DS figura como "Cerrada"/forest).
- `AuraRing` (versión grande, con marca radial de punto de partida y la palabra "Aura" bajo el número) — contador general; `role="img"` + `aria-label`.
- `AuraClose` (H21) — se dispara dentro del aro solo si se cruza un aura; una sola vez.
- Bloque de resultado `surface-2` ("Ganaste +N" / "Perdiste -N") — cifra con signo y color (`brand-text` / `danger-text`). En esta pantalla manda la referencia sobre el formato de R9 ("+N pulsos ganados" sigue en el resto de la app) (N7, PO 23/11/2026). El premio (H20) va en un bloque aparte, no dentro de este neto.
- `Button` `brand` "Continuar" (único botón fuerte de la pantalla), ancho completo, anclado al pie; oculto hasta el final de la animación (PO, 23/11/2026): el dock aparece 500 ms después del final, ya habilitado; nunca se muestra deshabilitado durante la animación. Con movimiento reducido aparece de inmediato.

## Componentes a extender
- `AuraRing` — props para: marca radial del punto de partida (`startPulses`), palabra "Aura" bajo el número, tamaño grande (referencia ~236 px en 390 pt), tramos `gain` (`brand-text`) transitorios durante la animación, y secuencia controlada por el padre (pulsos inicial/final). Sin tramos `coral` en pérdida (N6). El DS ya describe marca y palabra; la secuencia de ganancia/pérdida de la animación es lógica de la pantalla sobre `AuraRing`.
- `AuraRing`/`AuraClose` — soportar cruce de varias auras según H21, que manda sobre la secuencia del aro (N6, PO 23/11/2026): un solo cierre, el aro se llena hasta la primera cruzada, un pulso, el número salta al aura final y el aro queda en el resto real ("Seguís desde N de 25 pulsos").

## Gaps
- Cambio de emblema en el fin de partida — sin referencia (el diseño del emblema está pendiente en el DS) — sin referencia.
  - **Resolución temporal sugerida**: no mostrar nada de emblema hasta tener diseño; dejar el slot previsto fuera del layout.
- Neto de 0 — sin referencia (la animación solo muestra "Ganaste +N" / "Perdiste -N"; el DS exige cero neutro).
  - **Resolución temporal sugerida**: bloque con "sin cambios" en `text-muted`, sin signo ni color, y el aria "Sin cambios en tus pulsos".
- Jugador expulsado (resultado 0, bolsa devuelta 0) — sin referencia (caso borde de la historia).
  - **Resolución temporal sugerida**: neutro, sin rojo ni culpa. El aro parte del punto de partida (libres antes de la partida) y el neto es "sin cambios" porque nada vuelve; el neto de la partida no se muestra como pérdida (la pérdida de la bolsa ya ocurrió antes). Marcar como duda de producto: ¿se muestra la pérdida de la bolsa o solo lo que vuelve? Sugerencia provisoria: texto neutro como "Quedaste fuera de la partida" en `text-muted`.
- Premio y logros — fuera de esta historia (H20); no entran en el layout de referencia.
- Estado de carga y error al pedir el resultado final (red caída, servidor sin responder) — no definido por la historia.
  - **Resolución temporal sugerida**: patrón "Carga y error" del DS (esqueleto `surface-2` y bloque con "Reintentar" `neutral`, sin rojo, texto "No pudimos conectarnos. Revisá tu conexión y probá de nuevo."). Queda explícito como duda (ver Riesgos).
- Marcador de empate/puesto compartido y "Ganaste la partida" (rótulo del escenario "Completa un aura" y de partida con un solo jugador) — la animación usa "Ganaste la partida" como subtítulo pero la historia no lo lista; sin definición textual clara.
  - **Resolución temporal sugerida**: usar "Quedaste 1º de N jugadores"; con empate "Quedaste 1º de N jugadores (empate)" provisorio.
- Varias partidas resueltas al abrir la app (PO, 23/11/2026): cola, una pantalla de fin por vez, cada una con su animación y su "Continuar"; "Continuar" lleva al siguiente fin y el último deja al jugador en el Inicio. Sin referencia visual.
  - **Resolución temporal sugerida**: mostrar una por vez, cada una con su "Continuar".

## Tokens relevantes
- Colores: `bg` (fondo); `forest` + `on-forest` (chip); `surface-2` (bloque de resultado, pista vacía del aro); `line` (pista del aro); `brand` (tramos llenos y botón) con `on-brand` y `lip-brand`; `brand-soft` (centro en `AuraClose`); `brand-text` (+N, tramos en ganancia); `danger-text` (solo la cifra -N del bloque); `text`, `text-muted` (subtítulo, "AURA", marca radial, "sin cambios"). Nada de `coral` ni `danger-text` en el aro (N6).
- Tipografía: `display` Urbanist 800 para título (26/30), número de aura (84/78, tabulares), "N" de pulsos (24/26) y valor del bloque (28/34); `body` Nunito para subtítulo (15/22 700) y "de 25 pulsos" (16/22 700); `label` 12/16 800 mayúsculas con tracking .08em para chip y "Ganaste"/"Perdiste"; "AURA" 14/18 800 tracking .1em. Cifras tabulares en todo valor que cambia.
- Espaciado y radios: margen lateral `space-5`; dock con `space-5` lateral y `space-6` abajo; `radius-md` del bloque y del botón; `radius-pill` del chip; `tap-min` 52 px del botón.
- Sombras y labios: `lip-brand` en "Continuar" (se hunde 4 px al presionar); el bloque no lleva sombra.

## Patrones de interacción y movimiento
- Secuencia (de `animacion_fin_partida.html`): estado inicial con el aro en el punto de partida y bloque oculto; 900 ms de espera; aparece el bloque (fade + 8 px, 400 ms) con "0" neutro, sin signo ni color (PO, 23/11/2026; el signo y el color aparecen con el primer +1 o -1); ganancia: cada tramo se llena en `brand-text` cada 95 ms y el número del bloque cuenta +1; al completar 25, corre `AuraClose` con la secuencia de H21 (que manda sobre el aro, N6): un solo cierre aunque se crucen varias auras, el número salta al aura final y el aro queda en el resto real; pérdida: el bloque cuenta -N y los tramos pasan a pista sin animación de vaciado, sin `coral` ni rojo (H21); 400 ms después los tramos ganados pasan a `brand`; si hubo cruce aparecen "Completaste tu Nª aura" y "Seguís desde N de 25 pulsos" en el lugar de "N de 25 pulsos para tu Nª aura"; 500 ms después aparece el dock con "Continuar" y se habilita. Un solo anuncio `aria-live="polite"` al final de la secuencia (ver Textos).
- Bajar de aura: sin animación ni rojo en el número ni en el aro; solo se actualiza el número. La cifra del bloque "Perdiste -N" sí lleva `danger-text` (la referencia manda en el bloque, N7).
- Presión con labio en "Continuar": hunde 4 px en 100 ms.
- Movimiento reducido: sin secuencia; se muestra el estado final completo (aro final, número final, bloque con el neto, mensaje de aura si corresponde, botón habilitado), sin pulso y sin transición. Si se cruzó un aura, el número y el aro se actualizan sin `AuraClose` animado, pero la vibración suave se mantiene (PO, 23/11/2026).
- La vibración es exclusiva de `AuraClose`; la pantalla no vibra en ningún otro momento.
- "Continuar" bloqueado hasta el final de la animación (aparece al final); con movimiento reducido aparece de inmediato.
- Hay que prever el caso de salir de la app a mitad de la animación: al volver, mostrar el estado final (ver Riesgos).

## Datos y autoridad del servidor
- Llega del servidor (N6, PO 23/11/2026): bandera "partida resuelta", título de la partida, posición final y cantidad de jugadores (con empate), neto de la partida, saldo de pulsos libres antes y después (antes = punto de partida; después = final), si el premio está incluido en ese saldo (N7), y si hubo cambio de emblema.
- La app solo dibuja: ubica el aro y el número a partir de los dos saldos que envía el servidor y anima entre ambos. No decide nada con efecto sobre el saldo.
- La app nunca calcula: la resolución de la partida, la bolsa final, la devolución al contador, la posición, el desempate, el neto, ni cuándo se resuelve. Tampoco decide si se muestra la pantalla: lo informa el servidor. No hay topes de apuesta (desde el 23/11/2026, el único límite son los Pulsos disponibles): no hay nada que mostrar al respecto en esta pantalla.

## Textos de pantalla
- "Partida terminada" (chip; mayúsculas por estilo)
- "[Título de la partida]" (ej. "Partida con la barra")
- "Quedaste 2º de 4 jugadores" (con `º`; con empate, puesto compartido)
- "Aura" (bajo el número del aro; mayúsculas por estilo)
- "22 de 25 pulsos" / "para tu 2ª aura" (sin cruce de aura)
- "Ganaste" + "+6" / "Perdiste" + "-5" (cifra con signo y color; singular "1 pulso" si corresponde)
- "sin cambios" (neto 0; provisorio)
- "Completaste tu 2ª aura" y "Seguís desde N de 25 pulsos" con N real (solo si se cruzó un aura; H21, N6)
- "Continuar"
- `accessibilityLabel` del aro: "Tu aura: 1, 22 de 25 pulsos"
- Texto accesible del resultado, único anuncio de la pantalla (N6; H21 no agrega otro): "Ganaste 6 pulsos. Ahora tenés 1 aura y 22 de 25 pulsos." (singular: "1 aura", "1 pulso"; pérdida: "Perdiste 5 pulsos. ...")
- Error de red: "No pudimos conectarnos. Revisá tu conexión y probá de nuevo." / "Reintentar" (provisorio)

## Riesgos y dudas
- Verificado solo contra el DS: no hay implementación (`AuraRing` y `AuraClose` no existen en `mobile/src`).
- "Ganaste +6" (referencia) frente a "+N pulsos ganados" (R9): resuelto, en esta pantalla manda la referencia (N7). Inicio de la animación: resuelto (PO, 23/11/2026), arranca en "0" neutro sin signo; nunca "+0" ni "-0".
- Mensaje "Completaste tu Nª aura" y "Ganaste la partida" de la animación no coinciden con la historia en el segundo caso; confirmar con producto.
- Feedback de error al cargar el resultado: la historia no lo define; se propone "Carga y error" del DS pero es una duda explícita que el consistency-checker debe cruzar con otras historias.
- Si el jugador sale a mitad de la animación y vuelve: ¿se repite o se muestra el estado final? Sugerencia: estado final, `AuraClose` no se repite.
- Expulsado: no está definido si el aro parte del punto de partida y qué se dice del neto. Duda de producto.
- Una partida terminada con un solo jugador "gana sin el premio" (premio en H20); el subtítulo y "Ganaste la partida" necesitan texto.
