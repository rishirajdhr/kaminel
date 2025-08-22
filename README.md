# Kaminel

> A web-based engine for creating text adventure games.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v8 or higher)
- [Docker](https://www.docker.com/) and Docker Compose
- [Git](https://git-scm.com/)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rishirajdhr/kaminel.git
cd kaminel
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env.development` file in the root directory and add the
following environment variables:

```env
DATABASE_URL="postgresql://nalase:protect_omega@localhost:5432/kaminel"
```

### 4. Start the Application

Run the following command:

```bash
pnpm run dev
```

This command will:

- Start the PostgreSQL container
- Push the database schema
- Seed the database with initial data
- Start the Next.js development server

The application will be available at [http://localhost:3000](http://localhost:3000).

### Stopping the Database

At the end of the development session, run the following command to stop the
PostgreSQL container:

```bash
pnpm run db:stop
```

### Reseeding the Database

If you need to re-seed the database, run the following command:

```bash
pnpm run db:seed
```
