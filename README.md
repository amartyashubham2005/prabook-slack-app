# prabook-slack-app

This is an Express-based Node.js application for a Slack bot. The bot integrates with Slack's APIs and uses PostgreSQL as its database.

## Getting Started

### Prerequisites

- Node.js and npm installed.
- Docker and Docker Compose installed (for running the PostgreSQL database locally).

---

## Setup Instructions

### Step 1: Clone the Repository

Clone this repository to your local machine.

```bash
git clone <repository-url>
cd <project-folder>
```

### Step 2: Install Dependencies

Run the following command to install project dependencies:

```bash
npm install
```

### Step 3: Configure Environment Variables

Copy the `.env.template` file to `.env`:

```bash
cp .env.template .env
```

The `.env` file expects the following variables:

```plaintext
NODE_ENV: string;       # "development" for local setup, "production" for deployment
PORT: string;           # The port the app will run on (e.g., 3000)
CLIENT_ID: string;      # Slack App's Client ID
CLIENT_SECRET: string;  # Slack App's Client Secret
SIGNING_SECRET: string; # Slack App's Signing Secret
PGHOST: string;         # PostgreSQL host (e.g., localhost)
PGUSER: string;         # PostgreSQL username
PGPASSWORD: string;     # PostgreSQL password
PGDATABASE: string;     # PostgreSQL database name
PGPORT: string;         # PostgreSQL port (e.g., 5432)
```

#### Where to Get These Values:

1. **Slack App Credentials**:
   - Go to the [Slack API Dashboard](https://api.slack.com/apps) and create or manage your app.
   - Obtain:
     - `CLIENT_ID`
     - `CLIENT_SECRET`
     - `SIGNING_SECRET`

2. **PostgreSQL Variables**:
   - Use the following values if running PostgreSQL via Docker Compose:
     - `PGHOST=localhost`
     - `PGUSER=prabook`
     - `PGPASSWORD=prabook`
     - `PGDATABASE=prabook`
     - `PGPORT=5432`
   - For production, use the hostname, username, and password for your dedicated database server.

---

### Step 4: Run PostgreSQL Locally (Development Only)

We need a PostgreSQL database for the functioning of the slack app. We need to make sure the PostgreSQL database is reachable while the slack app is running.
To set up a local PostgreSQL instance using Docker Compose, run:

```bash
docker-compose up -d
```

- `-d`: Runs the containers in detached mode.
- This setup is **only for development purposes**. In production, you should use a dedicated PostgreSQL database.

To stop the database:

```bash
docker-compose down
```

---

## Running the App

### Development Mode

To run the app locally with hot-reloading, use:

```bash
npm run dev
```

### Build and Run for Production

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the application:

   ```bash
   npm start
   ```

---

## Additional Notes

- Ensure the `NODE_ENV` in the `.env` file is set to `development` for local development and `production` for deployment.
- Update `.env` with the correct database connection details for your production database.
- Always keep sensitive information like `.env` secrets safe and never commit them to version control. Use secret management tools like AWS Secrets Manager, Azure Key Vault, or environment variables in CI/CD pipelines for production deployments.