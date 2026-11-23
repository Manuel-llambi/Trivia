# Component Map: H21 - Ver el cierre de aura al completar un aura

## Resumen de la historia
Como jugador, quiero ver un único pulso sobrio cuando completo un aura, para sentir el logro sin estética de casino.

- Se dispara cuando el contador general cruza un múltiplo de 25 hacia arriba (por ejemplo, al terminar la partida).
- Secuencia de 1,5 s: 0 a 450 ms se llenan de a uno los pulsos que faltan; a los 650 ms se enciende el centro y un solo pulso de 600 ms (el aro crece 6% y vuelve) con vibración suave; a los 1250 ms el número sube; a los 1500 ms el aro vuelve a cero.
- Texto final: "Completaste tu Nª aura" y "Seguís desde N de 25 pulsos", con N real del resto (N6, PO 23/11/2026).
- Un solo cierre por cambio de saldo, aunque cruce más de un aura; no se repite ni se acumula; el número salta directo al aura final.
- Servidor: el saldo que dispara el cierre viene del servidor; la app no lo dispara con saldos propios.
- Experiencia: movimiento reducido = cambio instantáneo de número y aro, sin pulso; un solo anuncio accesible por pantalla (en Fin de partida, el de H19, que incluye el aura final; N6); bajar de aura no anima ni usa rojo.
- Dependencias: H1, H19. Prioridad media.

## Referencias revisadas
- `Referencias-y-definiciones/cierre_light.png` — 4 cuadros (faltan 5 pulsos / se completa / un solo pulso / aura nueva) y demo: "20 de 25 pulsos", "Te faltan 5 para tu 2ª aura", cronología 0/450/650/1250/1500 ms. Aro de 25 tramos sobre fondo claro, centro `brand-soft`, palabra "AURA" bajo el número.
- `Referencias-y-definiciones/Animaciones/animacion_cierre_aura.html` — secuencia real: tramos de a uno (90 ms c/u, `ease-out`) hasta 450 ms; a los 650 ms disco `brand-soft` (fade 200 ms) y escala 1 -> 1,06 -> 1 en 600 ms `ease-in-out` con `navigator.vibrate(12)`; número hace fundido (300 ms) y cambia a 1250 ms; aro y disco se vacían (~200 ms + 6 ms de desfase por tramo, disco 400 ms); a 1500 ms todo en cero. Con `prefers-reduced-motion` todas las duraciones pasan a 0. Mensaje final "Completaste tu 2ª aura" / "Seguís desde 0 de 25 pulsos". Contexto en la demo: "25 de 25 pulsos" durante el cierre. El botón "Reproducir cierre" es solo del prototipo, no va en la app.
- `Trivia_DS_completo.md` secciones 1 (Aura y pulsos, Movimiento, Accesibilidad), 2 (tokens `aura-*`), 3 (`AuraRing`, `AuraCounter`, `AuraClose`), 4 (Fin de partida, Tu aura) y 6.
- `historias.md` H19 (fin de partida), que es el disparador principal.
- No leí el MVP completo; usé las reglas citadas por la historia. Código: sin `AuraClose`/`AuraRing` en `mobile/src` (solo `tokens.ts`, tema y pantalla provisoria): componentes verificados contra el DS, sin implementación todavía.

## Pantallas involucradas
- Fin de partida (H19) — plantilla del DS: Fin de partida. Disparador principal: el cierre corre sobre el `AuraRing` grande. Esta historia manda sobre la secuencia del aro en esa pantalla (N6, PO 23/11/2026).
- Encabezado del Inicio y demás pantallas con `AuraCounter` — plantilla: Inicio. Resuelto (PO, 23/11/2026): el cierre corre solo en Fin de partida; en `AuraCounter` el número y los tramos se actualizan sin animación.
- Tu aura — plantilla: Tu aura (muestra el estado final, sin cierre propio).

## Componentes del DS a usar
- `AuraClose` — secuencia completa de 1,5 s sobre el aro.
- `AuraRing` (grande, en Fin de partida; 40 px en `AuraCounter`, mínimo permitido) — 25 tramos, pista `line`, tramos `brand`; `role="img"` con `aria-label`.
- `AuraCounter` — en encabezado: tramos se llenan de a uno y al completar corre el cierre.
- `Button` `brand` "Continuar" (Fin de partida, único `brand` de la pantalla) — aparece al terminar la animación (H19).
- Chip/texto "Completaste tu Nª aura" y "Seguís desde N de 25 pulsos" (N real) — texto sobre `text` / `text-muted`; sin componente propio.

## Componentes a extender
- `AuraClose` — definir API por comportamiento (sin código): entradas = saldos de pulsos libres antes y después (del servidor), modo reducido; salida = callback de fin para habilitar "Continuar". Debe soportar salto de varias auras mostrando solo el aura final.
- `AuraRing` — soportar llenado secuencial de tramos (90 ms c/u) y vaciado sin animación al bajar.
- `AuraCounter` — variante del cierre a 40 px (el pulso de 6% sobre `forest`); el DS no detalla cómo se comporta el cierre en tamaño pequeño.

## Gaps
- Texto final de `AuraClose` — la referencia lo muestra ("Completaste tu 2ª aura" / "Seguís desde 0 de 25 pulsos") pero el DS no lo incluye en el componente — no existe en el DS. Con resto, el texto usa el N real: "Seguís desde N de 25 pulsos" (N6).
  - **Resolución temporal sugerida**: texto en `display`/`body` bajo el aro en Fin de partida, tomando la ubicación de "N de 25 pulsos para tu Nª aura" (se reemplaza a los 1500 ms).
- Cierre cuando se cruzan varias auras y aro final con resto — resuelto por el PO (N6, 23/11/2026): un solo cierre; los tramos se llenan hasta completar el aro de la primera cruzada, un pulso, y el número salta directo al aura final. El aro queda en el resto real (no a cero) cuando el saldo final no es múltiplo de 25 (ej. 22 + 6 = 28 -> 3 de 25), y el texto dice "Seguís desde N de 25 pulsos" con ese N ("0" solo si el resto es 0).
- Mensaje de error/estado al fallar la carga del saldo — no definido: duda, no elijo patrón.

## Tokens relevantes
- Colores: tramos llenos `brand`; pista `line` (sobre `forest`: `aura-track-on-forest`); centro encendido `brand-soft`; número `text`; subtítulo/palabra "Aura" `text-muted`; sobre `forest`: `aura-pill-on-forest`, `aura-pill-line-on-forest`, `on-forest`, `on-forest-muted`. `brand-text` para "+N" del bloque de Fin de partida; nada de `coral`/`danger-text` al bajar de aura. Botón: `brand` + `on-brand` + `lip-brand`.
- Tipografía: número del centro `display` 800 tabular (88 px en la demo, escalable); "AURA" `label` mayúsculas (13 px/`.1em`); mensajes `display` 800 (22 px) y `body` 700 (16 px).
- Espaciado y radios: `space-*` estándar, margen lateral `space-5`; tramos de 14,4° con 1,5° de separación, trazo 7 a 9; `tap-min` en "Continuar".
- Sombras y labios: `lip-brand` en "Continuar"; el aro no lleva sombra ni brillo (sin destellos).

## Patrones de interacción y movimiento
- Secuencia `AuraClose` (1,5 s): 0-450 ms tramos faltantes de a uno (90 ms c/u, `ease-out`) -> 650 ms disco `brand-soft` (fade 200 ms) + un solo pulso de escala 1 -> 1,06 -> 1 en 600 ms `ease-in-out` + vibración suave (12 ms en el prototipo) -> ~1100-1250 ms número hace fundido y pasa a N+1 -> 1250-1500 ms aro y disco se vacían -> texto final. Movimiento reducido: sin transición ni pulso; se actualizan número, aro y texto de inmediato. La vibración suave se mantiene en reducido (PO, 23/11/2026): se quita solo lo visual.
- Un solo cierre por cambio de saldo: encolar y descartar duplicados (misma resolución de saldo no vuelve a disparar si se reabre la pantalla).
- Bajar de aura: los tramos se vacían sin animación, sin rojo, sin vibración.
- Vibración suave exclusiva de `AuraClose` (ningún otro momento vibra). Sin sonido, confeti ni destellos.
- Accesibilidad: durante el cierre, `aria-label` del aro actualizado. Un solo anuncio por pantalla (N6): en Fin de partida es el de H19 ("Ganaste N pulsos. Ahora tenés N auras y N de 25 pulsos."), que ya incluye el aura final; el cierre no agrega un anuncio propio. Aro `role="img"`.
- Presión: no aplica al cierre; el botón "Continuar" usa labio de 4 px y hundimiento 100 ms.

## Datos y autoridad del servidor
- Llega del servidor (N6, PO 23/11/2026): pulsos libres antes y después del cambio de saldo, la bandera/estado de que la partida se resolvió y la bolsa final devuelta.
- La app solo dibuja la transición entre los dos saldos que informa el servidor; no calcula nada con efecto sobre el saldo, y el cierre se dispara solo ante un cambio informado por el servidor. Sin topes de apuesta desde el 23/11/2026: el único límite son los Pulsos disponibles, así que los saldos pueden variar con montos libres; el cierre no depende de ello y no hay lógica de topes en esta historia. La app puede derivar visualmente `floor(pulsos/25)` y el resto solo para dibujar los valores que el servidor ya informó.

## Textos de pantalla
- "Completaste tu Nª aura" (ej. "Completaste tu 2ª aura")
- "Seguís desde N de 25 pulsos" (N real del resto; "0" solo si no hay resto)
- "Aura" (palabra bajo el número, `label`; en la referencia aparece en mayúsculas "AURA")
- "N de 25 pulsos" / "Te faltan N para tu Nª aura" (estados previos al cierre, de la demo)
- Accesible: aro "Tu aura: N, X de 25 pulsos"; anuncio único de H19 en Fin de partida (N6)
- "Continuar" (H19)
- No hay errores de tipeo que corregir en las referencias de esta historia.

## Riesgos y dudas
- Hápticos: confirmar API de Expo (`expo-haptics`, impacto suave) en `mobile/AGENTS.md`; la vibración del prototipo es 12 ms.
- Orden en Fin de partida: bloque de resultado, llenado del aro y cierre siguen la secuencia de H19 con el aro según esta historia (N6). Sigue sin definir dónde entra el cambio de emblema (no tiene diseño).
- Feedback de error al cargar el saldo: no definido; no elegí patrón.
- Usuario que reabre la app a mitad del cierre: el estado final debe mostrarse sin repetir la animación.
- Contraste del tramo `brand` sobre `line` y del texto de pasos: el DS ya lo verifica; no se probó en dispositivos.
