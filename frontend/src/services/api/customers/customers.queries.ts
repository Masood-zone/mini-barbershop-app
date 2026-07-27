import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
} from "@/services/api/customers/customers.api"
import { customerKeys } from "@/services/api/customers/customers.keys"
import { dashboardKeys } from "@/services/api/dashboard/dashboard.keys"

export function customersQueryOptions(search = "") {
  return queryOptions({
    queryKey: customerKeys.list(search),
    queryFn: () => getCustomers(search),
  })
}

export function customerQueryOptions(customerId: number) {
  return queryOptions({
    queryKey: customerKeys.detail(customerId),
    queryFn: () => getCustomer(customerId),
  })
}

export function useCustomers(search = "") {
  return useQuery(customersQueryOptions(search))
}

export function useCustomer(customerId: number) {
  return useQuery({
    ...customerQueryOptions(customerId),
    enabled: Number.isInteger(customerId) && customerId > 0,
  })
}

export function useCreateCustomer() {
  const client = useQueryClient()

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: async (customer) => {
      client.setQueryData(customerKeys.detail(customer.customerId), customer)
      await Promise.all([
        client.invalidateQueries({ queryKey: customerKeys.lists() }),
        client.invalidateQueries({ queryKey: dashboardKeys.all }),
      ])
    },
  })
}

export function useUpdateCustomer() {
  const client = useQueryClient()

  return useMutation({
    mutationFn: updateCustomer,
    onSuccess: async (customer) => {
      client.setQueryData(customerKeys.detail(customer.customerId), customer)
      await client.invalidateQueries({ queryKey: customerKeys.lists() })
    },
  })
}

export function useDeleteCustomer() {
  const client = useQueryClient()

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: async (_data, customerId) => {
      client.removeQueries({ queryKey: customerKeys.detail(customerId) })
      await Promise.all([
        client.invalidateQueries({ queryKey: customerKeys.lists() }),
        client.invalidateQueries({ queryKey: dashboardKeys.all }),
      ])
    },
  })
}
