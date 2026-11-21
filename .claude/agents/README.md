# Agentes de Trivia confianza

Pipeline para bajar un flujo del MVP a la app: `historias-generator` → fase de mapeo (`component-mapper` × N + `consistency-checker`) → `implementacion-planner`, una historia por vez.

Claude Code descubre los subagentes en `.claude/agents/`, por eso viven acá.

## Carpetas que usa

```
docs/
├── 02-historias/historias.md          ← historias-generator
├── 03-component-maps/
│   ├── component-map-HX.md            ← component-mapper (uno por historia)
│   └── _consistency-report.md         ← consistency-checker
└── 04-implementacion/progreso.md      ← implementacion-planner
```

Las entradas son las fuentes del proyecto: `App de trivia diseño del MVP.md`, `Trivia_DS_completo.md` y `Referencias-y-definiciones/`.

## Cómo correrlo

1. **Historias**: pedile a `historias-generator` que baje un flujo del MVP (por defecto, "Primer flujo a desarrollar: jugar una partida activa"). Genera o amplía `docs/02-historias/historias.md` con IDs estables.
2. **Mapeo**: lanzá un `component-mapper` en paralelo por cada historia sin mapear, pasándole el ID, la ruta de historias y la ruta de salida. Si se mapearon 2 o más historias nuevas, corré el `consistency-checker` y revisá su reporte.
3. **Implementación**: con los conflictos resueltos, invocá `implementacion-planner` con el `component-map-HX.md` de la primera historia sin dependencias pendientes. Planifica, implementa paso a paso con tu confirmación y se detiene al terminar cada historia.

## Puntos a tener en cuenta

- Las pantallas listadas en "Faltan en las referencias" del MVP salen como gaps "sin referencia": hay que definirlas antes de cerrar el flujo.
- La economía tiene autoridad en el servidor: ningún agente debe poner cálculo de Pulsos en la app.
- Todavía no hay código: la primera historia que se implemente arranca con el paso de base del proyecto (Expo + TypeScript, fuentes y tema).
