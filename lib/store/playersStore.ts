import { create } from 'zustand'

  export interface Player {
    id: string
    name: string
    position: string
    club: string
    nationality: string
    age: number
    rating: number
    photoUrl?: string
  }

  interface PlayersState {
    players: Player[]
    loading: boolean
    error: string | null
    currentPage: number
    totalPages: number
    totalCount: number
    filters: {
      search: string
      position: string
      club: string
    }
    setPlayers: (players: Player[]) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    setPagination: (currentPage: number, totalPages: number, totalCount: number) => void
    setFilters: (filters: Partial<PlayersState['filters']>) => void
    resetFilters: () => void
  }

  export const usePlayersStore = create<PlayersState>((set) => ({
    players: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    filters: {
      search: '',
      position: '',
      club: '',
    },
    setPlayers: (players) => set({ players }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setPagination: (currentPage, totalPages, totalCount) =>
      set({ currentPage, totalPages, totalCount }),
    setFilters: (newFilters) =>
      set((state) => ({ filters: { ...state.filters, ...newFilters } })),
    resetFilters: () =>
      set({ filters: { search: '', position: '', club: '' } }),
  }))