#!/bin/bash

docker-compose -f docker-compose-review.yml run --rm users-service-review npm test \ &&
docker-compose -f docker-compose-review.yml run --rm movies-service-review npm test
# testcafe firefox tests/**/*.js