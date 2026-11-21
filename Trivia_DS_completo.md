# Trivia DS Suave — sistema de diseño

Versión actualizada (noviembre 2026). Segundo sistema de diseño de la app de trivia competitiva: suave, redondeado, con labios duros en lo que se presiona. Nombre y tipografías provisorios.

## Cambios de esta versión

Resoluciones del 17 de noviembre de 2026 sobre el reporte de consistencia de las historias (`docs/03-component-maps/_consistency-report.md`):

- Patrón nuevo "Carga y error" para toda la app: esqueletos `surface-2` sin spinner y un bloque `surface-2` con "Reintentar" (`neutral`), sin rojo.
- Las vistas previas de pulsos ("Si acertás", total a cobrar, chip de disponibles, máximo de "Otro", doble por pregunta) salen del mismo módulo de reglas puras que usa el servidor.
- El cero es siempre neutro: "0 pulsos" en `text-muted`, nunca "+0" ni rojo. Singular: "1 pulso".
- Temporizador en 0: pista vacía y "0" en `danger-text`; congelado con 5 s o menos mantiene el tono urgente.
- Píldoras de monto que superan lo disponible: deshabilitadas.
- Ventana que cierra con la pantalla abierta: chip "Cerrada" (`forest`) y "Ver ranking", o bloque "Esta sesión ya cerró".
- Un solo botón de ícono cuadrado (`neutral`) para cerrar y volver; el botón de ayuda "?" es `ghost` y abre un `Overlay` de ayuda.
- Excepción a "un color fuerte por pantalla": en el Inicio, cada `MatchCard` jugable lleva su propio "Jugar" `brand`.
- El carrete del tema ya no vibra al frenar: la vibración es solo de `AuraClose`.
- "Guardar" confirmado: `neutral` en `TopicBetCard`, `brand` en el `Overlay`.

Alineado con las pantallas de referencia de `Referencias-y-definiciones/Pantalla-UI/` (17 de noviembre de 2026), que mandan sobre el detalle visual:

- `MatchCard`: la bolsa va en número grande y la ganancia neta debajo. Nueva variante compacta "Jugada hoy".
- `ConfidenceControl`: celdas con la diferencia ("+5 pulsos", "-5 pulsos"), no la bolsa antes y después. Dos variantes: por pregunta y en la tarjeta de tema.
- Componentes nuevos: `TopicBetCard` (tarjeta desplegable de confianza en el tema) y `ResultCard` (resultado y explicación de la pregunta).
- `AnswerCard`: al responder, las opciones no elegidas se atenúan sin labio.
- `LeaderboardRow`: la cifra son los pulsos en la bolsa, con la palabra "Pulsos" debajo.
- Plantillas reescritas para el primer flujo: Inicio, Detalle de partida, Sorteo de tema, Pregunta y Fin de partida.
- Componente nuevo `Overlay` (aviso sobre la pantalla oscurecida) para el monto "Otro" y para salir de la sesión; detalle visual provisorio, sin referencia.
- `ResultCard`: estados de respuesta incorrecta ("No era esa") y de tiempo vencido ("Se terminó el tiempo"), definidos en texto, sin referencia.
- `TopicBetCard`: el chip de pulsos disponibles baja al guardar una tarjeta con monto.

Alineado con "App de trivia: diseño del MVP" (13 de noviembre de 2026):

- El aura sube y baja: es `floor(pulsos libres / 25)`. Ya no es una marca permanente ni cuenta los pulsos comprometidos en partidas; entrar a una partida saca 50 pulsos del contador general.
- Emblemas en 5, 10, 20, 50 y 100 auras, junto al `AuraCounter`. Siguen al aura actual y se pueden perder.
- `MatchCard` sin aro: el bloque gris muestra el resultado neto de la partida, la bolsa debajo y la posición.
- `ConfidenceControl`: montos 0, 1, 5, 10 y "Otro" (monto libre) hasta toda la bolsa disponible (la bolsa menos la confianza reservada en el tema); muestra la bolsa antes y después.
- "Apuesta" queda como término interno del producto y del código; los textos visibles siguen diciendo "confianza".

Versión anterior (11 de noviembre de 2026):

- Aura y pulsos: 1 aura = aro completo = 25 pulsos. Componentes nuevos `AuraRing`, `AuraCounter`, `AuraClose` y plantilla "Tu aura"; `MatchCard` muestra la bolsa en un aro.
- La moneda anterior (disco `sun`) se retiró; las cifras van con la palabra "pulsos".
- Tokens nuevos `aura-*` sobre `forest` (decorativos, fuera de la tabla de contraste).
- Badge "Te toca hoy" (`d-chip--brand`) sutil: `brand-soft` con `brand-text`, sin relleno sólido.
- Botones reducidos a cuatro variantes: `brand`, `neutral`, `ghost` y `coral`.
- Opción elegida con trazo verde (`brand-deep`) en vez de azul.
- Barra de navegación clara (`surface` con borde `line`).
- `on-brand` pasa de `#13220a` a `#0a1206` (9,3:1 sobre `brand`).

## Índice

1. Principios y reglas de uso
2. Tokens
3. Componentes
4. Plantillas
5. Contraste verificado
6. Implementación en Expo / React Native
7. Apéndice A: `tokens.css`
8. Apéndice B: `bundle.css`

---

## 1. Principios y reglas de uso

### Principios

- **Suave pero con carácter.** Fondo `bg` verdoso, tarjetas `surface` con `radius-lg` y `shadow-soft`. Lo que se presiona lleva un labio duro de 4px (`lip-*`) y se hunde.
- **Números grandes.** El puntaje, la posición y los valores de cada mosaico van en `display` con `number-xl` o `number-md`. El dato manda y la decoración acompaña.
- **Un color fuerte por pantalla.** `brand` marca la acción que avanza el juego; los chips de estado en verde son suaves (`brand-soft`) para no competir con ella. Los botones tienen solo cuatro variantes. **Excepción:** en el Inicio, cuando hay varias `MatchCard` en las que te toca jugar, cada una lleva su propio botón `brand` "Jugar" (ver `MatchCard`); no es una violación de esta regla. El `Overlay` es una capa aparte y tiene su propia acción principal. `forest` ancla los encabezados; la barra de navegación es clara.
- **Competir sin casino.** Nada de fichas, luces ni sonidos de tragamonedas. Se pone "confianza", no "apuesta".
- **Sesiones con final.** Cada sesión termina con "listo por hoy"; sin scroll infinito.

### Voz y contenido

- Hablá en voseo rioplatense, en frases cortas: "Te toca hoy", "Elegí cuánta confianza ponés".
- Decí "confianza", "aura" y "pulsos"; nunca "apostar" ni "monedas". Mostrá cada cambio con signo: `+3`, `-2`. "Apuesta" se usa solo como término interno en el documento de producto y en el código, nunca en pantalla. "Arriesgar pulsos" sí se usa en pantalla ("¿Cómo querés arriesgar?", "Elegí cuántos pulsos arriesgás").
- Las pantallas de referencia tienen errores de tipeo que no se copian: escribí "¿Confiás en tu conocimiento?", "Arriesgá pulsos para ganar más, todo depende de qué tanto confiás en tu conocimiento", "¿Cómo querés arriesgar?", "Jugar la sesión" y "Vas 2º" (con `º`, no con "o").
- Los títulos y descripciones de las tarjetas de tema siguen `Topic Reel/Al menos X expanded.png`, no `Default.png` ni `General expanded.png`: "Ganar la sesión" (no "Ganar sesión") con "Acertá más que el resto hoy. Paga ×5,4 con 6 jugadores." (multiplicador y cantidad de jugadores dinámicos), y "Acertar al menos X de las 7" (no "Ganar x de las 7 sesiones") con "Elegí cuántas preguntas creés que vas a acertar del tema de hoy." (no "Arriesgás a ganar x de las 7 sesiones de la tematica de hoy").
- La píldora de monto libre se llama "Otro" en las dos variantes de `ConfidenceControl`: `Pregunta/Elegida.png` dice "Libre", no se copia.
- La celda de pérdida de la confianza por pregunta tampoco se copia de la referencia: escribí "Si errás" (no "Si errás o vence"). Si vence el tiempo sin tocar "Responder", la pregunta cuenta como error con 0 pulsos.
- Escribí los botones en infinitivo o imperativo, sin signos de exclamación y sin emoji.
- Explicá las pérdidas sin culpa.
- Netos y movimientos: "+12 pulsos ganados" (`brand-text`), "-8 pulsos perdidos" (`danger-text`) y "sin cambios" (`text-muted`), igual en `MatchCard` y en la tarjeta "Tu puesto". Con 1, en singular: "1 pulso", "+1 pulso ganado", "-1 pulso perdido".
- El cero es siempre neutro: "0 pulsos" en `text-muted`, sin signo ni color. Nunca "+0", "-0" ni rojo.
- Error de conexión: "No pudimos conectarnos. Revisá tu conexión y probá de nuevo." (ver "Carga y error").

### Color

- Fondo de pantalla en `bg`; tarjetas y opciones en `surface`; pistas y huecos en `surface-2`. Texto en `text` y `text-muted`.
- `brand` es la acción principal y el acierto. `coral` es el error y la urgencia. `sky` es la selección y lo social. `violet`, `orange` y `sun` identifican temas y estadísticas; `sun` ya no es la moneda: la moneda es el aura y se dibuja con `brand`.
- Poné `on-brand`, `on-coral`, `on-sky`, `on-orange` y `on-sun` (oscuros) sobre sus fondos. Solo `violet` usa `on-violet` claro.
- `forest` es el encabezado, con `on-forest` encima. `*-soft` son fondos grandes de estado.
- Escribí ganancias en `brand-text` y pérdidas en `danger-text`, siempre con signo. El cero va en `text-muted`, sin signo.
- Los errores de conexión no usan rojo ni `coral`: no son culpa del jugador (ver "Carga y error").
- Los bordes con significado usan `edge`, salvo la opción elegida, que usa trazo `brand-deep`. `line` y `line-strong` son decorativos: el límite del objeto también lo marcan el labio, la sombra y el texto.

### Aura y pulsos

La moneda de la app es el **aura**. Un aura es un aro completo y se arma con **25 pulsos**: cada tramo del aro es un pulso.

- El aro tiene 25 tramos rectos, empieza arriba y avanza en sentido horario. Pista en `line`, tramos llenos en `brand`. Detalle en `AuraRing`.
- El número del centro es el aura actual: `floor(pulsos libres / 25)`. Sube y baja con el saldo; no es una marca permanente. El aro no se vacía por inactividad.
- El aura cuenta solo los pulsos libres (el contador general). Entrar a una partida saca 50 pulsos del contador y los deja como bolsa de esa partida, así que el aura baja; al terminar la partida, la bolsa final vuelve completa al contador.
- Emblemas: se ganan al llegar a 5, 10, 20, 50 y 100 auras y siguen al aura actual, así que se pueden perder. El diseño visual de cada emblema está pendiente.
- Encabezado: `AuraCounter` (aro de 40px con el aura actual + "16/25") y el emblema reemplazan a la pastilla de monedas. Al tocarla se abre `Plantilla-Aura`.
- Partidas Clásicas: la card no lleva aro. Muestra el resultado neto de la partida y la bolsa en cifras (`MatchCard`). Lo ganado va en `brand-text`, lo perdido en `danger-text`. Quedar fuera de la partida es neutro, sin rojo.
- Completar un aura es el único festejo: `AuraClose` (1,5 s, un solo pulso, sin confeti ni sonido; con `prefers-reduced-motion`, instantáneo). Bajar de aura no tiene animación ni rojo: el número y el aro se actualizan.
- Tokens nuevos sobre `forest`: `aura-track-on-forest`, `aura-pill-on-forest`, `aura-pill-line-on-forest`.
- La moneda anterior (disco `sun`) se retiró de todos los componentes: las cifras van con la palabra "pulsos".

### Tipografía

- Los títulos y números van en `display` (Urbanist, 800); el texto en `body` (Nunito, 600). Cargá ambas desde Google Fonts.
- Usá `label` solo para etiquetas cortas en mayúsculas. Poné cifras tabulares en todo valor que cambia.

### Forma, sombra y espacio

- Esquinas: `radius-md` en botones y opciones, `radius-lg` en tarjetas y mosaicos, `radius-xl` en la barra de navegación (`surface`, borde `line`), `radius-pill` en chips, avatares y barras.
- Sombras blandas (`shadow-soft`, `shadow-float`) para tarjetas y elementos flotantes; `lip-*` para lo que se presiona.
- Espaciado de `space-1` a `space-8`. Margen lateral de pantalla `space-5`. Todo control táctil mide al menos `tap-min`.

### Movimiento

- Presionar baja el elemento 4px en 100ms. La revelación del tema pasa los temas rápido y frena en 2,4s, una vez por sesión, sin vibración.
- La vibración suave es exclusiva de `AuraClose`; ningún otro momento vibra.
- Con `prefers-reduced-motion`, quitá transiciones y revelá el tema sin movimiento.

### Accesibilidad

- Cada par de texto y fondo documentado cumple 4,5:1 y cada borde con significado 3:1, en ambos temas (verificado con la fórmula WCAG). No se probó en dispositivos reales ni con simulación de daltonismo.
- Todo foco usa un anillo de 3px en `focus-ring` con separación.
- Ningún resultado depende solo del color: lleva palabra, signo o ícono.

---

## 2. Tokens

### 2.1 Color

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `bg` | `#f3f6ee` | `#111912` | Fondo de pantalla. Texto `text` y `text-muted` encima. |
| `surface` | `#ffffff` | `#1b251d` | Tarjetas, opciones y paneles sobre `bg`. |
| `surface-2` | `#eaf0e3` | `#243028` | Pistas de barras, huecos y fondos secundarios sobre `bg` o `surface`. |
| `line` | `#dce5d3` | `#2e3b31` | Divisores decorativos finos. No lleva significado. |
| `line-strong` | `#c6d2bb` | `#3d4e41` | Borde de reposo de opciones y píldoras. Es decorativo: el límite lo marcan también la sombra inferior y el texto. |
| `edge` | `#7a8875` | `#6e8272` | Borde con significado (elegido, campo activo). 3:1 o más contra `surface` y `bg`. |
| `text` | `#19231b` | `#f0f5ea` | Texto principal sobre `bg`, `surface`, `surface-2` y los fondos `-soft`. |
| `text-muted` | `#566358` | `#a8b6aa` | Texto secundario sobre `bg`, `surface`, `surface-2` y los fondos `-soft`. |
| `forest` | `#26352b` | `#2f4034` | Barra de navegación en píldora y encabezados oscuros. Texto `on-forest` encima. |
| `on-forest` | `#ffffff` | `#f0f5ea` | Texto e íconos sobre `forest`. |
| `on-forest-muted` | `#b9c8bc` | `#b9c8bc` | Texto secundario sobre `forest`. |
| `brand` | `#6fcb1f` | `#6fcb1f` | Acción principal, acierto y progreso. Texto `on-brand` encima. |
| `brand-deep` | `#4e9f12` | `#4e9f12` | Borde inferior (labio) de los elementos `brand`. No lleva texto. |
| `brand-soft` | `#e1f4c8` | `#25381a` | Fondo suave de aciertos, primer puesto y seleccionado en verde. Texto `text` encima. |
| `on-brand` | `#0a1206` | `#0a1206` | Texto e íconos sobre `brand`. |
| `brand-text` | `#3c7a0a` | `#8fe04a` | Texto verde (ganancias, +12) sobre `bg`, `surface` y `brand-soft`. Siempre con signo +. |
| `coral` | `#ff6378` | `#ff6378` | Error, pérdida y vencimiento. Texto `on-coral` encima. |
| `coral-deep` | `#d93a52` | `#d93a52` | Labio de los elementos `coral`. No lleva texto. |
| `coral-soft` | `#ffe1e6` | `#3c1920` | Fondo suave de avisos de pérdida o eliminación. Texto `text` encima. |
| `on-coral` | `#2a0a10` | `#2a0a10` | Texto e íconos sobre `coral`. |
| `danger-text` | `#c0273f` | `#ff8fa0` | Texto de pérdidas (-10) y errores sobre `bg`, `surface` y `coral-soft`. Siempre con signo -. |
| `sky` | `#5ab0ff` | `#5ab0ff` | Opción elegida y rivales. Texto `on-sky` encima. |
| `sky-deep` | `#2f8be0` | `#2f8be0` | Labio y borde de lo elegido en celeste. No lleva texto. |
| `sky-soft` | `#ddf0ff` | `#14283a` | Fondo de la opción elegida y de tu propia fila. Texto `text` encima. |
| `on-sky` | `#0b1d2e` | `#0b1d2e` | Texto e íconos sobre `sky`. |
| `violet` | `#6a4be0` | `#8a6ff2` | Mosaicos de tema y perfil. Texto `on-violet` encima. |
| `violet-deep` | `#4f33b8` | `#6a4be0` | Labio de los elementos `violet`. No lleva texto. |
| `violet-soft` | `#e9e3ff` | `#271f45` | Fondo suave de mosaicos violeta. Texto `text` encima. |
| `on-violet` | `#ffffff` | `#12082e` | Texto e íconos sobre `violet`. |
| `orange` | `#ff8a3d` | `#ff8a3d` | Mosaicos de tema y rachas. Texto `on-orange` encima. |
| `orange-deep` | `#e06a1c` | `#e06a1c` | Labio de los elementos `orange`. No lleva texto. |
| `orange-soft` | `#ffe8d6` | `#3a2415` | Fondo suave de mosaicos naranja. Texto `text` encima. |
| `on-orange` | `#2b1405` | `#2b1405` | Texto e íconos sobre `orange`. |
| `sun` | `#ffc93c` | `#ffc93c` | Monedas y primer puesto. Texto `on-sun` encima. |
| `sun-deep` | `#e0a516` | `#e0a516` | Labio de los elementos `sun`. No lleva texto. |
| `sun-soft` | `#fff1c9` | `#3a3010` | Fondo suave de premios y datos destacados. Texto `text` encima. |
| `on-sun` | `#2b2005` | `#2b2005` | Texto e íconos sobre `sun`. |
| `focus-ring` | `#2f8be0` | `#7dc0ff` | Anillo de foco de 3px con separación de 3px, sobre `bg` o `surface`. |
| `aura-track-on-forest` | `rgba(255, 255, 255, 0.2)` | `rgba(255, 255, 255, 0.2)` | Tramos vacíos del aro de aura sobre `forest` (encabezado). Decorativo: el valor lo dicen el número y los tramos llenos. |
| `aura-pill-on-forest` | `rgba(255, 255, 255, 0.08)` | `rgba(255, 255, 255, 0.08)` | Fondo de la pastilla del contador de aura sobre `forest`. |
| `aura-pill-line-on-forest` | `rgba(255, 255, 255, 0.14)` | `rgba(255, 255, 255, 0.14)` | Borde de la pastilla del contador de aura sobre `forest`. Decorativo. |

### 2.2 Tipografía

- `display`: "Urbanist", "Arial Rounded MT Bold", system-ui, sans-serif
- `body`: "Nunito", system-ui, sans-serif

Cargar desde Google Fonts: Urbanist 700–800 y Nunito 600–800.

| Estilo | Tamaño / interlineado | Peso | Espaciado | Uso |
|---|---|---|---|---|
| `display-xl` | 56px / 56px | 800 | -0.02em | Resultado final de la partida y tema revelado. |
| `display-lg` | 36px / 40px | 800 | -0.02em | Títulos de pantalla. |
| `title` | 24px / 30px | 800 | — | Títulos de tarjetas y secciones. |
| `number-xl` | 64px / 64px | 800 | -0.03em | Puntaje del día y posición. |
| `number-md` | 28px / 32px | 800 | — | Cifras de mosaicos y estadísticas. |
| `heading` | 18px / 24px | 800 | — | Nombres de jugadores y de partidas. |
| `body` | 16px / 24px | 600 | — | Texto corrido, preguntas y explicaciones. |
| `body-sm` | 14px / 20px | 600 | — | Metadatos y ayudas. |
| `label` | 12px / 16px | 800 | 0.08em | Etiquetas en mayúsculas: estados, chips y encabezados de grupo. |

### 2.3 Espaciado

| Token | Valor | Uso |
|---|---|---|
| `space-1` | `4px` | Separación mínima entre ícono y texto. |
| `space-2` | `8px` | Separación dentro de un mismo grupo. |
| `space-3` | `12px` | Relleno de chips y filas compactas. |
| `space-4` | `16px` | Relleno de tarjetas. |
| `space-5` | `20px` | Margen lateral de pantalla. |
| `space-6` | `24px` | Separación entre bloques. |
| `space-7` | `32px` | Separación entre secciones. |
| `space-8` | `48px` | Aire de pantallas de revelación y resultado. |

### 2.4 Radios

| Token | Valor | Uso |
|---|---|---|
| `radius-sm` | `12px` | Chips y marcas. |
| `radius-md` | `16px` | Botones, opciones y píldoras de confianza. |
| `radius-lg` | `24px` | Tarjetas y mosaicos. |
| `radius-xl` | `32px` | Paneles grandes y la barra de navegación. |
| `radius-pill` | `999px` | Avatares, barras y píldoras. |

### 2.5 Bordes

| Token | Valor | Uso |
|---|---|---|
| `border-w` | `2px` | Borde estándar de opciones y píldoras. |

### 2.6 Tamaños

| Token | Valor | Uso |
|---|---|---|
| `tap-min` | `52px` | Alto mínimo de cualquier control táctil. |
| `avatar-sm` | `32px` | Avatares apilados. |
| `avatar-md` | `44px` | Avatar en filas de ranking. |
| `avatar-lg` | `88px` | Avatar del perfil. |
| `icon` | `24px` | Íconos de navegación y de estado. |

### 2.7 Sombras

Sombras blandas para tarjetas y un labio duro de 4px bajo los elementos que se presionan. El labio de cada color es su `-deep`.

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `shadow-soft` | `0 6px 20px rgba(38, 53, 43, 0.10)` | `0 6px 20px rgba(0, 0, 0, 0.45)` | Tarjetas en reposo. |
| `shadow-float` | `0 14px 36px rgba(38, 53, 43, 0.16)` | `0 14px 36px rgba(0, 0, 0, 0.55)` | Barra de navegación y elementos flotantes. |
| `lip-neutral` | `0 4px 0 0 #c6d2bb` | `0 4px 0 0 #0b120d` | Labio de botones y opciones neutros. |
| `lip-brand` | `0 4px 0 0 #4e9f12` | `0 4px 0 0 #4e9f12` | Labio de botones `brand`. |
| `lip-coral` | `0 4px 0 0 #d93a52` | `0 4px 0 0 #d93a52` | Labio de elementos `coral`. |
| `lip-sky` | `0 4px 0 0 #2f8be0` | `0 4px 0 0 #2f8be0` | Labio de elementos `sky`. |
| `lip-violet` | `0 4px 0 0 #4f33b8` | `0 4px 0 0 #6a4be0` | Labio de elementos `violet`. |
| `lip-orange` | `0 4px 0 0 #e06a1c` | `0 4px 0 0 #e06a1c` | Labio de elementos `orange`. |
| `lip-sun` | `0 4px 0 0 #e0a516` | `0 4px 0 0 #e0a516` | Labio de elementos `sun`. |

---

## 3. Componentes

Cada componente tiene su clase en `bundle.css` (prefijo `d-`).

### Button (botón)

Botón de acción con cuerpo de color y un labio duro de 4px debajo; al presionar se hunde sobre su labio.

- Hay solo cuatro variantes, en orden de jerarquía: `brand` (principal, una sola por pantalla, salvo un "Jugar" por cada `MatchCard` jugable en el Inicio), `neutral` (secundaria), `ghost` (terciaria) y `coral` (destructiva: abandonar). No agregues más colores de botón.
- Cada variante usa su texto `on-*` y su labio `lip-*`.
- Alto mínimo `tap-min`; esquina `radius-md`; texto en `display` 800.
- El foco muestra un anillo de 3px en `focus-ring` con separación. El estado deshabilitado usa `surface-2` y pierde el labio.
- **Botón de ícono cuadrado (cerrar y volver):** `neutral`, cuadrado de `tap-min`, solo ícono y `accessibilityLabel` ("Cerrar", "Volver"). Es el cerrar de la Pregunta y el volver del Detalle de partida; no es una variante nueva y es el único estilo de botón de ícono de navegación (cerrar, volver) en toda la app. El "?" de ayuda es informativo y va en `ghost`.
- **Botón de ayuda "?":** botón de ícono `ghost` junto a "¿Confiás en tu conocimiento?", con `accessibilityLabel` "Cómo funciona la confianza". Abre el `Overlay` de ayuda.
- Un botón que espera la respuesta del servidor queda deshabilitado (`surface-2`, sin labio) con el mismo rótulo, sin spinner (ver "Carga y error").
- Escribí el rótulo en infinitivo, sin signos de exclamación: "Jugar hoy", "Ver ranking".

### StatPill, chips, pulsos y avatares

Piezas pequeñas de datos del perfil: racha, puntos y aura, además de chips de estado, cifras de pulsos y avatares.

- Mostrá cada cambio de pulsos con signo: `+3 pulsos` en `brand-text` (clase `d-coins--up`), `-2 pulsos` en `danger-text` (`d-coins--down`). El color nunca va solo: el signo lo acompaña. El cero va "0 pulsos" en `text-muted`, sin signo. Con 1, en singular ("1 pulso").
- El dato de aura lleva un aro pequeño (16 de 25) y el texto "1 aura · 16 de 25". No hay disco de moneda: la cifra siempre va con la palabra "pulsos".
- Los chips usan `label` en mayúsculas y forma `radius-pill`. Cada color de chip tiene un significado fijo, y `brand` va suave para no competir con el botón principal: es "te toca", `coral` urgencia, `sky` social, `sun` premio, `forest` cerrado (chip "Cerrada" cuando la ventana de la sesión vence).
- Los avatares son discos con inicial en `display` sobre `brand`, `sky`, `coral`, `sun` o `violet`; apilalos con un solape de 8px.
- Poné cifras tabulares en todo valor que cambie.
### ProgressBar (barra, temporizador y pasos)

Barra de avance, temporizador de pregunta y pasos de los 5 días de la partida.

- La barra es una pastilla `surface-2` con relleno `brand` y un brillo suave arriba; el relleno usa la variable `--p`.
- En el temporizador, pasá la barra a `coral` y la cifra a `danger-text` con `data-tone="urgent"` cuando queden 5 segundos o menos. Mostrá siempre la cifra además de la barra.
- En 0, la barra queda vacía (solo la pista `surface-2`) y la cifra "0" en `danger-text`. Congelado al responder, mantiene el tono que tenía: si se respondió con 5 s o menos, barra `coral` y cifra en `danger-text`.
- El "0" en `danger-text` es el tono urgente del temporizador, no un monto de pulsos: "sin rojo en el cero" aplica a los montos de pulsos.
- Entre los 20 y los 22 s el jugador no ve nada distinto: en 0 "Responder" se deshabilita y la pantalla espera el veredicto del servidor, que llega como tiempo vencido. Los 2 s extra solo absorben respuestas enviadas antes de los 20 s; la app nunca deja responder después de 0.
- Los pasos usan `forest` para los días jugados, `brand` para hoy y `surface-2` para los que faltan.
- Anunciá el tiempo a lectores de pantalla solo en 10, 5 y 0 segundos.

### AnswerCard (opción de respuesta)

Opción de respuesta tipo tarjeta, con letra, texto y un labio inferior.

- Estados: reposo (`surface` con labio neutro), elegida (`surface` con trazo y labio verdes `brand-deep`, letra `brand` y la palabra "Elegida"), correcta (`brand-soft` con trazo y labio `brand-deep`, tilde y "Correcta"), incorrecta (`coral-soft`) y atenuada.
- Al responder, las opciones que no son la elegida ni la correcta pasan a atenuadas: `surface-2`, sin labio ni borde, texto en `text-muted` y la letra en un disco `surface`. Referencia: `Pregunta/Respondida.png`.
- Cada resultado lleva palabra e ícono ("Correcta", "Incorrecta"), nunca solo color.
- El borde de reposo (`line-strong`) es decorativo: el límite del objeto lo marcan también el labio y el texto. El trazo verde de la elegida (`brand-deep`) contrasta 3:1 o más contra `surface` y `bg` en ambos temas. La correcta se distingue por su relleno `brand-soft` y el ícono de tilde.
- Alto mínimo 64px; la zona táctil es toda la tarjeta. Al presionar se hunde 4px.
- Con `prefers-reduced-motion`, quitá la transición.

### ConfidenceControl (confianza)

Selector de cuántos pulsos de confianza poner en una pregunta, con el resultado posible a la vista.

- Cinco píldoras: 0, 1, 5, 10 y "Otro" (monto libre hasta toda tu bolsa disponible, sin la confianza reservada en el tema; valores provisorios). Usá "Otro" en las dos variantes, aunque `Pregunta/Elegida.png` diga "Libre".
- Las píldoras cuyo monto supera los pulsos disponibles quedan deshabilitadas (estilo deshabilitado: `surface-2`, sin labio; accesibilidad "No disponible"). El 0 y "Otro" siguen activos: "Otro" sirve para cualquier monto hasta el máximo.
- Las vistas previas ("Si acertás", "Si errás", total a cobrar, chip de disponibles, máximo de "Otro", el doble por pregunta) las calcula la app con el mismo módulo de reglas puras que usa el servidor para los pagos reales, a partir de los valores que entrega el servidor (multiplicadores, factor, bolsa disponible y reservas). No mueven pulsos: el servidor siempre recalcula y rechaza montos inválidos.
- Al tocar "Otro" se abre un `Overlay` con el título "¿Cuántos pulsos arriesgás?", un campo numérico con foco automático y teclado numérico, la ayuda "Podés arriesgar hasta N pulsos" en `text-muted` (N = pulsos disponibles) y los botones "Guardar" (`brand`) y "Cancelar" (`ghost`). Un valor mayor al máximo se ajusta solo al máximo, sin rojo ni reproche. Al guardar, la píldora "Otro" muestra el número ingresado con el estilo de elegida y la celda "Si acertás" se recalcula; vacío o 0 vuelve a "Otro" con el 0 elegido. Igual en las dos variantes.
- **Por pregunta** (`Pregunta/Elegida.png`): etiqueta "Elegí cuántos pulsos arriesgás". La elegida se pinta `brand` sólido. Debajo, dos celdas siempre visibles: "Si acertás" (`brand-soft`, `+5 pulsos` en `brand-text`) y "Si errás" (`coral-soft`, `-5 pulsos` en `danger-text`), con la cifra en `display` grande; la referencia dice "Si errás o vence", no se copia. Acertar paga el doble de lo puesto; errar con el monto enviado con "Responder" lo pierde. Si vence el tiempo sin tocar "Responder", es error con 0 pulsos. Con monto 0, las dos celdas siguen visibles y dicen "0 pulsos" en `text-muted`, sin signo ni color.
- **En la tarjeta de tema** (dentro de `TopicBetCard`): la elegida va `brand-soft` con trazo y labio `brand-deep`. Debajo, una sola celda "Si acertás" (`brand-soft`) con la ganancia y el total a cobrar, siempre exactos porque salen de un multiplicador fijo (con 6 jugadores y 5 pulsos: `+22 pulsos`, "Cobrás 27 total"). Las cifras de la imagen de referencia son de ejemplo. En "Acertar al menos X de las 7", la celda dice "SI ACERTÁS 6 · (×4)", con la ganancia (`+15 pulsos`) y el total ("Cobrás 20 total"), según `Topic Reel/Al menos X expanded.png`. El pago se redondea hacia abajo. Con monto 0, la celda "Si acertás" se oculta (el chip ya dice "Sin pulsos").
- Decí "confianza" y "pulsos"; nunca "apuesta" ni "all in". Poner 0 es una opción válida y se muestra igual de prominente.
- El anuncio con `aria-live` informa el nuevo resultado posible cada vez que cambia el monto.
### TopicTile (mosaico de tema)

Mosaico de color para mostrar una estadística por tema con un minigráfico de barras y un número grande.

- Cada mosaico tiene un color de tema (`brand`, `sky`, `coral`, `violet`, `orange`, `sun`), su texto `on-*` y su labio `lip-*`; esquina `radius-lg`.
- El número va en `display` 40px con cifras tabulares. La etiqueta y la unidad dicen qué mide, siempre en texto.
- Las barras del minigráfico son decorativas (`aria-hidden`); la barra resaltada (`data-hi`) marca el último valor. El dato real debe estar en el texto.
- No uses el color del mosaico como única señal: un mosaico `coral` no significa "malo" sin su etiqueta.

### MatchCard (tarjeta de partida)

Tarjeta de resumen de una partida Clásica: vencimiento, día, título, jugadores, avatares, tu bolsa, tu resultado neto, tu posición y la acción siguiente. Referencia: `Dashboard/Todas.png`.

- Una tarjeta `surface` con `radius-lg` y `shadow-soft`. Arriba, el chip de vencimiento ("Vence en 16:20:23") sutil (`coral-soft` con `danger-text`), nunca un relleno sólido, y a la derecha "Día 3 de 5" en `text-muted`.
- Título en `display` y debajo "8 jugadores" en `text-muted`; avatares apilados a la derecha.
- El bloque gris (`surface-2`, `radius-md`) **no lleva aro**. A la izquierda, la bolsa en número grande (`display` 40px) y debajo la ganancia o pérdida neta; a la derecha, la etiqueta "Posición" y el valor.

| Estado | Número grande | Debajo | Posición | Botón |
| --- | --- | --- | --- | --- |
| Ganando | `62` | "+12 pulsos ganados" en `brand-text` | "Vas 2º" | `brand` "Jugar" |
| Perdiendo | `42` | "-8 pulsos perdidos" en `danger-text` | "Vas 2º" | `brand` "Jugar" |
| Recién empieza | `50` | "sin cambios" en `text-muted` | "Todos 0" | `brand` "Jugar" |
| Fuera de la partida | `0` | "sin pulsos" en `text-muted` | "Quedaste 4º" | `neutral` "Ver ranking" |

- **Variante compacta "Jugada hoy":** sin bloque gris ni botón. Chip "Jugada hoy" en `surface-2`, "Día 2 de 5", título, avatares y una línea en `text-muted`: "Vas 2º · 11 aciertos · Abre mañana 00:00". En "Todas" se agrupan bajo la etiqueta "Partidas completadas hoy".

- Fuera de la partida el tono es neutro: chip gris "Fuera de la partida", textos en `text-muted` y el botón pasa a `neutral`. Ni el 0 ni la bolsa vacía llevan rojo, y el texto nunca culpa.
- Una sola acción principal por tarjeta: el botón `brand` aparece solo si te toca jugar. Si hay varias tarjetas jugables en el Inicio, cada una lleva su propio `brand` "Jugar": es una excepción explícita a "un color fuerte por pantalla", no una violación.
- Ventana que vence con el Inicio abierto: la tarjeta se actualiza sola; el chip pasa a "Cerrada" (`forest`), el botón `brand` desaparece y queda `neutral` "Ver ranking".
- El bloque lleva `aria-label` con el resultado, la bolsa y la posición. El signo y las palabras dicen ganado o perdido, así que el color no es lo único que informa.

### AuraRing (aro de aura)

Aro que muestra cuántos pulsos llevás. Es la moneda de la app: un aro completo es un aura y se arma con 25 pulsos, un tramo por pulso.

- Geometría: viewBox 64×64, radio 24, 25 tramos de 14,4° con 1,5° de separación a cada lado, extremos rectos (`butt`), trazo de 7 a 9. Empieza arriba y avanza en sentido horario.
- Colores: pista en `line` (sobre `forest`, `aura-track-on-forest`), tramos llenos en `brand`.
- Se usa solo para el contador general (encabezado, pantalla "Tu aura" y fin de partida), no en la card de partida.
- En el fin de partida, una marca radial en `text-muted` indica el punto de partida (los pulsos libres antes de la partida) y la palabra "Aura" va bajo el número.
- El número del centro es el aura actual (`floor(pulsos libres / 25)`). Usá `Urbanist` 800 y cifras tabulares.
- El aura sube y baja con los pulsos libres; no queda ninguna marca permanente. El aro no se vacía por inactividad.
- Sin pulsos libres: pista sin relleno y el número en 0, sin rojo.
- Siempre con `role="img"` y `aria-label`: "Tu aura: 1, 16 de 25 pulsos". Ningún dato depende solo del color.
- Con 40px o menos los tramos miden pocos píxeles: no lo uses debajo de 40px.

### AuraCounter (contador del encabezado)

Contador de aura del encabezado: ocupa el lugar de la antigua pastilla de monedas, sobre `forest`.

- Una pastilla de `tap-min` de alto con un aro de 40px a la izquierda y, al lado, los pulsos del aura en curso ("16/25"). El número dentro del aro es el aura actual. El emblema va junto a la pastilla.
- Fondo `aura-pill-on-forest`, borde `aura-pill-line-on-forest`, texto `on-forest` y `on-forest-muted`.
- Al tocarla se abre la pantalla "Tu aura". Cuando suman pulsos, los tramos se llenan de a uno; al completar el aro corre el cierre de aura (ver AuraClose). Cuando restan, los tramos se vacían sin animación y, si corresponde, el número y el emblema bajan.
- Cuenta solo los pulsos libres: entrar a una partida saca 50 pulsos y baja el contador; la bolsa final vuelve al terminar la partida.
- `aria-label` completo: "Tu aura: 1, 16 de 25 pulsos para la siguiente".
- Alternativas que se descartaron: solo el aro de 52px, y una pastilla con texto ("1 aura / 16 de 25 pulsos"), más clara pero más ancha.

### AuraClose (cierre de aura)

Animación que ocurre al completar un aura (llegar a 25 pulsos). Es el único festejo de la app: sobrio, breve y sin sonido.

- Secuencia de 1,5 s: los pulsos que faltan se llenan de a uno (hasta 450ms), se enciende el centro con `brand-soft` y el aro crece 6% y vuelve en un solo pulso de 600ms con una vibración suave, el número sube (1 a 2) y el aro se vacía en 500ms.
- Sin confeti, destellos ni sonido. No se repite ni se acumula: un cierre, una vez.
- Con `prefers-reduced-motion`, el cambio es instantáneo: se actualiza el número y el aro, sin transición ni pulso.
- No deja marca permanente: si después perdés pulsos, el aura vuelve a bajar.
- Dejá un texto accesible con el resultado: "Llegaste a 2 auras".
### LeaderboardRow (fila de ranking)

Fila del ranking con posición, avatar, nombre, resumen y puntaje grande.

- El primer puesto (`data-first`) usa `brand-soft` y un disco `sun` con labio. Tu fila (`data-me`) usa `sky-soft` y un borde `edge` de 2px. Un jugador eliminado (`data-out`) se atenúa y el avatar pasa a grises, con el motivo en texto.
- La cifra son los pulsos en la bolsa, con la palabra "Pulsos" debajo en `text-muted`; va en `display` 26px con cifras tabulares y es lo más grande de la fila. Como todos entran con la misma bolsa, ordenar por bolsa equivale a ordenar por pulsos netos. Referencia: `Match Detail/Ranking.png`.
- El resumen bajo el nombre dice los aciertos de la partida ("17 aciertos"); son un dato, no definen el puesto. Tu fila se llama "Vos". Quien no jugó se atenúa con el motivo ("No jugó 2 días").
- Reconocé logros no monetarios en el resumen; mostrá las ganancias con signo.

### TabBar (navegación)

Barra de navegación inferior: una píldora clara (`surface` con borde `line`) flotante con cuatro destinos.

- Destinos: Inicio, Partidas, Ranking y Perfil. El activo se pinta `brand` con `lip-brand` y lleva `aria-current="page"`; los demás usan `text-muted`.
- Flota con `shadow-float` a `space-6` del borde inferior; esquina `radius-xl`.
- Cada ítem mide al menos 52px de alto. Sumá siempre un `aria-label`, porque el ícono no lleva texto.

### TopicReel (sorteo del tema)

Momento de sorpresa del día: una ventana de una sola línea muestra pasar los temas a toda velocidad y frena en el de la sesión.

- El tema ya lo decidió el servidor y es el mismo para todos. El carrete solo lo revela: el consumidor aporta la lista que pasa y el tema final en la última fila.
- Mostrá solo la fila donde va a quedar el tema; los vecinos asoman difuminados con `surface-2`. Nunca el carrete entero.
- Corré una sola vez por sesión, 2 a 3 segundos, con desenfoque al inicio y desaceleración larga. Con `prefers-reduced-motion`, mostrá el tema final sin movimiento.
- Los dos triángulos `brand` marcan dónde frena. Sin luces, destellos, fichas, sonidos de tragamonedas ni vibración al frenar: es una revelación, no un juego de azar.
- No lo uses para que el jugador elija entre temas.
- Antes de girar, la ventana muestra "Tema de hoy" y el botón `brand` dice "Descubrir tema"; el carrete corre cuando el jugador lo toca. Referencia: `Topic Reel/Default-1.png`.

### TopicBetCard (confianza en el tema)

Tarjeta desplegable para cada confianza de tema: "Ganar la sesión" y "Acertar al menos X de las 7". Referencias: `Topic Reel/Default.png`, `Topic Reel/General expanded.png` y `Topic Reel/Al menos X expanded.png` (esta última manda sobre la tarjeta "Acertar al menos X de las 7" desplegada, salvo que el selector de X muestra solo 4, 5, 6 y 7; la imagen muestra del 1 al 7 y del 1 al 3 no son válidos).

- Cerrada: tarjeta `surface` con borde `line`, `radius-lg`; título en `display`, descripción en `text-muted`, y a la derecha un chip con el monto y un chevron. El chip dice "Sin pulsos" en `surface-2` o el monto ("5 pulsos") en `brand-soft` con `brand-text`.
- Abierta: un separador `line`, el `ConfidenceControl` en su variante de tema y un botón "Guardar" con tilde. Guardar cierra la tarjeta y deja el monto en el chip.
- "Acertar al menos X de las 7" abierta: primero la etiqueta "ELEGÍ CUÁNTAS PREGUNTAS VAS A ACERTAR" (estilo `label`, en mayúsculas) con las píldoras 4, 5, 6 y 7 (la elegida va `brand-soft` con trazo y labio `brand-deep`, como la variante de tema de `ConfidenceControl`; por defecto, 4); después la etiqueta "ELEGÍ CUÁNTOS PULSOS ARRIESGÁS" con las píldoras de monto, la celda "Si acertás" y "Guardar".
- Títulos y descripciones: "Ganar la sesión" / "Acertá más que el resto hoy. Paga ×5,4 con 6 jugadores." (multiplicador y cantidad de jugadores dinámicos) y "Acertar al menos X de las 7" / "Elegí cuántas preguntas creés que vas a acertar del tema de hoy.". Nunca muestres un pozo ni montos de otros jugadores: lo que cobrás no depende de lo que arriesgan los demás.
- Solo una tarjeta abierta a la vez. Poner 0 o no tocarla es válido.
- Encima de las tarjetas: "¿Confiás en tu conocimiento?" con el botón de ayuda "?" (`ghost`, ver `Button` y `Overlay`), la bajada, el chip "62 pulsos disponibles" (`surface-2`, `label`) y "¿Cómo querés arriesgar?".
- El chip de pulsos disponibles baja en el momento al guardar una tarjeta con monto (de 62 a 57 al guardar 5 en "Ganar la sesión") y se recalcula si cambiás el monto o lo pasás a 0. Es una vista previa calculada con el módulo de reglas compartido (ver `ConfidenceControl`). La reserva real ocurre al tocar "Jugar la sesión"; el chip solo la anticipa. No hay una línea aparte con el total arriesgado.
- La referencia dibuja "Guardar" blanco con borde y labio oscuros, que no es ninguna de las cuatro variantes. Va `neutral` (decisión confirmada; no hay quinta variante). En el `Overlay` de "Otro", "Guardar" es `brand` porque el `Overlay` es una capa aparte con su propia acción principal.
- Ventana que vence antes de confirmar: al tocar "Jugar la sesión" el servidor lo rechaza y aparece el bloque de "Carga y error" con "Esta sesión ya cerró. No se movieron pulsos." y `neutral` "Volver a la partida" (no se reservó nada).

### ResultCard (resultado de la pregunta)

Tarjeta que aparece al responder, debajo de las opciones. Referencia: `Pregunta/Respondida.png`.

- Tarjeta `surface` con `radius-lg` y `shadow-soft`. Arriba, el resultado en `display` ("Acertaste") y a la derecha el movimiento con signo (`+5 pulsos` en `brand-text`, `-5 pulsos` en `danger-text`).
- Debajo, la explicación en `body` y `text-muted`.
- Los estados de error y de tiempo vencido siguen la voz sin culpa y se arman igual, con `AnswerCard` y `ResultCard`; todavía no tienen imagen de referencia:

| Estado | `AnswerCard` | Título | Movimiento | Debajo | Temporizador |
| --- | --- | --- | --- | --- | --- |
| Acierto | La elegida pasa a correcta ("Correcta"); las otras tres, atenuadas | "Acertaste" | `+5 pulsos` en `brand-text`; con monto 0, "0 pulsos" en `text-muted` | La explicación | Congelado en el segundo en que respondió, con el tono que tenía |
| Error | La elegida pasa a incorrecta (`coral-soft`, cruz y "Incorrecta"); la correcta dice "Correcta"; las otras dos, atenuadas | "No era esa" | `-5 pulsos` en `danger-text`; con monto 0, "0 pulsos" en `text-muted` | La explicación | Congelado en el segundo en que respondió, con el tono que tenía |
| Tiempo vencido | La correcta dice "Correcta"; las otras tres, atenuadas; ninguna como elegida (no se envió nada) | "Se terminó el tiempo" | "0 pulsos" en `text-muted` | "Cuenta como error, no perdiste pulsos." y después la explicación | Barra vacía (solo la pista `surface-2`) y "0" en `danger-text` |

- En los tres estados, debajo va el botón "Siguiente pregunta".
- Con monto 0 el título no cambia ("Acertaste" o "No era esa"); solo el movimiento pasa a "0 pulsos" neutro.

### Overlay (aviso sobre la pantalla)

Aviso que se abre sobre la pantalla oscurecida para una decisión corta del jugador o para una ayuda; nunca para errores (los errores usan "Carga y error"). Lo usan el monto "Otro" de `ConfidenceControl`, el botón cerrar de la pregunta y el botón de ayuda "?" de la confianza en el tema. Es una capa aparte: puede tener su propio botón principal aunque la pantalla de fondo ya tenga uno. Detalle visual provisorio: todavía no tiene imagen de referencia.

- Un velo (scrim) oscurece la pantalla de fondo; encima, una tarjeta `surface` con `radius-lg` y `shadow-float`. Título en `display`, contenido y uno o dos botones de las cuatro variantes.
- Tocar el velo equivale a la acción de cancelar.
- **Monto "Otro":** "¿Cuántos pulsos arriesgás?", campo numérico con foco automático y teclado numérico, ayuda "Podés arriesgar hasta N pulsos" en `text-muted`, botones "Guardar" (`brand`) y "Cancelar" (`ghost`). Ver `ConfidenceControl`.
- **Salir de la sesión:** "¿Salir de la sesión?", el texto "Podés volver mientras la sesión siga abierta. El tiempo de esta pregunta sigue corriendo." y los botones "Salir" (`coral`) y "Seguir jugando" (`neutral`). Al volver, el jugador va directo a la pregunta que estaba en pantalla si todavía tiene tiempo, o a la siguiente pendiente, sin pantalla intermedia; si la que dejó venció, primero la ve en el estado de tiempo vencido de `ResultCard` y después sigue.
- **Ayuda de la confianza:** "¿Cómo funciona la confianza?", tres líneas: "Ganar la sesión: si hoy acertás más que el resto, cobrás tu monto por el multiplicador.", "Acertar al menos X de las 7: elegí cuántas creés que vas a acertar; cuanto más alto, más paga." y "Los pulsos que pongas se reservan al tocar Jugar la sesión. Poner 0 también vale." Un solo botón `neutral` "Entendido".
- Sin culpa ni rojo: el aviso informa, no reprocha.

### Carga y error (patrón)

Patrón único para toda la app cuando se espera al servidor o falla la conexión.

- **Carga:** bloques `surface-2` con la forma del contenido que va a aparecer (esqueleto), sin spinner y sin cifras inventadas ni viejas. Un botón que espera la respuesta del servidor queda deshabilitado (`surface-2`, sin labio) con el mismo rótulo.
- **Error:** un bloque donde iría el contenido, o justo encima del botón que falló: fondo `surface-2`, el texto "No pudimos conectarnos. Revisá tu conexión y probá de nuevo." en `text-muted` y un botón `neutral` "Reintentar". Sin rojo ni `coral`: no es culpa del jugador. No usa `Overlay`.
- **Reintento automático:** en las acciones de la sesión ("Responder" y "Jugar la sesión") la app reintenta sola 2 veces antes de mostrar el bloque.
- **Ventana que cierra con la pantalla abierta:**
  - Inicio y Detalle de partida: se actualizan solos; chip "Cerrada" (`forest`), desaparece el botón `brand` y queda `neutral` "Ver ranking".
  - Pantalla del tema antes de confirmar: el servidor rechaza "Jugar la sesión" y aparece el bloque con "Esta sesión ya cerró. No se movieron pulsos." y `neutral` "Volver a la partida".
  - En medio de las preguntas: las que faltan cuentan como error sin pulsos; aparece el bloque con "La sesión cerró. Las preguntas que faltaban cuentan como error, sin pulsos." y `neutral` "Volver a la partida".

---

## 4. Plantillas

Pantallas de 390×844 pt, armadas solo con los componentes anteriores. Las de Inicio a Fin de partida forman el primer flujo y tienen referencia en `Referencias-y-definiciones/Pantalla-UI/`, que manda sobre el detalle visual:

- **Inicio** (`Dashboard/Todas.png`): encabezado `forest` con avatar, "Hola de nuevo", nombre y `AuraCounter`; control segmentado "Te toca", "Jugadas", "Todas" (activa en `surface` sobre pista `surface-2`); `MatchCard` de la partida que te toca (si te tocan varias, cada una con su `brand` "Jugar"); etiqueta "Partidas completadas hoy" y `MatchCard` compactas.
- **Detalle de partida** (`Match Detail/Ranking.png`): encabezado `forest` con botón volver (`neutral` cuadrado, el mismo que el cerrar de la Pregunta), chip "Día 3 de 5" (`brand-soft`), título y "6 jugadores · Cierra en 6 h"; tarjeta "Tu puesto 3º" con "+24 pulsos ganados" (o "-8 pulsos perdidos" en `danger-text`, o "sin cambios" en `text-muted`, como `MatchCard`); control segmentado "Ranking" / "Historial"; etiqueta "Posiciones actuales" y `LeaderboardRow`; botón `brand` "Jugar la sesión".
- **Sorteo de tema** (`Topic Reel/Default-1.png`, `Default.png`, `General expanded.png`, `Al menos X expanded.png`; en esta última el selector de X muestra solo 4, 5, 6 y 7, no del 1 al 7): "Descubrí el tema de hoy" con su bajada, `TopicReel`, botón "Descubrir tema"; con el tema revelado, dos `TopicBetCard` y botón `brand` "Jugar la sesión".
- **Pregunta** (`Pregunta/Elegida.png`, `Respondida.png`): encabezado `surface` con chip "Pregunta 3 de 7" (`sky-soft`), botón cerrar `neutral` cuadrado (abre el `Overlay` "¿Salir de la sesión?"), pasos de las 7 preguntas y temporizador con cifra; etiqueta del tema, enunciado, cuatro `AnswerCard`, `ConfidenceControl` por pregunta y botón "Responder". Al responder: tiempo congelado, `ResultCard` (acierto o error) y botón "Siguiente pregunta". Al vencer el tiempo: temporizador en 0 (barra vacía, "0" en `danger-text`), "Responder" deshabilitado mientras llega el veredicto del servidor, `ResultCard` de tiempo vencido y el mismo botón.
- **Fin de partida** (`Fin de partida/Gana.png`): chip `forest` "Partida terminada", título de la partida, "Quedaste 2º de 4 jugadores", `AuraRing` grande con la palabra "Aura" bajo el número y la marca radial del punto de partida, "22 de 25 pulsos para tu 2ª aura", bloque `surface-2` "Ganaste +6" y botón "Continuar". La animación está en `Referencias-y-definiciones/Animaciones/animacion_fin_partida.html`.
- **Tu aura:** aro grande con el aura actual y los pulsos libres, el emblema actual y el siguiente, y aparte la lista de partidas con su bolsa (los pulsos comprometidos no suman al aura).
- **Perfil:** avatar grande, calibración, racha y maestría por tema.

Las versiones HTML están en el artifact del DS (grupo "Plantillas").

---

## 5. Contraste verificado

Calculado con la fórmula WCAG 2.x sobre los valores hex de `tokens.json`. Texto: mínimo 4,5:1; bordes y elementos con significado: mínimo 3:1.

| Tema | Primer plano | Fondo | Ratio | Mínimo | Resultado |
|---|---|---|---|---|---|
| light | `text` | `bg` | 14.82:1 | 4.5:1 | Pasa |
| light | `text-muted` | `bg` | 5.79:1 | 4.5:1 | Pasa |
| light | `text` | `surface` | 16.18:1 | 4.5:1 | Pasa |
| light | `text-muted` | `surface` | 6.32:1 | 4.5:1 | Pasa |
| light | `text` | `surface-2` | 13.93:1 | 4.5:1 | Pasa |
| light | `text-muted` | `surface-2` | 5.44:1 | 4.5:1 | Pasa |
| light | `text` | `brand-soft` | 13.85:1 | 4.5:1 | Pasa |
| light | `text-muted` | `brand-soft` | 5.41:1 | 4.5:1 | Pasa |
| light | `text` | `coral-soft` | 13.23:1 | 4.5:1 | Pasa |
| light | `text-muted` | `coral-soft` | 5.17:1 | 4.5:1 | Pasa |
| light | `text` | `sky-soft` | 13.86:1 | 4.5:1 | Pasa |
| light | `text-muted` | `sky-soft` | 5.41:1 | 4.5:1 | Pasa |
| light | `text` | `violet-soft` | 13.02:1 | 4.5:1 | Pasa |
| light | `text-muted` | `violet-soft` | 5.09:1 | 4.5:1 | Pasa |
| light | `text` | `orange-soft` | 13.69:1 | 4.5:1 | Pasa |
| light | `text-muted` | `orange-soft` | 5.35:1 | 4.5:1 | Pasa |
| light | `text` | `sun-soft` | 14.39:1 | 4.5:1 | Pasa |
| light | `text-muted` | `sun-soft` | 5.62:1 | 4.5:1 | Pasa |
| light | `on-forest` | `forest` | 12.91:1 | 4.5:1 | Pasa |
| light | `on-forest-muted` | `forest` | 7.41:1 | 4.5:1 | Pasa |
| light | `on-brand` | `brand` | 9.29:1 | 4.5:1 | Pasa |
| light | `on-coral` | `coral` | 6.36:1 | 4.5:1 | Pasa |
| light | `on-sky` | `sky` | 7.39:1 | 4.5:1 | Pasa |
| light | `on-violet` | `violet` | 5.68:1 | 4.5:1 | Pasa |
| light | `on-orange` | `orange` | 7.43:1 | 4.5:1 | Pasa |
| light | `on-sun` | `sun` | 10.42:1 | 4.5:1 | Pasa |
| light | `brand-text` | `bg` | 4.83:1 | 4.5:1 | Pasa |
| light | `brand-text` | `surface` | 5.28:1 | 4.5:1 | Pasa |
| light | `brand-text` | `brand-soft` | 4.52:1 | 4.5:1 | Pasa |
| light | `danger-text` | `bg` | 5.34:1 | 4.5:1 | Pasa |
| light | `danger-text` | `surface` | 5.83:1 | 4.5:1 | Pasa |
| light | `danger-text` | `coral-soft` | 4.76:1 | 4.5:1 | Pasa |
| light | `edge` | `bg` | 3.43:1 | 3:1 | Pasa |
| light | `focus-ring` | `bg` | 3.26:1 | 3:1 | Pasa |
| light | `edge` | `surface` | 3.75:1 | 3:1 | Pasa |
| light | `focus-ring` | `surface` | 3.57:1 | 3:1 | Pasa |
| dark | `text` | `bg` | 16.18:1 | 4.5:1 | Pasa |
| dark | `text-muted` | `bg` | 8.48:1 | 4.5:1 | Pasa |
| dark | `text` | `surface` | 14.26:1 | 4.5:1 | Pasa |
| dark | `text-muted` | `surface` | 7.48:1 | 4.5:1 | Pasa |
| dark | `text` | `surface-2` | 12.4:1 | 4.5:1 | Pasa |
| dark | `text-muted` | `surface-2` | 6.5:1 | 4.5:1 | Pasa |
| dark | `text` | `brand-soft` | 11.42:1 | 4.5:1 | Pasa |
| dark | `text-muted` | `brand-soft` | 5.99:1 | 4.5:1 | Pasa |
| dark | `text` | `coral-soft` | 14.02:1 | 4.5:1 | Pasa |
| dark | `text-muted` | `coral-soft` | 7.35:1 | 4.5:1 | Pasa |
| dark | `text` | `sky-soft` | 13.59:1 | 4.5:1 | Pasa |
| dark | `text-muted` | `sky-soft` | 7.13:1 | 4.5:1 | Pasa |
| dark | `text` | `violet-soft` | 13.85:1 | 4.5:1 | Pasa |
| dark | `text-muted` | `violet-soft` | 7.26:1 | 4.5:1 | Pasa |
| dark | `text` | `orange-soft` | 13.13:1 | 4.5:1 | Pasa |
| dark | `text-muted` | `orange-soft` | 6.89:1 | 4.5:1 | Pasa |
| dark | `text` | `sun-soft` | 11.77:1 | 4.5:1 | Pasa |
| dark | `text-muted` | `sun-soft` | 6.17:1 | 4.5:1 | Pasa |
| dark | `on-forest` | `forest` | 9.96:1 | 4.5:1 | Pasa |
| dark | `on-forest-muted` | `forest` | 6.33:1 | 4.5:1 | Pasa |
| dark | `on-brand` | `brand` | 9.29:1 | 4.5:1 | Pasa |
| dark | `on-coral` | `coral` | 6.36:1 | 4.5:1 | Pasa |
| dark | `on-sky` | `sky` | 7.39:1 | 4.5:1 | Pasa |
| dark | `on-violet` | `violet` | 5.12:1 | 4.5:1 | Pasa |
| dark | `on-orange` | `orange` | 7.43:1 | 4.5:1 | Pasa |
| dark | `on-sun` | `sun` | 10.42:1 | 4.5:1 | Pasa |
| dark | `brand-text` | `bg` | 11.04:1 | 4.5:1 | Pasa |
| dark | `brand-text` | `surface` | 9.73:1 | 4.5:1 | Pasa |
| dark | `brand-text` | `brand-soft` | 7.79:1 | 4.5:1 | Pasa |
| dark | `danger-text` | `bg` | 8.27:1 | 4.5:1 | Pasa |
| dark | `danger-text` | `surface` | 7.29:1 | 4.5:1 | Pasa |
| dark | `danger-text` | `coral-soft` | 7.17:1 | 4.5:1 | Pasa |
| dark | `edge` | `bg` | 4.35:1 | 3:1 | Pasa |
| dark | `focus-ring` | `bg` | 9.27:1 | 3:1 | Pasa |
| dark | `edge` | `surface` | 3.84:1 | 3:1 | Pasa |
| dark | `focus-ring` | `surface` | 8.17:1 | 3:1 | Pasa |
| light | `brand-deep` | `surface` | 3.34:1 | 3:1 | Pasa |
| light | `brand-deep` | `bg` | 3.06:1 | 3:1 | Pasa |
| light | `on-brand` | `brand-deep` | 5.71:1 | 4.5:1 | Pasa |
| dark | `brand-deep` | `surface` | 4.73:1 | 3:1 | Pasa |
| dark | `brand-deep` | `bg` | 5.37:1 | 3:1 | Pasa |
| dark | `on-brand` | `brand-deep` | 5.71:1 | 4.5:1 | Pasa |

No verificado: pruebas en dispositivos reales, simulación de daltonismo ni lectores de pantalla. Los bordes de reposo `line` y `line-strong` son decorativos y no se miden.

---

## 6. Implementación en Expo / React Native

- Fuentes: `@expo-google-fonts/urbanist` y `@expo-google-fonts/nunito`; cargalas con `useFonts` antes de mostrar la primera pantalla.
- Labio duro: en iOS usá `shadowOffset {0,4}`, `shadowRadius 0`, `shadowOpacity 1` y `shadowColor` con el `lip-*`; en Android renderizá una vista hermana desplazada 4px detrás del botón con el color del labio.
- Al presionar, desplazá el botón 4px hacia abajo y ocultá el labio (`Pressable` con estilo según `pressed`).
- Sombras blandas (`shadow-soft`, `shadow-float`): `shadowRadius` 20–36 en iOS y `elevation` en Android.
- Cifras tabulares: `fontVariant: ['tabular-nums']`.
- Movimiento: consultá `AccessibilityInfo.isReduceMotionEnabled` y salteá la animación del carrete.
- Tema: elegí el conjunto de colores según `useColorScheme()` y guardalos en un objeto de tema con los nombres de este documento.

---

## 7. Apéndice A: `tokens.css`

```css
:root{--font-display:"Urbanist", "Arial Rounded MT Bold", system-ui, sans-serif;--font-body:"Nunito", system-ui, sans-serif;--space-1:4px;--space-2:8px;--space-3:12px;--space-4:16px;--space-5:20px;--space-6:24px;--space-7:32px;--space-8:48px;--radius-sm:12px;--radius-md:16px;--radius-lg:24px;--radius-xl:32px;--radius-pill:999px;--border-w:2px;--tap-min:52px;--avatar-sm:32px;--avatar-md:44px;--avatar-lg:88px;--icon:24px;--bg:#f3f6ee;--surface:#ffffff;--surface-2:#eaf0e3;--line:#dce5d3;--line-strong:#c6d2bb;--edge:#7a8875;--text:#19231b;--text-muted:#566358;--forest:#26352b;--on-forest:#ffffff;--on-forest-muted:#b9c8bc;--brand:#6fcb1f;--brand-deep:#4e9f12;--brand-soft:#e1f4c8;--on-brand:#0a1206;--brand-text:#3c7a0a;--coral:#ff6378;--coral-deep:#d93a52;--coral-soft:#ffe1e6;--on-coral:#2a0a10;--danger-text:#c0273f;--sky:#5ab0ff;--sky-deep:#2f8be0;--sky-soft:#ddf0ff;--on-sky:#0b1d2e;--violet:#6a4be0;--violet-deep:#4f33b8;--violet-soft:#e9e3ff;--on-violet:#ffffff;--orange:#ff8a3d;--orange-deep:#e06a1c;--orange-soft:#ffe8d6;--on-orange:#2b1405;--sun:#ffc93c;--sun-deep:#e0a516;--sun-soft:#fff1c9;--on-sun:#2b2005;--focus-ring:#2f8be0;--shadow-soft:0 6px 20px rgba(38, 53, 43, 0.10);--shadow-float:0 14px 36px rgba(38, 53, 43, 0.16);--lip-neutral:0 4px 0 0 #c6d2bb;--lip-brand:0 4px 0 0 #4e9f12;--lip-coral:0 4px 0 0 #d93a52;--lip-sky:0 4px 0 0 #2f8be0;--lip-violet:0 4px 0 0 #4f33b8;--lip-orange:0 4px 0 0 #e06a1c;--lip-sun:0 4px 0 0 #e0a516;}
:root[data-theme="dark"]{--bg:#111912;--surface:#1b251d;--surface-2:#243028;--line:#2e3b31;--line-strong:#3d4e41;--edge:#6e8272;--text:#f0f5ea;--text-muted:#a8b6aa;--forest:#2f4034;--on-forest:#f0f5ea;--on-forest-muted:#b9c8bc;--brand:#6fcb1f;--brand-deep:#4e9f12;--brand-soft:#25381a;--on-brand:#0a1206;--brand-text:#8fe04a;--coral:#ff6378;--coral-deep:#d93a52;--coral-soft:#3c1920;--on-coral:#2a0a10;--danger-text:#ff8fa0;--sky:#5ab0ff;--sky-deep:#2f8be0;--sky-soft:#14283a;--on-sky:#0b1d2e;--violet:#8a6ff2;--violet-deep:#6a4be0;--violet-soft:#271f45;--on-violet:#12082e;--orange:#ff8a3d;--orange-deep:#e06a1c;--orange-soft:#3a2415;--on-orange:#2b1405;--sun:#ffc93c;--sun-deep:#e0a516;--sun-soft:#3a3010;--on-sun:#2b2005;--focus-ring:#7dc0ff;--shadow-soft:0 6px 20px rgba(0, 0, 0, 0.45);--shadow-float:0 14px 36px rgba(0, 0, 0, 0.55);--lip-neutral:0 4px 0 0 #0b120d;--lip-brand:0 4px 0 0 #4e9f12;--lip-coral:0 4px 0 0 #d93a52;--lip-sky:0 4px 0 0 #2f8be0;--lip-violet:0 4px 0 0 #6a4be0;--lip-orange:0 4px 0 0 #e06a1c;--lip-sun:0 4px 0 0 #e0a516;}
:root,:root[data-theme="dark"]{--aura-track-on-forest:rgba(255, 255, 255, 0.2);--aura-pill-on-forest:rgba(255, 255, 255, 0.08);--aura-pill-line-on-forest:rgba(255, 255, 255, 0.14);}
```

## 8. Apéndice B: `bundle.css`

```css
/* Trivia DS Suave. Every value comes from tokens.json. */

.d-root { color: var(--text); font-family: var(--font-body); font-size: 16px; line-height: 24px; font-weight: 600; }
.d-stack { display: flex; flex-direction: column; gap: var(--space-3); }
.d-row { display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; }
.d-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
.d-num { font-variant-numeric: tabular-nums; }
.d-muted { color: var(--text-muted); }
.d-btn:focus-visible, .d-answer:focus-visible, .d-pill:focus-visible, .d-iconbtn:focus-visible, .d-tab:focus-visible {
  outline: 3px solid var(--focus-ring); outline-offset: 3px;
}

/* Button: soft body with a hard lip underneath */
.d-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--space-2);
  min-height: var(--tap-min); padding: 0 var(--space-6);
  font: 800 17px/1 var(--font-display); color: var(--on-brand);
  background: var(--brand); border: 0; border-radius: var(--radius-md);
  box-shadow: var(--lip-brand); cursor: pointer;
  transition: transform 100ms ease-out, box-shadow 100ms ease-out;
}
.d-btn:active { transform: translateY(4px); box-shadow: none; }
.d-btn--neutral { background: var(--surface); color: var(--text); border: var(--border-w) solid var(--line-strong); box-shadow: var(--lip-neutral); }
.d-btn--coral { background: var(--coral); color: var(--on-coral); box-shadow: var(--lip-coral); }
.d-btn--ghost { background: transparent; color: var(--text); box-shadow: none; }
.d-btn--ghost:active { transform: none; background: var(--surface-2); }
.d-btn--sm { min-height: 44px; padding: 0 var(--space-4); font-size: 15px; }
.d-btn--block { width: 100%; }
.d-btn:disabled { background: var(--surface-2); color: var(--text-muted); border-color: transparent; box-shadow: none; cursor: not-allowed; transform: none; }
.d-iconbtn { display: grid; place-items: center; width: var(--tap-min); height: var(--tap-min); color: var(--text); background: var(--surface); border: var(--border-w) solid var(--line-strong); border-radius: var(--radius-md); box-shadow: var(--lip-neutral); cursor: pointer; }
.d-iconbtn:active { transform: translateY(4px); box-shadow: none; }
.d-iconbtn--dark { background: transparent; color: var(--on-forest); border-color: var(--on-forest-muted); box-shadow: none; }

/* Chip */
.d-chip { display: inline-flex; align-items: center; gap: var(--space-1); height: 28px; padding: 0 var(--space-3); font: 800 12px/16px var(--font-body); letter-spacing: 0.08em; text-transform: uppercase; color: var(--text); background: var(--surface-2); border-radius: var(--radius-pill); white-space: nowrap; }
.d-chip--brand { background: var(--brand-soft); color: var(--brand-text); }
.d-chip--coral { background: var(--coral-soft); color: var(--danger-text); }
.d-chip--sky { background: var(--sky-soft); color: var(--text); }
.d-chip--sun { background: var(--sun); color: var(--on-sun); }
.d-chip--forest { background: var(--forest); color: var(--on-forest); }

/* Coin */
.d-coins { display: inline-flex; align-items: center; gap: 6px; font: 800 16px/1 var(--font-display); font-variant-numeric: tabular-nums; color: var(--text); }
.d-coins--lg { font-size: 28px; gap: var(--space-2); }
.d-coins--lg .d-coins--up { color: var(--brand-text); }
.d-coins--down { color: var(--danger-text); }

/* Progress / timer bar */
.d-bar { flex: 1; height: 16px; background: var(--surface-2); border-radius: var(--radius-pill); overflow: hidden; }
.d-bar__fill { position: relative; height: 100%; width: var(--p, 100%); background: var(--brand); border-radius: var(--radius-pill); }
.d-bar__fill::after { content: ""; position: absolute; left: 8px; right: 8px; top: 3px; height: 4px; border-radius: var(--radius-pill); background: rgba(255, 255, 255, 0.35); }
.d-bar[data-tone="urgent"] .d-bar__fill { background: var(--coral); }
.d-bar[data-tone="sky"] .d-bar__fill { background: var(--sky); }
.d-timer { display: flex; align-items: center; gap: var(--space-3); }
.d-timer__digits { min-width: 4ch; text-align: right; font: 800 20px/20px var(--font-display); font-variant-numeric: tabular-nums; }
.d-timer[data-tone="urgent"] .d-timer__digits { color: var(--danger-text); }
.d-steps { display: flex; gap: var(--space-1); }
.d-steps i { flex: 1; height: 8px; border-radius: var(--radius-pill); background: var(--surface-2); }
.d-steps i[data-done] { background: var(--forest); }
.d-steps i[data-today] { background: var(--brand); }

/* Answer card */
.d-answer {
  display: flex; align-items: center; gap: var(--space-3); width: 100%; min-height: 64px; padding: var(--space-3) var(--space-4);
  font: 700 17px/22px var(--font-body); text-align: left; color: var(--text);
  background: var(--surface); border: var(--border-w) solid var(--line-strong); border-radius: var(--radius-md);
  box-shadow: var(--lip-neutral); cursor: pointer;
  transition: transform 100ms ease-out, box-shadow 100ms ease-out;
}
.d-answer:active { transform: translateY(4px); box-shadow: none; }
.d-answer__key { flex: none; display: grid; place-items: center; width: 32px; height: 32px; font: 800 14px/1 var(--font-display); color: var(--text); background: var(--surface-2); border-radius: var(--radius-pill); }
.d-answer__text { flex: 1; min-width: 0; }
.d-answer__mark { flex: none; display: inline-flex; align-items: center; gap: 6px; font: 800 12px/1 var(--font-body); letter-spacing: 0.08em; text-transform: uppercase; }
.d-answer[data-state="selected"] { background: var(--surface); border-color: var(--brand-deep); box-shadow: var(--lip-brand); }
.d-answer[data-state="selected"] .d-answer__key { background: var(--brand); color: var(--on-brand); }
.d-answer[data-state="selected"] .d-answer__mark { color: var(--brand-text); }
.d-answer[data-state="correct"] { background: var(--brand-soft); border-color: var(--brand-deep); box-shadow: var(--lip-brand); }
.d-answer[data-state="correct"] .d-answer__key { background: var(--brand); color: var(--on-brand); }
.d-answer[data-state="correct"] .d-answer__mark { color: var(--brand-text); }
.d-answer[data-state="wrong"] { background: var(--coral-soft); border-color: var(--coral-deep); box-shadow: var(--lip-coral); }
.d-answer[data-state="wrong"] .d-answer__key { background: var(--coral); color: var(--on-coral); }
.d-answer[data-state="wrong"] .d-answer__mark { color: var(--danger-text); }
.d-answer[data-state="dim"] { background: var(--surface-2); border-color: transparent; color: var(--text-muted); box-shadow: none; cursor: default; }

/* Confidence control */
.d-conf { display: flex; flex-direction: column; gap: var(--space-3); }
.d-conf__pills { display: grid; grid-template-columns: repeat(5, 1fr); gap: var(--space-2); }
.d-pill { min-height: 48px; font: 800 18px/1 var(--font-display); color: var(--text); background: var(--surface); border: var(--border-w) solid var(--line-strong); border-radius: var(--radius-md); box-shadow: var(--lip-neutral); cursor: pointer; transition: transform 100ms ease-out, box-shadow 100ms ease-out; }
.d-pill[aria-pressed="true"] { background: var(--brand); color: var(--on-brand); border-color: var(--brand); box-shadow: none; transform: translateY(4px); }
.d-conf__sum { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); }
.d-conf__cell { display: flex; flex-direction: column; gap: var(--space-1); padding: var(--space-3); border-radius: var(--radius-md); }
.d-conf__cell--up { background: var(--brand-soft); }
.d-conf__cell--down { background: var(--coral-soft); }
.d-conf__label { font: 800 12px/16px var(--font-body); letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); }

/* Stat pill */
.d-stat { display: inline-flex; align-items: center; gap: var(--space-3); padding: var(--space-2) var(--space-4) var(--space-2) var(--space-2); background: var(--surface); border: var(--border-w) solid var(--line-strong); border-radius: var(--radius-md); }
.d-stat__icon { display: grid; place-items: center; width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--orange); color: var(--on-orange); }
.d-stat__icon--brand { background: var(--brand); color: var(--on-brand); }
.d-stat__icon--sun { background: var(--sun); color: var(--on-sun); }
.d-stat__icon--violet { background: var(--violet); color: var(--on-violet); }
.d-stat__value { font: 800 20px/20px var(--font-display); font-variant-numeric: tabular-nums; }
.d-stat__label { font: 700 13px/16px var(--font-body); color: var(--text-muted); }

/* Avatar */
.d-avatar { display: grid; place-items: center; flex: none; width: var(--avatar-md); height: var(--avatar-md); font: 800 18px/1 var(--font-display); color: var(--on-brand); background: var(--brand); border-radius: var(--radius-pill); box-shadow: 0 0 0 3px var(--surface); }
.d-avatar--sm { width: var(--avatar-sm); height: var(--avatar-sm); font-size: 13px; }
.d-avatar--lg { width: var(--avatar-lg); height: var(--avatar-lg); font-size: 36px; box-shadow: 0 0 0 4px var(--surface); }
.d-avatar--sky { background: var(--sky); color: var(--on-sky); }
.d-avatar--coral { background: var(--coral); color: var(--on-coral); }
.d-avatar--sun { background: var(--sun); color: var(--on-sun); }
.d-avatar--violet { background: var(--violet); color: var(--on-violet); }
.d-avatars { display: flex; }
.d-avatars .d-avatar + .d-avatar { margin-left: -8px; }

/* Topic tile: a colored tile with a mini chart */
.d-tile { position: relative; display: flex; flex-direction: column; justify-content: space-between; gap: var(--space-3); min-height: 168px; padding: var(--space-4); color: var(--on-brand); background: var(--brand); border-radius: var(--radius-lg); box-shadow: var(--lip-brand); overflow: hidden; }
.d-tile--coral { background: var(--coral); color: var(--on-coral); box-shadow: var(--lip-coral); }
.d-tile--sky { background: var(--sky); color: var(--on-sky); box-shadow: var(--lip-sky); }
.d-tile--violet { background: var(--violet); color: var(--on-violet); box-shadow: var(--lip-violet); }
.d-tile--orange { background: var(--orange); color: var(--on-orange); box-shadow: var(--lip-orange); }
.d-tile--sun { background: var(--sun); color: var(--on-sun); box-shadow: var(--lip-sun); }
.d-tile__top { display: flex; align-items: center; justify-content: space-between; font: 800 14px/18px var(--font-body); }
.d-tile__value { font: 800 40px/40px var(--font-display); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
.d-tile__unit { font: 700 14px/18px var(--font-body); opacity: 0.85; }
.d-tile__bars { display: flex; align-items: flex-end; gap: 6px; height: 40px; }
.d-tile__bars i { flex: 1; min-height: 6px; height: var(--h, 50%); border-radius: var(--radius-pill); background: currentColor; opacity: 0.35; }
.d-tile__bars i[data-hi] { opacity: 0.9; }

/* Card */
.d-card { background: var(--surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-soft); padding: var(--space-4); }

/* Match card */
.d-match { display: flex; flex-direction: column; gap: var(--space-4); }
.d-match__meta { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
.d-match__next { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); padding: var(--space-3) var(--space-4); background: var(--surface-2); border-radius: var(--radius-md); }

/* Leaderboard row */
.d-rank { display: grid; grid-template-columns: 36px auto 1fr auto; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--space-4); background: var(--surface); border-radius: var(--radius-md); box-shadow: var(--shadow-soft); }
.d-rank__pos { display: grid; place-items: center; width: 36px; height: 36px; font: 800 20px/1 var(--font-display); }
.d-rank__name { font: 800 16px/20px var(--font-body); }
.d-rank__meta { font: 700 13px/16px var(--font-body); color: var(--text-muted); }
.d-rank__score { text-align: right; font: 800 26px/1 var(--font-display); font-variant-numeric: tabular-nums; }
.d-rank[data-first] { background: var(--brand-soft); }
.d-rank[data-first] .d-rank__pos { background: var(--sun); color: var(--on-sun); border-radius: var(--radius-pill); box-shadow: var(--lip-sun); }
.d-rank[data-me] { background: var(--sky-soft); box-shadow: 0 0 0 2px var(--edge); }
.d-rank[data-out] { background: var(--surface-2); color: var(--text-muted); box-shadow: none; }
.d-rank[data-out] .d-avatar { filter: grayscale(1); }

/* Tab bar: light floating pill */
.d-tabbar { display: flex; align-items: center; justify-content: space-around; gap: var(--space-2); padding: var(--space-2); background: var(--surface); border: var(--border-w) solid var(--line); border-radius: var(--radius-xl); box-shadow: var(--shadow-float); }
.d-tab { display: grid; place-items: center; width: 64px; height: 52px; color: var(--text-muted); background: transparent; border: 0; border-radius: var(--radius-lg); cursor: pointer; }
.d-tab[aria-current="page"] { color: var(--on-brand); background: var(--brand); box-shadow: var(--lip-brand); }

/* Topic reel: one window, topics pass quickly and settle */
.d-reel { position: relative; height: 112px; overflow: hidden; background: var(--surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-float); }
.d-reel::before, .d-reel::after { content: ""; position: absolute; left: 0; right: 0; height: 32px; z-index: 1; pointer-events: none; }
.d-reel::before { top: 0; background: linear-gradient(var(--surface-2), transparent); }
.d-reel::after { bottom: 0; background: linear-gradient(transparent, var(--surface-2)); }
.d-reel__strip { will-change: transform; transform: translateY(0); }
.d-reel__strip[data-spin] { animation: d-reel-blur 2400ms ease-out forwards; transition: transform 2400ms cubic-bezier(0.12, 0.7, 0.1, 1); }
.d-reel__row { height: 112px; display: grid; place-items: center; padding: 0 var(--space-6); text-align: center; font: 800 32px/36px var(--font-display); letter-spacing: -0.02em; color: var(--text); }
.d-reel__row[data-idle] { color: var(--text-muted); font-size: 20px; line-height: 24px; letter-spacing: 0; font-family: var(--font-body); font-weight: 700; }
.d-reel__ptr { position: absolute; top: 50%; width: 14px; height: 24px; margin-top: -12px; background: var(--brand); z-index: 2; }
.d-reel__ptr--l { left: 0; clip-path: polygon(0 0, 100% 50%, 0 100%); }
.d-reel__ptr--r { right: 0; clip-path: polygon(100% 0, 0 50%, 100% 100%); }
@keyframes d-reel-blur { 0% { filter: blur(0); } 12% { filter: blur(3px); } 78% { filter: blur(2px); } 100% { filter: blur(0); } }

/* Phone frame and screen helpers for templates */
.d-phone { position: relative; width: 390px; height: 844px; margin: 0 auto; overflow: hidden; background: var(--bg); border-radius: 44px; box-shadow: 0 0 0 10px var(--forest), var(--shadow-float); }
.d-status { display: flex; align-items: center; justify-content: space-between; height: 44px; padding: 0 var(--space-6); font: 800 14px/1 var(--font-display); }
.d-status--dark { color: var(--on-forest); }
.d-screen { padding: 0 var(--space-5); }
.d-hero { background: var(--forest); color: var(--on-forest); border-radius: 0 0 var(--radius-xl) var(--radius-xl); padding-bottom: var(--space-6); }
.d-hero--brand { background: var(--brand); color: var(--on-brand); }
.d-dock { position: absolute; left: var(--space-5); right: var(--space-5); bottom: var(--space-6); }
.d-segment { display: flex; padding: var(--space-1); background: var(--surface-2); border-radius: var(--radius-pill); }
.d-segment button { flex: 1; min-height: 40px; font: 800 14px/1 var(--font-body); color: var(--text-muted); background: transparent; border: 0; border-radius: var(--radius-pill); cursor: pointer; }
.d-segment button[aria-selected="true"] { color: var(--on-brand); background: var(--brand); box-shadow: var(--lip-brand); }
.d-meter { position: relative; height: 16px; background: var(--surface-2); border-radius: var(--radius-pill); }
.d-meter__zone { position: absolute; top: 0; bottom: 0; left: 35%; width: 30%; background: var(--brand); border-radius: var(--radius-pill); }
.d-meter__pin { position: absolute; top: -6px; left: var(--at, 50%); width: 8px; height: 28px; margin-left: -4px; background: var(--forest); border-radius: var(--radius-pill); box-shadow: 0 0 0 3px var(--surface); }

@media (prefers-reduced-motion: reduce) {
  .d-btn, .d-answer, .d-pill, .d-reel__strip[data-spin] { transition: none; animation: none; }
}


/* Aura: aro de 25 pulsos y contador; bloque de la card de partida (sin aro) */
.d-aura { display: inline-flex; align-items: center; gap: var(--space-2); min-height: var(--tap-min); padding: 0 var(--space-4) 0 var(--space-2); color: var(--on-forest); background: var(--aura-pill-on-forest); border: var(--border-w) solid var(--aura-pill-line-on-forest); border-radius: var(--radius-pill); font-family: var(--font-display); cursor: pointer; }
.d-aura svg { display: block; flex: none; }
.d-aura__n { font: 800 20px/1 var(--font-display); font-variant-numeric: tabular-nums; }
.d-aura__of { margin-left: 1px; font: 700 13px/1 var(--font-body); color: var(--on-forest-muted); }

.d-mblock { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); padding: var(--space-3) var(--space-4); background: var(--surface-2); border-radius: var(--radius-md); }
.d-mblock__bag { display: flex; align-items: center; gap: var(--space-3); flex-wrap: nowrap; }
.d-mblock__big { font: 800 40px/40px var(--font-display); font-variant-numeric: tabular-nums; }
.d-mblock__sub { font: 800 15px/20px var(--font-body); color: var(--text-muted); }
.d-mblock__sub--up { color: var(--brand-text); }
.d-mblock__sub--down { color: var(--danger-text); }
.d-mblock__pos { text-align: right; }
.d-mblock__lb { font: 800 12px/16px var(--font-body); letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); }
.d-mblock__pv { font: 800 20px/26px var(--font-display); white-space: nowrap; }
```
