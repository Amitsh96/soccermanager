import { describe, it, expect } from 'vitest'

// Let's create a simple utility function to test
function formatPlayerName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`
}

function calculateTeamRating(playerRatings: number[]): number {
  if (playerRatings.length === 0) return 0
  const sum = playerRatings.reduce((acc, rating) => acc + rating, 0)
  return Math.round(sum / playerRatings.length)
}

describe('Utility Functions', () => {
  describe('formatPlayerName', () => {
    it('should format player name correctly', () => {
      const result = formatPlayerName('Lionel', 'Messi')
      expect(result).toBe('Lionel Messi')
    })

    it('should handle empty strings', () => {
      const result = formatPlayerName('', 'Messi')
      expect(result).toBe(' Messi')
    })
  })

  describe('calculateTeamRating', () => {
    it('should calculate average rating correctly', () => {
      const ratings = [90, 85, 88, 92, 87]
      const result = calculateTeamRating(ratings)
      expect(result).toBe(88) // (90+85+88+92+87)/5 = 88.4 → 88
    })

    it('should return 0 for empty array', () => {
      const result = calculateTeamRating([])
      expect(result).toBe(0)
    })

    it('should round to nearest integer', () => {
      const ratings = [90, 85] // Average: 87.5
      const result = calculateTeamRating(ratings)
      expect(result).toBe(88) // Rounded up
    })
  })
})
