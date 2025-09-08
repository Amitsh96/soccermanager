import { prisma } from './prisma'

// Mock player data that simulates API-Football responses
const MOCK_PLAYER_DATA: Record<string, any> = {
  'Lionel Messi': {
    id: 154,
    name: 'Lionel Messi',
    birth: { date: '1987-06-24', place: 'Rosario', country: 'Argentina' },
    nationality: 'Argentina',
    height: '170 cm',
    weight: '72 kg',
    photo: 'https://media.api-sports.io/football/players/154.png',
  },
  'Kylian Mbappé': {
    id: 276,
    name: 'Kylian Mbappé',
    birth: { date: '1998-12-20', place: 'Paris', country: 'France' },
    nationality: 'France',
    height: '178 cm',
    weight: '73 kg',
    photo: 'https://media.api-sports.io/football/players/276.png',
  },
  'Erling Haaland': {
    id: 1100,
    name: 'Erling Haaland',
    birth: { date: '2000-07-21', place: 'Leeds', country: 'England' },
    nationality: 'Norway',
    height: '194 cm',
    weight: '88 kg',
    photo: 'https://media.api-sports.io/football/players/1100.png',
  },
  'Harry Kane': {
    id: 184,
    name: 'Harry Kane',
    birth: { date: '1993-07-28', place: 'London', country: 'England' },
    nationality: 'England',
    height: '188 cm',
    weight: '89 kg',
    photo: 'https://media.api-sports.io/football/players/184.png',
  },
  'Virgil van Dijk': {
    id: 20,
    name: 'Virgil van Dijk',
    birth: { date: '1991-07-08', place: 'Breda', country: 'Netherlands' },
    nationality: 'Netherlands',
    height: '193 cm',
    weight: '92 kg',
    photo: 'https://media.api-sports.io/football/players/20.png',
  },
  'Robert Lewandowski': {
    id: 9,
    name: 'Robert Lewandowski',
    birth: { date: '1988-08-21', place: 'Warsaw', country: 'Poland' },
    nationality: 'Poland',
    height: '185 cm',
    weight: '81 kg',
    photo: 'https://media.api-sports.io/football/players/9.png',
  },
  'Kevin De Bruyne': {
    id: 640,
    name: 'Kevin De Bruyne',
    birth: { date: '1991-06-28', place: 'Drongen', country: 'Belgium' },
    nationality: 'Belgium',
    height: '181 cm',
    weight: '70 kg',
    photo: 'https://media.api-sports.io/football/players/640.png',
  },
  'Luka Modrić': {
    id: 138,
    name: 'Luka Modrić',
    birth: { date: '1985-09-09', place: 'Zadar', country: 'Croatia' },
    nationality: 'Croatia',
    height: '172 cm',
    weight: '66 kg',
    photo: 'https://media.api-sports.io/football/players/138.png',
  },
  'Bruno Fernandes': {
    id: 804,
    name: 'Bruno Fernandes',
    birth: { date: '1994-09-08', place: 'Maia', country: 'Portugal' },
    nationality: 'Portugal',
    height: '179 cm',
    weight: '69 kg',
    photo: 'https://media.api-sports.io/football/players/804.png',
  },
  Pedri: {
    id: 58468,
    name: 'Pedri',
    birth: { date: '2002-11-25', place: 'Tegueste', country: 'Spain' },
    nationality: 'Spain',
    height: '174 cm',
    weight: '60 kg',
    photo: 'https://media.api-sports.io/football/players/58468.png',
  },
  'Rúben Dias': {
    id: 655,
    name: 'Rúben Dias',
    birth: { date: '1997-05-14', place: 'Amadora', country: 'Portugal' },
    nationality: 'Portugal',
    height: '187 cm',
    weight: '82 kg',
    photo: 'https://media.api-sports.io/football/players/655.png',
  },
  'Alphonso Davies': {
    id: 40735,
    name: 'Alphonso Davies',
    birth: { date: '2000-11-02', place: 'Buduburam', country: 'Ghana' },
    nationality: 'Canada',
    height: '181 cm',
    weight: '73 kg',
    photo: 'https://media.api-sports.io/football/players/40735.png',
  },
  Alisson: {
    id: 2935,
    name: 'Alisson',
    birth: { date: '1992-10-02', place: 'Novo Hamburgo', country: 'Brazil' },
    nationality: 'Brazil',
    height: '191 cm',
    weight: '91 kg',
    photo: 'https://media.api-sports.io/football/players/2935.png',
  },
  'Thibaut Courtois': {
    id: 14,
    name: 'Thibaut Courtois',
    birth: { date: '1992-05-11', place: 'Bree', country: 'Belgium' },
    nationality: 'Belgium',
    height: '200 cm',
    weight: '96 kg',
    photo: 'https://media.api-sports.io/football/players/14.png',
  },
  Ederson: {
    id: 1488,
    name: 'Ederson',
    birth: { date: '1993-08-17', place: 'Osasco', country: 'Brazil' },
    nationality: 'Brazil',
    height: '188 cm',
    weight: '86 kg',
    photo: 'https://media.api-sports.io/football/players/1488.png',
  },
}

const API_FOOTBALL_BASE_URL = process.env.API_FOOTBALL_BASE_URL
const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY

interface ApiFootballPlayer {
  player: {
    id: number
    name: string
    age: number
    birth: {
      date: string
      place: string
      country: string
    }
    nationality: string
    height: string
    weight: string
    photo: string
  }
  statistics: Array<{
    team: {
      name: string
    }
    league: {
      name: string
      country: string
    }
    games: {
      position: string
    }
  }>
}

export class ApiFootballService {
  private async mockPlayerSearch(
    playerName: string
  ): Promise<ApiFootballPlayer[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const mockData = MOCK_PLAYER_DATA[playerName]
    if (!mockData) {
      console.log(`🔍 Mock: No data found for ${playerName}`)
      return []
    }

    console.log(`✅ Mock: Found data for ${playerName}`)

    return [
      {
        player: {
          id: mockData.id,
          name: mockData.name,
          age:
            new Date().getFullYear() -
            new Date(mockData.birth.date).getFullYear(),
          birth: mockData.birth,
          nationality: mockData.nationality,
          height: mockData.height,
          weight: mockData.weight,
          photo: mockData.photo,
        },
        statistics: [
          {
            team: { name: 'Mock FC' },
            league: { name: 'Mock League', country: 'Mock Country' },
            games: { position: 'Mock Position' },
          },
        ],
      },
    ]
  }

  async searchPlayerByName(playerName: string): Promise<ApiFootballPlayer[]> {
    console.log(`🔍 Searching for player: ${playerName} (Using Mock Data)`)

    // Use mock data instead of real API for demo purposes
    if (!API_FOOTBALL_KEY || API_FOOTBALL_KEY.startsWith('your_api_key')) {
      console.log('📝 Using mock data (no valid API key configured)')
      return await this.mockPlayerSearch(playerName)
    }

    // If a real API key is configured, you could uncomment this for real API calls:
    /*
      try {
        const response = await fetch(`${API_FOOTBALL_BASE_URL}/players?search=${encodeURIComponent(playerName)}`, {
          headers: {
            'X-RapidAPI-Key': API_FOOTBALL_KEY,
            'X-RapidAPI-Host': 'v3.football.api-sports.io',
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`API Football request failed: ${response.statusText}`)
        }

        const data = await response.json()
        return data.response || []
      } catch (error) {
        console.error(`Real API failed for ${playerName}, falling back to mock:`, error)
        return await this.mockPlayerSearch(playerName)
      }
      */

    // For now, always use mock data
    return await this.mockPlayerSearch(playerName)
  }

  async syncPlayerData(playerId: string): Promise<boolean> {
    try {
      const existingPlayer = await prisma.player.findUnique({
        where: { id: playerId },
      })

      if (!existingPlayer) {
        console.error(`Player not found: ${playerId}`)
        return false
      }

      const apiPlayers = await this.searchPlayerByName(existingPlayer.name)

      if (apiPlayers.length === 0) {
        console.log(`No API data found for player: ${existingPlayer.name}`)
        return false
      }

      const apiPlayer = apiPlayers[0]

      await prisma.player.update({
        where: { id: playerId },
        data: {
          apiFootballId: apiPlayer.player.id,
          photoUrl: apiPlayer.player.photo,
          height: apiPlayer.player.height,
          weight: apiPlayer.player.weight,
          birthDate: new Date(apiPlayer.player.birth.date),
          birthPlace: `${apiPlayer.player.birth.place}, ${apiPlayer.player.birth.country}`,
          lastSyncAt: new Date(),
        },
      })

      console.log(`✅ Successfully synced player: ${existingPlayer.name}`)
      return true
    } catch (error) {
      console.error(`Error syncing player ${playerId}:`, error)
      return false
    }
  }

  async syncAllPlayers(): Promise<{
    success: number
    failed: number
    total: number
  }> {
    const players = await prisma.player.findMany({
      where: {
        OR: [
          { apiFootballId: null },
          {
            lastSyncAt: {
              lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        ],
      },
    })

    let success = 0
    let failed = 0

    for (const player of players) {
      console.log(
        `Syncing player ${success + failed + 1}/${players.length}: ${player.name}`
      )

      const syncResult = await this.syncPlayerData(player.id)
      if (syncResult) {
        success++
      } else {
        failed++
      }

      // Rate limiting simulation
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    console.log(`🎉 Sync completed: ${success} successful, ${failed} failed`)
    return { success, failed, total: players.length }
  }
}

export const apiFootball = new ApiFootballService()
