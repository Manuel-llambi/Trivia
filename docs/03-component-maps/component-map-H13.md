# Component Map: H13 - Ver el resultado de una respuesta incorrecta

## Resumen de la historia
Como jugador, quiero ver que erré, cuántos pulsos perdí, cuál era la correcta y la explicación, para aprender sin sentir culpa.

- Tiempo congelado en el segundo en que respondió; la opción elegida pasa a "Incorrecta" (`coral-soft`, cruz y la palabra); la correcta dice "Correcta"; las otras dos se atenúan.
- Tarjeta de resultado "No era esa", movimiento "-5 pulsos" en `danger-text` (con monto 0, "0 pulsos" en `text-muted`) y debajo la explicación.
- Botón "Siguiente pregunta".
- Servidor: igual que H12, resuelve, registra el movimiento y revela la correcta solo después de responder.
- Casos borde: error que deja la bolsa total en 0 dispara la expulsión (H18, fuera de alcance en esta tanda). Si deja en 0 solo los disponibles y hay reservas, sigue con monto 0.
- Dependencia: H12. Prioridad alta. Sin imagen de referencia del elemento central.

## Referencias revisadas
- `Referencias-y-definiciones/Pantalla-UI/Pregunta/Respondida.png` — base del layout: chip "PREGUNTA 3 DE 7", botón cerrar, 7 pasos (2 `forest`, 1 `brand`, 4 `surface-2`), barra de tiempo con cifra "0:09", etiqueta de tema, enunciado, cuatro `AnswerCard` (correcta con tilde y "CORRECTA", tres atenuadas), `ResultCard` con "Acertaste" / "+5 pulsos" y botón `brand` "Siguiente pregunta" anclado abajo. Es el estado de acierto: el de error se deriva de él.
- `Referencias-y-definiciones/card_states.png` — revisada; es de cards de partida (MatchCard), no aporta al estado de error. Solo confirma el uso de `danger-text` para "-2 perdidos".
- No hay imagen del estado de error: definido en texto (DS sección 3 `ResultCard`, MVP "Primer flujo" paso 6).

## Pantallas involucradas
- Pregunta, estado "respondida con error" — plantilla del DS: **Pregunta** (sección 4), subestado "Al responder: tiempo congelado, `ResultCard` (acierto o error) y botón Siguiente pregunta".
- Destino del botón: siguiente Pregunta (H11) o, tras la 7ª, el Resumen del día (H17), que lleva al Detalle de partida con `brand` "Ver partida" (N2, PO 23/11/2026).

## Componentes del DS a usar
- `AnswerCard` (incorrecta) — la opción elegida: `coral-soft`, trazo `coral-deep`, labio `lip-coral`, cruz y palabra "Incorrecta".
- `AnswerCard` (correcta) — la opción correcta: `brand-soft`, trazo y labio `brand-deep`, tilde y "Correcta".
- `AnswerCard` (atenuada) x2 — las otras dos: `surface-2`, sin labio ni borde, texto `text-muted`, letra en disco `surface`.
- `ResultCard` (estado Error) — título "No era esa", movimiento con signo, explicación debajo.
- `ProgressBar` (temporizador, congelado) — barra y cifra detenidas en el segundo de la respuesta; tono normal salvo que haya quedado en 5 s o menos (ver dudas).
- `ProgressBar` (pasos) — 7 pasos de la sesión; el actual en `brand`.
- `Button` `brand` — "Siguiente pregunta" (único botón fuerte de la pantalla).
- `Button` `neutral` cuadrado (botón cerrar) — sigue visible en el encabezado y abre el `Overlay` "¿Salir de la sesión?" de H10/H11.
- Chip "Pregunta N de 7" (`sky-soft`) — encabezado.

## Componentes a extender
- `AnswerCard` — el DS define el estado incorrecta pero la cruz no tiene ícono especificado; usar el mismo set de íconos que el tilde, mismo tamaño y posición (a la derecha, junto a la palabra), `danger-text` para ícono y palabra.
- `ResultCard` — soportar la variante Error con dos tonos de movimiento: `danger-text` con signo (`-N pulsos`) y `text-muted` para cero.
- `ProgressBar` (temporizador) — estado "congelado": sin animar y sin anunciar de nuevo.

## Gaps
- Estado Error de `ResultCard` y `AnswerCard` incorrecta con imagen — sin referencia (definido solo en texto).
  - **Resolución temporal sugerida**: construir con la estructura exacta de `Respondida.png` cambiando título, color del movimiento y estado de las opciones, tal como lo describe el DS. Marcar como provisorio hasta que haya imagen.
- Ícono de cruz y su ubicación — no existe en el DS (solo "cruz").
  - **Resolución temporal sugerida**: espejar el tilde de "Correcta" con una cruz del mismo set de íconos.
- Qué pasa con el `ConfidenceControl` al responder — sin referencia (`Respondida.png` no lo muestra).
  - **Resolución temporal sugerida**: ocultarlo, como en la referencia, y mostrar `ResultCard` en su lugar; el botón "Responder" también desaparece.
- Feedback si falla la red al recibir el resultado — sin definición en la historia.
  - **Resolución temporal sugerida**: no inventar patrón; ver "Riesgos y dudas".
- Expulsión por bolsa en 0 (H18) — resuelto por el PO (N3, 23/11/2026): si la bolsa llega a 0 en esta pregunta, la sesión termina ahí y la hoja de expulsión aparece directamente, sin resumen del día; su cierre lleva al Detalle de partida. El `ResultCard` de error no cambia.

## Tokens relevantes
- Colores: `coral-soft` (fondo de la elegida; `#ffe1e6` light), `coral-deep` (trazo), `danger-text` (`#c0273f` light / `#ff8fa0` dark: palabra "Incorrecta", ícono y `-N pulsos`), `brand-soft` + `brand-deep` (correcta), `surface-2` y `text-muted` (atenuadas y "0 pulsos"), `surface` (ResultCard), `bg`, `text`, `sky-soft` (chip), `forest`/`brand` (pasos), `on-brand` sobre el botón. Contrastes `danger-text` sobre `coral-soft`: 4,76:1 light, 7,17:1 dark (pasa).
- Tipografía: Urbanist 800 (`display`) para el título "No era esa", el movimiento y la cifra del temporizador; Nunito 600 (`body`) para enunciado, opciones y explicación; `label` en mayúsculas para el tema y el chip. Cifras tabulares en el temporizador y los pulsos.
- Espaciado y radios: margen lateral `space-5`; `radius-lg` en `ResultCard`; `radius-md` en botones; alto mínimo de `AnswerCard` 64px; táctiles de al menos `tap-min` (52px).
- Sombras y labios: `lip-coral` (incorrecta), `lip-brand` / `brand-deep` (correcta y botón), sin labio en atenuadas, `shadow-soft` en `ResultCard`.

## Patrones de interacción y movimiento
- Revelación del resultado: las opciones cambian de estado y aparece `ResultCard` debajo, sin festejo ni animación especial. Bajar de pulsos no se anima. — Movimiento reducido: el cambio es instantáneo (el DS pide quitar la transición de `AnswerCard`).
- Temporizador congelado: la barra y la cifra quedan fijas en el segundo en que respondió. — Movimiento reducido: igual.
- Opciones ya no presionables tras responder (no hay segundo intento); solo "Siguiente pregunta" es interactivo, con labio de 4 px y hundimiento al presionar.
- Accesibilidad: el resultado va con palabra e ícono, no solo color; anunciar a lectores de pantalla el resultado ("No era esa", pérdida, correcta) una sola vez; el temporizador no vuelve a anunciar.
- Sin vibración ni sonido en el error (solo `AuraClose` tiene vibración suave).

## Datos y autoridad del servidor
- Llega del servidor: si la respuesta fue incorrecta, cuál es la correcta (recién ahora), el movimiento de pulsos resuelto (-N o 0), la explicación, el segundo exacto de la respuesta para congelar la barra y el estado de la bolsa (para H11/H18).
- La app nunca calcula: pulsos perdidos, si la respuesta fue correcta, la correcta antes de responder, el cronómetro (20 s visibles, 22 s aceptados), ni la expulsión. Muestra lo que el servidor registró en el libro de Pulsos. Si se corta la conexión después de responder, al volver muestra el resultado registrado.

## Textos de pantalla
- "Pregunta 3 de 7" (chip, N dinámico; en `Respondida.png` va en mayúsculas por el estilo `label`)
- Etiqueta de tema, p. ej. "Geografía"; enunciado de la pregunta y cuatro opciones (A a D) vienen de los datos
- "Incorrecta" (en la opción elegida)
- "Correcta" (en la opción correcta)
- "No era esa" (título de `ResultCard`)
- "-5 pulsos" (monto dinámico, `danger-text`); con monto 0: "0 pulsos" (`text-muted`)
- Explicación de la pregunta (dato del servidor)
- "Siguiente pregunta"
- Cerrar: "¿Salir de la sesión?" / "Podés volver mientras la sesión siga abierta. El tiempo de esta pregunta sigue corriendo." / "Salir" / "Seguir jugando" (de H10; no cambia aquí)
- Corrección aplicada: ninguna de la lista de tipeo del DS toca esta pantalla; se evita "apuesta"/"apostar" y no se escribe "Si errás o vence".

## Riesgos y dudas
- Estado sin imagen de referencia: todo el diseño de error es provisorio; conviene pedir una imagen antes de cerrar la implementación.
- Error de red al enviar o recibir el resultado: la historia no dice cómo mostrarlo (toast, banner o pantalla). No se eligió patrón; hay que decidirlo de forma común con H12 y H14.
- Plural y cero: "-1 pulsos" o "-1 pulso"; los textos del DS siempre dicen "pulsos". Confirmar si se singulariza el 1.
- Timer congelado con 5 s o menos: no está definido si la barra se queda en `coral` (tono urgente) o vuelve a `brand` al responder. Conservador: mantener el tono que tenía al responder.
- Tras la 7ª pregunta, "Siguiente pregunta" lleva al Resumen del día (H17); sigue abierto si el rótulo del botón cambia en esa última pregunta.
- Expulsión (H18) fuera de alcance: no queda definido qué ve el jugador si este error deja la bolsa total en 0 en medio de una sesión; la regla del MVP dice que se entera al abrir la partida, así que H13 no muestra aviso.
- Componentes verificados contra el DS, sin implementación todavía (no hay código en el repo).
