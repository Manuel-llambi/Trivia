# Component Map: H8 - Poner confianza en "Ganar la sesión"

## Resumen de la historia
Como jugador, quiero elegir cuántos pulsos arriesgo a ganar la sesión del día viendo exactamente cuánto cobraría, para respaldar que voy a hacer el mejor puntaje del día.

- Encima de las tarjetas: "¿Confiás en tu conocimiento?" con botón de ayuda, la bajada, el chip "N pulsos disponibles" (la bolsa menos lo reservado en las dos tarjetas) y "¿Cómo querés arriesgar?".
- Tarjeta cerrada: "Ganar la sesión", descripción con multiplicador y jugadores dinámicos ("Acertá más que el resto hoy. Paga ×5,4 con 6 jugadores."), chip con el monto y chevron.
- Tarjeta abierta: píldoras 0, 1, 5, 10 y "Otro"; celda "Si acertás" con "+N pulsos" y "Cobrás N total"; botón "Guardar".
- "Otro" abre un `Overlay` ("¿Cuántos pulsos arriesgás?", campo numérico, ayuda "Podés arriesgar hasta N pulsos", "Guardar" `brand` / "Cancelar" `ghost`). Tocar fuera = cancelar. Vacío o 0 vuelve a "Otro" con el 0 elegido.
- Guardar cierra la tarjeta y deja el monto en el chip. El chip de disponibles baja en el momento (62 a 57 al guardar 5); la reserva real ocurre con "Jugar la sesión" (H10).
- Solo una tarjeta abierta a la vez; 0 o no tocarla es válido. Nunca se muestra un pozo ni montos de otros jugadores.
- Regla de producto: pago total = monto × (0,9 × jugadores en pie), redondeado hacia abajo; el multiplicador queda fijo a la apertura del día para todos. 2 jugadores: ×1,8. Menos de 2 jugaron: se devuelve lo arriesgado (informado en H17, fuera de alcance acá).
- Dependencia: H6 (sorteo del tema). Alta prioridad.

## Referencias revisadas
- `Referencias-y-definiciones/Pantalla-UI/Topic Reel/Default.png` — estructura de la pantalla con el tema revelado, encabezado "Confiás en tu conocimiento", chip de disponibles, dos tarjetas cerradas con chip "Sin pulsos" y botón `brand` "Jugar la sesión". Tiene los errores de tipeo ("Confias", "Ganar sesión", "sesion").
- `Referencias-y-definiciones/Pantalla-UI/Topic Reel/General expanded.png` — "Ganar la sesión" abierta: píldoras 0/1/5/10/Otro con la 5 elegida (`brand-soft`, trazo y labio verdes), celda "SI ACERTÁS +7 pulsos / Cobrás 12 total" (cifra de ejemplo, no coincide con ningún multiplicador), "Guardar" blanco con borde y labio oscuros, chip "5 PULSOS" verde suave. El chip de disponibles sigue en 62 (la imagen no muestra la anticipación).
- `Referencias-y-definiciones/Pantalla-UI/Topic Reel/Al menos X expanded.png` — manda sobre los textos de la tarjeta "Ganar la sesión" cerrada: "Acertá más que el resto hoy. Paga ×5,4 con 6 jugadores.", chip "5 PULSOS" en verde suave y chevron. Ahí el chip de disponibles dice 62 con 5 guardados (inconsistencia con la regla de 62 a 57; ver dudas). Muestra además la otra tarjeta (H9) abierta, con el selector de X del 1 al 7 (solo valen 4-7).
- No se leyeron las animaciones: la historia no las referencia, y el despliegue es sin animación obligatoria.
- No hay código: componentes verificados contra el DS, sin implementación todavía (no hay `TopicBetCard` en ningún `.ts`/`.tsx`).

## Pantallas involucradas
- Sorteo de tema, estado "tema revelado" — plantilla del DS: **Sorteo de tema** (dos `TopicBetCard` y botón `brand` "Jugar la sesión"). H8 cubre solo la tarjeta "Ganar la sesión", su `Overlay` "Otro" y los datos compartidos del encabezado de confianza; la tarjeta "Acertar al menos X" es H9 y el botón "Jugar la sesión" es H10.

## Componentes del DS a usar
- `TopicReel` (ya revelado, solo contexto) — viene de H6; H8 no lo modifica.
- `TopicBetCard` (cerrada) — "Ganar la sesión": `surface`, borde `line`, `radius-lg`, título `display`, descripción `text-muted`, chip a la derecha y chevron. Toda la tarjeta cerrada es zona táctil que despliega.
- `TopicBetCard` (abierta) — separador `line`, `ConfidenceControl` variante de tema, botón "Guardar".
- Chip de monto (chips de `StatPill`) — "Sin pulsos" en `surface-2`; "N pulsos" en `brand-soft` con `brand-text`. Forma `radius-pill`, `label` en mayúsculas.
- Chip "N pulsos disponibles" (`StatPill`/chip) — `surface-2`, `label`.
- `ConfidenceControl` (variante de tema) — píldoras 0, 1, 5, 10, "Otro"; elegida en `brand-soft` con trazo y labio `brand-deep`; una celda "Si acertás" en `brand-soft`.
- `Button` `neutral` — "Guardar" con tilde (la referencia lo dibuja con borde oscuro; el DS manda `neutral`).
- `Overlay` — monto "Otro": título, campo numérico, ayuda, "Guardar" (`brand`) y "Cancelar" (`ghost`).
- `Button` `brand` — "Jugar la sesión" (existe en la pantalla, pertenece a H10; es el único `brand` de la pantalla, salvo cuando el `Overlay` está abierto, donde "Guardar" `brand` es el único fuerte sobre el velo).

## Componentes a extender
- `TopicBetCard` — la cerrada de "Ganar la sesión" necesita props para título, descripción dinámica (multiplicador y jugadores en pie), monto guardado y estado abierta/cerrada controlado desde afuera (solo una abierta a la vez entre las dos tarjetas).
- `ConfidenceControl` (variante de tema) — soporta el máximo dinámico: "Otro" limitado a los pulsos disponibles (bolsa menos lo reservado en la otra tarjeta) y la celda con "Cobrás N total" calculada por el servidor (ver datos).

## Gaps
- Botón de ayuda "?" de "¿Confiás en tu conocimiento?" — la referencia lo dibuja, pero no hay contenido ni componente que se abra — sin referencia
  - **Resolución temporal sugerida**: renderizar el botón (táctil `tap-min`, `accessibilityLabel`) y abrir un `Overlay` informativo con un solo botón `neutral`; el texto del aviso es placeholder y hay que definirlo (ver dudas).
- Celda "Si acertás" con monto 0 — ninguna referencia muestra qué dice la celda con 0 pulsos — sin referencia
  - **Resolución temporal sugerida**: con 0 mostrar la celda neutra (`surface-2`), "+0 pulsos" en `text-muted` y sin "Cobrás N total", o directamente ocultarla; sin rojo. Provisorio.
- Error al confirmar o al pedir cifras al servidor (red, multiplicador no disponible) — la historia no define cómo se muestra — sin referencia
  - **Resolución temporal sugerida**: no inventar; dejar el monto sin guardar y como duda (ver dudas).
- Campo numérico del `Overlay` — el DS lo describe en prosa pero no tiene componente de input con estados (foco, vacío, ajustado al máximo) — sin referencia
  - **Resolución temporal sugerida**: campo con borde `edge` al enfocar y texto de ayuda en `text-muted`; si el valor supera el máximo, se reemplaza por el máximo sin rojo.
- Estado de "Otro" elegido — la píldora muestra el número ingresado con estilo de elegida; no hay referencia de ese estado — sin referencia
  - **Resolución temporal sugerida**: píldora elegida `brand-soft` con el número en `display`; el ancho puede crecer, con tamaño mínimo `tap-min`.
- Sin pulsos disponibles (bolsa en 0 o todo reservado) — las píldoras 1, 5, 10 y "Otro" quedan sin saldo — sin referencia
  - **Resolución temporal sugerida**: deshabilitar las píldoras cuyo monto supera lo disponible (estado deshabilitado de `surface-2`, sin labio) y mantener 0 activa; sin mensaje de culpa.
- Pantalla de carga mientras el servidor entrega jugadores en pie y factor — sin referencia
  - **Resolución temporal sugerida**: placeholder estático en la descripción y la celda hasta tener datos; no permitir guardar sin multiplicador.

## Tokens relevantes
- Colores: `bg` (pantalla), `surface` (tarjeta, `Overlay`), `surface-2` (chip "Sin pulsos", chip de disponibles, deshabilitados), `line` (borde y separador), `line-strong` (borde de reposo de píldoras, decorativo), `edge` (campo activo), `text`, `text-muted`; `brand-soft` (chip con monto, píldora elegida, celda "Si acertás"), `brand-deep` (trazo y labio de elegida), `brand-text` (+N pulsos, chip con monto), `brand` / `on-brand` / `lip-brand` ("Jugar la sesión" y "Guardar" del `Overlay`), `focus-ring`.
- Tipografía: `title` o `heading` en el título de la tarjeta; `display-lg` "Confiás en tu conocimiento" según referencia (pantalla Sorteo de tema); `body`/`body-sm` en bajada y descripciones; `label` en chips y "SI ACERTÁS"; `number-md` o `display` grande en "+N pulsos". Cifras tabulares (`tabular-nums`) en montos, disponibles, multiplicador y totales.
- Espaciado y radios: `space-5` margen lateral, `space-4` relleno de tarjeta, `space-2`/`space-3` entre píldoras y chips, `space-6` entre bloques; `radius-lg` tarjetas y `Overlay`, `radius-md` píldoras y botones, `radius-pill` chips; `tap-min` (52 px) en píldoras, chevron/tarjeta, "Guardar" y botón de ayuda; `border-w` 2px.
- Sombras y labios: `shadow-soft` en tarjeta, `shadow-float` en `Overlay`, `lip-neutral` en píldoras de reposo y "Guardar" `neutral`, `lip-brand` en "Jugar la sesión" y "Guardar" del `Overlay`. En iOS `shadowOffset {0,4}`/`shadowRadius 0`; en Android vista hermana de 4 px (sección 6 del DS).

## Patrones de interacción y movimiento
- Despliegue de la tarjeta: toque en la tarjeta cerrada la abre y cierra la otra, con chevron que gira — Movimiento reducido: sin transición, la tarjeta aparece abierta directamente.
- Presión con labio: píldoras, "Guardar" y botones se hunden 4 px en 100 ms — Movimiento reducido: quitar la transición.
- Elegir un monto: la píldora pasa a elegida y la celda "Si acertás" se actualiza al instante; se anuncia con `aria-live` (`accessibilityLiveRegion`) el nuevo "+N pulsos, Cobrás N total".
- "Otro": abre `Overlay` con foco automático en el campo y teclado numérico; "Cancelar" o tocar el velo cierran sin cambios; "Guardar" aplica el monto. Valor mayor al máximo se ajusta solo, sin rojo; vacío o 0 deja el 0 elegido y "Otro" sin número.
- Guardar: cierra la tarjeta, deja el monto en el chip y recalcula el chip de disponibles en el momento (62 a 57); cambiar a otro monto o a 0 lo recalcula. Sin festejo, sin animación del número.
- Solo una tarjeta abierta; poner 0 o no tocar es válido y el 0 tiene el mismo peso visual que los demás.
- No hay animación de festejo: no se usa `AuraClose` acá.

## Datos y autoridad del servidor
- Llega del servidor: cantidad de jugadores en pie contada a la apertura del día; factor configurado (0,9); multiplicador resultante (×5,4 con 6, ×1,8 con 2); cifras de la celda ("+N pulsos", "Cobrás N total", redondeado hacia abajo) calculadas o validadas por el servidor; pulsos disponibles de la bolsa; si hay un monto ya guardado/reservado de una visita anterior.
- La app nunca calcula: lo que se cobra ni ninguna cifra que afecte pulsos (la celda muestra lo que el servidor entrega o valida), la reserva real (ocurre con "Jugar la sesión", H10), la resolución del ganador (más aciertos; desempate por menor tiempo total), ni el reintegro si juegan menos de 2. El chip de disponibles es una anticipación visual, no un movimiento del libro de Pulsos. Nunca se muestra pozo ni montos de otros.
- El monto elegido no se envía al guardar la tarjeta: se envía al confirmar con "Jugar la sesión" (H10), donde el servidor valida que no supere la bolsa.

## Textos de pantalla
- "¿Confiás en tu conocimiento?" (referencia dice "Confias en tu conocimiento?")
- "Arriesgá pulsos para ganar más, todo depende de qué tanto confiás en tu conocimiento" (referencia sin tildes ni voseo)
- "N pulsos disponibles" (ej. "62 pulsos disponibles"; en `label` va en mayúsculas)
- "¿Cómo querés arriesgar?" (referencia "Como queres arriesgar?")
- "Ganar la sesión" (referencia Default y General expanded dicen "Ganar sesión")
- "Acertá más que el resto hoy. Paga ×5,4 con 6 jugadores." (multiplicador y jugadores dinámicos; las referencias Default y General expanded traen otra descripción que no se copia)
- "Sin pulsos" / "5 pulsos" (chip)
- "0", "1", "5", "10", "Otro" (píldoras)
- "Si acertás" (celda; "SI ACERTÁS" en `label`), "+22 pulsos", "Cobrás 27 total" (ejemplo con 6 jugadores y 5 pulsos; no copiar "+7 / 12" de la referencia)
- "Guardar"
- "¿Cuántos pulsos arriesgás?", "Podés arriesgar hasta N pulsos", "Guardar", "Cancelar" (`Overlay`)
- "Jugar la sesión" (referencia "Jugar la sesion"; botón de H10)
- Accesibilidad: etiquetas de las tarjetas y píldoras (por definir), anuncio `aria-live` de "Si acertás +N pulsos, cobrás N en total".

## Riesgos y dudas
- **Chip de disponibles inconsistente entre imágenes:** `Al menos X expanded.png` y `General expanded.png` muestran 62 con 5 guardados; el MVP y la historia dicen que baja a 57. Se sigue la regla escrita; confirmar que las imágenes quedaron desactualizadas.
- **Contenido del botón de ayuda "?"** no está definido en ninguna fuente. Es la duda más importante antes de implementar.
- **Celda con monto 0** sin referencia (ver gaps).
- **Cómo se calcula "Si acertás" en el cliente:** la historia dice que el servidor "calcula o valida" las cifras. Si la app las muestra al instante al cambiar el monto, o espera al servidor, no está resuelto; afecta la latencia percibida y el `aria-live`. Es el punto de posible tensión con "la app nunca calcula".
- **Error de red al pedir cifras o al confirmar:** la historia no dice cómo se muestra; no se eligió ningún patrón.
- **Respecto de H9:** el máximo de "Otro" depende de lo reservado en la otra tarjeta; el estado compartido entre ambas tarjetas (disponibles, tarjeta abierta) debe vivir por encima de las dos. Verificar consistencia con el mapa de H9.
- **Sin H10:** mientras no exista "Jugar la sesión" con reserva real, el monto guardado vive solo en estado local; define si se pierde al salir de la pantalla.
- **Jugadores en pie y expulsión posterior:** el multiplicador queda fijo, pero el texto "con 6 jugadores" podría quedar desactualizado respecto de jugadores realmente presentes; el MVP lo define así, solo cuidar que no se recalcule en el cliente.
