import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import { dashboardKeys } from "@/services/api/dashboard/dashboard.keys"
import {
  createService,
  deleteService,
  getService,
  getServices,
  updateService,
} from "@/services/api/services/services.api"
import { serviceKeys } from "@/services/api/services/services.keys"

export function servicesQueryOptions() {
  return queryOptions({
    queryKey: serviceKeys.list(),
    queryFn: getServices,
  })
}

export function serviceQueryOptions(serviceId: number) {
  return queryOptions({
    queryKey: serviceKeys.detail(serviceId),
    queryFn: () => getService(serviceId),
  })
}

export function useServices() {
  return useQuery(servicesQueryOptions())
}

export function useService(serviceId: number) {
  return useQuery({
    ...serviceQueryOptions(serviceId),
    enabled: Number.isInteger(serviceId) && serviceId > 0,
  })
}

export function useCreateService() {
  const client = useQueryClient()

  return useMutation({
    mutationFn: createService,
    onSuccess: async (service) => {
      client.setQueryData(serviceKeys.detail(service.serviceId), service)
      await Promise.all([
        client.invalidateQueries({ queryKey: serviceKeys.list() }),
        client.invalidateQueries({ queryKey: dashboardKeys.all }),
      ])
    },
  })
}

export function useUpdateService() {
  const client = useQueryClient()

  return useMutation({
    mutationFn: updateService,
    onSuccess: async (service) => {
      client.setQueryData(serviceKeys.detail(service.serviceId), service)
      await client.invalidateQueries({ queryKey: serviceKeys.list() })
    },
  })
}

export function useDeleteService() {
  const client = useQueryClient()

  return useMutation({
    mutationFn: deleteService,
    onSuccess: async (_data, serviceId) => {
      client.removeQueries({ queryKey: serviceKeys.detail(serviceId) })
      await Promise.all([
        client.invalidateQueries({ queryKey: serviceKeys.list() }),
        client.invalidateQueries({ queryKey: dashboardKeys.all }),
      ])
    },
  })
}
