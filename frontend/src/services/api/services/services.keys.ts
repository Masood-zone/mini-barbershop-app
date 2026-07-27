export const serviceKeys = {
  all: ["services"] as const,
  list: () => [...serviceKeys.all, "list"] as const,
  details: () => [...serviceKeys.all, "detail"] as const,
  detail: (serviceId: number) => [...serviceKeys.details(), serviceId] as const,
}
