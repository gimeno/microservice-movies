const AWS = require('aws-sdk');

const createUsersTaskDefinition = require('../tasks/users-review_task').createUsersTaskDefinition;
const createMoviesTaskDefinition = require('../tasks/movies-review_task').createMoviesTaskDefinition;
const createWebTaskDefinition = require('../tasks/web-review_task').createWebTaskDefinition;

const port = require('./listener').getPort;


// globals

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_USERNAME = process.env.AWS_USERNAME;
const AWS_CONFIG_REGION = process.env.AWS_CONFIG_REGION;
const SHORT_GIT_HASH = process.env.CIRCLE_SHA1.substring(0, 7);
const LOAD_BALANCER_DNS = process.env.LOAD_BALANCER_DNS;
const REACT_APP_API_KEY = process.env.REACT_APP_API_KEY;


// config

AWS.config = new AWS.Config();
AWS.config.accessKeyId = AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = AWS_SECRET_ACCESS_KEY;
AWS.config.region = AWS_CONFIG_REGION;


// init aws services

const ecs = new AWS.ECS();
const iam = new AWS.IAM();


// methods

function ensureAuthenticated() {
  return new Promise((resolve, reject) => {
    const params = { UserName: AWS_USERNAME };
    iam.getUser(params, (err, data) => {
      if (err) { reject(err); }
      resolve(data);
    });
  });
}

function registerTaskDef(task) {
  return new Promise((resolve, reject) => {
    const params = task;
    ecs.registerTaskDefinition(params, (err, data) => {
      if (err) { reject(err); }
      resolve(data);
    });
  });
}

function registerUsersTD() {
  const task = createUsersTaskDefinition(AWS_ACCOUNT_ID, AWS_CONFIG_REGION, SHORT_GIT_HASH);
  return registerTaskDef(task)
  .then((res) => {
    console.log('Task Registered!');
    console.log(res.taskDefinition.taskDefinitionArn);
  })
  .catch((err) => {
    console.log(err);
  });
}

function registerMoviesTD() {
  const task = createMoviesTaskDefinition(AWS_ACCOUNT_ID, AWS_CONFIG_REGION, SHORT_GIT_HASH);
  return registerTaskDef(task)
  .then((res) => {
    console.log('Task Registered!');
    console.log(res.taskDefinition.taskDefinitionArn);
  })
  .catch((err) => {
    console.log(err);
  });
}

function registerWebTD(usersURL, moviesURL) {
  const task = createWebTaskDefinition(AWS_ACCOUNT_ID, AWS_CONFIG_REGION, SHORT_GIT_HASH, usersURL, moviesURL, REACT_APP_API_KEY);
  return registerTaskDef(task)
  .then((res) => {
    console.log('Task Registered!');
    console.log(res.taskDefinition.taskDefinitionArn);
  })
  .catch((err) => {
    console.log(err);
  });
}


// main

return ensureAuthenticated()
.then((data) => {
  console.log(`Welcome ${data.User.UserName}!`);
  return port();
})
.then((port) => {
  const usersURL = `${LOAD_BALANCER_DNS}:${port}/users`;
  const moviesURL = `${LOAD_BALANCER_DNS}:${port}/movies`;
  registerUsersTD();
  registerMoviesTD();
  registerWebTD(usersURL, moviesURL);
})
.catch((err) => { console.log(err); });