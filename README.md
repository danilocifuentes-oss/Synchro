## Cronista — Frontend Redesign (Techno-gótica)

### Quick dev
1. Instala dependencias:
   - `npm i`
   - `npm i -D @storybook/react @storybook/addon-essentials @dnd-kit/core @dnd-kit/sortable @dnd-kit/modifiers`
2. Ejecuta desarrollo:
   - `npm run dev`
3. Ejecuta Storybook:
   - `npm run storybook`

### Archivos añadidos (alto nivel)
- `app/globals.css` (tokens y estilo global actualizado)
- `components/*` (`NexoWrapper`, `SidebarMesa`, `CharacterStatusPanel`, `ActionRevealButton`, `DiceRollerD10`, `TechnicalHud`, `TerminalLogStream`, `AriaLiveLog`, `SettingsPanel`, etc.)
- `hooks/*` (`usePrefersReducedMotion`, `useActionLogger`, `useWebSocket`, `useKeyboardShortcuts`, `useA11yAnnounce`)
- `context/SettingsContext.tsx`
- `app/(solo)/SoloCampaignApp.tsx`
- `app/(admin)/CommandCenter.tsx` (DnD + WebSocket)
- Stories en `.storybook/`, `components/*.stories.tsx`, `pages/*.stories.tsx`
- Endpoints mínimos: `app/api/chronicle/log`, `app/api/chronicle/export`

### Migration checklist (alto nivel)
- **Fase 0: tokens + fuentes**
  - Añadir tokens e importar en globales.
  - Validar fuentes en `app/layout.tsx`.
  - Smoke test visual.
- **Fase 1: shell + login + hub**
  - Integrar `NexoWrapper`, `TerminalLogStream`, `SchreckNetLogin`.
  - Activar `SettingsProvider` en `app/layout`.
- **Fase 2: sidebar + HUD**
  - Integrar `SidebarMesa`, `TechnicalHud`, `CharacterStatusPanel`.
  - Conectar adaptadores de estado existentes.
- **Fase 3: canal + digest + solo**
  - Integrar panel narrativo y `SoloCampaignApp`.
  - Validar consecuencias con `applyConsequence` y logger.
- **Fase 4: command center + realtime**
  - Integrar `CommandCenter`, `useWebSocket`, widgets reordenables.
  - Exportación CSV y endpoint server-side.
- **Fase 5: QA + accesibilidad**
  - Cobertura Storybook.
  - Flujos de teclado, contraste y tests a11y.
  - Pruebas cross-device y perf audit.
- **Fase 6: cleanup**
  - Retirar CSS legacy.
  - Consolidar tokens.
  - Endurecer endpoints y documentar API interna.

### QA y criterios de aceptación
- Reduced motion respetado (sistema y override).
- Transiciones dinámicas registradas en buffer local + POST a `/api/chronicle/log`.
- Atajos de teclado documentados y sin conflicto crítico.
- Toggle scanline persistente entre sesiones.
- `aria-live` anuncia errores, consecuencias y estados críticos.
- Storybook con variantes mínimas por componente.

### Notas
- Backend: endpoints actuales son mínimos; endurecer autenticación, validación y permisos para producción.
- WebSocket: usar servicio WS productivo (el modo actual es para desarrollo/integración inicial).
