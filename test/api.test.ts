import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import {
  setupTestDatabase,
  cleanupTestDatabase,
  testDb,
  teardownTestDatabase,
} from './db-utils'

// Mock Next.js request/response for API testing
const createMockRequest = (
  method: string,
  body?: any,
  headers?: Record<string, string>
) => ({
  method,
  json: () => Promise.resolve(body),
  headers: headers || {},
})

const createMockResponse = () => {
  const response = {
    status: 200,
    headers: {},
    data: null,
    statusText: 'OK',
  }

  return {
    status: (code: number) => {
      response.status = code
      return {
        json: (data: any) => {
          response.data = data
          return Promise.resolve(response)
        },
      }
    },
    json: (data: any) => {
      response.data = data
      return Promise.resolve(response)
    },
  }
}

describe('API Routes', () => {
  let testUser: any

  beforeAll(async () => {
    await setupTestDatabase()
  })

  afterAll(async () => {
    await teardownTestDatabase()
  })

  beforeEach(async () => {
    await cleanupTestDatabase()
    // Create a test user for API tests
    testUser = await testDb.user.create({
      data: {
        name: 'API Test User',
        email: 'api@example.com',
        password: 'hashedpassword123',
      },
    })
  })

  describe('Players API', () => {
    beforeEach(async () => {
      // Create test players
      await testDb.player.createMany({
        data: [
          {
            name: 'Lionel Messi',
            position: 'RW',
            club: 'Inter Miami',
            nationality: 'Argentina',
            age: 36,
            rating: 93,
          },
          {
            name: 'Erling Haaland',
            position: 'ST',
            club: 'Manchester City',
            nationality: 'Norway',
            age: 23,
            rating: 91,
          },
          {
            name: 'Virgil van Dijk',
            position: 'CB',
            club: 'Liverpool',
            nationality: 'Netherlands',
            age: 32,
            rating: 90,
          },
        ],
      })
    })

    it('should fetch players with pagination', async () => {
      const players = await testDb.player.findMany({
        take: 10,
        skip: 0,
      })

      expect(players).toHaveLength(3)
      expect(players[0]).toHaveProperty('name')
      expect(players[0]).toHaveProperty('position')
      expect(players[0]).toHaveProperty('rating')
    })

    it('should filter players by position', async () => {
      const strikers = await testDb.player.findMany({
        where: { position: 'ST' },
      })

      expect(strikers).toHaveLength(1)
      expect(strikers[0].name).toBe('Erling Haaland')
    })

    it('should search players by name', async () => {
      const messiResults = await testDb.player.findMany({
        where: {
          name: {
            contains: 'Messi',
          },
        },
      })

      expect(messiResults).toHaveLength(1)
      expect(messiResults[0].name).toBe('Lionel Messi')
    })
  })

  describe('Teams API', () => {
    it('should create a team', async () => {
      const teamData = {
        name: 'Test Team FC',
        formation: '4-3-3',
      }

      const team = await testDb.team.create({
        data: {
          ...teamData,
          userId: testUser.id,
        },
      })

      expect(team.name).toBe('Test Team FC')
      expect(team.formation).toBe('4-3-3')
      expect(team.userId).toBe(testUser.id)
    })

    it('should fetch user teams', async () => {
      // Create multiple teams for the user
      await testDb.team.createMany({
        data: [
          { name: 'Team 1', formation: '4-3-3', userId: testUser.id },
          { name: 'Team 2', formation: '4-4-2', userId: testUser.id },
        ],
      })

      const userTeams = await testDb.team.findMany({
        where: { userId: testUser.id },
        include: { teamPlayers: true },
      })

      expect(userTeams).toHaveLength(2)
      expect(userTeams[0].name).toBe('Team 1')
      expect(userTeams[1].name).toBe('Team 2')
    })

    it('should update team', async () => {
      const team = await testDb.team.create({
        data: {
          name: 'Original Name',
          formation: '4-3-3',
          userId: testUser.id,
        },
      })

      const updatedTeam = await testDb.team.update({
        where: { id: team.id },
        data: { name: 'Updated Name', formation: '4-4-2' },
      })

      expect(updatedTeam.name).toBe('Updated Name')
      expect(updatedTeam.formation).toBe('4-4-2')
    })

    it('should delete team', async () => {
      const team = await testDb.team.create({
        data: {
          name: 'Team to Delete',
          formation: '4-3-3',
          userId: testUser.id,
        },
      })

      // Verify team exists first
      const existingTeam = await testDb.team.findUnique({
        where: { id: team.id },
      })
      expect(existingTeam).toBeDefined()

      // Now delete it
      await testDb.team.delete({
        where: { id: team.id },
      })

      const deletedTeam = await testDb.team.findUnique({
        where: { id: team.id },
      })

      expect(deletedTeam).toBeNull()
    })
  })

  describe('TeamPlayer relationships', () => {
    it('should add player to team', async () => {
      const team = await testDb.team.create({
        data: {
          name: 'Test Team',
          formation: '4-3-3',
          userId: testUser.id,
        },
      })

      const player = await testDb.player.create({
        data: {
          name: 'Test Player',
          position: 'ST',
          club: 'Test Club',
          nationality: 'Test Country',
          age: 25,
          rating: 85,
        },
      })

      const teamPlayer = await testDb.teamPlayer.create({
        data: {
          teamId: team.id,
          playerId: player.id,
          position: 'ST',
        },
        include: {
          player: true,
          team: true,
        },
      })

      expect(teamPlayer.position).toBe('ST')
      expect(teamPlayer.player.name).toBe('Test Player')
      expect(teamPlayer.team.name).toBe('Test Team')
    })

    it('should prevent duplicate players in same team', async () => {
      const team = await testDb.team.create({
        data: { name: 'Test Team', formation: '4-3-3', userId: testUser.id },
      })

      const player = await testDb.player.create({
        data: {
          name: 'Test Player',
          position: 'ST',
          club: 'Test Club',
          nationality: 'Test',
          age: 25,
          rating: 85,
        },
      })

      // First assignment should work
      await testDb.teamPlayer.create({
        data: { teamId: team.id, playerId: player.id, position: 'ST' },
      })

      // Second assignment should fail due to unique constraint
      await expect(
        testDb.teamPlayer.create({
          data: { teamId: team.id, playerId: player.id, position: 'RW' },
        })
      ).rejects.toThrow()
    })
  })
})
