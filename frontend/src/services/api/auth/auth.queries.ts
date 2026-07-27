import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import { getCurrentUser, login, logout } from "@/services/api/auth/auth.api"
import { authKeys } from "@/services/api/auth/auth.keys"

export function currentUserQueryOptions() {
  return queryOptions({
    queryKey: authKeys.me(),
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 60_000,
  })
}

export function useCurrentUser() {
  return useQuery(currentUserQueryOptions())
}

export function useLogin() {
  const client = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      client.setQueryData(authKeys.me(), user)
    },
  })
}

export function useLogout() {
  const client = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      client.removeQueries({ queryKey: authKeys.all })
    },
  })
}
