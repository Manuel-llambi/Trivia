# PRD: Jugar una partida activa (Trivia confianza, MVP)

Etiqueta propuesta: `needs-info` (quedan preguntas abiertas bloqueantes: pantallas del flujo sin referencia).

## Fuente

Carpeta del proyecto "Trivia confianza", alineada el 17 de noviembre de 2026. Este PRD se construyó con tres fuentes, en este orden de prioridad:

1. **Referencias-y-definiciones/**: pantallas de `Pantalla-UI/` (Dashboard, Match Detail, Topic Reel, Pregunta, Fin de partida), `cierre_light.png` y las animaciones de `Animaciones/`. Mandan sobre el detalle visual y los textos de pantalla; los errores de tipeo se corrigen según "Voz y contenido" del sistema de diseño.
2. **App de trivia: diseño del MVP** (actualizado el 17 de noviembre de 2026): reglas de partida, economía de Pulsos, ganador y premios, flujo, la sección "Primer flujo a desarrollar: jugar una partida activa", arquitectura, casos borde y las decisiones resueltas ese día.
3. **Trivia DS Suave** (`Trivia_DS_completo.md`): componentes, tokens y voz.

También es consistente con `docs/02-historias/historias.md` (secciones "Decisiones tomadas (17/11/2026)" y "Preguntas para PO") y con la sección "Resoluciones (17/11/2026)" de `docs/03-component-maps/_consistency-report.md`.

Es un documento derivado: si contradice el documento del MVP, manda el MVP.

## Planteamiento del problema

Las apuestas en línea y los juegos de azar llegan cada vez más a los jóvenes y explotan un deseo concreto: la tensión de arriesgar, la expectativa del resultado y la recompensa de ganar. En esos productos el resultado depende del azar, el dinero es real y la estética (luces, destellos, sonidos) empuja a seguir jugando. Cuando se pierde, la consecuencia llega tarde y sin una lectura clara de lo que pasó.

A la vez, quien busca un pasatiempo corto termina en el doomscrolling: no tiene final, no deja aprendizaje y no da una forma de demostrar cuánto sabe ni de competir con sus amigos.

## Solución

Una trivia móvil que simula el mismo deseo del riesgo, pero con una moneda ficticia, los **Pulsos**, que no se compra ni se canjea, y donde ganar depende de **cuánto confiás en tu conocimiento**, no del azar. El jugador pone confianza sobre lo que sabe: primero al ver el tema del día y después en cada pregunta. Adivinar pierde en promedio la mitad de lo arriesgado y el ranking premia a quien sabe y se anima a respaldarlo.

La consecuencia de arriesgar de más es real dentro del juego (la bolsa baja, el Aura y el emblema bajan, la expulsión existe), pero se muestra con claridad y sin culpa, y sin la estética de un casino. En pantalla se dice "confianza", "arriesgar" y "pulsos", nunca "apostar" ni "monedas".

Esta feature cubre el primer flujo a desarrollar: el jugador entra a una partida existente en la que le toca jugar, descubre el tema, pone confianza en el tema, juega la sesión de 7 preguntas arriesgando en cada una, ve el resumen del día y, cuando la partida se resuelve, ve la pantalla de fin de partida.

## Historias de usuario

**Entrar a la partida**

1. Como jugador, quiero ver en el inicio un encabezado con mi avatar, "Hola de nuevo", mi nombre y mi contador de Aura ("1 · 16/25") con mi emblema, para ubicarme.
2. Como jugador, quiero que el contador cuente solo mis pulsos libres (no lo comprometido en bolsas), para leer mi saldo real.
3. Como jugador, quiero ver arriba la card de la partida en la que me toca jugar, con el chip "Vence en HH:MM:SS", "Día 3 de 5", el título, los jugadores, mi bolsa en número grande, mis pulsos ganados o perdidos con signo y color, mi posición ("Vas 2º") y el botón **Jugar**, para decidir entrar sin abrir nada más.
4. Como jugador expulsado, quiero que la card muestre 0, "sin pulsos", "Quedaste 4º", el chip gris "Fuera de la partida" y el botón **Ver ranking**, sin rojo.
5. Como jugador, quiero filtrar el inicio con las pestañas *Te toca*, *Jugadas* y *Todas*, y ver en "Partidas completadas hoy" las cards compactas ("Jugada hoy", "Vas 2º · 11 aciertos · Abre mañana 00:00") con los aciertos acumulados de la partida y la apertura en mi hora local.
6. Como jugador, quiero que **Jugar** me lleve al detalle de la partida, con el chip del día, el título y "6 jugadores · Cierra en 6 h", para saber cuánto tiempo me queda.
7. Como jugador, quiero ver mi puesto ("Tu puesto 3º") con los pulsos ganados, para saber cómo llego a la sesión.
8. Como jugador, quiero ver las posiciones actuales con puesto, avatar, nombre, aciertos de la partida y pulsos en la bolsa, con el 1º destacado y mi fila marcada como "Vos", para compararme con el grupo.
9. Como jugador, quiero que los empatados compartan el puesto (1º, 2º, 2º, 4º), para que el ranking sea justo.
10. Como jugador, quiero que quien no jugó aparezca atenuado con el motivo ("No jugó 2 días"), para entender por qué está atrás.
11. Como jugador, quiero ver la pestaña *Historial* del detalle, para revisar los días anteriores (contenido pendiente).
12. Como jugador, quiero el botón **Jugar la sesión** solo si me toca jugar y la ventana está abierta, para empezar el día.

**Descubrir el tema**

13. Como jugador, quiero ver "Descubrí el tema de hoy", "Un solo tema al azar para todos los jugadores de la partida." y la ventana con "Tema de hoy", para confiar en que la competencia es pareja.
14. Como jugador, quiero tocar **Descubrir tema** y ver el carrete girar y frenar en el tema, sin vibración, para que la revelación tenga intriga sin parecer un juego de azar.
15. Como jugador, quiero que el tema revelado sea el que el servidor ya definió, y que al volver a la pantalla se vea sin volver a girar, para que nadie pueda girar hasta que le toque uno que le convenga.

**Poner confianza en el tema (momento 1)**

16. Como jugador, quiero ver "¿Confiás en tu conocimiento?" con un botón de ayuda "?" que abre "¿Cómo funciona la confianza?" (tres líneas sobre "Ganar la sesión", "Acertar al menos X de las 7" y la reserva al tocar **Jugar la sesión**, con **Entendido**), la bajada "Arriesgá pulsos para ganar más, todo depende de qué tanto confiás en tu conocimiento", el chip "N pulsos disponibles" y "¿Cómo querés arriesgar?", para saber con cuánto cuento.
17. Como jugador, quiero desplegar la tarjeta **Ganar la sesión** ("Acertá más que el resto hoy. Paga ×5,4 con 6 jugadores.", con el multiplicador y la cantidad de jugadores dinámicos), para saber cuánto cobro antes de confirmar.
18. Como jugador, quiero que el multiplicador quede fijo a la hora de apertura del día, sea el mismo para todos y sea el que se paga, para que lo que cobro no dependa de lo que arriesgan los demás.
19. Como jugador, quiero desplegar la tarjeta **Acertar al menos X de las 7** ("Elegí cuántas preguntas creés que vas a acertar del tema de hoy.") y elegir X con las píldoras 4, 5, 6 y 7 bajo "ELEGÍ CUÁNTAS PREGUNTAS VAS A ACERTAR" (4 por defecto), para respaldar cuántas creo que voy a acertar (`Topic Reel/Al menos X expanded.png`, salvo que la imagen muestra del 1 al 7).
20. Como jugador, quiero elegir el monto de cada tarjeta entre 0, 1, 5, 10 u "Otro", sin que la suma de las dos supere mi bolsa, para ajustar el riesgo. "Otro" (igual en la pregunta) abre un aviso sobre la pantalla oscurecida con "¿Cuántos pulsos arriesgás?", un campo numérico con foco automático y teclado numérico, "Podés arriesgar hasta N pulsos", **Guardar** y **Cancelar** (tocar fuera = Cancelar); un valor mayor al máximo se ajusta solo, sin rojo ni reproche; al guardar, la píldora muestra el número como elegida y la celda "Si acertás" se recalcula; vacío o 0 vuelve a "Otro" con el 0 elegido.
21. Como jugador, quiero ver la ganancia y el total exactos ("Si acertás +22 pulsos · Cobrás 27 total"; en "al menos X", "SI ACERTÁS 6 · (×4)", "+15 pulsos", "Cobrás 20 total"), redondeados hacia abajo, para decidir con información.
22. Como jugador, quiero tocar **Guardar** y que la tarjeta se cierre mostrando el monto en su chip ("Sin pulsos" por defecto), con una sola tarjeta abierta a la vez.
23. Como jugador, quiero que el chip de pulsos disponibles baje apenas guardo una tarjeta con monto (de 62 a 57 al guardar 5 en "Ganar la sesión") y se recalcule si cambio el monto o lo paso a 0, para ver lo que me queda sin una línea aparte con el total; la reserva real ocurre al tocar **Jugar la sesión**.
24. Como jugador, quiero que poner confianza sea opcional, para poder jugar solo por los aciertos.
25. Como jugador, quiero que **Jugar la sesión** confirme y reserve de mi bolsa lo arriesgado en el tema y arranque las preguntas, sin poder cambiarlo después, para que las reglas sean claras.

**Jugar las 7 preguntas (momento 2)**

26. Como jugador, quiero ver el chip "Pregunta 3 de 7", el botón cerrar, 7 segmentos de progreso y la barra de tiempo con la cifra, para saber dónde estoy y cuánto me queda.
27. Como jugador, quiero tener 20 segundos por pregunta, contados por el servidor desde que me entrega la pregunta, con la barra en coral cuando quedan 5 o menos.
28. Como jugador, quiero ver el tema en una etiqueta, el enunciado y 4 opciones (A–D) en orden aleatorio, y que la elegida diga "Elegida".
29. Como jugador, quiero elegir cuántos pulsos arriesgo ("Elegí cuántos pulsos arriesgás": 0, 1, 5, 10 u "Otro" hasta mis pulsos disponibles, es decir, la bolsa menos lo reservado en el tema), con el monto en 0 al empezar cada pregunta.
30. Como jugador, quiero ver antes de responder "Si acertás +5 pulsos" y "Si errás -5 pulsos" con signo y color (con monto 0, las dos dicen "0 pulsos" en `text-muted`), para conocer la consecuencia.
31. Como jugador, quiero que **Responder** esté deshabilitado hasta elegir una opción y que, al tocarlo, envíe la opción y el monto.
32. Como jugador, quiero recibir el doble de lo puesto si acierto, o perderlo si erro con un monto enviado a tiempo.
33. Como jugador al que se le venció el tiempo sin tocar **Responder**, quiero que cuente como error con 0 pulsos, porque el monto elegido nunca llegó al servidor.
34. Como jugador con mala conexión, quiero que una respuesta que llega al servidor después de los 22 segundos cuente como error con 0 pulsos, para que la conexión no me cueste pulsos.
35. Como jugador que respondió, quiero que el tiempo se congele, las otras opciones se atenúen y la correcta diga "Correcta", para ver el resultado sin ambigüedad.
36. Como jugador que acertó, quiero una tarjeta con "Acertaste", "+5 pulsos" y la explicación, para aprender algo en cada pregunta.
37. Como jugador que erró, quiero ver mi opción marcada como "Incorrecta" (coral suave con cruz), la correcta con "Correcta", las otras dos atenuadas, el tiempo congelado en el segundo en que respondí y una tarjeta "No era esa" con "-5 pulsos" en `danger-text` (o "0 pulsos" en `text-muted` si no arriesgué) y la explicación; y si se me venció el tiempo, la correcta con "Correcta", las otras tres atenuadas sin ninguna elegida, el temporizador en 0 (barra vacía y la cifra "0" en `danger-text`) y una tarjeta "Se terminó el tiempo" con "0 pulsos" en `text-muted`, "Cuenta como error, no perdiste pulsos." y la explicación, para entender qué pasó sin sentir culpa. Los dos estados están definidos en texto, sin imagen de referencia.
38. Como jugador, quiero el botón **Siguiente pregunta**, para avanzar a mi ritmo entre preguntas.
39. Como jugador, quiero no ver nunca una pregunta que ya respondí en cualquier partida, para que el juego mida lo que sé y no lo que memoricé.
40. Como jugador con 0 pulsos disponibles y pulsos reservados en el tema, quiero seguir la sesión con monto 0 y que mis aciertos cuenten para las dos tarjetas del tema, porque no estoy expulsado.
41. Como jugador, quiero que el botón cerrar abra un aviso con "¿Salir de la sesión?", "Podés volver mientras la sesión siga abierta. El tiempo de esta pregunta sigue corriendo." y los botones **Salir** (`coral`) y **Seguir jugando** (`neutral`), para no salir sin querer.
42. Como jugador al que se le cortó la conexión o cerró la app, quiero retomar la sesión dentro de la ventana: lo respondido cuenta, la pregunta en pantalla mantiene su cronómetro de servidor y las no mostradas me esperan; al volver voy directo, sin pantalla intermedia, a la pregunta que estaba en pantalla si todavía tiene tiempo o a la siguiente pendiente, y si la que dejé venció, primero la veo en el estado de tiempo vencido; si no la retomo, al cerrar la ventana las que faltan cuentan como error sin pulsos.

**Cierre de la sesión**

43. Como jugador, quiero ver un resumen al terminar la 7ª pregunta con mis aciertos del día, el resultado de "Al menos X de las 7", los pulsos netos del día, mi bolsa y mi posición, y el resultado de "Ganar la sesión" si ya se resolvió, para cerrar el día.
44. Como jugador, quiero que "al menos X" se resuelva cuando termino mis 7 preguntas (o al cerrar la ventana si no retomé) y que las ganancias se sumen a mi bolsa.
45. Como jugador, quiero que "ganar la sesión" se resuelva cuando todos los jugadores en pie terminaron o al cerrar la ventana, que gane quien más aciertos tenga entre quienes jugaron (hayan arriesgado o no) y que el empate se defina por menor tiempo total.
46. Como jugador que puso confianza en "ganar la sesión", quiero que se me devuelva lo arriesgado si jugaron menos de 2, para no perder por falta de rivales.
47. Como jugador que terminó su día 5, quiero que el resumen me avise que los resultados finales salen cuando todos terminen.
48. Como jugador cuya bolsa total llegó a 0, quiero una hoja que me diga qué pasó ("Te quedaste sin Pulsos en esta partida"), qué sigue y un momento de reflexión con datos concretos ("Arriesgaste el 80% de tu bolsa en 3 preguntas"): al terminar la pregunta que la vació, o, si pasó después de mi sesión al resolverse "ganar la sesión", la próxima vez que abro la partida o por notificación push.
49. Como jugador, quiero que si la ventana cierra sin que jugué, ese día cuente con 0 aciertos, sin cobrar ni pagar nada y sin tocar mi bolsa.

**Fin de partida**

50. Como jugador, quiero que el fin de partida aparezca cuando la partida se resuelve (el último jugador en pie termina el día 5, cierra la ventana del día 5 o queda uno solo), por notificación push o al abrir la app, y no cuando termino mi propio día 5.
51. Como jugador, quiero ver el chip "Partida terminada", el título de la partida y mi puesto final ("Quedaste 2º de 4 jugadores").
52. Como jugador, quiero ver el aro grande del contador general con mi Aura, la palabra "Aura", una marca en el punto de partida y cuánto me falta para la siguiente ("22 de 25 pulsos para tu 2ª aura").
53. Como jugador, quiero ver lo ganado o perdido en la partida ("Ganaste +6" o "Perdiste -N") con signo y color, y si cambió mi emblema.
54. Como jugador, quiero que, si el aro se completa, el Aura suba con un solo pulso de 600 ms y una vibración suave, una sola vez aunque cruce más de un aura, y que si perdí pulsos baje sin animación ni rojo.
55. Como ganador de una partida que llegó al final del día 5, quiero recibir el premio de 150 Pulsos, dividido si hay empate en el primer puesto, y ver logros no monetarios.
56. Como último jugador en pie, quiero ganar la partida llevándome mi bolsa y lo ganado, sin el premio de 150.
57. Como jugador, quiero que mi bolsa final vuelva completa a mi contador general, sea cual sea su valor.
58. Como jugador, quiero tocar **Continuar** para volver al inicio.

**Modo rápido**

59. Como administrador, quiero activar el modo rápido en una partida para jugar las 5 sesiones seguidas, con el tema de la siguiente revelado apenas termina una, para probar el flujo completo sin esperar.

## Decisiones de implementación

**Autoridad del servidor**

- La app no calcula nada que afecte Pulsos: envía respuestas y montos, y muestra lo que devuelve el servidor. Las vistas previas ("Si acertás", total a cobrar, chip de disponibles, máximo de "Otro", el doble por pregunta) las calcula con el mismo módulo de reglas puras que usa el servidor y con los valores que este entrega; no mueven Pulsos y el servidor siempre recalcula y rechaza montos inválidos.
- Entre los 20 y los 22 s el jugador no ve nada distinto: en 0 "Responder" se deshabilita y la pantalla espera el veredicto, que llega como tiempo vencido; la app nunca deja responder después de 0.
- El servidor define el tema del día (la rueda solo lo revela), controla el cronómetro de cada pregunta (20 s visibles, 22 s aceptados), resuelve las apuestas y registra cada movimiento en el **libro de Pulsos**.
- La respuesta correcta nunca llega a la app antes de responder.
- La bolsa nunca queda en negativo: lo reservado en el tema más el monto de la pregunta en curso nunca superan la bolsa.

**Módulos que toca la feature**

- **Motor de reglas (funciones puras, módulo compartido entre el servidor y la app para las vistas previas):** pago por pregunta (×2; error con monto enviado a tiempo lo pierde; vencido o tardío es error con 0), "al menos X" (X entre 4 y 7, multiplicadores fijos, redondeo hacia abajo), "ganar la sesión" (0,9 × jugadores en pie contados a la hora de apertura, redondeo hacia abajo con el mismo criterio único que "al menos X", desempate por menor tiempo total, devolución si jugaron menos de 2), reservas del tema, expulsión sobre la bolsa total una vez resueltas las reservas, último jugador en pie, premio mayor con división en empate, ranking por Pulsos netos con puesto compartido, Aura y emblemas.
- **Servicio de sesión (servidor):** sorteo del tema solo entre temas con al menos 7 preguntas no vistas por ningún jugador de la partida, armado de las 7 preguntas excluyendo las ya vistas, orden aleatorio de opciones, cronómetro por pregunta desde la entrega, reserva de la confianza del tema al confirmar, recepción de respuestas y montos, retomar una sesión interrumpida y cierre de la ventana.
- **Libro de Pulsos:** cada reserva, apuesta, pago, premio y devolución es un movimiento; la bolsa, los pulsos disponibles, el contador general y el Aura se derivan de ahí.
- **Notificaciones push:** fin de partida y expulsión ocurrida después de la sesión.
- **Configuración:** preguntas por sesión, tiempo por pregunta, multiplicadores de "al menos X", factor de "ganar la sesión", premio mayor, cortes de emblemas, ritmo de las sesiones y umbral de alerta del banco de preguntas viven en configuración, no en el código.
- **Modo rápido (solo administrador):** las 5 sesiones se juegan seguidas; el tema de cada día sigue siendo el mismo para todos y "ganar la sesión" se resuelve cuando todos la terminaron. El multiplicador de "ganar la sesión" de cada sesión queda fijo (contando los jugadores en pie) cuando el primer jugador de la partida empieza esa sesión, igual para todos; una expulsión sin resolver en ese momento cuenta desde la sesión siguiente.

**Valores iniciales (provisorios hasta la simulación)**

Del documento del MVP:

| Umbral "al menos X" | Probabilidad de referencia (tema al 60%) | Pago total |
| --- | --- | --- |
| 4 o más | ~71% | ×1,3 |
| 5 o más | ~42% | ×2 |
| 6 o más | ~16% | ×4 |
| Las 7 | ~3% | ×8 |

| Jugadores en pie | Multiplicador "ganar la sesión" | Con 5 Pulsos recibís |
| --- | --- | --- |
| 2 | ×1,8 | 9 (ganás 4) |
| 4 | ×3,6 | 18 (ganás 13) |
| 6 | ×5,4 | 27 (ganás 22) |
| 8 | ×7,2 | 36 (ganás 31) |

- Bolsa de entrada: 50 Pulsos. 1 Aura = 25 Pulsos (`floor(Pulsos libres / 25)`).
- Premio mayor: 150, solo si la partida llega al final del día 5.
- Emblemas en 5, 10, 20, 50 y 100 Aura.
- Montos de confianza: 0, 1, 5, 10 y "Otro" (monto libre).

**Interacciones y tono**

- Carrete del tema: frena en unos 2,4 a 2,5 s, sin vibración (la vibración es solo de `AuraClose`), una vez por sesión; con movimiento reducido, el tema aparece sin giro.
- Cierre de aura (`AuraClose`): un solo pulso de 600 ms con vibración suave dentro de una secuencia de 1,5 s, que es el único festejo. Bajar de aura no anima ni usa rojo. Respetar el movimiento reducido.
- Fin de partida según `animacion_fin_partida.html`: los tramos se llenan de a uno (ganancia) o se vacían en coral (pérdida) y al final aparece "Continuar".
- Sin confeti, destellos, fichas, luces ni sonidos de tragamonedas. Sin rojo en el cero. Textos sin culpa.
- Ganancias y pérdidas siempre con signo y color (+12 en `brand-text`, -8 en `danger-text`); ningún resultado depende solo del color. Netos: "+12 pulsos ganados", "-8 pulsos perdidos", "sin cambios" (también en "Tu puesto"); singular con 1 ("1 pulso"). El cero es "0 pulsos" en `text-muted`, nunca "+0": con monto 0, las celdas de la pregunta dicen "0 pulsos", la celda "Si acertás" de la tarjeta de tema se oculta y `ResultCard` mantiene su título.
- Temporizador: en 0, barra vacía y "0" en `danger-text`; congelado con 5 s o menos mantiene el tono urgente.
- Píldoras de monto que superan lo disponible: deshabilitadas; "Otro" cubre cualquier monto hasta el máximo.
- Solo cuatro variantes de botón; "Guardar" es `neutral` en las tarjetas de tema (confirmado) y `brand` en el `Overlay`. Cerrar (pregunta) y volver (detalle) usan el mismo botón de ícono cuadrado `neutral`; la ayuda "?" es un botón de ícono `ghost`. En el Inicio, cada card jugable lleva su propio `brand` "Jugar" (excepción explícita a "un color fuerte por pantalla").
- `Overlay` (componente nuevo del DS, detalle visual provisorio): tarjeta `surface` con `radius-lg` y `shadow-float` sobre un velo que oscurece la pantalla. Se usa para decisiones del jugador y ayuda, nunca para errores: el monto "Otro" ("Guardar" `brand`, "Cancelar" `ghost`), la salida de la sesión ("Salir" `coral`, "Seguir jugando" `neutral`) y la ayuda "¿Cómo funciona la confianza?" ("Entendido" `neutral`).
- Carga y error (patrón del DS): esqueletos `surface-2` sin spinner; botón que espera al servidor deshabilitado (`surface-2`, sin labio) con el mismo rótulo; error en un bloque `surface-2` con "No pudimos conectarnos. Revisá tu conexión y probá de nuevo." y `neutral` "Reintentar", sin rojo. "Responder" y "Jugar la sesión" reintentan solos 2 veces.
- Ventana que cierra con la pantalla abierta: Inicio y detalle se actualizan solos (chip "Cerrada", `neutral` "Ver ranking"); en el tema, "Jugar la sesión" se rechaza con "Esta sesión ya cerró. No se movieron pulsos." y "Volver a la partida"; en medio de las preguntas, "La sesión cerró. Las preguntas que faltaban cuentan como error, sin pulsos." y "Volver a la partida".
- Textos de pantalla corregidos según el DS: "¿Confiás en tu conocimiento?", "¿Cómo querés arriesgar?", "Jugar la sesión", "Vas 2º", "Si errás", "Otro". Tarjetas de tema: "Ganar la sesión" / "Acertá más que el resto hoy. Paga ×5,4 con 6 jugadores." y "Acertar al menos X de las 7" / "Elegí cuántas preguntas creés que vas a acertar del tema de hoy.".

## Decisiones de prueba

- **Qué es una buena prueba:** valida comportamiento externo (dado un estado de partida y unas respuestas, tiempos y montos, qué movimientos de Pulsos y qué ranking salen), no detalles internos.
- **Costura única confirmada:** el **motor de reglas como funciones puras**. Cubre pago por pregunta, respuesta vencida y tardía (error con 0), reservas del tema y tope de la bolsa, "al menos X" (redondeo hacia abajo), "ganar la sesión" (multiplicador fijado en la apertura o, en modo rápido, al empezar la sesión el primer jugador, redondeo, desempate, devolución con menos de 2, expulsión posterior el mismo día), seguir con monto 0 con reservas, sesión interrumpida no retomada, expulsión sobre la bolsa total, último jugador en pie, premio con empate, puesto compartido, devolución de la bolsa al contador general, Aura y emblemas.
- **Simulación de la economía:** corre sobre la misma costura, con jugadores de 30%, 60% y 90% de precisión, para confirmar que adivinar pierde, que el experto gana, que no hay estrategias rotas y cuánto se inflan los temas fáciles. Es la prueba de que ganar depende del conocimiento y no del azar.
- **Antecedentes:** no hay código ni pruebas previas en la carpeta.
- **Prueba manual del flujo:** de punta a punta en modo rápido, desde el inicio hasta el fin de partida.

## Preguntas abiertas

**Bloqueantes**

1. **Resumen del día** después de la 7ª pregunta: diseño, textos y a dónde lleva.
2. **Hoja de expulsión con reflexión** y sus textos.
3. **Aviso del resumen del día 5** ("los resultados finales salen cuando todos terminen") y **notificación push del fin de partida**.

**No bloqueantes**

4. Contenido de la pestaña *Historial*.
5. Emblema en el encabezado y diseño visual de cada emblema.
6. Premio y logros en el fin de partida.
7. Estado de sesión vencida: cómo se le informa al jugador.
8. Pestañas "Te toca" y "Jugadas" seleccionadas, y estados vacíos del inicio.
9. Activación e indicación del modo rápido.
10. ¿Cómo se ve la fila de un jugador expulsado en el ranking?

## Fuera de alcance

**Fuera de esta feature (son parte del MVP, pero no de este flujo):**

- Acceso con email, OTP y apodo.
- Crear una partida, invitar por link, elegir la hora de apertura y pagar la entrada.
- Jugar varias partidas en paralelo.
- Quiebra total y reposición tras 48 h.
- Pantallas "Tu aura" y "Perfil", y la barra de navegación.
- CLI de generación de preguntas y alerta del banco de preguntas al administrador.

**Fuera del MVP (según el documento):** tema a elección del jugador, apuesta "ganar la partida", costo de entrada variable, multiplicadores por tema, modos de especialidad, equipos y en vivo, preguntas con IA para nicho, perfil de maestría y calibración, repaso de errores y ligas, y compra de Pulsos con dinero real (descartada).

## Notas adicionales

- **Encuadre sobre apuestas:** el documento del MVP pide no prometer que la app "cura" adicciones y advierte que las apuestas simuladas pueden normalizar el hábito en menores. El planteamiento del problema presenta la app como una alternativa que simula el deseo del riesgo con moneda ficticia y premia el conocimiento, no como un tratamiento. Conviene sostener ese límite en los textos de la app y en la comunicación.
- **Sinónimos:** "expulsado" = "fuera de la partida" = "bolsa total en cero". "Apuesta" es el término interno; en pantalla es "confianza" o "arriesgar". "Ganar la sesión" = "mayor puntaje del día" = más aciertos de la sesión. "Momento 1" = confianza en el tema; "momento 2" = confianza por pregunta. "Pulsos disponibles" = bolsa menos lo reservado en el tema.
- **Ranking por Pulsos netos y filas con bolsa:** el ganador se define por Pulsos netos ganados apostando, pero las filas del detalle muestran los pulsos en la bolsa. Como todos arrancan con una bolsa de 50, el orden es el mismo.
- **Valores provisorios:** todos los números de la economía se ajustan después de la simulación y la prueba con amigos; las cifras de las referencias son ejemplos.
- **Discrepancias de las referencias ya resueltas por el DS o el MVP:** `General expanded.png` muestra "+7 pulsos, Cobrás 12 total" con 5 pulsos, que no corresponde a ningún multiplicador (cifras de ejemplo); `Pregunta/Elegida.png` dice "Libre" (se escribe "Otro"); `Al menos X expanded.png` muestra el selector de X del 1 al 7 (solo valen 4, 5, 6 y 7); "Guardar" va como `neutral` (confirmado); los títulos de las tarjetas de tema y "Si errás o vence" no se copian.
- **Discrepancias sin confirmar:** la animación del sorteo usa "Descubrir el tema", "Tu tema de hoy", "Buscando tema", chips "7 preguntas" y "20 s por pregunta" y montos 0, 1, 2 y 5, que no están en las pantallas (mandan las pantallas); el detalle dice "Cierra en 6 h" y la card del inicio "Vence en" para el mismo concepto; la segunda card compacta del Dashboard dice "6 de 7 aciertos" (vale el acumulado de la partida).
- **Color de la pérdida:** la tabla de estados de la card del MVP dice "rojo" para -8, mientras que el sistema de diseño usa `danger-text`/coral. Se sigue el sistema de diseño, que manda sobre tokens.
- **Publicación pendiente:** no hay issue tracker configurado ni repositorio git, así que el PRD queda como archivo local.
