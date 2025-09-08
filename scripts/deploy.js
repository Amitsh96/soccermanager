const { execSync } = require('child_process')

console.log('🚀 Starting deployment process...')

try {
  // Generate Prisma client for production
  console.log('📦 Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })

  // Run database migrations
  console.log('🏗️  Running database migrations...')
  execSync('npx prisma db push', { stdio: 'inherit' })

  // Seed the database (if needed)
  if (process.env.RUN_SEED === 'true') {
    console.log('🌱 Seeding database...')
    execSync('npx prisma db seed', { stdio: 'inherit' })
  }

  console.log('✅ Deployment preparation complete!')
} catch (error) {
  console.error('❌ Deployment failed:', error.message)
  process.exit(1)
}
