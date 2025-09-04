import { PrismaClient } from '@prisma/client'

  const prisma = new PrismaClient()

  const players = [
    // Forwards
    { name: 'Lionel Messi', position: 'RW', club: 'Inter Miami', nationality: 'Argentina', age: 36, rating: 93 },
    { name: 'Kylian Mbappé', position: 'LW', club: 'Real Madrid', nationality: 'France', age: 25, rating: 91 },
    { name: 'Erling Haaland', position: 'ST', club: 'Manchester City', nationality: 'Norway', age: 24, rating: 91 },
    { name: 'Harry Kane', position: 'ST', club: 'Bayern Munich', nationality: 'England', age: 30, rating: 90 },
    { name: 'Robert Lewandowski', position: 'ST', club: 'Barcelona', nationality: 'Poland', age: 35, rating: 89 },

    // Midfielders
    { name: 'Kevin De Bruyne', position: 'CAM', club: 'Manchester City', nationality: 'Belgium', age: 32, rating: 91 },
    { name: 'Luka Modrić', position: 'CM', club: 'Real Madrid', nationality: 'Croatia', age: 38, rating: 88 },
    { name: 'Casemiro', position: 'CDM', club: 'Manchester United', nationality: 'Brazil', age: 31, rating: 87 },
    { name: 'Bruno Fernandes', position: 'CAM', club: 'Manchester United', nationality: 'Portugal', age: 29, rating: 86 },
    { name: 'Pedri', position: 'CM', club: 'Barcelona', nationality: 'Spain', age: 21, rating: 85 },

    // Defenders
    { name: 'Virgil van Dijk', position: 'CB', club: 'Liverpool', nationality: 'Netherlands', age: 32, rating: 90 },
    { name: 'Rúben Dias', position: 'CB', club: 'Manchester City', nationality: 'Portugal', age: 27, rating: 88 },
    { name: 'Alphonso Davies', position: 'LB', club: 'Bayern Munich', nationality: 'Canada', age: 23, rating: 84 },
    { name: 'Reece James', position: 'RB', club: 'Chelsea', nationality: 'England', age: 24, rating: 84 },
    { name: 'Antonio Rüdiger', position: 'CB', club: 'Real Madrid', nationality: 'Germany', age: 31, rating: 87 },

    // Goalkeepers
    { name: 'Alisson', position: 'GK', club: 'Liverpool', nationality: 'Brazil', age: 30, rating: 89 },
    { name: 'Thibaut Courtois', position: 'GK', club: 'Real Madrid', nationality: 'Belgium', age: 31, rating: 89 },
    { name: 'Ederson', position: 'GK', club: 'Manchester City', nationality: 'Brazil', age: 30, rating: 87 },
  ]

  async function main() {
    console.log('Start seeding...')

    for (const player of players) {
      await prisma.player.create({
        data: player,
      })
    }

    console.log('Seeding finished.')
  }

  main()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })