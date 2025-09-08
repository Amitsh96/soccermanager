import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

// Simple test components based on your app patterns
const PlayerCard = ({ player }: { player: any }) => (
  <div className="player-card" data-testid="player-card">
    <h3>{player.name}</h3>
    <div className="position">{player.position}</div>
    <div className="club">{player.club}</div>
    <div className="rating">{player.rating}</div>
  </div>
)

const TeamCard = ({
  team,
  onDelete,
}: {
  team: any
  onDelete: (id: string) => void
}) => (
  <div className="team-card" data-testid="team-card">
    <h3>{team.name}</h3>
    <div className="formation">Formation: {team.formation}</div>
    <div className="players">Players: {team.teamPlayers?.length || 0}/11</div>
    <button onClick={() => onDelete(team.id)} className="delete-btn">
      Delete
    </button>
  </div>
)

const SearchForm = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('search') as string
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} data-testid="search-form">
      <input
        type="text"
        name="search"
        placeholder="Search players..."
        className="search-input"
      />
      <button type="submit">Search</button>
    </form>
  )
}

describe('Component Tests', () => {
  describe('PlayerCard Component', () => {
    const mockPlayer = {
      id: '1',
      name: 'Lionel Messi',
      position: 'RW',
      club: 'Inter Miami',
      nationality: 'Argentina',
      age: 36,
      rating: 93,
    }

    it('should render player information correctly', () => {
      render(<PlayerCard player={mockPlayer} />)

      expect(screen.getByText('Lionel Messi')).toBeInTheDocument()
      expect(screen.getByText('RW')).toBeInTheDocument()
      expect(screen.getByText('Inter Miami')).toBeInTheDocument()
      expect(screen.getByText('93')).toBeInTheDocument()
    })

    it('should have correct CSS classes', () => {
      render(<PlayerCard player={mockPlayer} />)

      const card = screen.getByTestId('player-card')
      expect(card).toHaveClass('player-card')
    })
  })

  describe('TeamCard Component', () => {
    const mockTeam = {
      id: 'team-1',
      name: 'Barcelona',
      formation: '4-3-3',
      teamPlayers: [{ id: '1' }, { id: '2' }], // 2 players
    }

    it('should render team information correctly', () => {
      const mockDelete = vi.fn()
      render(<TeamCard team={mockTeam} onDelete={mockDelete} />)

      expect(screen.getByText('Barcelona')).toBeInTheDocument()
      expect(screen.getByText('Formation: 4-3-3')).toBeInTheDocument()
      expect(screen.getByText('Players: 2/11')).toBeInTheDocument()
    })

    it('should call onDelete when delete button is clicked', async () => {
      const mockDelete = vi.fn()
      render(<TeamCard team={mockTeam} onDelete={mockDelete} />)

      const deleteBtn = screen.getByText('Delete')
      await userEvent.click(deleteBtn)

      expect(mockDelete).toHaveBeenCalledWith('team-1')
      expect(mockDelete).toHaveBeenCalledTimes(1)
    })

    it('should show 0/11 when no players', () => {
      const teamWithoutPlayers = { ...mockTeam, teamPlayers: [] }
      const mockDelete = vi.fn()

      render(<TeamCard team={teamWithoutPlayers} onDelete={mockDelete} />)

      expect(screen.getByText('Players: 0/11')).toBeInTheDocument()
    })
  })

  describe('SearchForm Component', () => {
    it('should call onSearch with input value when submitted', async () => {
      const mockSearch = vi.fn()
      render(<SearchForm onSearch={mockSearch} />)

      const input = screen.getByPlaceholderText('Search players...')
      const submitBtn = screen.getByText('Search')

      // Type in search input
      await userEvent.type(input, 'Messi')

      // Submit form
      await userEvent.click(submitBtn)

      expect(mockSearch).toHaveBeenCalledWith('Messi')
      expect(mockSearch).toHaveBeenCalledTimes(1)
    })

    it('should submit form when Enter key is pressed', async () => {
      const mockSearch = vi.fn()
      render(<SearchForm onSearch={mockSearch} />)

      const input = screen.getByPlaceholderText('Search players...')

      // Type and press Enter
      await userEvent.type(input, 'Ronaldo{enter}')

      expect(mockSearch).toHaveBeenCalledWith('Ronaldo')
    })

    it('should handle empty search', async () => {
      const mockSearch = vi.fn()
      render(<SearchForm onSearch={mockSearch} />)

      const submitBtn = screen.getByText('Search')
      await userEvent.click(submitBtn)

      expect(mockSearch).toHaveBeenCalledWith('')
    })
  })

  describe('Interactive Components', () => {
    it('should handle multiple user interactions', async () => {
      const mockSearch = vi.fn()
      const mockDelete = vi.fn()

      const mockTeam = {
        id: 'interactive-team',
        name: 'Test Team',
        formation: '4-4-2',
        teamPlayers: [{ id: '1' }],
      }

      render(
        <div>
          <SearchForm onSearch={mockSearch} />
          <TeamCard team={mockTeam} onDelete={mockDelete} />
        </div>
      )

      // Test search functionality
      const searchInput = screen.getByPlaceholderText('Search players...')
      await userEvent.type(searchInput, 'Benzema')
      await userEvent.click(screen.getByText('Search'))

      expect(mockSearch).toHaveBeenCalledWith('Benzema')

      // Test delete functionality
      await userEvent.click(screen.getByText('Delete'))
      expect(mockDelete).toHaveBeenCalledWith('interactive-team')

      // Verify both functions were called
      expect(mockSearch).toHaveBeenCalledTimes(1)
      expect(mockDelete).toHaveBeenCalledTimes(1)
    })
  })
})
