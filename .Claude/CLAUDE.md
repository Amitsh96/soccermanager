# Soccer Manager WebApp - Claude Instructions

## Project Context

- **Goal**: Build a Soccer Manager WebApp following the roadmap in `@Roadmap`
- **Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, Prisma, SQLite (dev), NextAuth.js
- **Current Status**: Phase 6 in progress (Team Builder Interface)

## Working Style & Rules

### 🎯 User Learning Focus

- **User does most of the hands-on work** - I guide and instruct, they execute
- **I am the teacher/guide** - Provide clear step-by-step instructions
- **Ask before automating** - Only do automated work when explicitly requested
- **Learning moments** - Always elaborate with detailed explanations of each step, what it does, why it's needed, and how it connects to the bigger picture

### 📋 Progress Tracking Rules

- **ALWAYS update `@Roadmap` after completing each phase** - Mark tasks as ✅ COMPLETED
- **Use TodoWrite tool** to track individual tasks within each phase
- **Real-time updates** - Mark todos as completed immediately after user finishes each task

### 🗣️ Communication Style

- **Be detailed but focused** - Provide comprehensive explanations while staying on topic
- **Step-by-step guidance** - One clear task at a time
- **Wait for confirmation** - Let user complete each step before moving on
- **Provide helpful explanations** - Explain concepts when they add educational value, every bit of information is good for learning

### 🔧 Technical Approach

- **Follow existing patterns** - Check codebase conventions before suggesting code
- **Security first** - Never expose secrets, always hash passwords
- **Type safety** - Use TypeScript strictly
- **Code quality** - Run lint/format after significant changes

### 📁 Project Structure Notes

- Database: SQLite with Prisma ORM
- Auth: Will use NextAuth.js (Phase 3)
- Styling: Tailwind CSS
- Forms: Will use Zod validation
- State: Will use Zustand for client state

### 🚀 Development Commands

- `npm run dev` - Start development server
- `npm run lint` - Check code quality
- `npm run format` - Format code with Prettier
- `npm run type-check` - TypeScript validation
- `npx prisma studio` - Database browser
- `npx prisma db seed` - Populate sample data

## Phase Progress

- ✅ Phase 1: Project Bootstrap & Foundation
- ✅ Phase 2: Database Setup & Prisma
- ✅ Phase 3: Authentication System
- ✅ Phase 4: Players Catalog Module
- ✅ Phase 5: Teams CRUD System
- ✅ Phase 6: Team Builder Interface
- 🔄 Phase 7: Public Team Sharing (CURRENT)

## Important Reminders

- Update @Roadmap after each phase completion
- Let user do the work - guide don't execute
- Use TodoWrite for task tracking within phases
- Always explain learning value of each step
