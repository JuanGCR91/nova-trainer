// backend/src/utils/promptRenderer.ts
export function renderPrompt(template: string, datosCliente: Record<string, any>): string {
  return template.replace(/\[([^\]]+)\]/g, (_, campo) => {
    const key = campo.trim();
    return datosCliente[key] ?? `[${key}]`;
  });
}