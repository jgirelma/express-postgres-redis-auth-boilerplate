# This is an express server which implements a simple authentication api using postgress, express-session, redis, and typescript

## Production

1. Build Dockerfile
docker build -t local/ts-node-postgres-auth .

2. docker-compose up

## Dev

1. docker-compose -f docker-compose.dev.yml

2. npm run dev