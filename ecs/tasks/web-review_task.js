function createWebTaskDefinition(accountID, region, tag, backendURL, apiKey) {
    const taskDefinition = {
      containerDefinitions: [
        {
          name: 'web-service-review',
          image: `${accountID}.dkr.ecr.${region}.amazonaws.com\/microservicemovies\/web-service-review:${tag}`,
          essential: true,
          memoryReservation: 300,
          cpu: 300,
          portMappings: [
            {
              containerPort: 5000,
              hostPort: 0,
              protocol: 'tcp'
            }
          ],
          environment: [
            {
              name: 'NODE_ENV',
              value: 'test'
            },
            {
              name: 'REACT_APP_USERS_SERVICE_URL',
              value: backendURL
            },
            {
              name: 'REACT_APP_MOVIES_SERVICE_URL',
              value: backendURL
            },
            {
              name: 'REACT_APP_API_KEY',
              value: apiKey
            }
          ],
          logConfiguration: {
            logDriver: 'awslogs',
            options: {
              'awslogs-group': 'microservicemovies',
              'awslogs-region': region
            }
          }
        },
      ],
      family: 'microservicemovies-review-web-td'
    };
    return taskDefinition;
  }
  
  module.exports = {
    createWebTaskDefinition
  };