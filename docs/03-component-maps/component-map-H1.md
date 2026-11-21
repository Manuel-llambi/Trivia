# Component Map: H1 - Ver mi aura en el encabezado del inicio

## Resumen de la historia
Como jugador, quiero ver mi aura actual y cuántos pulsos llevo hacia la siguiente en el encabezado del inicio, para saber cómo está mi contador general antes de jugar.

- Aura = `floor(pulsos libres / 25)`. El contador general son los pulsos libres; la bolsa de una partida activa no suma.
- Encabezado: avatar, "Hola de nuevo" y apodo. A la derecha, aro de 25 tramos con el aura adentro y "16/25" al lado. Tramos llenos = `pulsos libres mod 25`.
- Emblema (5, 10, 20, 50, 100 aura) junto al contador, siguiendo al aura actual: sin referencia visual.
- Cargando: sin cifras inventadas. Error: sin valores viejos como actuales, con acción de reintentar. Sin pulsos libres: aro vacío y 0, sin rojo. Si el saldo baja, los tramos se vacían sin animación ni rojo.
- Accesibilidad: "Tu aura: 1, 16 de 25 pulsos para la siguiente". Cifras tabulares.
- Casos borde: 0 pulsos libres con partida activa no es quiebra; saldo múltiplo exacto de 25 muestra aura +1 y 0/25.
- Servidor: entrega saldo libre (libro de Pulsos) y emblema; la app solo deriva aura y tramos.
- Dependencias: ninguna. Prioridad: media.

## Referencias revisadas
- `Referencias-y-definiciones/Pantalla-UI/Dashboard/Todas.png` — encabezado `forest` con esquinas inferiores redondeadas; avatar verde con iniciales "MA"; "Hola de nuevo" en texto secundario y "Manuel" en `display` blanco; a la derecha pastilla translúcida con aro (aura "1") y "16" grande + "/25" más chico y atenuado. No hay emblema.
- `Trivia_DS_completo.md` secciones 1 (Voz, Aura y pulsos, Movimiento, Accesibilidad), 2 (tokens `aura-*-on-forest`, `forest`, tamaños), 3 (`AuraCounter`, `AuraRing`, chips y avatares), 4 (plantilla Inicio) y 6 (Expo/RN).
- `App de trivia diseño del MVP.md` — "Aura, emblemas y cards", "Flujo y pantallas" (Inicio) y "Faltan en las referencias" (el emblema en el encabezado figura como pendiente).
- Código: no existe implementación (no hay `.ts`/`.tsx`). Componentes verificados contra el DS, sin implementación todavía.

## Pantallas involucradas
- Inicio (dashboard), solo el encabezado — plantilla del DS: **Inicio**.
- Toque del contador: abre "Tu aura" (plantilla **Tu aura**). Está fuera del alcance de H1 y no disponible por ahora; ver Riesgos.

## Componentes del DS a usar
- `AuraCounter` — pastilla de `tap-min` de alto sobre `forest`, con aro de 40px, número de aura adentro y "16/25" al lado. Es el componente central de la historia.
- `AuraRing` (tamaño 40px, sobre `forest`) — dentro de `AuraCounter`; 25 tramos, pista `aura-track-on-forest`, llenos en `brand`; con `role="img"`. 40px es el mínimo permitido por el DS.
- Avatar (de "StatPill, chips, pulsos y avatares") — disco con iniciales en `display` sobre `brand` (u otro color de avatar), a la izquierda del saludo.
- Texto de saludo: "Hola de nuevo" en `body-sm` con `on-forest-muted` y apodo en `title` o `heading` con `on-forest`.
- `Button` — para "Reintentar" en el estado de error, con la variante `ghost` (ver Gaps). No usar `brand`: la pantalla ya tiene el `brand` de "Jugar" de la card.

## Componentes a extender
- `AuraCounter` — estados `cargando` y `error` (hoy el DS solo define el estado normal y el de 0 pulsos). Ver Gaps.
- `AuraCounter` — slot de emblema "junto a la pastilla": el DS lo menciona, pero no define tamaño, posición ni estado vacío.
- `AuraCounter` — prop de accesibilidad con el `aria-label` completo (`accessibilityLabel` en RN) y `accessibilityRole="button"` si abre "Tu aura".

## Gaps
- **Emblema en el encabezado** — el DS dice "junto a la pastilla", pero no hay diseño visual de cada emblema ni referencia de ubicación — sin referencia (MVP lo lista en "Faltan en las referencias").
  - **Resolución temporal sugerida**: no renderizar nada para el emblema hasta tener diseño; reservar el slot sin ancho fijo. Si hay que mostrar algo, un texto del umbral ("5 aura") sería inventar: no hacerlo. Provisoria.
- **Estado cargando del contador** — ni el DS ni las referencias lo definen — sin referencia.
  - **Resolución temporal sugerida**: la pastilla `AuraCounter` con aro de pista vacía (`aura-track-on-forest`) y sin número ni "/25" (un guion o espacio vacío), con `accessibilityLabel` "Cargando tu aura". No usar "0" porque sería una cifra inventada. Provisoria.
- **Estado de error al obtener el saldo** — la historia pide no mostrar valores viejos y ofrecer reintentar, pero no dice el patrón — sin referencia / no existe en el DS.
  - **Resolución temporal sugerida**: misma pastilla sin cifras y con ícono de reintento tocable de al menos `tap-min`, o tocar la pastilla para reintentar; texto neutro, sin rojo, sin culpa. Provisoria; es una duda (ver Riesgos).
- **Avatar del encabezado** — la referencia muestra el avatar con dos iniciales ("MA") y de ~48px; el DS define avatares de 32/44/88px y "inicial" (una letra) — discrepancia entre referencia y DS.
  - **Resolución temporal sugerida**: respetar la referencia (iniciales) y usar `avatar-md` (44px) hasta que se defina; señalarlo.
- **Control segmentado "Te toca / Jugadas / Todas"** — aparece en la misma pantalla pero no está en la tabla de componentes del DS; no pertenece a H1 y se resuelve en la historia que lo use.

## Tokens relevantes
- Colores: fondo del encabezado `forest`; texto `on-forest` (apodo, "16") y `on-forest-muted` (saludo, "/25"); pastilla `aura-pill-on-forest` con borde `aura-pill-line-on-forest`; tramos vacíos `aura-track-on-forest`; tramos llenos `brand`; avatar `brand` con `on-brand`. Sin `danger-text` ni `coral` en ningún estado (ni 0 ni baja de saldo). `focus-ring` para foco si la pastilla es tocable.
- Tipografía: `display` (Urbanist 800) para el número de aura, "16" y el apodo; `body`/`body-sm` (Nunito 600) para "Hola de nuevo"; "/25" en `body-sm`. Cifras tabulares en aura y "16/25".
- Espaciado y radios: margen lateral `space-5`; separación avatar-texto `space-3`; alto de pastilla `tap-min` (52px); `radius-pill` para pastilla y avatar; esquinas inferiores del encabezado grandes (`radius-xl` como aproximación: la referencia no lo especifica).
- Sombras y labios: ninguno. `AuraCounter` no lleva labio ni hundimiento de 4px (no es un botón `lip-*`); si se toca, el feedback es de opacidad o foco.

## Patrones de interacción y movimiento
- Actualización de saldo hacia arriba: según el DS, los tramos se llenan de a uno y al completar el aro corre `AuraClose`. Eso lo dispara el cierre de aura (no es de H1) — Movimiento reducido: instantáneo.
- Actualización hacia abajo: los tramos se vacían sin animación, y el número y el emblema bajan si corresponde. Sin rojo, sin transición — Movimiento reducido: igual.
- Primera carga: no hay animación; el aro aparece ya con su valor cuando llega el dato.
- Toque de la pastilla: abre "Tu aura" (fuera de alcance; ver Riesgos). El área táctil es toda la pastilla (>= `tap-min`).

## Datos y autoridad del servidor
- Llega del servidor: saldo de pulsos libres (según el libro de Pulsos), emblema actual, apodo y datos de avatar del jugador. Los cortes de emblemas son configuración del servidor.
- La app nunca calcula: el saldo ni qué cuenta como libre o comprometido en bolsas. Solo deriva para dibujar: aura = `floor(saldo / 25)` y tramos llenos = `saldo mod 25`. El corte de 25 pulsos por aura debería leerse de configuración, no ser una constante en la app (ver Riesgos). El emblema lo informa el servidor; la app no lo deduce del aura.

## Textos de pantalla
- "Hola de nuevo"
- "[apodo del jugador]" (dato del servidor; en la referencia "Manuel")
- "16/25" (valores dinámicos; "16" en `on-forest`, "/25" atenuado)
- Número de aura dentro del aro (dinámico; en la referencia "1")
- `accessibilityLabel`: "Tu aura: 1, 16 de 25 pulsos para la siguiente"
- Cargando (provisorio): `accessibilityLabel` "Cargando tu aura"
- Error (provisorio): texto del reintento sin definir; sugerencia neutra "No pudimos cargar tu aura. Reintentar" (sin culpa, sin rojo)

## Riesgos y dudas
- **Error de saldo**: la historia no define el patrón de feedback ni el texto del reintento; es un punto típico de inconsistencia con las otras historias del inicio (¿reintento en la pastilla, banner, o pull-to-refresh del inicio?). Hace falta decidir una sola convención.
- **Toque de la pastilla**: el DS dice que abre "Tu aura", pero esa pantalla no está disponible por ahora ni figura en los criterios de H1. Decidir si la pastilla es tocable ya (con feedback sin destino) o queda estática hasta que exista la pantalla.
- **Emblema**: sin diseño ni ubicación; el slot queda reservado pero vacío.
- **Constante 25**: aura y tramos dependen de "25 pulsos por aura"; el MVP no lo lista explícitamente entre los valores configurables. Confirmar si va en configuración.
- **Avatar**: la referencia (dos iniciales, ~48px) no coincide con el DS (una inicial, 32/44/88px).
- **Cuando el aura cruza varios auras de una vez** (MVP): el número salta directo; el aro muestra el resto. Esto lo cubre `AuraClose` en otra historia, no H1.
