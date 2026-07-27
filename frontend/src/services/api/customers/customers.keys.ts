export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (search: string) => [...customerKeys.lists(), { search }] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (customerId: number) =>
    [...customerKeys.details(), customerId] as const,
}
