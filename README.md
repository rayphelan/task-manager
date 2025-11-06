# Task Manager

## Local Database (MongoDB)

- Prerequisite: Docker Desktop installed and running
- Start MongoDB:

```bash
docker compose up -d
```

- Stop MongoDB and remove container (data persists in volume):

```bash
docker compose down
```

- Connection string for local development:

```
mongodb://localhost:27017
```

- Data persists in the named volume `mongo-data` defined in `docker-compose.yml`.

- Tests in the backend will run against an in-memory MongoDB, so Docker is not required for `npm test`.

## Backend: test DB ping

1. Start MongoDB (Docker):

```bash
docker compose up -d
```

2. Create backend env file (first time):

```bash
cd backend
cp env.example .env
```

3. Run the backend:

```bash
npm run dev
```

4. In a new terminal, ping the DB route:

```bash
curl http://localhost:3000/db/ping
# expected: {"ok":true}
```

Troubleshooting:

- Ensure Docker Desktop is running and `docker ps` shows the MongoDB container.
- Verify `.env` contains `MONGODB_URI=mongodb://localhost:27017` and `MONGODB_DB_NAME=task_manager_dev`.
- Check the server logs in the dev terminal for connection errors.

## Backend: run tests

From the `backend/` directory:

```bash
cd backend
npm test          # run tests once (Vitest)
npm run test:watch # watch mode
```

Notes:

- Tests use an in-memory MongoDB via `mongodb-memory-server`, so Docker is not required to run them.
- Includes tests for the `/db/ping` route and the `tasks` collection schema/validation.

## Frontend: run tests

From the `frontend/` directory:

```bash
cd frontend
npm test           # run tests once
npm run test:watch # watch mode
```

Notes:

- Vitest is configured with jsdom and React Testing Library in `vite.config.ts`.
- No backend or Docker is required to run frontend tests.

## Frontend: run app

1. Configure API base URL (optional if using backend default):

```bash
cd frontend
cp env.example .env
# edit .env if your backend is not on http://localhost:3000
```

2. Start dev server:

```bash
npm run dev
```

The app runs at http://localhost:5173 and uses Redux Toolkit + RTK Query for data fetching.

## MongoDB: verify tasks collection

Ensure the backend has started at least once (it creates/updates the collection schema on startup):

```bash
cd backend
npm run dev
```

Open MongoDB shell and select the database (match `MONGODB_DB_NAME` from `.env`):

```bash
mongosh
use task_manager_dev
```

Show the collection validator:

```javascript
db.getCollectionInfos({ name: 'tasks' });
```

Show indexes on the `tasks` collection:

```javascript
db.tasks.getIndexes();
```

## API usage (Tasks)

Start backend (requires MongoDB running):

```bash
cd backend
npm run dev
```

Base URL: `http://localhost:3000`

Response format:

```json
{
  "success": true,
  "data": { }
}
```

Errors:

```json
{
  "success": false,
  "error": "message"
}
```

Create task:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"My Task","description":"optional","status":"pending"}'
```

List tasks (optional filters):

```bash
curl 'http://localhost:3000/api/tasks?status=pending&limit=20'
```

Get single task:

```bash
curl http://localhost:3000/api/tasks/<id>
```

Update task status:

```bash
curl -X PATCH http://localhost:3000/api/tasks/<id> \
  -H 'Content-Type: application/json' \
  -d '{"status":"completed"}'
```

Edit task (title/description/status):

```bash
curl -X PATCH http://localhost:3000/api/tasks/<id> \
  -H 'Content-Type: application/json' \
  -d '{"title":"New Title","description":"New description","status":"in-progress"}'
```

Delete task:

```bash
curl -X DELETE http://localhost:3000/api/tasks/<id>
```
