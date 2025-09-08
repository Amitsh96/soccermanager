# Soccer Manager

A web-based soccer team management application built with Next.js, allowing users to build and manage their dream soccer teams.

## Features

- **User Authentication**: Secure signup and login with NextAuth
- **Team Management**: Create and manage multiple soccer teams
- **Player Database**: Browse and add players to your teams
- **Team Builder**: Build teams with different formations (default: 4-3-3)
- **Player Positioning**: Assign players to specific positions within your team

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: NextAuth.js
- **Database**: SQLite with Prisma ORM
- **Validation**: Zod
- **State Management**: Zustand
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd soccermanager
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. Set up the database:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed the database with initial data
npm run db:seed
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Mode

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Database Management

### Prisma Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Generate Prisma client after schema changes
npx prisma generate
```

## Project Structure

```
soccermanager/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── players/      # Player management
│   │   └── teams/        # Team management
│   ├── auth/             # Authentication pages
│   ├── components/       # Reusable components
│   ├── players/          # Player pages
│   ├── teams/            # Team management pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   ├── seed.ts          # Database seeding
│   └── migrations/      # Database migrations
├── package.json
└── README.md
```

## Database Schema

The application uses the following main models:

- **User**: User accounts with authentication
- **Player**: Soccer players with stats and club information
- **Team**: User-created teams with formations
- **TeamPlayer**: Junction table linking teams and players with positions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and type checking:
   ```bash
   npm run lint
   npm run type-check
   ```
5. Commit your changes
6. Push to your branch
7. Create a Pull Request

## License

ISC
