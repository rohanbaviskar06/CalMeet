# MeetMe - Modern SaaS Scheduling Platform

MeetMe is a premium scheduling platform inspired by Cal.com, built with the latest technologies.

## Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL (configured via Prisma)
- **Authentication**: [NextAuth.js / Auth.js](https://next-auth.js.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms**: React Hook Form & Zod
- **Icons**: Lucide React

## Project Structure
- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components (landing, dashboard, ui).
- `src/lib`: Shared utilities (auth, prisma, utils).
- `src/app/actions`: Server Actions for database mutations.
- `prisma`: Database schema and migrations.

## Key Features
- **User Authentication**: Google OAuth and Email login.
- **Dashboard**: Professional sidebar, upcoming meetings, and analytics overview.
- **Event Management**: Create, edit, and toggle different meeting types.
- **Availability**: Set weekly working hours and timezones.
- **Booking System**: Public booking page with calendar and slot selection.
- **Integrations**: Support for Google Calendar, Zoom, and more.
- **Admin Panel**: Manage users and view platform-wide analytics.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup Database**:
   Update `DATABASE_URL` in `.env` and run:
   ```bash
   npx prisma db push
   ```

3. **Authentication**:
   Configure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`.

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Design Principles
- **Minimalist Aesthetic**: High-contrast black and white theme.
- **Premium Feel**: Glassmorphism cards, subtle gradients, and smooth animations.
- **Responsive**: Fully optimized for mobile, tablet, and desktop.
- **UX Focused**: Loading skeletons and toast notifications for a smooth experience.
