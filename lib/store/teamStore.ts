import { create } from 'zustand'

  export interface Team {
    id: string
    name: string
    formation: string
    userId: string
    createdAt: string
    updatedAt: string
    teamPlayers: TeamPlayer[]
  }

  export interface TeamPlayer {
    id: string
    teamId: string
    playerId: string
    position: string
    player: {
      id: string
      name: string
      position: string
      club: string
      nationality: string
      age: number
      rating: number
    }
  }

  interface TeamsState {
    teams: Team[]
    loading: boolean
    error: string | null
    setTeams: (teams: Team[]) => void
    addTeam: (team: Team) => void
    updateTeam: (teamId: string, updatedTeam: Team) => void
    deleteTeam: (teamId: string) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
  }

  export const useTeamsStore = create<TeamsState>((set) => ({
    teams: [],
    loading: false,
    error: null,
    setTeams: (teams) => set({ teams }),
    addTeam: (team) => set((state) => ({ teams: [team, ...state.teams] })),
    updateTeam: (teamId, updatedTeam) =>
      set((state) => ({
        teams: state.teams.map((team) =>
          team.id === teamId ? updatedTeam : team
        ),
      })),
    deleteTeam: (teamId) =>
      set((state) => ({
        teams: state.teams.filter((team) => team.id !== teamId),
      })),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
  }))