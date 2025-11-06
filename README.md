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
