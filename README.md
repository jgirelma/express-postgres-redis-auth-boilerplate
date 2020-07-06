# This is an express server which implements a simple authentication api using postgress, express-session, redis, and typescript

## Production

1. Build Dockerfile
docker build -t local/ts-node-postgres-auth .

2. docker-compose up

## Dev

1. docker-compose -f docker-compose.dev.yml

2. npm run dev

### Routes

curl -v -X POST localhost:3000/api/register -H 'Content-Type: application/json' -d '{"email":"alex5@gmail.com","firstname":"Alex", "lastname": "Deer", "password":"Secret12","passwordConfirmation":"Secret12"}'

curl -v -X POST localhost:3000/api/login -H 'Content-Type: application/json' -d '{"email":"alex5@gmail.com","password":"Secret12"}'

curl -v -X POST localhost:3000/api/logout --cookie "cookie goes here"

curl -v -X POST localhost:3000/api/user --cookie "cookie goes here"