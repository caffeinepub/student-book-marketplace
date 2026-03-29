import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Book,
  BookCondition,
  CreateBookInput,
  backendInterface as FullBackend,
} from "../backend.d";
import { useActor } from "./useActor";

function fullActor(actor: unknown): FullBackend {
  return actor as FullBackend;
}

export function useFeaturedBooks() {
  const { actor, isFetching } = useActor();
  return useQuery<Book[]>({
    queryKey: ["featuredBooks"],
    queryFn: async () => {
      if (!actor) return [];
      return fullActor(actor).getFeaturedBooks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBrowseBooks(
  search: string,
  condition: BookCondition | null,
  category: string,
) {
  const { actor, isFetching } = useActor();
  return useQuery<Book[]>({
    queryKey: ["browseBooks", search, condition, category],
    queryFn: async () => {
      if (!actor) return [];
      return fullActor(actor).browseBooks(search, condition, category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyListings() {
  const { actor, isFetching } = useActor();
  return useQuery<Book[]>({
    queryKey: ["myListings"],
    queryFn: async () => {
      if (!actor) return [];
      return fullActor(actor).getMyListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListBook() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateBookInput) => {
      if (!actor) throw new Error("Not authenticated");
      return fullActor(actor).listBook(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["featuredBooks"] });
      queryClient.invalidateQueries({ queryKey: ["browseBooks"] });
      queryClient.invalidateQueries({ queryKey: ["myListings"] });
    },
  });
}

export function useMarkAsSold() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return fullActor(actor).markAsSold(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myListings"] });
      queryClient.invalidateQueries({ queryKey: ["browseBooks"] });
      queryClient.invalidateQueries({ queryKey: ["featuredBooks"] });
    },
  });
}

export function useDeleteBook() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return fullActor(actor).deleteBook(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myListings"] });
      queryClient.invalidateQueries({ queryKey: ["browseBooks"] });
      queryClient.invalidateQueries({ queryKey: ["featuredBooks"] });
    },
  });
}
