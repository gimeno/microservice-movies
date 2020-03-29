#!/bin/sh

docker-compose run --rm movies-service knex migrate:latest --env development --knexfile app/knexfile.js
docker-compose run --rm movies-service knex seed:run --env development --knexfile app/knexfile.js