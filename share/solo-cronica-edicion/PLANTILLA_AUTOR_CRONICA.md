# Plantilla de Autor · Crónica Solitaria

Este documento es una base para escribir una nueva crónica sin romper el motor actual.

## 1) Estructura mínima obligatoria

- **Capítulo**: `id`, `title`, `description`, `startSceneId`, `scenes[]`
- **Escena**: `id`, `chapterId`, `title`, `text`, `options[]`
- **Opción**: `id`, `type`, `text`, `requirement`, `nextSceneId`

## 2) Formato recomendado de escena

Usa siempre esta convención en `scene.text`:

```txt
CONTEXTO: Lugar, hora, atmósfera.

NARRACIÓN: Prosa jugable de la escena.
```

## 3) Formato recomendado de opción

Usa este molde en `option.text`:

```txt
OPCIÓN A [ETIQUETA]: Verbo de acción claro para el jugador.

PUENTE: Lo que ocurre al elegir esta acción (transición narrativa).

CONSECUENCIA: Resultado diegético inmediato.

RESULTADO: Efectos esperados y escena de destino.
```

> Nota: `RESULTADO` es texto para edición humana; la lógica real la define `effects[]` y `nextSceneId`.

## 4) Tipos de opción esperados

- `dialogue`: opción general, sin tirada específica por disciplina/habilidad.
- `discipline`: opción asociada a disciplina (puede gatillar Despertar si hay tirada).
- `skill`: opción asociada a habilidad.
- `clan`: opción exclusiva de clan.

## 5) Requisitos más usados

- Sin requisito:
```ts
{ type: "none" }
```

- Por disciplina:
```ts
{ type: "discipline", discipline: "presence", minLevel: 1 }
```

- Por habilidad:
```ts
{ type: "skill", skill: "perspicacia", minLevel: 1 }
```

- Por bandera:
```ts
{ type: "flag", flag: "mi_flag", equals: true }
```

- Compuesto:
```ts
{
  type: "all",
  requirements: [
    { type: "flag", flag: "mi_flag", equals: true },
    { type: "not", requirement: { type: "flag", flag: "otra_flag", equals: true } },
  ],
}
```

## 6) Efectos narrativos/mecánicos frecuentes

```ts
effects: [
  { type: "setFlag", flag: "mi_flag" },
  { type: "hungerDelta", delta: 1 },
  { type: "willpowerDelta", delta: -1 },
  { type: "humanityDelta", delta: -1 },
  { type: "addStateTag", tag: "ruta_inicial" },
  { type: "setRoute", route: "main" },
]
```

## 7) Plantilla TS de capítulo (copiar y adaptar)

```ts
import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter01: SoloChapter = {
  id: "chapter01",
  title: "NUEVA CRÓNICA · CAPÍTULO 1",
  description: "Resumen editorial del capítulo.",
  startSceneId: "n1_0",
  scenes: [
    {
      id: "n1_0",
      chapterId: "chapter01",
      title: "[ESCENA 1.0]: TÍTULO",
      text: `CONTEXTO: ...

NARRACIÓN: ...`,
      options: [
        {
          id: "n1_0_opcion_a",
          type: "dialogue",
          text: `OPCIÓN A [CAMINO ESTÁNDAR]: ...

PUENTE: ...

CONSECUENCIA: ...

RESULTADO: ...`,
          requirement: { type: "none" },
          nextSceneId: "n1_1",
          effects: [{ type: "setFlag", flag: "n1_0_a" }],
        },
      ],
    },
    {
      id: "n1_1",
      chapterId: "chapter01",
      title: "[ESCENA 1.1]: TÍTULO",
      text: `CONTEXTO: ...

NARRACIÓN: ...`,
      options: [],
    },
  ],
};
```

## 8) Checklist de consistencia (antes de guardar)

- Toda `nextSceneId` apunta a una escena existente del mismo capítulo.
- Cada flag importante tiene al menos un uso posterior.
- No hay escena final con texto vacío.
- Si una consecuencia menciona costo/beneficio, existe en `effects[]`.
- Si una opción depende de requisito narrativo, usar `requirement` o `visibilityRequirement` (según corresponda).

## 9) Flujo recomendado de trabajo

1. Escribir capítulo en TS con esta plantilla.
2. Ejecutar:
   - `npm run solo:validate`
   - `npx tsc --noEmit`
3. Exportar hoja editorial:
   - `npm run solo:export-edicion`

---

## 10) Plantilla V2 · Rutas múltiples y finales distintos

Este bloque añade un patrón listo para:

- 3 caminos jugables (`diplomacia`, `violencia`, `intriga`)
- convergencia en escena de cierre
- 3 finales canónicos + 1 final fatal

### 10.1 Convención de nombres recomendada

- **Flags de ruta temprana**
  - `route_diplomacia`
  - `route_violencia`
  - `route_intriga`
- **Flags de transición de capítulo**
  - `chapter_pending_chapter02`
- **Etiquetas de estado**
  - `ruta_cap2_diplomacia`
  - `ruta_cap2_violencia`
  - `ruta_cap2_intriga`
- **Finales**
  - `setEnding: endingA | endingB | endingC`
- **Fatal**
  - `fatalOutcome: { id, title, body }`

### 10.2 Diagrama narrativo sugerido

```txt
n1_0
 ├─ A (Diplomacia) -> n1_1  [setFlag: route_diplomacia]
 ├─ B (Violencia)  -> n1_1  [setFlag: route_violencia]
 └─ C (Intriga)    -> n1_1  [setFlag: route_intriga]

n1_1 (escena de evaluación / consecuencia por ruta)
 └─ Continuar -> n1_cierre

n1_cierre (opciones condicionales por ruta)
 ├─ Final A (endingA)
 ├─ Final B (endingB)
 ├─ Final C (endingC)
 └─ Colapso fatal (fatalOutcome)
```

### 10.3 Esqueleto TS V2 (copiar y adaptar)

```ts
import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter01: SoloChapter = {
  id: "chapter01",
  title: "NUEVA CRÓNICA · CAPÍTULO 1",
  description: "Capítulo base con rutas múltiples y finales diferenciados.",
  startSceneId: "n1_0",
  scenes: [
    {
      id: "n1_0",
      chapterId: "chapter01",
      title: "[ESCENA 1.0]: APERTURA",
      text: `CONTEXTO: Punto de partida.

NARRACIÓN: Presentación del conflicto inicial.`,
      options: [
        {
          id: "n1_0_diplomacia",
          type: "dialogue",
          text: `OPCIÓN A [DIPLOMACIA]: Negociar antes de escalar.

PUENTE: Tomas control de la conversación.

CONSECUENCIA: Queda abierta una salida política.

RESULTADO: route_diplomacia | IR A [ESCENA 1.1]`,
          requirement: { type: "none" },
          nextSceneId: "n1_1",
          effects: [{ type: "setFlag", flag: "route_diplomacia" }],
        },
        {
          id: "n1_0_violencia",
          type: "dialogue",
          text: `OPCIÓN B [VIOLENCIA]: Imponerte por fuerza.

PUENTE: Aceleras el conflicto.

CONSECUENCIA: Obtienes control inmediato, pero dejas rastro.

RESULTADO: route_violencia | humanityDelta: -1 | IR A [ESCENA 1.1]`,
          requirement: { type: "none" },
          nextSceneId: "n1_1",
          effects: [{ type: "setFlag", flag: "route_violencia" }, { type: "humanityDelta", delta: -1 }],
        },
        {
          id: "n1_0_intriga",
          type: "dialogue",
          text: `OPCIÓN C [INTRIGA]: Operar en sombras.

PUENTE: Tomas distancia y observas.

CONSECUENCIA: Consigues información clave para más adelante.

RESULTADO: route_intriga | IR A [ESCENA 1.1]`,
          requirement: { type: "none" },
          nextSceneId: "n1_1",
          effects: [{ type: "setFlag", flag: "route_intriga" }],
        },
      ],
    },
    {
      id: "n1_1",
      chapterId: "chapter01",
      title: "[ESCENA 1.1]: CONSECUENCIAS",
      text: `CONTEXTO: El entorno reacciona a tu enfoque.

NARRACIÓN: Se prepara el cierre del capítulo.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "route_diplomacia", equals: true },
          text: "Tu postura diplomática reduce fricción inmediata.",
        },
        {
          requirement: { type: "flag", flag: "route_violencia", equals: true },
          text: "Tu rastro violento aumenta la presión externa.",
        },
        {
          requirement: { type: "flag", flag: "route_intriga", equals: true },
          text: "Tu ruta de intriga te entrega ventaja de contexto.",
        },
      ],
      options: [
        {
          id: "n1_1_continuar",
          type: "dialogue",
          text: `Continuar al cierre del capítulo.`,
          requirement: { type: "none" },
          nextSceneId: "n1_cierre",
        },
      ],
    },
    {
      id: "n1_cierre",
      chapterId: "chapter01",
      title: "[ESCENA 1.END]: RESOLUCIÓN",
      text: `CONTEXTO: Cierre del capítulo.

NARRACIÓN: Tus decisiones definen la forma de avanzar.`,
      options: [
        {
          id: "n1_final_a",
          type: "dialogue",
          requirement: { type: "flag", flag: "route_diplomacia", equals: true },
          text: `Final diplomático.

RESULTADO: endingA | chapter_pending_chapter02`,
          nextSceneId: "n1_end",
          effects: [
            { type: "setEnding", endingId: "endingA" },
            { type: "setFlag", flag: "chapter_pending_chapter02" },
            { type: "addStateTag", tag: "ruta_cap2_diplomacia" },
            { type: "setRoute", route: "main" },
          ],
        },
        {
          id: "n1_final_b",
          type: "dialogue",
          requirement: { type: "flag", flag: "route_violencia", equals: true },
          text: `Final de imposición.

RESULTADO: endingB | chapter_pending_chapter02`,
          nextSceneId: "n1_end",
          effects: [
            { type: "setEnding", endingId: "endingB" },
            { type: "setFlag", flag: "chapter_pending_chapter02" },
            { type: "addStateTag", tag: "ruta_cap2_violencia" },
            { type: "setRoute", route: "w" },
          ],
        },
        {
          id: "n1_final_c",
          type: "dialogue",
          requirement: { type: "flag", flag: "route_intriga", equals: true },
          text: `Final de intriga.

RESULTADO: endingC | chapter_pending_chapter02`,
          nextSceneId: "n1_end",
          effects: [
            { type: "setEnding", endingId: "endingC" },
            { type: "setFlag", flag: "chapter_pending_chapter02" },
            { type: "addStateTag", tag: "ruta_cap2_intriga" },
            { type: "setRoute", route: "q" },
          ],
        },
        {
          id: "n1_final_fatal",
          type: "dialogue",
          requirement: { type: "humanityMin", min: 1 },
          text: `RIESGO: Forzar una salida imposible.`,
          nextSceneId: "n1_end",
          effects: [
            {
              type: "fatalOutcome",
              id: "colapso_nexo",
              title: "Colapso del plan",
              body: "Tu operación se derrumba antes de consolidar ruta.",
            },
          ],
        },
      ],
    },
    {
      id: "n1_end",
      chapterId: "chapter01",
      title: "Cierre del capítulo",
      text: `CONTEXTO: Umbral del siguiente capítulo.

NARRACIÓN: El sistema queda listo para continuar con la ruta resultante.`,
      options: [],
    },
  ],
};
```

### 10.4 Reglas para que no se rompa la narrativa

- Cada opción de ruta debe setear su flag de ruta.
- Cada final debe:
  - setear `setEnding` o `fatalOutcome`,
  - setear `chapter_pending_*` si debe continuar.
- Si usas `setRoute`, úsalo de forma consistente por estilo narrativo.
- En capítulo siguiente, consume `stateTags`/`flags` para dar payoff.

