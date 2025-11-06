# Task Manager

Clone the repository and enter the app directory:

```bash
git clone git@github.com:rayphelan/task-manager.git
cd task-manager
```

## Installation

### Database (MongoDB)

- Prerequisite: Docker Desktop installed and running

```bash
docker compose up -d    # start MongoDB
```

- Local connection string: `mongodb://localhost:27017`

### Backend

```bash
cd backend
npm install
cp env.example .env
npm run dev             # start the server (requires Mongo running)
```

### Frontend

```bash
cd frontend
npm install
cp env.example .env     # optional; adjust VITE_API_BASE_URL if not localhost:3000
npm run dev             # app runs at http://localhost:5173
```

## Testing

### Backend tests

```bash
cd backend
npm test          # run tests once (Vitest)
npm run test:watch # watch mode
```

Notes:

- Tests use an in-memory MongoDB via `mongodb-memory-server`, so Docker is not required to run them.
- Includes tests for the `/db/ping` route and the `tasks` collection schema/validation.

### Frontend tests

```bash
cd frontend
npm test           # run tests once
npm run test:watch # watch mode
```

Notes:

- Vitest is configured with jsdom and React Testing Library in `vite.config.ts`.
- No backend or Docker is required to run frontend tests.

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
  "data": {}
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
