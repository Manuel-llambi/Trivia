# App de trivia: diseño del MVP

Oct 22, 2026 · @Manu · Actualizado Nov 21, 2026

## Resumen

Trivia móvil de cultura general donde cada jugador arriesga **Pulsos** según cuánto cree saber; el MVP busca validar si ese ciclo diario engancha a grupos de amigos.

- **Qué es:** partidas de 5 días para 2 o más jugadores, con un tema al azar por día y 7 preguntas de opción múltiple por sesión.
- **Propuesta:** demostrar cuánto sabés, competir con amigos y aprender con explicaciones. Es una alternativa al doomscrolling: sesiones cortas, con un final claro.
- **Diferencial:** una sesión diaria por partida (escasez), ventana que vence, y confianza calibrada: apostás sobre tu propio conocimiento con Pulsos que solo se ganan jugando. Replica la mecánica del riesgo de un casino, sin dinero real y sin su estética, para que el jugador viva la consecuencia de arriesgar de más.
- **Objetivo del MVP:** probar con 8 a 12 amigos si vuelven cada día, si entienden las reglas sin explicación y si la economía de Pulsos se sostiene.
- **Cómo se construye:** app móvil en React Native (Expo) con backend en Supabase, desarrollada en solitario.

## Glosario

| Término | Significado |
| --- | --- |
| **Pulso** | La moneda del juego. Se gana y se pierde apostando. No se compra ni se canjea. |
| **Aura** | Unidad de acumulación: 1 Aura = 25 Pulsos. Es `floor(Pulsos / 25)`, sube y baja con el saldo. |
| **Contador general** | Pulsos libres del jugador, mostrados como Aura arriba a la derecha del dashboard. |
| **Bolsa** | Los 50 Pulsos comprometidos al entrar a una partida. Las apuestas de esa partida salen de ahí. |
| **Emblema** | Insignia según el Aura actual. Sube y baja con ella. |

## Reglas de la partida

Una partida dura 5 días y cada día es una sesión de 7 preguntas sobre un tema distinto, para un total de 35 preguntas.

- **Jugadores:** mínimo 2, invitados por link.
- **Tema del día:** 100% al azar, definido por el servidor y el mismo para todos los jugadores de la partida. El servidor sortea solo entre los temas que tienen al menos 7 preguntas no vistas por ningún jugador de la partida; el jugador no lo nota. La rueda de la app solo revela ese tema.
- **Sesión:** una por día y por partida. Se pueden tener varias partidas en paralelo, limitadas por los Pulsos libres (ver Economía).
- **Hora de apertura:** la elige quien crea la partida (por defecto, las 9:00 de su hora local). Cada jugador la ve convertida a su hora local.
- **Ventana:** la sesión está disponible 24 horas desde la apertura. Si no la jugás a tiempo, ese día tenés cero aciertos y no se te cobra ni paga ninguna apuesta.
- **Sesión interrumpida:** si se corta la conexión o cerrás la app a mitad de sesión, podés retomarla dentro de la ventana de 24 horas (ver Casos borde).
- **Tiempo por pregunta:** 20 segundos visibles; el servidor acepta hasta 22 segundos para absorber la latencia. No suma ni resta, pero pasarse cuenta como error. Una respuesta enviada con "Responder" que llega al servidor después de los 22 segundos cuenta como error con 0 Pulsos, igual que el tiempo vencido sin responder: una mala conexión no te cuesta Pulsos. El cronómetro corre en el servidor. Entre los 20 y los 22 segundos el jugador no ve nada distinto: en 0 "Responder" se deshabilita y la pantalla espera el veredicto del servidor, que llega como tiempo vencido. Los 2 segundos extra solo absorben respuestas enviadas antes de los 20; la app nunca deja responder después de 0.
- **Preguntas:** opción múltiple de 4 opciones en orden aleatorio, con explicación breve después de responder. Ningún jugador ve una pregunta que ya respondió en cualquier partida: al armar el día se excluyen las preguntas ya vistas por cualquier jugador de la partida.
- **Temas:** el modo de tema a elección no entra en el MVP.

## Economía de Pulsos

El Pulso solo se gana jugando: no se compra ni se canjea por dinero o premios. Todos los números de esta sección son provisionales y se ajustan con la simulación y las pruebas.

**Contador general y bolsa**

- Cada jugador arranca con **50 Pulsos (2 Aura)**.
- Entrar a una partida cuesta **50 Pulsos fijos**. Esos Pulsos salen del contador general y quedan comprometidos como bolsa de esa partida hasta que termina o te expulsan.
- Un jugador nuevo puede jugar **una sola partida a la vez**. Jugar varias en paralelo es un privilegio que se gana acumulando Pulsos.
- Al terminar la partida, **la bolsa final vuelve completa al contador general**, sea cual sea su valor. Ejemplo: tenés 50, entrás y quedás en 0 libres; si terminás con la bolsa en 70, quedás en 70; si terminás en 30, quedás en 30; si te expulsan (bolsa en 0), quedás en 0.
- Las ganancias de cada sesión se suman a la bolsa apenas termina la sesión, así que quien acierta puede apostar más fuerte en las siguientes.

**Dos momentos de confianza**

1. **Al ver el tema (antes de empezar):** apuesta "al menos X de las 7" y apuesta "ganar la sesión". Al tocar "Jugar la sesión", lo apostado en las dos queda **reservado** de la bolsa hasta que se resuelve. Cada tarjeta tiene un tope de **10 Pulsos** (configurable, Nov 21, 2026). "Al menos X" se resuelve cuando terminás tus 7 preguntas (si no retomás una sesión interrumpida, al cerrar la ventana); "ganar la sesión", cuando todos los jugadores en pie terminaron o al cerrar la ventana.
2. **En cada pregunta:** elegís respuesta y cuántos Pulsos ponés (0, 1, 5, 10 o un monto libre hasta un tope de **10 Pulsos** por pregunta, configurable, sin superar tu bolsa disponible, es decir, la bolsa menos lo reservado en las apuestas de tema). El monto arranca en 0 en cada pregunta. Si acertás recibís el doble de lo apostado; si errás, lo perdés. Solo se pierde el monto enviado con "Responder" que el servidor recibe a tiempo: si se acaba el tiempo sin que toques "Responder", el monto elegido nunca llegó al servidor y la pregunta cuenta como error con 0 Pulsos (no perdés nada). Lo mismo si tocaste "Responder" pero la respuesta llega al servidor después de los 22 segundos. Con 4 opciones, adivinar pierde en promedio la mitad de lo apostado.

La bolsa nunca puede quedar en negativo: la suma de lo reservado y lo apostado en la pregunta en curso nunca supera la bolsa.

Si tus Pulsos disponibles llegan a 0 mientras tenés Pulsos reservados en el tema, seguís jugando la sesión con la única opción de monto 0; tus aciertos siguen contando para "al menos X" y "ganar la sesión".

**Pagos de "al menos X de las 7"** (multiplicadores fijos en el MVP; referencia: tema donde el promedio global acierta el 60%)

| Umbral | Probabilidad | Pago total (incluye lo apostado) | Con 10 Pulsos recibís |
| --- | --- | --- | --- |
| 4 o más | ~71% | ×1,3 | 13 (ganás 3) |
| 5 o más | ~42% | ×2 | 20 (ganás 10) |
| 6 o más | ~16% | ×4 | 40 (ganás 30) |
| Las 7 | ~3% | ×8 | 80 (ganás 70) |

X solo puede ser 4, 5, 6 o 7: son los únicos umbrales con multiplicador. El pago se redondea hacia abajo, igual que en "ganar la sesión": el motor de pagos usa un solo criterio de redondeo (por ejemplo, 5 × 1,3 = 6,5 → 6). Los multiplicadores son fijos para todos los temas. La simulación debe medir cuánto se infla la economía en temas fáciles; si se infla, se pasa a calcularlos con el promedio real de cada tema.

**"Ganar la sesión": multiplicador fijo según la cantidad de jugadores**

Cada jugador se hace cargo de lo que arriesga: cuánto cobrás depende solo de tu monto y de un multiplicador que conocés antes de confirmar, no de lo que arriesgan los demás. Lo que sí depende de los demás es ganar la sesión.

- **Pago total (incluye lo apostado):** monto × (0,9 × jugadores en pie). "Jugadores en pie" se cuentan a la hora de apertura del día: el multiplicador queda fijo en ese momento y es el mismo para todos los jugadores de ese día. Si alguien queda expulsado más tarde ese mismo día, el multiplicador de hoy no cambia; deja de contar desde el día siguiente. El multiplicador que ves antes de confirmar es el que se paga. Se redondea hacia abajo.

| Jugadores en pie | Multiplicador | Con 5 Pulsos recibís |
| --- | --- | --- |
| 2 | ×1,8 | 9 (ganás 4) |
| 4 | ×3,6 | 18 (ganás 13) |
| 6 | ×5,4 | 27 (ganás 22) |
| 8 | ×7,2 | 36 (ganás 31) |

- **Quién gana:** quien más aciertos tiene entre todos los que jugaron la sesión, hayan apostado o no.
- **Empate en aciertos:** gana quien tardó menos tiempo total en responder. Cada pregunta respondida a tiempo suma el tiempo medido por el servidor; una pregunta vencida, una respuesta que llegó después de los 22 segundos o una pregunta que no se llegó a mostrar suman los 20 segundos completos.
- **Empate en aciertos y en tiempo total:** ganan todos los empatados y cada uno cobra su pago completo.
- **Menos de 2 jugaron la sesión:** se devuelve lo apostado.
- **Si no ganás,** perdés lo apostado.
- **Cuándo se resuelve:** cuando todos los jugadores en pie terminaron la sesión del día, o al cerrar la ventana. Quien no juega ese día no suma ni resta.
- **Por qué 0,9:** entre jugadores parejos, la chance de ganar es 1 sobre la cantidad de jugadores, así que el pago justo sería ×N. Pagar el 90% de eso hace que, en promedio, esta apuesta retire Pulsos de circulación en lugar de crearlos. El factor es provisional y se ajusta con la simulación.

**Expulsión (bolsa en cero)**

- Si tu bolsa llega a cero, quedás expulsado de esa partida y tu resultado queda congelado.
- La expulsión se evalúa sobre la **bolsa total** una vez resueltas las reservas: quedarte sin Pulsos disponibles con Pulsos reservados en el tema no te expulsa. Solo quedás expulsado cuando la bolsa total llega a 0, lo que puede pasar después de tu sesión, cuando se resuelve "ganar la sesión".
- No hay bloqueo: podés seguir jugando tus otras partidas y entrar a nuevas si tenés Pulsos libres.
- Si en una partida queda **un solo jugador en pie** (incluida la partida de 2 con un expulsado), la partida termina en ese momento y ese jugador gana, **sin el premio de 150**: se lleva solo su bolsa y lo que ganó apostando.

**Quiebra total**

- Si quedás con 0 Pulsos libres y **ninguna partida activa**, esperás **48 horas** y se te reponen **50 Pulsos (2 Aura)**, lo justo para volver a entrar a una partida.
- Tener 0 libres con una partida activa no es quiebra.

## Ganador y premios

- **Ranking y ganador:** quien más Pulsos netos ganó apostando en esa partida (todas las apuestas: por pregunta, "al menos X" y "ganar la sesión"). Apostar bien se basa en saber y en animarse a respaldarlo.
- **Empates en el ranking:** los empatados en Pulsos netos comparten el puesto y el siguiente salta (1º, 2º, 2º, 4º). Los dos empatados en el 2º puesto ven "Vas 2º".
- **Aciertos:** se muestran como dato y logro, pero no definen al ganador.
- **Premio:** 150 Pulsos para el 1° puesto, **solo si la partida llega al final del día 5 con al menos 2 jugadores en pie**. Si al resolverse el día 5 queda un solo jugador en pie (o ninguno), la partida termina como "último en pie" y no hay premio. Si hay empate en el primer puesto, el premio se divide entre los empatados y se redondea hacia abajo (150 entre 4 = 37 cada uno).
- **Del 2° puesto en adelante:** se quedan con su bolsa final. Para sostener el interés se muestran logros no monetarios: mejor día, mejor apuesta, aciertos y un título de calibración.

## Aura, emblemas y cards

**Contador general en el dashboard.** Arriba a la derecha se ve el Aura actual dentro de un aro, junto al emblema. El aro se llena cada 25 Pulsos; al completarse, el número de Aura sube en uno y el centro se enciende con un solo pulso de 600 ms y una vibración suave. Si una ganancia cruza más de un Aura de una vez, el pulso corre una sola vez y el número salta directo al Aura final. Si perdés Pulsos, el Aura baja.

**Emblemas.** Se ganan al llegar a **5, 10, 20, 50 y 100 Aura**. Siguen al Aura actual: si perdés Pulsos podés bajar de Aura y de emblema. Vivís la consecuencia de no haber sido cauto con tus riesgos.

**Card de partida (te toca jugar).** Chip de vencimiento ("Vence en 16:20:23"), "Día 3 de 5", título, cantidad de jugadores y avatares. El bloque gris **no muestra aro**: a la izquierda, la bolsa en número grande y debajo la ganancia o pérdida neta en la partida; a la derecha, la posición. Debajo, el botón.

| Estado | Número grande | Debajo | Posición | Botón |
| --- | --- | --- | --- | --- |
| Ganando | 62 | +12 pulsos ganados (verde) | Vas 2º | Jugar |
| Perdiendo | 42 | -8 pulsos perdidos (rojo) | Vas 2º | Jugar |
| Recién empieza | 50 | sin cambios (gris) | Todos 0 | Jugar |
| Fuera de la partida | 0 | sin pulsos (gris) | Quedaste 4º | Ver ranking |

Si hay varias cards en las que te toca jugar, cada una lleva su propio botón **Jugar** principal (excepción explícita a "un color fuerte por pantalla" del sistema de diseño). Si la ventana vence con el inicio abierto, la card se actualiza sola: chip "Cerrada", sin **Jugar** y con **Ver ranking**. Con 1 pulso, los textos van en singular ("+1 pulso ganado", "-1 pulso perdido").

**Card de partida (ya jugada hoy).** Versión compacta sin bloque gris ni botón: chip "Jugada hoy", "Día 2 de 5", título, avatares y una línea de resumen ("Vas 2º · 11 aciertos · Abre mañana 00:00"). Los aciertos son los acumulados en la partida, no los del día. En "Todas" se agrupan bajo "Partidas completadas hoy".

**Confianza por pregunta.** Antes de responder se anticipa el resultado con dos celdas: "Si acertás +5 pulsos" (verde) y "Si errás -5 pulsos" (coral), con signo y color. Con monto 0, las dos celdas siguen visibles y dicen "0 pulsos" en gris, sin signo.

**Fin de partida.** Aparece cuando la partida se resuelve (el último jugador en pie termina el día 5, cierra la ventana del día 5 o queda un solo jugador en pie), no cuando el jugador termina su propio día 5. La posición y el Aura que muestra son finales. Aparece una animación central grande con el aro del contador general: muestra el Aura actual, una marca en el punto de partida, "22 de 25 pulsos para tu 2ª aura" y lo ganado o perdido en la partida ("Ganaste +6"), incluido el cambio de emblema si lo hubo.

**Cuando te expulsan.** Cuando la bolsa total llega a 0 aparece una hoja: si pasa durante tu sesión, al terminar la pregunta que la vacía; si pasa después, al resolverse "ganar la sesión", la próxima vez que abrís esa partida o con una notificación push. La hoja que dice qué pasó ("Te quedaste sin Pulsos en esta partida"), qué sigue (seguís viendo el ranking, no jugás los días que faltan, tus otras partidas siguen) y un **momento de reflexión** con datos concretos de tus apuestas, por ejemplo: "Arriesgaste el 80% de tu bolsa en 3 preguntas". En la card, el chip pasa a gris ("Fuera de la partida") y el botón es "Ver ranking".

**Reglas de tono.** La mecánica del riesgo es la de un casino (la pérdida duele, la expulsión es real); la estética no.

- Sin confeti, destellos, fichas, luces ni sonidos de premio o de tragamonedas.
- Sin rojo en el 0: el vacío ya lo dice. El cero se escribe "0 pulsos", nunca "+0".
- La vibración suave es solo del cierre de aura; la rueda del tema no vibra.
- Una falla de conexión no se muestra en rojo: no es culpa del jugador ("No pudimos conectarnos. Revisá tu conexión y probá de nuevo." con **Reintentar**).
- Texto sin culpa: "te quedaste sin Pulsos", no "perdiste todo". Siempre hay una acción posible.
- La conciencia sale de mostrar la consecuencia con claridad (reflexión, saldo antes y después), no de castigar.
- Ganancias y pérdidas siempre con signo y color: +12 y -8.

## Flujo y pantallas

El recorrido va de la lista de partidas a la sesión del día y termina en el ranking.

1. **Inicio (dashboard):** tres pestañas, *Te toca*, *Jugadas* y *Todas*. Cada card muestra el día (1 de 5), el estado de la sesión (disponible, jugada o cuánto falta para que venza), la bolsa, la ganancia neta y mi posición. Arriba a la derecha, el Aura con su aro y el emblema.
2. **Detalle de la partida:** mi puesto y los pulsos ganados, pestañas *Ranking* e *Historial*, y el ranking por Pulsos. Si me toca jugar, aparece el botón **Jugar la sesión**.
3. **Revelación del tema:** el jugador toca "Descubrir tema" y una animación tipo rueda revela el tema que el servidor ya definió.
4. **Apuestas de tema (momento 1):** en la misma pantalla, debajo del tema: "ganar la sesión" (con su multiplicador a la vista) y "al menos X de las 7", cada una con su monto y su pago exacto. El chip de pulsos disponibles baja al guardar cada monto, así que muestra lo que me queda sin una línea aparte con el total. Al empezar la sesión no se puede cambiar y lo arriesgado queda reservado de la bolsa.
5. **Pregunta (×7, momento 2):** pregunta, 4 opciones, cronómetro y progreso. Elijo respuesta y cuántos Pulsos pongo (arranca en 0 en cada pregunta; no puedo confirmar sin elegir respuesta); siempre se ve cuánto tengo en juego. Al confirmar aparece acierto o error, la explicación y el movimiento de Pulsos. El tiempo empieza a correr al empezar las preguntas.
6. **Resumen del día:** aciertos (por ejemplo 5 de 7), resultado de las apuestas de tema, Pulsos netos del día, posición y, si ya se resolvió, el resultado de "ganar la sesión". Después de la sesión del día 5, el resumen avisa que los resultados finales salen cuando todos terminen.
7. **Ranking de la partida:** Pulsos netos actualizados cuando cada jugador termina su sesión.
8. **Fin de partida (cuando la partida se resuelve: el último jugador en pie termina el día 5, cierra la ventana del día 5 o queda uno solo):** ganador, premio (si corresponde), logros y la animación del contador general. El jugador llega por una notificación push o la próxima vez que abre la app.

**Estados especiales:** sesión vencida (día perdido, sin apuestas), expulsión (hoja con reflexión) y quiebra total (cuenta regresiva de 48 h hasta la reposición).

## Primer flujo a desarrollar: jugar una partida activa

Es el recorrido desde que el jugador entra a una partida en la que le toca jugar hasta que termina. Las pantallas de referencia están en `Referencias-y-definiciones/Pantalla-UI/` y mandan sobre el detalle visual; los componentes y tokens están en el sistema de diseño.

1. **Inicio** (`Dashboard/Todas.png`). Encabezado con avatar, "Hola de nuevo" y el nombre, y el contador de Aura ("1 · 16/25"). Pestañas *Te toca*, *Jugadas*, *Todas*. Arriba, la card de la partida que me toca (bolsa, pulsos ganados, posición, botón **Jugar**); debajo, "Partidas completadas hoy" con cards compactas.
2. **Detalle de la partida** (`Match Detail/Ranking.png`). Encabezado oscuro con volver (el mismo botón cuadrado que el cerrar de la pregunta), chip "Día 3 de 5", título y "6 jugadores · Cierra en 6 h". Card "Tu puesto 3º" con "+24 pulsos ganados" (o "-8 pulsos perdidos", o "sin cambios", con los mismos textos y colores que la card del inicio). Si la ventana vence con la pantalla abierta, se actualiza sola: chip "Cerrada", sin **Jugar la sesión** y con **Ver ranking**. Pestañas *Ranking* e *Historial*. "Posiciones actuales": cada fila con puesto, avatar, nombre, aciertos de la partida y pulsos en la bolsa. El 1º se destaca, mi fila se marca como "Vos", y quien no jugó se atenúa con el motivo ("No jugó 2 días"). Botón **Jugar la sesión**.
3. **Descubrir el tema** (`Topic Reel/Default-1.png`). "Descubrí el tema de hoy" y "Un solo tema al azar para todos los jugadores de la partida". La ventana del carrete muestra "Tema de hoy" hasta que el jugador toca **Descubrir tema**; entonces gira y frena en el tema.
4. **Confianza en el tema** (`Topic Reel/Default.png`, `General expanded.png` y `Al menos X expanded.png`). En la misma pantalla, debajo del tema revelado: "¿Confiás en tu conocimiento?" con un botón de ayuda "?" (abre un aviso "¿Cómo funciona la confianza?" con tres líneas: "Ganar la sesión: si hoy acertás más que el resto, cobrás tu monto por el multiplicador.", "Acertar al menos X de las 7: elegí cuántas creés que vas a acertar; cuanto más alto, más paga." y "Los pulsos que pongas se reservan al tocar Jugar la sesión. Poner 0 también vale.", y el botón **Entendido**), el chip de pulsos disponibles (la bolsa menos lo que se reserva en estas dos tarjetas) y "¿Cómo querés arriesgar?". Los títulos de las tarjetas son los de este documento ("Ganar sesión" y "Ganar x de las 7 sesiones" en `Default.png` y `General expanded.png` son errores). Dos tarjetas desplegables, cada una con su monto en un chip ("Sin pulsos" por defecto):
   - **Ganar la sesión:** lograr el mayor puntaje del día entre los jugadores. Título "Ganar la sesión"; descripción "Acertá más que el resto hoy. Paga ×5,4 con 6 jugadores." (el multiplicador y la cantidad de jugadores son dinámicos).
   - **Acertar al menos X de las 7:** acertar al menos X de las 7 preguntas del tema de hoy. Título "Acertar al menos X de las 7"; descripción "Elegí cuántas preguntas creés que vas a acertar del tema de hoy."

   Al desplegar una tarjeta: montos 0, 1, 5, 10 y "Otro" (monto libre); una celda con la ganancia y el total exactos, calculados con el multiplicador (con 6 jugadores y 5 pulsos: "Si acertás +22 pulsos · Cobrás 27 total"; las cifras de la imagen de referencia son de ejemplo); y el botón **Guardar**, que cierra la tarjeta con el monto en el chip. Apostar es opcional. Con monto 0 la celda "Si acertás" no se muestra (el chip ya dice "Sin pulsos"). Las píldoras cuyo monto supera los pulsos disponibles quedan deshabilitadas; "Otro" sigue disponible para cualquier monto hasta el máximo (igual en la pregunta).

   Al guardar una tarjeta con monto, el chip de pulsos disponibles baja en el momento (de 62 a 57 al guardar 5 en "Ganar la sesión"); cambiar el monto o pasarlo a 0 lo recalcula. La reserva real sigue ocurriendo al tocar **Jugar la sesión**: el chip solo la anticipa. No hay una línea aparte con el total arriesgado. Si la ventana ya cerró al tocar **Jugar la sesión**, el servidor lo rechaza y la pantalla muestra "Esta sesión ya cerró. No se movieron pulsos." con **Volver a la partida** (no se reservó nada).

   **Monto libre ("Otro")**, igual en las tarjetas de tema y en la pregunta: al tocar "Otro" se abre un aviso sobre la pantalla oscurecida con el título "¿Cuántos pulsos arriesgás?", un campo numérico con foco automático y teclado numérico, la ayuda "Podés arriesgar hasta N pulsos" (N = el menor entre los pulsos disponibles y el tope de 10) y los botones **Guardar** y **Cancelar**. Un valor mayor al máximo se ajusta solo al máximo, sin rojo ni reproche. Tocar fuera del aviso equivale a **Cancelar**. Al guardar, la píldora "Otro" muestra el número ingresado como elegida y la celda "Si acertás" se recalcula; si queda vacío o en 0, la píldora vuelve a decir "Otro" y queda elegido el 0.

   La tarjeta "Acertar al menos X de las 7" desplegada sigue `Al menos X expanded.png`, salvo que el selector de X muestra solo 4, 5, 6 y 7 (la imagen muestra del 1 al 7; del 1 al 3 no son válidos). Orden: la etiqueta "ELEGÍ CUÁNTAS PREGUNTAS VAS A ACERTAR" con las píldoras 4, 5, 6 y 7 (X por defecto: 4; el 6 elegido en la imagen es de ejemplo); la etiqueta "ELEGÍ CUÁNTOS PULSOS ARRIESGÁS" con las píldoras de monto; la celda "Si acertás" con el formato "SI ACERTÁS 6 · (×4)", "+15 pulsos" y "Cobrás 20 total"; y el botón **Guardar**. El botón **Jugar la sesión** confirma las apuestas de tema, reserva lo arriesgado de la bolsa y arranca las preguntas.
5. **Pregunta** (`Pregunta/Elegida.png`). Chip "Pregunta 3 de 7", botón cerrar, 7 segmentos de progreso y barra de tiempo con la cifra. Tema en etiqueta, enunciado y 4 opciones (A–D); la elegida dice "Elegida". "Elegí cuántos pulsos arriesgás": 0, 1, 5, 10 y "Otro" (monto libre, hasta el tope de 10 o los pulsos disponibles, lo que sea menor; la referencia dice "Libre", no copiarlo), con las celdas "Si acertás +5" y "Si errás -5" (la referencia dice "Si errás o vence"; no copiarlo). El monto arranca en 0 en cada pregunta; con 0, las dos celdas dicen "0 pulsos" en gris. Botón **Responder**, deshabilitado hasta elegir una opción y otra vez al llegar el tiempo a 0. El botón cerrar abre un aviso (el mismo que el de "Otro") con el título "¿Salir de la sesión?", el texto "Podés volver mientras la sesión siga abierta. El tiempo de esta pregunta sigue corriendo." y los botones **Salir** y **Seguir jugando**. Al retomar, ver "Conexión cortada o app cerrada a mitad de sesión" en Casos borde.
6. **Pregunta respondida** (`Pregunta/Respondida.png`). Se congela el tiempo (con el tono que tenía: si quedaban 5 segundos o menos, sigue en coral), las otras opciones se atenúan y la correcta dice "Correcta". Una tarjeta muestra el resultado ("Acertaste", "+5 pulsos"; si el monto era 0, "Acertaste" con "0 pulsos" en gris) y la explicación. Botón **Siguiente pregunta**.

   Los estados de error y de tiempo vencido se arman igual, con las mismas opciones y la misma tarjeta de resultado; están definidos en texto pero todavía no tienen imagen de referencia:
   - **Respuesta incorrecta:** la opción elegida pasa a "Incorrecta" (fondo coral suave, cruz y la palabra "Incorrecta"), la correcta dice "Correcta" y las otras dos se atenúan. La tarjeta dice "No era esa" con el movimiento "-5 pulsos" en rojo (si el monto era 0, "0 pulsos" en gris) y debajo la explicación. El tiempo queda congelado en el segundo en que respondió.
   - **Tiempo vencido:** la correcta dice "Correcta" y las otras tres se atenúan; ninguna se muestra como elegida, porque no se envió nada. La tarjeta dice "Se terminó el tiempo" con el movimiento "0 pulsos" en gris y debajo "Cuenta como error, no perdiste pulsos." seguido de la explicación. El temporizador queda en 0: la barra vacía y la cifra "0" en rojo (`danger-text`).
   - En los dos, botón **Siguiente pregunta**.
7. **Fin de partida** (`Fin de partida/Gana.png`). Aparece cuando la partida se resuelve, no al terminar la propia sesión del día 5 (ver "Aura, emblemas y cards"). Chip "Partida terminada", título de la partida, "Quedaste 2º de 4 jugadores", aro grande del contador general con el Aura, marca del punto de partida, "22 de 25 pulsos para tu 2ª aura", bloque "Ganaste +6" y botón **Continuar**.

**Faltan en las referencias** (definir antes de cerrar el flujo): el resumen del día después de la 7ª pregunta, el contenido de la pestaña *Historial*, el emblema en el encabezado y el premio y los logros en el fin de partida.

## Arquitectura

[embedded content: arquitectura · app, servidor y datos]

La app no calcula nada que afecte Pulsos: envía respuestas y apuestas, y el servidor valida el tiempo, resuelve las apuestas, y registra cada movimiento en un libro de Pulsos. Las vistas previas ("Si acertás", total a cobrar, chip de pulsos disponibles, máximo de "Otro", el doble por pregunta) sí las calcula la app, con el mismo módulo de reglas puras que usa el servidor para los pagos reales y con los valores que entrega el servidor (multiplicadores, factor, bolsa disponible y reservas). Esas vistas previas no mueven Pulsos: el servidor siempre recalcula y rechaza montos inválidos.

- **Stack:** Expo (React Native) con TypeScript; Supabase para base de datos Postgres, autenticación, funciones del servidor y tareas programadas; notificaciones push de Expo. Para probar se distribuye con Expo Go o TestFlight.
- **Acceso:** email con código de 6 dígitos (OTP de Supabase), sin link mágico, más un apodo visible.
- **Datos principales:** usuarios, partidas, jugadores de la partida, días con su tema, banco de preguntas (tema, texto, opciones, respuesta correcta, explicación, fuente), preguntas vistas por usuario, sesiones, apuestas y libro de movimientos de Pulsos.
- **Reglas configurables:** duración, cantidad de preguntas, Pulsos iniciales, costo de entrada, multiplicadores de "al menos X", factor de "ganar la sesión" (0,9), premio mayor, cortes de emblemas, tiempo por pregunta, espera de quiebra, ritmo de las sesiones y umbral de alerta del banco de preguntas viven en configuración, no en el código.
- **Motor de reglas:** pagos y ranking como funciones puras con pruebas automáticas, en un módulo compartido entre el servidor (pagos reales) y la app (vistas previas).
- **Pensado para crecer:** el competidor de una partida se modela como "participante", para que a futuro pueda ser un usuario o un equipo sin rehacer la base.

**Generación de preguntas** (fuera de la app)

1. Un script local (CLI) recibe documentos o recursos de un tema: PDF, links o texto.
2. Llama a la API de Claude y genera un JSON con pregunta, 4 opciones, respuesta correcta, explicación y fuente.
3. Revisión humana del 100% en un archivo, marcando las aprobadas.
4. Un segundo comando carga en Supabase solo las aprobadas.
5. Cuando un tema baja de un umbral de preguntas disponibles (configurable), el administrador recibe una alerta.

## Casos borde y manejo de fallas

- **Sesión vencida:** cero aciertos ese día, sin apuestas; la bolsa no se toca.
- **Conexión cortada o app cerrada a mitad de sesión:** podés retomar la sesión dentro de la ventana de 24 horas. Lo respondido cuenta. La pregunta que estaba en pantalla mantiene su cronómetro de servidor: si volvés tarde, cuenta como vencida, es decir, error con 0 Pulsos; un monto elegido sin tocar "Responder" nunca llegó al servidor y no se pierde. Una respuesta enviada con "Responder" que llega al servidor después de los 22 segundos también cuenta como error con 0 Pulsos. Las preguntas que todavía no se mostraron te esperan. Al retomar vas directo, sin pantalla intermedia, a la pregunta que estaba en pantalla si todavía tiene tiempo, o a la siguiente pendiente; si la que dejaste venció, primero la ves en el estado de tiempo vencido y después seguís. Si no retomás la sesión, al cerrar la ventana las que falten cuentan como error sin apuesta y se resuelve "al menos X". El botón cerrar de la pregunta abre un aviso de confirmación antes de salir (ver "Primer flujo a desarrollar").
- **Falla de conexión o carga:** mientras carga, la app muestra bloques grises con la forma del contenido, sin spinner ni cifras viejas; un botón que espera al servidor queda deshabilitado (gris, sin labio) con el mismo rótulo. Si falla, un bloque gris donde iría el contenido (o encima del botón que falló) dice "No pudimos conectarnos. Revisá tu conexión y probá de nuevo." con **Reintentar**, sin rojo. En **Responder** y **Jugar la sesión** la app reintenta sola 2 veces antes de mostrar el bloque.
- **Ventana que cierra con la pantalla abierta:** en el inicio y el detalle, la card y la pantalla se actualizan solas (chip "Cerrada", **Ver ranking**). En la pantalla del tema antes de confirmar, **Jugar la sesión** se rechaza con "Esta sesión ya cerró. No se movieron pulsos." y **Volver a la partida**. En medio de las preguntas, las que faltan cuentan como error sin Pulsos y se ve "La sesión cerró. Las preguntas que faltaban cuentan como error, sin pulsos." con **Volver a la partida**.
- **Pulsos disponibles en 0 con reservas de tema:** seguís jugando la sesión con monto 0; los aciertos cuentan para "al menos X" y "ganar la sesión". No es expulsión.
- **Expulsión:** se evalúa sobre la bolsa total una vez resueltas las reservas; fuera de esa partida con el resultado congelado; las otras partidas siguen y no hay bloqueo. Si la bolsa llega a 0 después de tu sesión, te enterás la próxima vez que abrís esa partida o por notificación push.
- **Queda un solo jugador en pie:** la partida termina y gana sin el premio de 150, aunque pase al resolverse el día 5. Si no queda ninguno en pie (los últimos quedan expulsados en la misma resolución), tampoco hay premio. Esto evita que dos jugadores fabriquen Pulsos dejándose expulsar a propósito.
- **Quiebra total:** 48 h de espera y reposición de 50 Pulsos.
- **Empates:** en el ranking, los empatados comparten el puesto (1º, 2º, 2º, 4º); el premio mayor se divide entre los empatados en el primer puesto; "ganar la sesión" se desempata por menor tiempo total (una pregunta vencida, tardía o no mostrada suma 20 segundos) y, si persiste el empate, ganan todos los empatados con pago completo.
- **"Ganar la sesión" con menos de 2 jugadores en la sesión:** se devuelve lo apostado.
- **Preguntas:** sin repeticiones para ningún jugador entre partidas; opciones en orden aleatorio; la respuesta correcta nunca llega a la app antes de contestar.
- **Banco de preguntas agotado en un tema:** el servidor sortea el tema del día solo entre los temas con al menos 7 preguntas no vistas por ningún jugador de la partida, sin que el jugador lo note. El administrador recibe una alerta cuando un tema baja del umbral configurado.
- **Hora de apertura:** una hora fija por partida con ventana de 24 horas, para evitar problemas de zona horaria.
- **Trampa:** en el MVP se mitiga con cronómetro de servidor y tiempo corto por pregunta; googlear no se puede impedir del todo.

## Pruebas y métricas

**Pruebas técnicas**

- **Motor de pagos y ranking:** funciones puras con pruebas automáticas de casos concretos, porque es donde un error rompe la economía.
- **Simulación de la economía:** antes de dar la app a nadie, correr miles de partidas simuladas con jugadores de precisión 30%, 60% y 90% para confirmar que adivinar pierde, que el experto gana, que no hay estrategias rotas y cuánto se inflan los temas fáciles con multiplicadores fijos.
- **Modo rápido (solo para pruebas):** una configuración que solo activa el administrador. Las 5 sesiones se juegan seguidas: apenas termina una sesión de 7 preguntas, se revela el tema de la siguiente. El tema de cada día sigue siendo el mismo para todos los jugadores, y "ganar la sesión" se resuelve cuando todos la terminaron. Como no hay hora de apertura por sesión, el multiplicador de "ganar la sesión" de cada sesión queda fijo (contando los jugadores en pie) cuando el primer jugador de la partida empieza esa sesión, y es el mismo para todos; una expulsión que todavía no se resolvió en ese momento solo cuenta desde la sesión siguiente.

**Prueba con gente real**

- 8 a 12 amigos en modo rápido, y después una partida real de 5 días.
- **Qué medir:** cuántos vuelven cada día, qué porcentaje apuesta, si la confianza se corresponde con los aciertos, cuántos son expulsados, cuántos llegan a la quiebra total y si entienden las reglas sin explicación.

## Fuera del MVP e ideas futuras

| Idea | Estado | Detalle |
| --- | --- | --- |
| Apuesta "ganar la partida" | Próxima versión | Pago según el día en que se apuesta y la cantidad de jugadores, resuelta el día 5. |
| Costo de entrada variable | Próxima versión | Que quien crea la partida elija cuántos Pulsos cuesta entrar. |
| Multiplicadores por tema | Próxima versión | Calcular "al menos X" con el promedio real de cada tema si la simulación muestra inflación. |
| Tema a elección del jugador | Próxima versión | Era el motor original del ego; se desarrolla después de validar el modo de tema al azar. Posible variante: un veto o cambio por partida. |
| Modo "cada jugador elige su especialidad" | V2 | Con tres jugadores hay tres temas, todos responden los tres y gana el mejor promedio general. Hay que normalizar la dificultad de cada tema. |
| Modo equipos | V2 | Invitar a un amigo experto en un tema para formar equipo y competir contra otro. Modelar al competidor como "participante" (usuario o equipo) desde la base. |
| Modo en vivo | V2 | Todos conectados a la vez, como segunda capa sobre la partida asincrónica. |
| Preguntas con IA para temas de nicho | V2 | Con sello de "verificado" o "beta" y reportes de usuarios; el catálogo curado cubre los temas principales. |
| Perfil de maestría y de calibración | V2 | Nivel de experto por tema y qué tan bien te conocés. |
| Repaso de errores y ligas de amigos | V2 | Repetición espaciada de lo que fallaste y ranking semanal entre amigos. |
| Modelos de negocio | Parking lot | Suscripción premium, packs temáticos, cosméticos (títulos, marcos, avatares), B2B y educación. |
| Compra de Pulsos con dinero real | Descartada | Convierte la moneda en dinero, monetiza el peor momento del usuario y arriesga la clasificación en tiendas y la regulación. |

## Riesgos y decisiones pendientes

**Riesgos**

- **Presión compulsiva:** la mecánica de riesgo es deliberadamente la de un casino. Mitigación: sin estética de casino, sin dinero real, una sola partida al inicio, reflexión tras la expulsión y logros no monetarios.
- **Mensaje sobre apuestas:** no prometer que la app "cura" adicciones. Las apuestas simuladas pueden normalizar el hábito en menores; la moneda no se compra ni se canjea.
- **Calidad de las preguntas:** es el producto. Revisión humana del 100%.
- **Banco de preguntas:** sin repeticiones entre partidas, el banco se consume rápido. Meta inicial: 8 temas con unas 60 preguntas cada uno.
- **Abandono de quien queda atrás:** con premio solo para el 1° y emblemas que bajan, se necesitan logros y resultados parciales que sostengan el interés.
- **Inflación:** los premios y los multiplicadores de "al menos X" crean Pulsos. "Ganar la sesión" retira en promedio un 10% (factor 0,9), pero un jugador que gana seguido crea Pulsos igual. Ya no hay comisión de pozo. La simulación (Nov 21, 2026, 10.000 partidas con jugadores de 30/60/90%) mostró inflación exponencial sin topes: unos 9.500 Pulsos creados por partida y +4.700 netos para el jugador de 90%. Con topes de 10 por pregunta y 10 por tarjeta baja a unos 1.100 por partida (+580 para el de 90%, unas 23 Aura); lo que queda viene sobre todo del ×2 por pregunta, que da ganancia esperada a quien acierta más del 50%. Revisar los cortes de emblemas con datos de la prueba con amigos. A futuro se necesitan lugares donde gastarlos.
- **Acuerdos entre amigos en "ganar la sesión":** con pago fijo, un jugador puede responder mal a propósito para que otro cobre el multiplicador. Se mitiga con el factor 0,9, devolviendo lo apostado si juegan menos de 2, y midiéndolo en la prueba con amigos.
- **Bola de nieve:** quien gana temprano apuesta más fuerte después y el ranking ya no tiene tope. Validar en la simulación.
- **Ranking solo por Pulsos:** un jugador con muchos aciertos que no apuesta pierde contra uno con suerte. Es una decisión consciente: apostar bien se basa en saber.

**Decisiones resueltas (Nov 13, 2026)**

- [x] Partida de 2 con un expulsado: el otro gana automáticamente, sin el premio de 150.
- [x] Límite por pregunta: 20 segundos (22 en servidor).
- [x] Hora de apertura: la elige quien crea la partida. Modo rápido: sesiones seguidas.
- [x] Banco de preguntas: generación asistida desde documentos con revisión humana del 100%.
- [x] Acceso: email con código OTP más apodo.
- [x] Apuesta máxima por pregunta (Nov 21, 2026): 10 Pulsos, configurable, sin superar la bolsa disponible. Reemplaza "toda la bolsa disponible": la simulación mostró que, sin tope, los montos se componen y cada partida crea unos 9.500 Pulsos.
- [x] Apuesta máxima por tarjeta de tema (Nov 21, 2026): 10 Pulsos por tarjeta, configurable.
- [x] Unidad de cuenta: Pulsos, con 1 Aura = 25 Pulsos.
- [x] "Ganar la sesión" (Nov 17, 2026): multiplicador fijo de 0,9 × jugadores en pie en lugar del pozo común, para que cada uno sepa cuánto cobra sin depender de lo que arriesgan los demás.
- [x] Apuestas de tema (Nov 17, 2026): lo arriesgado se reserva de la bolsa al tocar "Jugar la sesión"; los pulsos disponibles y el máximo por pregunta descuentan esa reserva.
- [x] Monto por pregunta (Nov 17, 2026): arranca en 0; "Responder" se habilita al elegir opción; si vence el tiempo sin tocar "Responder", cuenta como error con 0 Pulsos (el monto elegido no llegó al servidor). Lo mismo si se cierra la app con monto elegido sin enviar.
- [x] "Al menos X de las 7" (Nov 17, 2026): X solo puede ser 4, 5, 6 o 7.
- [x] Fin de partida (Nov 17, 2026): aparece cuando la partida se resuelve, no al terminar la propia sesión del día 5.
- [x] Empates en el ranking (Nov 17, 2026): puesto compartido (1º, 2º, 2º, 4º).
- [x] Card compacta (Nov 17, 2026): muestra los aciertos acumulados de la partida.
- [x] Banco de preguntas (Nov 17, 2026): el tema se sortea solo entre temas con al menos 7 preguntas no vistas; alerta al administrador por umbral configurable.
- [x] Sesión interrumpida (Nov 17, 2026): se retoma dentro de la ventana; la pregunta en pantalla mantiene su cronómetro. Si no se retoma, "al menos X" se resuelve al cerrar la ventana.
- [x] Disponibles en 0 con reservas (Nov 17, 2026): se sigue jugando con monto 0 y los aciertos cuentan para las apuestas de tema. La expulsión se evalúa sobre la bolsa total una vez resueltas las reservas; si ocurre después de la sesión, la hoja aparece al abrir la partida o por push.
- [x] Respuesta tardía (Nov 17, 2026): una respuesta enviada con "Responder" que llega al servidor después de los 22 segundos cuenta como error con 0 Pulsos, igual que el tiempo vencido. El margen de 2 segundos absorbe la latencia; una mala conexión no cuesta Pulsos.
- [x] Multiplicador de "ganar la sesión" (Nov 17, 2026): queda fijo a la hora de apertura del día y es el mismo para todos; los jugadores en pie se cuentan en ese momento. Una expulsión posterior ese mismo día no lo cambia y cuenta desde el día siguiente. Se paga el multiplicador que el jugador vio antes de confirmar.
- [x] Redondeo de "al menos X de las 7" (Nov 17, 2026): hacia abajo, igual que "ganar la sesión"; un solo criterio de redondeo en el motor de pagos (5 × 1,3 = 6,5 → 6).
- [x] Multiplicador de "ganar la sesión" en modo rápido (Nov 17, 2026): queda fijo cuando el primer jugador de la partida empieza esa sesión y es el mismo para todos; una expulsión sin resolver en ese momento cuenta desde la sesión siguiente.
- [x] Elección de X (Nov 17, 2026): dentro de la tarjeta "Acertar al menos X de las 7" desplegada, según `Topic Reel/Al menos X expanded.png`, con píldoras 4, 5, 6 y 7; X por defecto 4.
- [x] Textos de las tarjetas de tema (Nov 17, 2026): "Acertar al menos X de las 7" / "Elegí cuántas preguntas creés que vas a acertar del tema de hoy." y "Ganar la sesión" / "Acertá más que el resto hoy. Paga ×5,4 con 6 jugadores." (multiplicador y jugadores dinámicos).
- [x] Píldora de monto libre (Nov 17, 2026): se llama "Otro" en las tarjetas de tema y en la pregunta.
- [x] Chip de pulsos disponibles en el tema (Nov 17, 2026): baja al guardar una tarjeta con monto y se recalcula al cambiarlo o pasarlo a 0; la reserva real sigue siendo al tocar "Jugar la sesión". No hay resumen aparte del total arriesgado.
- [x] Monto "Otro" (Nov 17, 2026): se ingresa en un aviso sobre la pantalla oscurecida ("¿Cuántos pulsos arriesgás?", campo numérico, "Podés arriesgar hasta N pulsos", Guardar y Cancelar). Lo que supera el máximo se ajusta solo; vacío o 0 vuelve a "Otro" con 0 elegido.
- [x] Salir de la sesión (Nov 17, 2026): el botón cerrar abre el mismo aviso ("¿Salir de la sesión?", Salir y Seguir jugando). Al retomar se va directo a la pregunta en pantalla si tiene tiempo o a la siguiente pendiente; si venció, primero se ve en estado de tiempo vencido.
- [x] Estados de error y tiempo vencido (Nov 17, 2026): "No era esa" con "-5 pulsos" (o "0 pulsos") y "Se terminó el tiempo" con "0 pulsos" y "Cuenta como error, no perdiste pulsos."; definidos en texto, sin imagen de referencia.
- [x] Carga y error (Nov 17, 2026): esqueletos grises sin spinner; error en un bloque gris con "No pudimos conectarnos. Revisá tu conexión y probá de nuevo." y **Reintentar** (`neutral`), sin rojo; **Responder** y **Jugar la sesión** reintentan solos 2 veces.
- [x] Vistas previas (Nov 17, 2026): la app las calcula con el mismo módulo de reglas puras que el servidor; no mueven Pulsos y el servidor siempre recalcula y rechaza montos inválidos.
- [x] Monto 0 (Nov 17, 2026): en la pregunta, las dos celdas dicen "0 pulsos" en gris; en la tarjeta de tema, la celda "Si acertás" se oculta; el resultado mantiene su título con "0 pulsos" en gris. Nunca "+0" ni rojo.
- [x] Temporizador (Nov 17, 2026): en 0, barra vacía y "0" en rojo (tono urgente del temporizador; "sin rojo en el cero" aplica a los montos de pulsos); congelado con 5 segundos o menos mantiene el coral; de 20 a 22 segundos no cambia nada en pantalla y **Responder** queda deshabilitado.
- [x] Píldoras por encima de lo disponible (Nov 17, 2026): deshabilitadas; "Otro" cubre cualquier monto hasta el máximo.
- [x] Ventana que cierra con la pantalla abierta (Nov 17, 2026): ver "Casos borde y manejo de fallas".
- [x] Ayuda de la confianza (Nov 17, 2026): botón "?" que abre "¿Cómo funciona la confianza?" con tres líneas y **Entendido**.
- [x] Textos de neto (Nov 17, 2026): "+12 pulsos ganados", "-8 pulsos perdidos", "sin cambios", también en "Tu puesto"; singular con 1 ("1 pulso").
- [x] Rueda del tema (Nov 17, 2026): no vibra al frenar; la vibración es solo del cierre de aura.
- [x] Varias partidas por jugar (Nov 17, 2026): cada card lleva su propio **Jugar** principal.
- [x] Botón volver del detalle (Nov 17, 2026): el mismo botón cuadrado que el cerrar de la pregunta.

**Decisiones pendientes**

- [ ] Ajustar los números de la economía (multiplicadores, factor de "ganar la sesión", premio, cortes de emblemas) después de la simulación y la prueba con amigos.
- [ ] Diseño visual de cada emblema.
- [ ] Textos de la reflexión tras la expulsión.
- [ ] Qué temas forman el banco inicial de 8.
- [ ] Pantallas que faltan en las referencias del primer flujo (ver "Primer flujo a desarrollar").
- [ ] Si el factor de "ganar la sesión" alcanza para frenar la inflación sin comisión de pozo (medir en la simulación).
