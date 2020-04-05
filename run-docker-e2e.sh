export MSYS_NO_PATHCONV=1

# Run testcafe image directly with tests
# docker run --rm -v "$(pwd)/tests:/tests" -it testcafe/testcafe firefox /tests/**/*.js

# Enter testcafe image
# docker run --rm -v "$(pwd)/e2e:/e2e" -it --entrypoint sh testcafe/testcafe

 # testcafe:
  #   container_name: testcafe
  #   image: testcafe/testcafe
  #   environment:
  #     - NODE_PATH=/opt/testcafe/node_modules:/opt
  #     - SCREEN_WIDTH=1920
  #     - SCREEN_HEIGHT=1080
  #     - BROWSER=firefox
  #     - TEST_ENV_URL=http://web-service:3006
  #   volumes:
  #   - ./e2e/tests:/tests
  #   - ./e2e/screenshots:/screenshots
  #   entrypoint: ["/opt/testcafe/docker/testcafe-docker.sh", "${BROWSER} --no-sandbox", "-S", "-s", "screenshots", "/tests"]
  #   depends_on:
  #     web-service:
  #       condition: service_started
  #   links:
  #     - web-service

docker run --rm -w "/e2e" -v "$(pwd)/e2e:/e2e" --net microservice-movies_default --link web-service \
-it --entrypoint node testcafe/testcafe /e2e/index.js --browser=firefox:headless --portalToTest=http://web-service:3006