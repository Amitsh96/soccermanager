import { create } from 'zustand'

export interface FormationSlot {
  id: string
  position: string
  x: number
  y: number
  playerId?: string
  player?: {
    id: string
    name: string
    position: string
    club: string
    rating: number
  }
}

export interface Formation {
  name: string
  positions: FormationSlot[]
}

interface TeamBuilderState {
  currentTeamId: string | null
  teamName: string
  formation: string
  slots: FormationSlot[]
  availablePlayers: any[]
  loading: boolean
  error: string | null

  // Actions
  setTeam: (teamId: string, teamName: string, formation: string) => void
  setFormation: (formationName: string) => void
  assignPlayer: (slotId: string, player: any) => void
  removePlayer: (slotId: string) => void
  setAvailablePlayers: (players: any[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

// Formation layouts (position coordinates on the field)
const formations: { [key: string]: Formation } = {
  '4-3-3': {
    name: '4-3-3',
    positions: [
      // Forwards
      { id: 'lw', position: 'LW', x: 25, y: 18 },
      { id: 'st', position: 'ST', x: 50, y: 18 },
      { id: 'rw', position: 'RW', x: 75, y: 18 },

      // Midfielders
      { id: 'cm1', position: 'CM', x: 30, y: 42 },
      { id: 'cm2', position: 'CM', x: 50, y: 42 },
      { id: 'cm3', position: 'CM', x: 70, y: 42 },

      // Defenders
      { id: 'lb', position: 'LB', x: 20, y: 66 },
      { id: 'cb1', position: 'CB', x: 40, y: 66 },
      { id: 'cb2', position: 'CB', x: 60, y: 66 },
      { id: 'rb', position: 'RB', x: 80, y: 66 },

      // Goalkeeper
      { id: 'gk', position: 'GK', x: 50, y: 88 },
    ],
  },
  '4-4-2': {
    name: '4-4-2',
    positions: [
      // Forwards
      { id: 'st1', position: 'ST', x: 40, y: 18 },
      { id: 'st2', position: 'ST', x: 60, y: 18 },

      // Midfielders
      { id: 'lm', position: 'LM', x: 20, y: 42 },
      { id: 'cm1', position: 'CM', x: 40, y: 42 },
      { id: 'cm2', position: 'CM', x: 60, y: 42 },
      { id: 'rm', position: 'RM', x: 80, y: 42 },

      // Defenders
      { id: 'lb', position: 'LB', x: 20, y: 66 },
      { id: 'cb1', position: 'CB', x: 40, y: 66 },
      { id: 'cb2', position: 'CB', x: 60, y: 66 },
      { id: 'rb', position: 'RB', x: 80, y: 66 },

      // Goalkeeper
      { id: 'gk', position: 'GK', x: 50, y: 88 },
    ],
  },
  '3-5-2': {
    name: '3-5-2',
    positions: [
      // Forwards
      { id: 'st1', position: 'ST', x: 40, y: 18 },
      { id: 'st2', position: 'ST', x: 60, y: 18 },

      // Midfielders
      { id: 'lwb', position: 'LWB', x: 15, y: 42 },
      { id: 'cm1', position: 'CM', x: 35, y: 42 },
      { id: 'cm2', position: 'CM', x: 50, y: 42 },
      { id: 'cm3', position: 'CM', x: 65, y: 42 },
      { id: 'rwb', position: 'RWB', x: 85, y: 42 },

      // Defenders
      { id: 'cb1', position: 'CB', x: 30, y: 66 },
      { id: 'cb2', position: 'CB', x: 50, y: 66 },
      { id: 'cb3', position: 'CB', x: 70, y: 66 },

      // Goalkeeper
      { id: 'gk', position: 'GK', x: 50, y: 88 },
    ],
  },
  '4-2-3-1': {
    name: '4-2-3-1',
    positions: [
      // Forward
      { id: 'st', position: 'ST', x: 50, y: 18 },

      // Attacking Midfielders
      { id: 'lw', position: 'LW', x: 25, y: 30 },
      { id: 'cam', position: 'CAM', x: 50, y: 30 },
      { id: 'rw', position: 'RW', x: 75, y: 30 },

      // Defensive Midfielders
      { id: 'cdm1', position: 'CDM', x: 40, y: 48 },
      { id: 'cdm2', position: 'CDM', x: 60, y: 48 },

      // Defenders
      { id: 'lb', position: 'LB', x: 20, y: 66 },
      { id: 'cb1', position: 'CB', x: 40, y: 66 },
      { id: 'cb2', position: 'CB', x: 60, y: 66 },
      { id: 'rb', position: 'RB', x: 80, y: 66 },

      // Goalkeeper
      { id: 'gk', position: 'GK', x: 50, y: 88 },
    ],
  },
  '5-3-2': {
    name: '5-3-2',
    positions: [
      // Forwards
      { id: 'st1', position: 'ST', x: 40, y: 18 },
      { id: 'st2', position: 'ST', x: 60, y: 18 },

      // Midfielders
      { id: 'cm1', position: 'CM', x: 35, y: 42 },
      { id: 'cm2', position: 'CM', x: 50, y: 42 },
      { id: 'cm3', position: 'CM', x: 65, y: 42 },

      // Defenders (5 at the back)
      { id: 'lwb', position: 'LWB', x: 15, y: 66 },
      { id: 'cb1', position: 'CB', x: 30, y: 66 },
      { id: 'cb2', position: 'CB', x: 50, y: 66 },
      { id: 'cb3', position: 'CB', x: 70, y: 66 },
      { id: 'rwb', position: 'RWB', x: 85, y: 66 },

      // Goalkeeper
      { id: 'gk', position: 'GK', x: 50, y: 88 },
    ],
  },
}

export const useTeamBuilderStore = create<TeamBuilderState>((set, get) => ({
  currentTeamId: null,
  teamName: '',
  formation: '4-3-3',
  slots: formations['4-3-3'].positions,
  availablePlayers: [],
  loading: false,
  error: null,

  setTeam: (teamId, teamName, formation) => {
    const formationData = formations[formation] || formations['4-3-3']
    set({
      currentTeamId: teamId,
      teamName,
      formation,
      slots: formationData.positions,
    })
  },

  setFormation: formationName => {
    const formationData = formations[formationName] || formations['4-3-3']
    set({
      formation: formationName,
      slots: formationData.positions,
    })
  },

  assignPlayer: (slotId, player) => {
    const { slots } = get()
    const updatedSlots = slots.map(slot =>
      slot.id === slotId ? { ...slot, playerId: player.id, player } : slot
    )
    set({ slots: updatedSlots })
  },

  removePlayer: slotId => {
    const { slots } = get()
    const updatedSlots = slots.map(slot =>
      slot.id === slotId
        ? { ...slot, playerId: undefined, player: undefined }
        : slot
    )
    set({ slots: updatedSlots })
  },

  setAvailablePlayers: players => set({ availablePlayers: players }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),

  reset: () => {
    const defaultFormation = formations['4-3-3']
    set({
      currentTeamId: null,
      teamName: '',
      formation: '4-3-3',
      slots: defaultFormation.positions,
      availablePlayers: [],
      loading: false,
      error: null,
    })
  },
}))

export { formations }
