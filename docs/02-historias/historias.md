# Historias de usuario: Primer flujo a desarrollar: jugar una partida activa

Fuentes: App de trivia diseño del MVP.md (secciones "Glosario", "Reglas de la partida", "Economía de Pulsos", "Ganador y premios", "Aura, emblemas y cards", "Flujo y pantallas", "Primer flujo a desarrollar: jugar una partida activa", "Arquitectura", "Casos borde y manejo de fallas", "Pruebas y métricas"), Trivia_DS_completo.md (secciones "Principios", "Voz y contenido", "Aura y pulsos", componentes del flujo y "4. Plantillas"), Referencias-y-definiciones/Pantalla-UI/ (Dashboard, Match Detail, Topic Reel, Pregunta, Fin de partida), Referencias-y-definiciones/cierre_light.png, Referencias-y-definiciones/Animaciones/ (animacion_sorteo_tema.html, animacion_cierre_aura.html, animacion_fin_partida.html).

Notas generales que aplican a todas las historias:

- Los textos de pantalla van en voseo rioplatense, copiados de las referencias y corregidos según "Voz y contenido" del DS ("¿Confiás en tu conocimiento?", "Arriesgá pulsos para ganar más, todo depende de qué tanto confiás en tu conocimiento", "¿Cómo querés arriesgar?", "Jugar la sesión", "Vas 2º"). En pantalla nunca "apostar", "apuesta" ni "monedas".
- Todos los números de la economía (Pulsos iniciales, costo de entrada, multiplicadores, factor de "ganar la sesión", premio, tiempo por pregunta, cantidad de preguntas, duración) salen de la configuración del servidor. Las cifras de las referencias son ejemplos.
- La app no calcula nada que afecte Pulsos: muestra lo que devuelve el servidor. Las vistas previas ("Si acertás", total a cobrar, chip de pulsos disponibles, máximo de "Otro", el doble por pregunta) las calcula la app con el mismo módulo de reglas puras que usa el servidor y con los valores que este entrega; no mueven pulsos y el servidor siempre recalcula y rechaza montos inválidos.
- Carga y error siguen el patrón "Carga y error" del DS: esqueletos `surface-2` sin spinner; botones que esperan al servidor deshabilitados (`surface-2`, sin labio) con el mismo rótulo; error en un bloque `surface-2` con "No pudimos conectarnos. Revisá tu conexión y probá de nuevo." en `text-muted` y `neutral` "Reintentar", sin rojo. "Responder" y "Jugar la sesión" reintentan solos 2 veces antes de mostrar el bloque.
- El cero es neutro: "0 pulsos" en `text-muted`, nunca "+0" ni rojo. Con 1, en singular ("1 pulso", "+1 pulso ganado", "-1 pulso perdido").
- Sin estética de casino. El único festejo es el cierre de aura (`AuraClose`). Toda animación respeta el movimiento reducido.
- Ganancias y pérdidas siempre con signo y color; sin rojo en el cero; textos sin culpa.

---

## H1: Ver mi aura en el encabezado del inicio

- **Descripción**: Como jugador, quiero ver mi aura actual y cuántos pulsos llevo hacia la siguiente en el encabezado del inicio, para saber cómo está mi contador general antes de jugar.
- **Referencias visuales**: `Referencias-y-definiciones/Pantalla-UI/Dashboard/Todas.png` (encabezado). Emblema en el encabezado: sin referencia.
- **Reglas de producto involucradas**:
  - Glosario: Aura = `floor(Pulsos / 25)`; el contador general son los Pulsos libres, mostrados como Aura arriba a la derecha del dashboard.
  - Aura, emblemas y cards: el aro se llena cada 25 Pulsos; si perdés Pulsos, el Aura baja. Emblemas en 5, 10, 20, 50 y 100 Aura, siguen al Aura actual.
  - Economía de Pulsos: la bolsa de una partida no suma al contador general mientras la partida está activa.
- **Criterios de aceptación funcionales**:
  - El encabezado muestra el avatar del jugador, "Hola de nuevo" y su apodo.
  - A la derecha, el contador muestra el aura actual dentro de un aro y los pulsos del aura en curso con el formato "16/25".
  - El aro tiene 25 tramos; los tramos llenos equivalen a `pulsos libres mod 25`.
  - El contador cuenta solo los pulsos libres; los pulsos comprometidos en bolsas no suman.
  - Si el jugador tiene emblema, se muestra junto al contador (pendiente de referencia y de diseño visual).
- **Autoridad del servidor**:
  - El servidor entrega el saldo de pulsos libres (según el libro de Pulsos) y el emblema actual; los cortes de emblemas son configuración.
  - La app solo deriva lo que dibuja (aura y tramos) a partir del saldo recibido.
- **Criterios de experiencia**:
  - Cargando: esqueleto `surface-2` con la forma del contador, sin cifras inventadas (patrón "Carga y error" del DS).
  - Error: el contador no muestra valores viejos como si fueran actuales; bloque de error del patrón "Carga y error" con `neutral` "Reintentar".
  - Sin pulsos libres: aro vacío y número 0, sin rojo.
  - Cuando el saldo baja, los tramos se vacían sin animación ni rojo; el número y el emblema bajan si corresponde.
  - Cifras tabulares. Texto accesible completo: "Tu aura: 1, 16 de 25 pulsos para la siguiente".
- **Casos borde**:
  - Jugador con 0 pulsos libres y una partida activa: no es quiebra; el contador muestra 0 sin mensajes de alarma.
  - Saldo exacto múltiplo de 25: aura sube y el aro muestra 0/25.
- **Dependencias**: ninguna
- **Prioridad**: media — da contexto pero no bloquea jugar la partida.

---

## H2: Ver la card de la partida que me toca jugar

- **Descripción**: Como jugador, quiero ver en el inicio la card de la partida en la que me toca jugar con mi bolsa, mi resultado y mi posición, para decidir entrar a jugar la sesión del día.
- **Referencias visuales**: `Referencias-y-definiciones/Pantalla-UI/Dashboard/Todas.png` (los estados de la card siguen el MVP y el DS).
- **Reglas de producto involucradas**:
  - Aura, emblemas y cards: "Card de partida (te toca jugar)" con chip de vencimiento, "Día 3 de 5", título, cantidad de jugadores, avatares, bloque gris sin aro (bolsa grande, neto debajo, posición a la derecha) y botón.
  - Reglas de la partida: la sesión está disponible 24 horas desde la apertura.
  - Ganador y premios: el ranking es por Pulsos netos ganados en la partida.
- **Criterios de aceptación funcionales**:
  - La card muestra: chip "Vence en HH:MM:SS" con la cuenta regresiva hasta el cierre de la ventana, "Día N de 5", título de la partida, "N jugadores", avatares apilados, la bolsa en número grande, el neto debajo y la posición.
  - Estados del bloque y botón:
    - Ganando: bolsa (ej. 62), "+12 pulsos ganados" en verde, "Vas 2º", botón "Jugar".
    - Perdiendo: bolsa (ej. 42), "-8 pulsos perdidos" en rojo, "Vas 2º", botón "Jugar".
    - Recién empieza: bolsa igual al costo de entrada, "sin cambios" en gris, "Todos 0", botón "Jugar".
    - Fuera de la partida: 0, "sin pulsos" en gris, "Quedaste 4º", chip gris "Fuera de la partida", botón "Ver ranking".
  - "Jugar" lleva al detalle de la partida (H4). "Ver ranking" lleva al detalle de la partida sin botón de jugar.
  - La card de la partida que me toca aparece arriba de las demás.
- **Autoridad del servidor**:
  - El servidor entrega la bolsa, el neto, la posición, el día actual, la hora de cierre de la ventana y si el jugador fue expulsado.
  - La cuenta regresiva se calcula contra la hora de cierre que da el servidor; la app no decide si la sesión sigue abierta.
- **Criterios de experiencia**:
  - Una sola acción principal por card: el botón `brand` aparece solo si te toca jugar. Si te tocan varias partidas, cada card lleva su propio `brand` "Jugar" (excepción explícita del DS a "un color fuerte por pantalla").
  - Vacío: si no hay partidas, el inicio no muestra cards vacías (el estado vacío no tiene referencia; ver "Preguntas para PO").
  - Cargando y error según el patrón "Carga y error" del DS, sin mostrar cifras viejas como actuales.
  - Fuera de la partida en tono neutro: ni el 0 ni la bolsa vacía llevan rojo.
  - Etiqueta accesible del bloque con resultado, bolsa y posición.
  - Cifras tabulares en bolsa, neto y cuenta regresiva.
- **Casos borde**:
  - La ventana vence mientras el jugador mira el inicio: la card se actualiza sola cuando el servidor informa el cierre; chip "Cerrada" (`forest`), sin `brand` "Jugar" y con `neutral` "Ver ranking".
  - Jugador expulsado: card "Fuera de la partida" con "Ver ranking".
  - Empate en la posición: los empatados comparten el puesto (1º, 2º, 2º, 4º); los dos empatados en el 2º ven "Vas 2º".
- **Dependencias**: ninguna
- **Prioridad**: alta — es la entrada al flujo.

---

## H3: Ver las partidas que ya jugué hoy y filtrar por pestañas

- **Descripción**: Como jugador, quiero ver aparte las partidas que ya jugué hoy y filtrar el inicio por pestañas, para saber qué me falta jugar y cuándo abre la próxima sesión.
- **Referencias visuales**: `Referencias-y-definiciones/Pantalla-UI/Dashboard/Todas.png`. Pestañas "Te toca" y "Jugadas" seleccionadas: sin referencia.
- **Reglas de producto involucradas**:
  - Flujo y pantallas: inicio con tres pestañas, *Te toca*, *Jugadas* y *Todas*.
  - Aura, emblemas y cards: "Card de partida (ya jugada hoy)" compacta, sin bloque gris ni botón; en "Todas" se agrupan bajo "Partidas completadas hoy".
- **Criterios de aceptación funcionales**:
  - Control segmentado con "Te toca", "Jugadas" y "Todas".
  - En "Todas": arriba las partidas que me tocan (H2); debajo, la etiqueta "Partidas completadas hoy" y las cards compactas.
  - Card compacta: chip "Jugada hoy", "Día N de 5", título, avatares y una línea de resumen ("Vas 2º · 11 aciertos · Abre mañana 00:00"). Los aciertos son los acumulados en la partida, no los del día.
  - La hora de apertura se muestra convertida a la hora local del jugador.
- **Autoridad del servidor**:
  - El servidor decide qué partidas están jugadas hoy, la posición, los aciertos acumulados y la próxima apertura.
- **Criterios de experiencia**:
  - La pestaña activa se distingue en `surface` sobre la pista.
  - Vacío por pestaña: sin referencia (ver "Preguntas para PO").
  - Cifras tabulares en la línea de resumen.
- **Casos borde**:
  - Cambio de día con la app abierta: una partida jugada pasa a "te toca" cuando abre la nueva sesión.
  - La referencia muestra "6 de 7 aciertos" en una card y "11 aciertos" en otra; vale el acumulado de la partida ("11 aciertos").
- **Dependencias**: depende de H2
- **Prioridad**: media — ordena el inicio pero no es necesario para jugar.

---

## H4: Ver el detalle de la partida y el ranking

- **Descripción**: Como jugador, quiero ver mi puesto, lo que llevo ganado y el ranking de la partida antes de jugar, para saber cómo estoy frente a los demás.
- **Referencias visuales**: `Referencias-y-definiciones/Pantalla-UI/Match Detail/Ranking.png`
- **Reglas de producto involucradas**:
  - Primer flujo, paso 2: encabezado oscuro con volver, chip "Día 3 de 5", título y "6 jugadores · Cierra en 6 h"; card "Tu puesto 3º" con "+24 pulsos ganados"; pestañas *Ranking* e *Historial*; "Posiciones actuales"; botón "Jugar la sesión".
  - Ganador y premios: el ranking es por Pulsos netos; los aciertos son un dato, no definen el puesto.
  - Flujo y pantallas, paso 7: el ranking se actualiza cuando cada jugador termina su sesión.
- **Criterios de aceptación funcionales**:
  - Cada fila muestra puesto, avatar, nombre, aciertos de la partida y pulsos en la bolsa con la palabra "Pulsos" debajo.
  - El 1º se destaca; mi fila dice "Vos" y se marca; quien no jugó se atenúa y muestra el motivo en lugar de los aciertos ("No jugó 2 días").
  - El botón "Jugar la sesión" aparece solo si me toca jugar y la ventana está abierta; lleva a descubrir el tema (H6).
  - Volver regresa al inicio. Es el botón de ícono cuadrado `neutral` del DS, el mismo que el cerrar de la pregunta.
  - La tarjeta "Tu puesto" muestra el neto como la card del inicio: "+24 pulsos ganados" (`brand-text`), "-8 pulsos perdidos" (`danger-text`) o "sin cambios" (`text-muted`); con 1, en singular.
- **Autoridad del servidor**:
  - El servidor calcula el ranking, la posición, los netos, los aciertos y quién no jugó (motor de reglas puro).
  - El servidor informa la hora de cierre de la ventana.
- **Criterios de experiencia**:
  - Cargando y error según el patrón "Carga y error" del DS (esqueletos con la forma de las filas).
  - Netos con signo y color ("+24 pulsos ganados", "-8 pulsos perdidos"); el cero dice "sin cambios" en `text-muted`.
  - Jugador expulsado: el botón de jugar no aparece y la pantalla sigue mostrando el ranking.
  - Ningún dato depende solo del color.
- **Casos borde**:
  - Empate en pulsos: los empatados comparten el puesto y el siguiente salta (1º, 2º, 2º, 4º).
  - La ventana cierra mientras el jugador mira el detalle: la pantalla se actualiza sola; chip "Cerrada" (`forest`), desaparece "Jugar la sesión" y queda `neutral` "Ver ranking".
  - Jugador expulsado en el ranking: no hay referencia de cómo se ve su fila (ver "Preguntas para PO").
- **Dependencias**: depende de H2
- **Prioridad**: alta — es el paso obligado antes de jugar la sesión.

---

## H5: Consultar el historial de la partida

- **Descripción**: Como jugador, quiero ver la pestaña Historial del detalle de la partida, para revisar lo que pasó en los días anteriores.
- **Referencias visuales**: sin referencia (contenido de la pestaña *Historial*).
- **Reglas de producto involucradas**:
  - Flujo y pantallas, paso 2: pestañas *Ranking* e *Historial*.
  - Primer flujo: "Faltan en las referencias: el contenido de la pestaña Historial".
- **Criterios de aceptación funcionales**:
  - La pestaña *Historial* existe en el control segmentado del detalle de la partida.
  - Su contenido queda pendiente de definición del PO.
- **Autoridad del servidor**:
  - Cualquier dato del historial sale del servidor y del libro de Pulsos.
- **Criterios de experiencia**:
  - Pendiente de referencia.
- **Casos borde**:
  - Día 1 sin historial previo: estado vacío pendiente de definición.
- **Dependencias**: depende de H4
- **Prioridad**: baja — no bloquea jugar y no tiene contenido definido.

---

## H6: Descubrir el tema del día

- **Descripción**: Como jugador, quiero tocar "Descubrir tema" y ver cómo el carrete frena en el tema de hoy, para saber sobre qué voy a responder antes de decidir cuánta confianza pongo.
- **Referencias visuales**: `Referencias-y-definiciones/Pantalla-UI/Topic Reel/Default-1.png`, `Referencias-y-definiciones/Pantalla-UI/Topic Reel/Default.png`, `Referencias-y-definiciones/Animaciones/animacion_sorteo_tema.html`
- **Reglas de producto involucradas**:
  - Reglas de la partida: tema 100% al azar, definido por el servidor y el mismo para todos los jugadores de la partida; la rueda solo lo revela.
  - Primer flujo, paso 3: "Descubrí el tema de hoy" y "Un solo tema al azar para todos los jugadores de la partida."; la ventana muestra "Tema de hoy" hasta que el jugador toca "Descubrir tema"; entonces gira y frena en el tema.
- **Criterios de aceptación funcionales**:
  - Antes de girar: título "Descubrí el tema de hoy", bajada "Un solo tema al azar para todos los jugadores de la partida.", ventana con "Tema de hoy" y botón "Descubrir tema".
  - Al tocar el botón, el carrete pasa temas y frena en el tema que definió el servidor.
  - Con el tema revelado, debajo aparece la sección de confianza en el tema (H8, H9, H10) y el botón pasa a "Jugar la sesión".
  - El tema revelado coincide siempre con el del servidor para todos los jugadores de la partida.
  - Si el jugador vuelve a esta pantalla con el tema ya revelado, ve el tema sin volver a girar (una revelación por sesión).
- **Autoridad del servidor**:
  - El servidor define el tema del día al armar la sesión, solo entre temas con al menos 7 preguntas no vistas por ningún jugador de la partida; la app solo recibe el tema final y lo revela.
  - Cuando un tema baja del umbral configurado, el servidor alerta al administrador.
  - La lista de temas que pasan por el carrete es decorativa.
- **Criterios de experiencia**:
  - Animación según `animacion_sorteo_tema.html`: desenfoque al inicio y desaceleración larga, frenando en unos 2,4 a 2,5 s; los triángulos verdes marcan dónde frena; solo se ve la fila del tema y los vecinos asoman difuminados.
  - Al frenar no hay vibración (la vibración es solo de `AuraClose`); la sección de confianza aparece después de que frena.
  - Mientras gira, el botón queda deshabilitado.
  - Movimiento reducido: el tema aparece sin giro y la sección de confianza aparece sin transición.
  - Sin luces, destellos, fichas ni sonidos: es una revelación, no un juego de azar.
  - Error al obtener el tema: el carrete no gira con un tema inventado; bloque de error del patrón "Carga y error" con `neutral` "Reintentar".
- **Casos borde**:
  - Conexión cortada al tocar "Descubrir tema": no se revela nada hasta tener el tema del servidor.
  - Ventana que vence en esta pantalla: al tocar "Jugar la sesión" el servidor lo rechaza y aparece el bloque "Esta sesión ya cerró. No se movieron pulsos." con `neutral` "Volver a la partida" (ver H10).
  - Banco de preguntas sin preguntas no vistas para un tema: el servidor sortea solo entre temas con al menos 7 preguntas no vistas por ningún jugador de la partida; la app no tiene un estado especial porque el jugador no lo nota.
- **Dependencias**: depende de H4
- **Prioridad**: alta — paso obligado del flujo.

---

## H8: Poner confianza en "Ganar la sesión"

- **Descripción**: Como jugador, quiero elegir cuántos pulsos arriesgo a ganar la sesión del día viendo exactamente cuánto cobraría, para respaldar que voy a hacer el mejor puntaje del día.
- **Referencias visuales**: `Referencias-y-definiciones/Pantalla-UI/Topic Reel/Default.png`, `Referencias-y-definiciones/Pantalla-UI/Topic Reel/General expanded.png`, `Referencias-y-definiciones/Pantalla-UI/Topic Reel/Al menos X expanded.png` (tarjeta "Ganar la sesión" cerrada con el multiplicador en la descripción; en esta imagen el selector de X muestra del 1 al 7, pero solo valen 4, 5, 6 y 7).
- **Reglas de producto involucradas**:
  - Economía de Pulsos, "Ganar la sesión": pago total = monto × (0,9 × jugadores en pie), redondeado hacia abajo; "jugadores en pie" se cuentan a la hora de apertura del día, así que el multiplicador queda fijo en ese momento y es el mismo para todos los jugadores de ese día.
  - Gana quien más aciertos tiene entre todos los que jugaron la sesión, hayan arriesgado o no; empate en aciertos: gana quien tardó menos tiempo total.
  - Primer flujo, paso 4: tarjeta desplegable con chip "Sin pulsos" por defecto; al desplegar, montos 0, 1, 5, 10 y "Otro" (monto libre); celda con ganancia y total exactos ("Si acertás +22 pulsos · Cobrás 27 total" con 6 jugadores y 5 pulsos); botón "Guardar" que cierra la tarjeta con el monto en el chip. Arriesgar es opcional.
- **Criterios de aceptación funcionales**:
  - Encima de las tarjetas: "¿Confiás en tu conocimiento?" con botón de ayuda "?" (`ghost`, accesibilidad "Cómo funciona la confianza"), la bajada "Arriesgá pulsos para ganar más, todo depende de qué tanto confiás en tu conocimiento", el chip "N pulsos disponibles" (la bolsa menos lo que se reserva en las dos tarjetas) y "¿Cómo querés arriesgar?".
  - Tarjeta cerrada: título "Ganar la sesión" (no "Ganar sesión" como en `Default.png` y `General expanded.png`), descripción "Acertá más que el resto hoy. Paga ×5,4 con 6 jugadores." (multiplicador y cantidad de jugadores dinámicos), chip con el monto y chevron.
  - Tarjeta abierta: píldoras 0, 1, 5, 10 y "Otro"; celda "Si acertás" con "+N pulsos" y "Cobrás N total" (oculta con monto 0: el chip ya dice "Sin pulsos"); botón "Guardar".
  - Las píldoras cuyo monto supera los pulsos disponibles quedan deshabilitadas (`surface-2`, sin labio, accesibilidad "No disponible"); "Otro" sigue disponible hasta el máximo.
  - El botón de ayuda abre el `Overlay` "¿Cómo funciona la confianza?" con tres líneas: "Ganar la sesión: si hoy acertás más que el resto, cobrás tu monto por el multiplicador.", "Acertar al menos X de las 7: elegí cuántas creés que vas a acertar; cuanto más alto, más paga." y "Los pulsos que pongas se reservan al tocar Jugar la sesión. Poner 0 también vale."; un solo botón `neutral` "Entendido".
  - "Otro" permite un monto hasta los pulsos disponibles; la suma de las dos tarjetas nunca supera la bolsa.
  - Al tocar "Otro" se abre un `Overlay` sobre la pantalla oscurecida: título "¿Cuántos pulsos arriesgás?", campo numérico con foco automático y teclado numérico, ayuda "Podés arriesgar hasta N pulsos" en `text-muted` (N = pulsos disponibles), botones "Guardar" (`brand`) y "Cancelar" (`ghost`). Tocar fuera del aviso equivale a "Cancelar". Al guardar, la píldora "Otro" muestra el número ingresado como elegida y la celda "Si acertás" se recalcula; vacío o 0 vuelve a "Otro" con el 0 elegido.
  - Guardar cierra la tarjeta y deja el monto en el chip ("5 pulsos" en verde suave o "Sin pulsos").
  - Al guardar una tarjeta con monto, el chip de pulsos disponibles baja en el momento (de 62 a 57 al guardar 5 en "Ganar la sesión"); cambiar el monto o pasarlo a 0 lo recalcula. La reserva real ocurre al tocar "Jugar la sesión" (H10); el chip solo la anticipa.
  - Solo una tarjeta abierta a la vez. Poner 0 o no tocarla es válido.
  - Nunca se muestra un pozo ni montos de otros jugadores.
- **Autoridad del servidor**:
  - El servidor entrega la cantidad de jugadores en pie contada a la hora de apertura del día, el factor configurado, la bolsa disponible y las reservas; la app calcula la celda y el chip como vista previa con el mismo módulo de reglas puras que usa el servidor, y el servidor recalcula al confirmar.
  - El servidor paga con el mismo multiplicador que el jugador vio antes de confirmar.
  - El monto se envía al servidor al confirmar con "Jugar la sesión" (H10); el servidor valida que no supere la bolsa y lo reserva de la bolsa hasta resolverlo.
  - El servidor resuelve la apuesta cuando todos los jugadores en pie terminaron la sesión o al cerrar la ventana.
- **Criterios de experiencia**:
  - Cada cambio de monto actualiza la celda y se anuncia con `aria-live`.
  - Ganancias en verde con signo.
  - "Guardar" es `neutral` en la tarjeta (decisión confirmada) aunque la referencia lo dibuja con borde oscuro; en el `Overlay` de "Otro" es `brand`.
  - El monto 0 se muestra igual de prominente que los demás.
  - Movimiento reducido: la tarjeta se despliega sin transición.
- **Casos borde**:
  - Monto libre mayor que los pulsos disponibles: se ajusta solo al máximo, sin rojo ni reproche.
  - Si al resolver jugaron menos de 2 la sesión, se devuelve lo arriesgado (se informa en el resumen, H17).
  - Partida con 2 jugadores en pie: multiplicador ×1,8 según la tabla (valor configurable).
  - Un jugador queda expulsado después de la apertura del día: el multiplicador de hoy no cambia para nadie; deja de contar desde el día siguiente.
  - La cifra de la referencia ("+7 pulsos, Cobrás 12 total" con 5 pulsos) no coincide con ningún multiplicador posible; el MVP aclara que es de ejemplo.
- **Dependencias**: depende de H6
- **Prioridad**: alta — es uno de los dos momentos de confianza del producto.

---

## H9: Poner confianza en "Al menos X de las 7"

- **Descripción**: Como jugador, quiero elegir un umbral de aciertos y cuántos pulsos arriesgo a alcanzarlo, para respaldar cuánto sé del tema de hoy.
- **Referencias visuales**: `Referencias-y-definiciones/Pantalla-UI/Topic Reel/Default.png` (tarjeta cerrada), `Referencias-y-definiciones/Pantalla-UI/Topic Reel/Al menos X expanded.png` (tarjeta abierta con la elección de X; manda sobre el detalle visual y los textos, salvo que el selector de X muestra solo 4, 5, 6 y 7: la imagen muestra del 1 al 7 y del 1 al 3 no son válidos).
- **Reglas de producto involucradas**:
  - Economía de Pulsos, "al menos X de las 7": multiplicadores fijos 4 o más ×1,3; 5 o más ×2; 6 o más ×4; las 7 ×8 (pago total, incluye lo arriesgado; valores provisorios). X solo puede ser 4, 5, 6 o 7. El pago se redondea hacia abajo, con el mismo criterio que "ganar la sesión" (5 × 1,3 = 6,5 → 6).
  - Economía de Pulsos: lo arriesgado se reserva de la bolsa al tocar "Jugar la sesión".
  - Primer flujo, paso 4: "Acertar al menos X de las 7: acertar al menos X de las 7 preguntas del tema de hoy".
- **Criterios de aceptación funcionales**:
  - Tarjeta cerrada con título "Acertar al menos X de las 7" (no "Ganar x de las 7 sesiones" como en `Default.png`), descripción "Elegí cuántas preguntas creés que vas a acertar del tema de hoy.", chip del monto ("Sin pulsos" por defecto) y chevron.
  - Abierta, en este orden: etiqueta "ELEGÍ CUÁNTAS PREGUNTAS VAS A ACERTAR" (estilo `label`) con píldoras 4, 5, 6 y 7 (la elegida en `brand-soft` con trazo y labio `brand-deep`; por defecto, 4); etiqueta "ELEGÍ CUÁNTOS PULSOS ARRIESGÁS" con píldoras 0, 1, 5, 10 y "Otro"; celda "Si acertás" con el formato "SI ACERTÁS 6 · (×4)", "+15 pulsos" y "Cobrás 20 total"; y botón "Guardar" (`neutral`).
  - X solo puede ser 4, 5, 6 o 7 (los umbrales con multiplicador definido en la configuración); el 6 elegido en la referencia es de ejemplo.
  - "Otro" permite un monto hasta los pulsos disponibles; la suma de las dos tarjetas nunca supera la bolsa. El ingreso es el mismo `Overlay` de H8, y el chip de pulsos disponibles baja al guardar igual que en H8.
  - Las píldoras de monto que superan lo disponible quedan deshabilitadas, igual que en H8; con monto 0 la celda "Si acertás" se oculta.
  - Solo una tarjeta abierta a la vez; poner 0 es válido.
- **Autoridad del servidor**:
  - Los multiplicadores y el redondeo son configuración del servidor. La celda es una vista previa calculada con el módulo de reglas compartido (igual que H8).
  - El servidor reserva el monto de la bolsa al confirmar y resuelve la apuesta cuando el jugador termina sus 7 preguntas, según sus aciertos, o al cerrar la ventana si no retomó una sesión interrumpida.
- **Criterios de experiencia**:
  - Igual que H8: anuncio con `aria-live`, ganancias con signo y color, sin estética de casino.
- **Casos borde**:
  - Pago con decimales (ej. 5 × 1,3 = 6,5): se redondea hacia abajo (6).
  - Si la sesión queda interrumpida, el jugador puede retomarla dentro de la ventana; si no la retoma, al cerrar la ventana las preguntas faltantes cuentan como error y "al menos X" se resuelve en ese momento (H16).
  - Pulsos disponibles en 0 con pulsos reservados en el tema: el jugador sigue la sesión con monto 0 y sus aciertos cuentan para el umbral.
  - Ventana vencida sin jugar: no se cobra ni paga.
- **Dependencias**: depende de H6
- **Prioridad**: alta — es parte del primer momento de confianza.

---

## H10: Confirmar la confianza en el tema y empezar la sesión

- **Descripción**: Como jugador, quiero ver cuántos pulsos me quedan disponibles después de la confianza en el tema y confirmar con "Jugar la sesión", para empezar las preguntas sabiendo lo que tengo en juego.
- **Referencias visuales**: `Referencias-y-definiciones/Pantalla-UI/Topic Reel/Default.png` (botón "Jugar la sesión"), `Referencias-y-definiciones/Pantalla-UI/Topic Reel/Al menos X expanded.png` (botón "Jugar la sesión" debajo de las tarjetas; el selector de X muestra solo 4, 5, 6 y 7, no del 1 al 7).
- **Reglas de producto involucradas**:
  - Flujo y pantallas, paso 4: el chip de pulsos disponibles baja al guardar cada monto, sin una línea aparte con el total; al empezar la sesión no se puede cambiar.
  - Primer flujo, paso 4: "Jugar la sesión" confirma las apuestas de tema y arranca las preguntas.
  - Flujo y pantallas, paso 5: el tiempo empieza a correr al empezar las preguntas.
- **Criterios de aceptación funcionales**:
  - No hay resumen aparte del total arriesgado: el chip de pulsos disponibles ya descuenta lo guardado en las dos tarjetas (H8). La reserva real ocurre al tocar "Jugar la sesión".
  - "Jugar la sesión" envía los montos de tema al servidor y, con su confirmación, lleva a la primera pregunta (H11).
  - Después de confirmar, los montos de tema no se pueden cambiar y quedan reservados de la bolsa; los pulsos disponibles en las preguntas son la bolsa menos esa reserva.
  - Si no se arriesgó nada, "Jugar la sesión" igual arranca la sesión.
- **Autoridad del servidor**:
  - El servidor valida los montos contra la bolsa, los reserva, los registra en el libro de Pulsos y abre la sesión.
  - El cronómetro de la primera pregunta lo inicia el servidor.
- **Criterios de experiencia**:
  - Mientras se envía, el botón queda deshabilitado para evitar doble envío.
  - Error al confirmar: la app reintenta sola 2 veces; si sigue fallando, la sesión no empieza, se conservan los montos elegidos y aparece el bloque de error del patrón "Carga y error" justo encima del botón, con `neutral` "Reintentar".
- **Casos borde**:
  - Total arriesgado mayor que la bolsa: el servidor lo rechaza.
  - La ventana vence entre que se reveló el tema y se tocó "Jugar la sesión": el servidor lo rechaza y aparece el bloque "Esta sesión ya cerró. No se movieron pulsos." con `neutral` "Volver a la partida" (no se reservó nada).
  - Doble toque o reintento: el servidor no registra dos veces los mismos montos.
- **Dependencias**: depende de H8, H9
- **Prioridad**: alta — es la puerta a las preguntas.

---

## H11: Responder una pregunta poniendo confianza

- **Descripción**: Como jugador, quiero elegir una respuesta y cuántos pulsos arriesgo antes de que se acabe el tiempo, para ganar pulsos según lo que sé.
- **Referencias visuales**: `Referencias-y-definiciones/Pantalla-UI/Pregunta/Elegida.png`
- **Reglas de producto involucradas**:
  - Reglas de la partida: 20 segundos visibles; el servidor acepta hasta 22; pasarse cuenta como error. 4 opciones en orden aleatorio. Ningún jugador ve una pregunta que ya respondió.
  - Economía de Pulsos, momento 2: monto 0, 1, 5, 10 o libre hasta toda la bolsa disponible (bolsa menos lo reservado en la confianza del tema); el monto arranca en 0 en cada pregunta; acertar paga el doble de lo puesto; errar con el monto enviado con "Responder" lo pierde; si vence el tiempo sin tocar "Responder", cuenta como error con 0 pulsos.
  - Aura, emblemas y cards, "Confianza por pregunta": celdas "Si acertás +5 pulsos" y "Si errás -5 pulsos" (la referencia dice "Si errás o vence"; no se copia).
  - Primer flujo, paso 5.
- **Criterios de aceptación funcionales**:
  - Encabezado: chip "Pregunta N de 7", botón cerrar, 7 segmentos de progreso (respondidas, actual y pendientes) y barra de tiempo con la cifra.
  - Etiqueta del tema, enunciado y 4 opciones con letras A a D; la elegida se marca y dice "Elegida".
  - "Elegí cuántos pulsos arriesgás" con píldoras 0, 1, 5, 10 y "Otro" (no "Libre" como en la referencia; hasta los pulsos disponibles: la bolsa menos lo reservado en la confianza del tema). Cada pregunta arranca con 0 seleccionado.
  - "Otro" abre el mismo `Overlay` de ingreso de monto que en H8 ("¿Cuántos pulsos arriesgás?", "Podés arriesgar hasta N pulsos", "Guardar" y "Cancelar"); al guardar, la píldora muestra el número como elegida y las celdas se recalculan; vacío o 0 vuelve a "Otro" con el 0 elegido.
  - Celdas siempre visibles: "Si acertás +N pulsos" y "Si errás -N pulsos", que cambian con el monto. Con monto 0, las dos dicen "0 pulsos" en `text-muted`, sin signo ni color.
  - "Responder" queda deshabilitado hasta elegir una opción; al tocarlo, envía la opción y el monto al servidor.
  - El botón cerrar abre el `Overlay` "¿Salir de la sesión?" antes de salir (H16).
  - Siempre se ve cuánto tengo en juego.
- **Autoridad del servidor**:
  - El servidor envía la pregunta y las opciones ya mezcladas, sin la respuesta correcta.
  - El cronómetro corre en el servidor desde que entrega la pregunta; la barra de la app solo lo refleja.
  - El servidor valida el tiempo (hasta 22 s), que el monto no supere la bolsa disponible (bolsa menos lo reservado) y resuelve el resultado; la bolsa nunca queda en negativo.
  - Las celdas son una vista previa calculada con el módulo de reglas compartido; no mueven pulsos.
- **Criterios de experiencia**:
  - Con 5 segundos o menos, la barra pasa a coral y la cifra a rojo; el tiempo se anuncia a lectores de pantalla en 10, 5 y 0.
  - En 0, "Responder" se deshabilita y la pantalla espera el veredicto del servidor; del segundo 20 al 22 el jugador no ve nada distinto.
  - Las opciones y píldoras se hunden 4 px al presionar; con movimiento reducido, sin transición.
  - Cada cambio de monto se anuncia con `aria-live`.
  - Mientras se envía la respuesta, el botón queda deshabilitado (`surface-2`, sin labio) con el mismo rótulo; si falla, la app reintenta sola 2 veces antes de mostrar el bloque de error del patrón "Carga y error".
  - Cifras tabulares en tiempo y montos.
- **Casos borde**:
  - Monto libre mayor que los pulsos disponibles: se ajusta solo al máximo, sin rojo ni reproche.
  - Pulsos disponibles menores que 1, 5 o 10: esas píldoras quedan deshabilitadas (`surface-2`, sin labio, accesibilidad "No disponible"); "Otro" sigue disponible hasta el máximo.
  - Respuesta enviada antes de los 20 s que llega al servidor entre 20 y 22 s: se acepta; después de 22 s, cuenta como error con 0 pulsos aunque se haya enviado con "Responder" (H14). La app nunca deja responder después de 0.
  - La ventana cierra en medio de las preguntas: las que faltan cuentan como error sin pulsos y aparece el bloque "La sesión cerró. Las preguntas que faltaban cuentan como error, sin pulsos." con `neutral` "Volver a la partida".
  - Pulsos disponibles en 0 con pulsos reservados en el tema: la única opción de monto es 0; el jugador sigue la sesión y sus aciertos cuentan para "al menos X" y "ganar la sesión". No es expulsión (H18).
  - Monto elegido sin opción elegida: "Responder" sigue deshabilitado; si vence el tiempo, cuenta como error con 0 pulsos porque el monto nunca llegó al servidor (H14).
- **Dependencias**: depende de H10
- **Prioridad**: alta — es el corazón del juego.

---

## H12: Ver el resultado de una respuesta correcta

- **Descripción**: Como jugador, quiero ver que acerté, cuántos pulsos gané y la explicación, para aprender y saber cómo quedó mi bolsa.
- **Referencias visuales**: `Referencias-y-definiciones/Pantalla-UI/Pregunta/Respondida.png`
- **Reglas de producto involucradas**:
  - Flujo y pantallas, paso 5: al confirmar aparece acierto o error, la explicación y el movimiento de Pulsos.
  - Primer flujo, paso 6: se congela el tiempo, las otras opciones se atenúan y la correcta dice "Correcta"; tarjeta con "Acertaste", "+5 pulsos" y la explicación; botón "Siguiente pregunta".
  - Economía de Pulsos: acertar paga el doble de lo puesto.
- **Criterios de aceptación funcionales**:
  - El tiempo queda congelado en la cifra del momento de responder.
  - La opción correcta (que era la elegida) muestra tilde y "Correcta"; las demás se atenúan sin labio.
  - Tarjeta de resultado: "Acertaste", el movimiento con signo ("+5 pulsos") y la explicación de la pregunta.
  - "Siguiente pregunta" lleva a la próxima pregunta; después de la 7ª lleva al resumen del día (H17).
  - Si el monto fue 0, el título sigue siendo "Acertaste" y el movimiento dice "0 pulsos" en `text-muted`, sin signo.
  - El temporizador congelado mantiene el tono que tenía: si se respondió con 5 s o menos, barra `coral` y cifra en `danger-text`.
- **Autoridad del servidor**:
  - El servidor devuelve si fue correcta, la opción correcta, la explicación y el movimiento registrado en el libro de Pulsos.
  - La respuesta correcta llega a la app solo después de responder.
- **Criterios de experiencia**:
  - Ganancia en verde con signo; el resultado lleva palabra e ícono, no solo color.
  - Sin festejos: ni confeti, ni sonidos; si la ganancia completa un aura no corre `AuraClose` acá (los pulsos de la bolsa no suman al contador general).
  - Movimiento reducido: la tarjeta aparece sin transición.
- **Casos borde**:
  - Conexión cortada después de responder: al volver, la app muestra el resultado que registró el servidor.
- **Dependencias**: depende de H11
- **Prioridad**: alta — cierra el ciclo de cada pregunta.

---

## H13: Ver el resultado de una respuesta incorrecta

- **Descripción**: Como jugador, quiero ver que erré, cuántos pulsos perdí, cuál era la correcta y la explicación, para aprender sin sentir culpa.
- **Referencias visuales**: sin imagen de referencia; definido en texto y armado con `AnswerCard` y `ResultCard` como `Referencias-y-definiciones/Pantalla-UI/Pregunta/Respondida.png`.
- **Reglas de producto involucradas**:
  - Economía de Pulsos: si errás, perdés lo arriesgado.
  - DS, AnswerCard: estado incorrecta en `coral-soft` con cruz y la palabra "Incorrecta"; ResultCard: estado de error "No era esa".
  - Primer flujo, paso 6: estado de respuesta incorrecta.
- **Criterios de aceptación funcionales**:
  - El tiempo queda congelado en el segundo en que el jugador respondió; la opción elegida pasa a "Incorrecta" (`coral-soft`, cruz y la palabra); la correcta dice "Correcta"; las otras dos se atenúan.
  - Tarjeta de resultado con el título "No era esa", el movimiento "-5 pulsos" en `danger-text` (si el monto era 0, "0 pulsos" en `text-muted`) y debajo la explicación.
  - Botón "Siguiente pregunta".
- **Autoridad del servidor**:
  - Igual que H12: el servidor resuelve, registra el movimiento y revela la correcta solo después de responder.
- **Criterios de experiencia**:
  - Pérdida en rojo con signo; texto sin culpa. Con 1, en singular ("-1 pulso").
  - El temporizador congelado mantiene el tono que tenía (urgente si quedaban 5 s o menos).
  - Si el monto fue 0, sin rojo en el cero.
- **Casos borde**:
  - Error que deja la bolsa total en 0 (sin pulsos reservados en el tema): dispara la expulsión (H18). Si deja en 0 solo los pulsos disponibles y hay reservas, el jugador sigue con monto 0 (H11).
- **Dependencias**: depende de H12
- **Prioridad**: alta — ocurre en casi todas las sesiones y no tiene imagen de referencia.

---

## H14: Ver el resultado cuando vence el tiempo

- **Descripción**: Como jugador, quiero saber que se me acabó el tiempo y cuál era la correcta, para entender qué pasó y seguir con la próxima pregunta.
- **Referencias visuales**: sin imagen de referencia; definido en texto y armado con `AnswerCard` y `ResultCard` como `Referencias-y-definiciones/Pantalla-UI/Pregunta/Respondida.png`.
- **Reglas de producto involucradas**:
  - Reglas de la partida: pasarse del tiempo cuenta como error; el servidor acepta hasta 22 s.
  - Economía de Pulsos: si se acaba el tiempo sin tocar "Responder", el monto elegido nunca llegó al servidor y la pregunta cuenta como error con 0 pulsos; solo se pierde un monto enviado con "Responder" que llega a tiempo. Una respuesta que llega después de los 22 s también cuenta como error con 0 pulsos: una mala conexión no cuesta pulsos.
  - Primer flujo, paso 6: estado de tiempo vencido.
- **Criterios de aceptación funcionales**:
  - Al llegar a 0 la barra, "Responder" se deshabilita, la app deja de aceptar respuestas y espera el veredicto del servidor, que llega como tiempo vencido. Del segundo 20 al 22 el jugador no ve nada distinto.
  - El temporizador queda en 0: barra vacía (solo la pista `surface-2`) y la cifra "0" en `danger-text`; la correcta dice "Correcta" y las otras tres se atenúan; ninguna se muestra como elegida, porque no se envió nada.
  - Tarjeta de resultado con el título "Se terminó el tiempo", el movimiento "0 pulsos" en `text-muted` (sin pérdida, aunque hubiera un monto elegido) y debajo "Cuenta como error, no perdiste pulsos." seguido de la explicación.
  - Botón "Siguiente pregunta".
- **Autoridad del servidor**:
  - El servidor decide el vencimiento; la cifra de la app es solo visual.
  - Si el jugador había elegido monto pero no tocó "Responder", el servidor no recibió ese monto: la pregunta cuenta como error con 0 pulsos y la bolsa no cambia.
  - Si la respuesta enviada con "Responder" llega después de los 22 s, el servidor la trata igual: error con 0 pulsos y la bolsa no cambia.
- **Criterios de experiencia**:
  - Texto sin culpa; sin rojo en el 0.
- **Casos borde**:
  - Respuesta enviada a los 19 s que llega a los 21 s: el servidor la acepta.
  - Respuesta enviada con "Responder" que llega después de los 22 s (mala conexión): error con 0 pulsos, sin perder el monto.
  - App en segundo plano o cerrada durante la pregunta con monto elegido sin enviar: el tiempo siguió corriendo en el servidor; si el jugador vuelve tarde, la pregunta cuenta como vencida, error con 0 pulsos (H16).
- **Dependencias**: depende de H11
- **Prioridad**: alta — regla central y sin imagen de referencia.

---

## H16: Salir o perder la conexión a mitad de la sesión

- **Descripción**: Como jugador, quiero saber qué pasa si cierro la sesión o se corta la conexión a mitad de las preguntas, para no perder lo que ya respondí.
- **Referencias visuales**: `Referencias-y-definiciones/Pantalla-UI/Pregunta/Elegida.png` (botón cerrar). El `Overlay` de confirmación no tiene imagen de referencia (detalle visual provisorio en el DS).
- **Reglas de producto involucradas**:
  - Casos borde: con conexión cortada o app cerrada, el jugador puede retomar la sesión dentro de la ventana de 24 horas. La pregunta que estaba en pantalla mantiene su cronómetro de servidor; si vuelve tarde, cuenta como vencida: error con 0 pulsos, porque un monto elegido sin tocar "Responder" nunca llegó al servidor. Las preguntas no mostradas esperan. Si no retoma la sesión, al cerrar la ventana las que falten cuentan como error sin apuesta y "al menos X" se resuelve. El botón cerrar abre un aviso de confirmación antes de salir.
  - Reglas de la partida: ventana de 24 horas.
- **Criterios de aceptación funcionales**:
  - El botón cerrar de la pregunta abre el `Overlay` con el título "¿Salir de la sesión?", el texto "Podés volver mientras la sesión siga abierta. El tiempo de esta pregunta sigue corriendo." y los botones "Salir" (`coral`) y "Seguir jugando" (`neutral`).
  - Lo respondido antes de salir queda registrado.
  - Al volver dentro de la ventana, el jugador retoma la sesión en el estado que informa el servidor, sin pantalla intermedia: va directo a la pregunta que estaba en pantalla si todavía tiene tiempo (con el tiempo restante), o a la siguiente pendiente; si la que dejó venció, primero la ve en el estado de tiempo vencido (H14) y después sigue con la próxima.
  - Las preguntas que todavía no se mostraron no vencen mientras el jugador está afuera.
  - Si la ventana cierra con preguntas sin mostrar, esas preguntas cuentan como error sin pulsos arriesgados y "al menos X" se resuelve con los aciertos registrados.
- **Autoridad del servidor**:
  - El servidor lleva el estado de la sesión y el cronómetro de cada pregunta; la app nunca reanuda un tiempo local.
  - Una pregunta empieza a correr solo cuando el servidor la entrega.
- **Criterios de experiencia**:
  - Sin conexión: bloque de error del patrón "Carga y error" ("No pudimos conectarnos. Revisá tu conexión y probá de nuevo." con `neutral` "Reintentar"); nunca se muestra un resultado que el servidor no confirmó.
  - La ventana cierra en medio de las preguntas: bloque "La sesión cerró. Las preguntas que faltaban cuentan como error, sin pulsos." con `neutral` "Volver a la partida".
- **Casos borde**:
  - Respuesta enviada justo antes de cortarse la conexión: al reconectar se muestra lo que registró el servidor.
  - Pregunta en pantalla con monto elegido sin enviar (app cerrada o conexión cortada) que vence mientras el jugador está afuera: error con 0 pulsos; no pierde ese monto (H14).
- **Dependencias**: depende de H11
- **Prioridad**: media — protege la economía ante fallas reales.

---

## H17: Ver el resumen del día al terminar la sesión

- **Descripción**: Como jugador, quiero ver un resumen al terminar la 7ª pregunta, para saber cuántas acerté, cómo me fue en la confianza del tema y cómo quedé.
- **Referencias visuales**: sin referencia (resumen del día después de la 7ª pregunta).
- **Reglas de producto involucradas**:
  - Flujo y pantallas, paso 6: aciertos (ej. 5 de 7), resultado de las apuestas de tema, Pulsos netos del día, posición y, si ya se resolvió, el resultado de "ganar la sesión".
  - Economía de Pulsos: las ganancias de cada sesión se suman a la bolsa apenas termina la sesión; "al menos X" se resuelve cuando el jugador termina sus 7 preguntas; "ganar la sesión" se resuelve cuando todos los jugadores en pie terminaron o al cerrar la ventana.
  - Flujo y pantallas, paso 6: después de la sesión del día 5, el resumen avisa que los resultados finales salen cuando todos terminen.
  - DS, Principios: cada sesión termina con "listo por hoy".
- **Criterios de aceptación funcionales**:
  - Muestra aciertos del día, resultado de "Al menos X de las 7", pulsos netos del día con signo, bolsa resultante y posición actual.
  - Si "ganar la sesión" ya se resolvió, muestra el resultado; si no, indica que está pendiente (texto sin referencia).
  - Ofrece una acción para volver al inicio o al detalle de la partida (pendiente de referencia).
  - Si era el día 5, el resumen no lleva al fin de partida: avisa que los resultados finales salen cuando todos terminen (texto sin referencia). El fin de partida (H19) llega cuando la partida se resuelve.
- **Autoridad del servidor**:
  - Todos los datos del resumen los calcula el servidor.
- **Criterios de experiencia**:
  - Netos con signo y color; sin rojo en el cero; sin festejos.
- **Casos borde**:
  - Menos de 2 jugadores jugaron la sesión: lo arriesgado en "ganar la sesión" se devuelve.
  - Empate en aciertos: gana quien tardó menos tiempo total.
- **Dependencias**: depende de H12, H13, H14
- **Prioridad**: alta — cierra la sesión diaria y no tiene referencia.

---

## H18: Quedar fuera de la partida cuando la bolsa llega a cero

- **Descripción**: Como jugador, quiero entender qué pasó y qué sigue cuando me quedo sin pulsos en una partida, para reflexionar sobre cuánto arriesgué y seguir jugando mis otras partidas.
- **Referencias visuales**: card "Fuera de la partida" según el MVP y el DS (`MatchCard`). Hoja de expulsión con reflexión: sin referencia.
- **Reglas de producto involucradas**:
  - Economía de Pulsos, Expulsión: con bolsa en cero quedás expulsado y tu resultado queda congelado; podés seguir jugando otras partidas. Si queda un solo jugador en pie, la partida termina y gana sin el premio.
  - Economía de Pulsos, Expulsión: se evalúa sobre la bolsa total una vez resueltas las reservas. Quedarte con 0 pulsos disponibles y pulsos reservados en el tema no te expulsa: seguís la sesión con monto 0. La bolsa total puede llegar a 0 después de tu sesión, cuando se resuelve "ganar la sesión".
  - Aura, emblemas y cards, "Cuando te expulsan": cuando la bolsa total llega a 0 aparece una hoja (durante la sesión, al terminar la pregunta que la vacía; después, la próxima vez que abrís esa partida o con una notificación push) con qué pasó ("Te quedaste sin Pulsos en esta partida"), qué sigue (seguís viendo el ranking, no jugás los días que faltan, tus otras partidas siguen) y un momento de reflexión con datos concretos ("Arriesgaste el 80% de tu bolsa en 3 preguntas").
  - Decisiones pendientes: textos de la reflexión tras la expulsión.
- **Criterios de aceptación funcionales**:
  - Después del resultado de la pregunta que deja la bolsa total en 0, aparece la hoja de expulsión; la sesión termina para ese jugador y no ve más preguntas.
  - Si la bolsa total llega a 0 después de la sesión, al resolverse "ganar la sesión", la hoja aparece la próxima vez que el jugador abre esa partida, o le llega una notificación push.
  - Con 0 pulsos disponibles y pulsos reservados en el tema, no aparece la hoja: el jugador sigue la sesión con monto 0.
  - La card del inicio pasa a "Fuera de la partida" con 0, "sin pulsos", la posición final y "Ver ranking".
  - En el detalle, el jugador sigue viendo el ranking y no tiene botón para jugar.
- **Autoridad del servidor**:
  - El servidor evalúa la bolsa total una vez resueltas las reservas; si está en 0, expulsa al jugador, congela su resultado y entrega los datos de la reflexión.
  - Si queda un solo jugador en pie, el servidor termina la partida.
- **Criterios de experiencia**:
  - Texto sin culpa ("te quedaste sin Pulsos", no "perdiste todo"); siempre hay una acción posible.
  - Sin rojo en el 0.
- **Casos borde**:
  - Expulsión en una partida de 2: el otro jugador gana sin el premio.
  - Bolsa total en 0 al resolverse "ganar la sesión" después de la sesión: hoja al abrir esa partida o por notificación push.
  - Quedar con 0 libres y sin partidas activas activa la quiebra total (fuera de este flujo).
- **Dependencias**: depende de H2, H13
- **Prioridad**: media — regla clave de la economía, pero sin referencia ni textos.

---

## H19: Ver el fin de partida con mi aura

- **Descripción**: Como jugador, quiero ver cómo quedé y cómo cambió mi aura cuando termina la partida, para cerrar la experiencia con la consecuencia clara de lo que arriesgué.
- **Referencias visuales**: `Referencias-y-definiciones/Pantalla-UI/Fin de partida/Gana.png`, `Referencias-y-definiciones/Animaciones/animacion_fin_partida.html`
- **Reglas de producto involucradas**:
  - Economía de Pulsos: al terminar la partida, la bolsa final vuelve completa al contador general.
  - Aura, emblemas y cards, "Fin de partida": aro del contador general con el Aura actual, marca del punto de partida, "22 de 25 pulsos para tu 2ª aura" y lo ganado o perdido ("Ganaste +6"), incluido el cambio de emblema si lo hubo.
  - Flujo y pantallas, paso 8: aparece cuando la partida se resuelve (el último jugador en pie termina el día 5, cierra la ventana del día 5 o queda uno solo), no cuando el jugador termina su propio día 5; se llega por notificación push o al abrir la app.
  - Primer flujo, paso 7.
- **Criterios de aceptación funcionales**:
  - La pantalla se muestra solo cuando el servidor informa que la partida se resolvió: al tocar la notificación push o la próxima vez que el jugador abre la app.
  - Chip "Partida terminada", título de la partida y "Quedaste Nº de N jugadores" (posición final; con empate, puesto compartido).
  - Aro grande con el aura actual, la palabra "Aura" debajo del número y la marca del punto de partida (pulsos libres antes de la partida).
  - "N de 25 pulsos para tu Nª aura".
  - Bloque "Ganaste +N" en verde o "Perdiste -N" en rojo (según la animación).
  - Si se completó un aura durante la animación, corre `AuraClose` (H21) una sola vez, aunque se crucen varias, y aparece "Completaste tu Nª aura".
  - Botón "Continuar" al final de la animación, que lleva al inicio.
- **Autoridad del servidor**:
  - El servidor cierra la partida, devuelve la bolsa al contador general, registra el movimiento y entrega posición, neto y saldo antes y después, todos finales.
  - El servidor envía la notificación push cuando la partida se resuelve.
- **Criterios de experiencia**:
  - Secuencia según `animacion_fin_partida.html`: espera inicial, aparece el bloque, los tramos se llenan de a uno (ganancia) o se vacían en coral (pérdida), y al final aparece "Continuar".
  - Bajar de aura no tiene animación especial ni rojo en el número.
  - Movimiento reducido: estado final sin transición.
  - Texto accesible con el resultado ("Ganaste 6 pulsos. Ahora tenés 1 aura y 22 de 25 pulsos.").
- **Casos borde**:
  - Partida terminada porque quedó un solo jugador: gana sin el premio.
  - Jugador expulsado: el resultado es 0 y no hay pulsos que devolver.
  - Cambio de emblema: sin referencia visual.
  - Jugador que terminó su día 5 antes que los demás: ve el resumen del día (H17) y el fin de partida recién cuando se resuelve.
  - Texto y contenido de la notificación push: sin referencia.
- **Dependencias**: depende de H17
- **Prioridad**: alta — es el cierre del flujo.

---

## H20: Ver el premio y los logros al terminar la partida

- **Descripción**: Como jugador, quiero ver si gané el premio y qué logros obtuve al terminar la partida, para sentir que mi esfuerzo valió aunque no haya salido primero.
- **Referencias visuales**: sin referencia (premio y logros en el fin de partida).
- **Reglas de producto involucradas**:
  - Ganador y premios: premio para el 1º solo si la partida llega al final del día 5; con empate en el primer puesto, se divide. Logros no monetarios: mejor día, mejor apuesta, aciertos y título de calibración.
  - Flujo y pantallas, paso 8: ganador, premio (si corresponde) y logros.
- **Criterios de aceptación funcionales**:
  - El fin de partida muestra el ganador, el premio si corresponde y los logros.
  - Formato y textos pendientes de referencia.
- **Autoridad del servidor**:
  - El servidor calcula ganador, premio (valor configurable), división por empate y logros.
- **Criterios de experiencia**:
  - Sin festejos de casino; el único festejo sigue siendo `AuraClose`.
- **Casos borde**:
  - Empate en el primer puesto: el premio se divide.
  - Partida terminada antes del día 5 por quedar un solo jugador: sin premio.
- **Dependencias**: depende de H19
- **Prioridad**: baja — no bloquea el flujo principal y no tiene referencia.

---

## H21: Ver el cierre de aura al completar un aura

- **Descripción**: Como jugador, quiero ver un único pulso sobrio cuando completo un aura, para sentir el logro sin estética de casino.
- **Referencias visuales**: `Referencias-y-definiciones/cierre_light.png`, `Referencias-y-definiciones/Animaciones/animacion_cierre_aura.html`
- **Reglas de producto involucradas**:
  - Aura, emblemas y cards: al completarse el aro, el número sube en uno y el centro se enciende con un solo pulso de 600 ms y una vibración suave.
  - Reglas de tono: sin confeti, destellos, fichas, luces ni sonidos.
  - Aura, emblemas y cards: si una ganancia cruza más de un aura de una vez, el pulso corre una sola vez y el número salta al aura final.
- **Criterios de aceptación funcionales**:
  - Se dispara cuando el contador general cruza un múltiplo de 25 hacia arriba (por ejemplo, al terminar la partida).
  - Secuencia de 1,5 s: 0 a 450 ms se llenan de a uno los pulsos que faltan; a los 650 ms se enciende el centro y un solo pulso de 600 ms (el aro crece 6% y vuelve) con vibración suave; a los 1250 ms el número sube; a los 1500 ms el aro vuelve a cero.
  - Texto final: "Completaste tu Nª aura" y "Seguís desde 0 de 25 pulsos".
  - Un solo cierre por cambio de saldo, aunque cruce más de un aura; no se repite ni se acumula, y el número salta directo al aura final.
- **Autoridad del servidor**:
  - El saldo que dispara el cierre viene del servidor; la app no lo dispara con saldos propios.
- **Criterios de experiencia**:
  - Movimiento reducido: cambio instantáneo de número y aro, sin pulso.
  - Texto accesible "Llegaste a N auras".
  - Bajar de aura no anima ni usa rojo.
- **Casos borde**:
  - Ganancia que cruza más de un aura de una vez: el cierre corre una sola vez y el número salta directo al aura final.
- **Dependencias**: depende de H1, H19
- **Prioridad**: media — es el único festejo, pero no bloquea jugar.

---

## H22: Ver que la sesión venció sin jugarla

- **Descripción**: Como jugador, quiero saber que no jugué la sesión a tiempo y que mi bolsa no se tocó, para entender que perdí ese día sin culpa.
- **Referencias visuales**: sin referencia (estado de sesión vencida; la fila "No jugó 2 días" de `Referencias-y-definiciones/Pantalla-UI/Match Detail/Ranking.png` muestra cómo lo ven los demás).
- **Reglas de producto involucradas**:
  - Reglas de la partida: si no la jugás a tiempo, ese día tenés cero aciertos y no se te cobra ni paga ninguna apuesta.
  - Casos borde: sesión vencida, la bolsa no se toca.
  - Flujo y pantallas, estados especiales: sesión vencida (día perdido, sin apuestas).
- **Criterios de aceptación funcionales**:
  - Cuando la ventana cierra sin que el jugador haya jugado, la partida deja de ofrecer jugar ese día.
  - La bolsa no cambia y los aciertos del día son 0.
  - Cómo se informa al jugador: pendiente de referencia.
- **Autoridad del servidor**:
  - El servidor cierra la ventana y registra el día perdido.
- **Criterios de experiencia**:
  - Texto sin culpa; sin rojo.
- **Casos borde**:
  - Ventana que vence con la sesión empezada: aplica H16.
- **Dependencias**: depende de H2
- **Prioridad**: media — estado frecuente, sin referencia.

---

## H23: Jugar las sesiones seguidas en modo rápido

- **Descripción**: Como administrador, quiero activar el modo rápido en una partida, para probar las 5 sesiones seguidas sin esperar un día entre cada una.
- **Referencias visuales**: sin referencia.
- **Reglas de producto involucradas**:
  - Pruebas y métricas, Modo rápido: configuración que solo activa el administrador; apenas termina una sesión de 7 preguntas, se revela el tema de la siguiente; el tema sigue siendo el mismo para todos; "ganar la sesión" se resuelve cuando todos la terminaron. El multiplicador de "ganar la sesión" de cada sesión queda fijo (contando los jugadores en pie) cuando el primer jugador de la partida empieza esa sesión, y es el mismo para todos.
  - Prueba con gente real: 8 a 12 amigos en modo rápido.
- **Criterios de aceptación funcionales**:
  - Solo un administrador puede activar el modo rápido.
  - Al terminar una sesión, el flujo lleva a descubrir el tema de la siguiente (H6) en lugar de esperar la próxima apertura.
  - El resto de las reglas del flujo no cambian.
- **Autoridad del servidor**:
  - El modo rápido y el ritmo de las sesiones son configuración del servidor.
- **Criterios de experiencia**:
  - Cómo se activa y cómo se indica que la partida está en modo rápido: pendiente.
- **Casos borde**:
  - Un jugador termina su sesión antes que los demás: "ganar la sesión" queda pendiente hasta que todos la terminen.
  - Una expulsión que todavía no se resolvió cuando el primer jugador empieza la sesión no cambia su multiplicador; cuenta desde la sesión siguiente.
- **Dependencias**: depende de H6, H17
- **Prioridad**: media — es necesario para la prueba con amigos, aunque no es parte de la experiencia del jugador.

---

## Resumen
- Total de historias: 21
- Prioridad alta: H2, H4, H6, H8, H9, H10, H11, H12, H13, H14, H17, H19
- Prioridad media: H1, H3, H16, H18, H21, H22, H23
- Prioridad baja: H5, H20
- Historias sin referencia visual (total o del elemento central): H5, H13 y H14 (definidos en texto), H16 (`Overlay`, definido en texto), H17, H18 (hoja), H20, H22, H23. Con elementos parciales sin referencia: H1 (emblema) y H3 (pestañas Te toca y Jugadas).

## Preguntas para PO

Elementos que el MVP lista en "Faltan en las referencias" (sin referencia):

- Resumen del día después de la 7ª pregunta (H17): diseño, textos y a dónde lleva.
- Contenido de la pestaña *Historial* (H5).
- Emblema en el encabezado (H1) y diseño visual de cada emblema.
- Premio y logros en el fin de partida (H20).

Otros elementos del flujo sin referencia:

- Hoja de expulsión con reflexión (H18) y sus textos (decisión pendiente en el MVP).
- Estado de sesión vencida (H22).
- Aviso del resumen del día 5 ("los resultados finales salen cuando todos terminen") y notificación push del fin de partida (H17, H19).
- Pestañas "Te toca" y "Jugadas" seleccionadas, y estados vacíos del inicio (H2, H3).
- Activación e indicación del modo rápido (H23).

Reglas a definir:

- ¿Cómo se ve la fila de un jugador expulsado en el ranking?

Decisiones tomadas (17/11/2026):

- La confianza en el tema se reserva de la bolsa al tocar "Jugar la sesión"; el chip "pulsos disponibles" y el máximo por pregunta usan la bolsa menos esa reserva. La bolsa nunca queda en negativo (H8, H9, H10, H11).
- El monto de cada pregunta arranca en 0; "Responder" queda deshabilitado hasta elegir opción (H11).
- Si vence el tiempo sin tocar "Responder", el monto elegido nunca llegó al servidor: la pregunta cuenta como error con 0 pulsos. Solo se pierde un monto enviado con "Responder" que llega a tiempo en una respuesta incorrecta. Lo mismo vale si se cierra la app con monto elegido sin enviar. La celda de pérdida dice "Si errás", no "Si errás o vence" (H11, H13, H14, H16).
- Con 0 pulsos disponibles y pulsos reservados en el tema, el jugador sigue la sesión con monto 0 y sus aciertos cuentan para "al menos X" y "ganar la sesión". La expulsión se evalúa sobre la bolsa total una vez resueltas las reservas; si llega a 0 después de la sesión, al resolverse "ganar la sesión", la hoja aparece al abrir esa partida o por notificación push (H11, H13, H18).
- X en "al menos X de las 7" solo puede ser 4, 5, 6 o 7 (H9).
- El fin de partida aparece cuando la partida se resuelve, por push o al abrir la app; después del día 5 el jugador ve el resumen con un aviso (H17, H19).
- Si una ganancia cruza más de un aura, `AuraClose` corre una sola vez y el número salta (H19, H21).
- Textos de las tarjetas de tema (reemplazan los anteriores): "Acertar al menos X de las 7" con "Elegí cuántas preguntas creés que vas a acertar del tema de hoy.", y "Ganar la sesión" con "Acertá más que el resto hoy. Paga ×5,4 con 6 jugadores." (multiplicador y cantidad de jugadores dinámicos). Los títulos de `Default.png` y `General expanded.png` son errores (H8, H9).
- La card compacta muestra los aciertos acumulados de la partida (H3).
- Empates en el ranking: puesto compartido (1º, 2º, 2º, 4º), "Vas 2º" para ambos (H2, H4).
- El servidor sortea el tema solo entre temas con al menos 7 preguntas no vistas por ningún jugador de la partida; alerta al administrador por umbral configurable (H6).
- La sesión interrumpida se retoma dentro de la ventana; la pregunta en pantalla mantiene su cronómetro; las no mostradas esperan; si no se retoma, al cerrar la ventana las que faltan cuentan como error sin apuesta y "al menos X" se resuelve; cerrar abre el `Overlay` de confirmación (H9, H16).
- Una respuesta enviada con "Responder" que llega al servidor después de los 22 s cuenta como error con 0 pulsos, igual que el tiempo vencido sin responder. El margen de 2 s absorbe la latencia; una mala conexión no cuesta pulsos (H11, H14).
- El multiplicador de "ganar la sesión" queda fijo a la hora de apertura del día y es el mismo para todos los jugadores de ese día: los jugadores en pie se cuentan en ese momento. Un jugador expulsado más tarde ese mismo día no cambia el multiplicador de hoy y deja de contar desde el día siguiente. Se paga el multiplicador que el jugador vio antes de confirmar (H8).
- El pago de "al menos X de las 7" se redondea hacia abajo, igual que "ganar la sesión": un solo criterio de redondeo en el motor de pagos (5 × 1,3 = 6,5 → 6) (H9).
- En modo rápido, el multiplicador de "ganar la sesión" de cada sesión queda fijo cuando el primer jugador de la partida empieza esa sesión y es el mismo para todos; una expulsión sin resolver en ese momento cuenta desde la sesión siguiente (H23).
- La elección de X sigue `Topic Reel/Al menos X expanded.png`: etiqueta "ELEGÍ CUÁNTAS PREGUNTAS VAS A ACERTAR" con píldoras 4, 5, 6 y 7 (la imagen muestra del 1 al 7; del 1 al 3 no son válidos), etiqueta "ELEGÍ CUÁNTOS PULSOS ARRIESGÁS" con las píldoras de monto, celda "SI ACERTÁS 6 · (×4)" / "+15 pulsos" / "Cobrás 20 total" y "Guardar" (`neutral`). X por defecto: 4 (H9).
- La píldora de monto libre se llama "Otro" en la tarjeta de tema y en la pregunta; "Libre" en `Pregunta/Elegida.png` no se copia (H8, H9, H11).
- El chip de pulsos disponibles de la pantalla del tema baja en el momento al guardar una tarjeta con monto (de 62 a 57 al guardar 5 en "Ganar la sesión") y se recalcula al cambiar el monto o pasarlo a 0; la reserva real sigue ocurriendo al tocar "Jugar la sesión". No hay línea aparte con el total arriesgado (H8, H9, H10).
- "Otro" abre un `Overlay` sobre la pantalla oscurecida: "¿Cuántos pulsos arriesgás?", campo numérico con foco automático y teclado numérico, "Podés arriesgar hasta N pulsos" en `text-muted`, "Guardar" (`brand`) y "Cancelar" (`ghost`). Lo que supera el máximo se ajusta solo, sin rojo ni reproche; tocar fuera equivale a "Cancelar"; al guardar, la píldora muestra el número como elegida; vacío o 0 vuelve a "Otro" con el 0 elegido. El `Overlay` es un componente nuevo del DS, con detalle visual provisorio (H8, H9, H11).
- El botón cerrar de la pregunta abre el mismo `Overlay`: "¿Salir de la sesión?", "Podés volver mientras la sesión siga abierta. El tiempo de esta pregunta sigue corriendo.", "Salir" (`coral`) y "Seguir jugando" (`neutral`). Al retomar se va directo a la pregunta en pantalla si tiene tiempo o a la siguiente pendiente, sin pantalla intermedia; si la que dejó venció, primero la ve en estado de tiempo vencido (H16).
- Respuesta incorrecta: la elegida pasa a "Incorrecta", la correcta dice "Correcta", las otras dos se atenúan; tarjeta "No era esa" con "-5 pulsos" en `danger-text` (o "0 pulsos" en `text-muted`) y la explicación; tiempo congelado en el segundo de la respuesta (H13).
- Tiempo vencido: la correcta dice "Correcta", las otras tres se atenúan, ninguna como elegida; tarjeta "Se terminó el tiempo" con "0 pulsos" en `text-muted`, "Cuenta como error, no perdiste pulsos." y la explicación; temporizador en 0 con la barra vacía y la cifra "0" en `danger-text`. En los dos estados, botón "Siguiente pregunta"; siguen sin imagen de referencia (H14).

- Carga y error (patrón del DS para toda la app): esqueletos `surface-2` sin spinner; botón que espera al servidor deshabilitado (`surface-2`, sin labio) con el mismo rótulo; error en un bloque `surface-2` con "No pudimos conectarnos. Revisá tu conexión y probá de nuevo." en `text-muted` y `neutral` "Reintentar", sin rojo; "Responder" y "Jugar la sesión" reintentan solos 2 veces (todas las historias).
- Las vistas previas ("Si acertás", total a cobrar, chip de disponibles, máximo de "Otro", el doble por pregunta) las calcula la app con el mismo módulo de reglas puras que el servidor, con los valores que este entrega; no mueven pulsos y el servidor siempre recalcula y rechaza montos inválidos (H8, H9, H10, H11).
- Monto 0: en la pregunta, las celdas "Si acertás" y "Si errás" siguen visibles con "0 pulsos" en `text-muted`; en la tarjeta de tema, la celda "Si acertás" se oculta; `ResultCard` mantiene el título ("Acertaste" / "No era esa") con "0 pulsos" en `text-muted`. Nunca "+0" ni rojo (H8, H9, H11, H12, H13).
- Temporizador: en 0, barra vacía y "0" en `danger-text`; congelado con 5 s o menos mantiene el tono urgente; del segundo 20 al 22 no cambia nada en pantalla y "Responder" queda deshabilitado; la app nunca deja responder después de 0 (H11, H12, H13, H14, H16).
- Las píldoras de monto que superan lo disponible quedan deshabilitadas (`surface-2`, sin labio, "No disponible"); "Otro" cubre cualquier monto hasta el máximo (H8, H9, H11).
- Ventana que vence con la pantalla abierta: Inicio y detalle se actualizan solos con chip "Cerrada" (`forest`) y `neutral` "Ver ranking"; en el tema, "Jugar la sesión" se rechaza con "Esta sesión ya cerró. No se movieron pulsos." y "Volver a la partida"; en medio de las preguntas, "La sesión cerró. Las preguntas que faltaban cuentan como error, sin pulsos." y "Volver a la partida" (H2, H4, H6, H10, H11, H16).
- Botón de ícono cuadrado `neutral` para la navegación: cerrar (pregunta) y volver (detalle de partida) (H4, H11, H16). La ayuda "?" es informativa y va en `ghost`.
- Botón de ayuda "?" `ghost` ("Cómo funciona la confianza") que abre el `Overlay` "¿Cómo funciona la confianza?" con tres líneas y `neutral` "Entendido". El `Overlay` se usa para decisiones del jugador y ayuda, nunca para errores (H8, H9, H10).
- Netos: "+12 pulsos ganados", "-8 pulsos perdidos", "sin cambios", también en "Tu puesto"; singular con 1 (H2, H4, H13).
- El carrete del tema no vibra al frenar; la vibración es solo de `AuraClose` (H6).
- Si hay varias cards jugables en el Inicio, cada una lleva su `brand` "Jugar": excepción explícita del DS a "un color fuerte por pantalla" (H2).
- "Guardar" es `neutral` en `TopicBetCard` y `brand` en el `Overlay` (capa aparte con su propia acción principal) (H8, H9).
- La imagen de estados de la card de las referencias se eliminó por desactualizada; los estados de la card siguen el MVP, el DS y `Dashboard/Todas.png` (H2, H18).

Contradicciones entre fuentes:

- "Ganar sesión" en `General expanded.png`: 5 pulsos dan "+7 pulsos, Cobrás 12 total" (×2,4), que no corresponde a 0,9 × jugadores en pie para ningún número entero de jugadores. El MVP aclara que son cifras de ejemplo.
- La animación del sorteo usa montos 0, 1, 2 y 5 en lugar de 0, 1, 5, 10 y "Otro".
- Animación del sorteo vs. pantallas: el botón dice "Descubrir el tema" (pantalla: "Descubrir tema"), la ventana dice "Tu tema de hoy" (pantalla: "Tema de hoy"), muestra "Buscando tema" mientras gira, tiñe la tarjeta con el color del tema, agrega un ícono y los chips "7 preguntas" y "20 s por pregunta", que no aparecen en `Default.png`. El giro dura 2,5 s en la animación y 2,4 s en el DS.
- Detalle de la partida: "Cierra en 6 h" en el encabezado vs. "Vence en" en la card del inicio para el mismo concepto (cierre de la ventana). Confirmar si es intencional.
- Errores de tipeo en las referencias que se corrigen según el DS: "Confias", "Arriesga", "mas", "que tanto confias", "Como queres arriesgar?", "Jugar la sesion", "Vas 2o", "3o".
