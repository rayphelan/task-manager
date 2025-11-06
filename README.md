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
cd /Users/rayphelan/Documents/cursor/task-manager-2
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
