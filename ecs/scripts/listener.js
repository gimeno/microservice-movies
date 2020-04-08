const AWS = require('aws-sdk');


// globals

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_USERNAME = process.env.AWS_USERNAME;
const AWS_CONFIG_REGION = process.env.AWS_CONFIG_REGION;
const LOAD_BALANCER_ARN = process.env.LOAD_BALANCER_ARN;


// config

AWS.config = new AWS.Config();
AWS.config.accessKeyId = AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = AWS_SECRET_ACCESS_KEY;
AWS.config.region = AWS_CONFIG_REGION;


// init aws services

const elbv2 = new AWS.ELBv2();


// methods

function getPort() {
  return new Promise((resolve, reject) => {
    var params = {
      LoadBalancerArn: LOAD_BALANCER_ARN
    };
    elbv2.describeListeners(params, (err, data) => {
      if (err) { reject(err); }
      const max = data.Listeners.reduce((prev, current) => {
        return (prev.Port > current.Port) ? prev : current;
      });
      if (parseInt(max.Port) === 80) {
        resolve(30000);
      } else {
        const port = parseInt(max.Port) + 1;
        resolve(port);
      }
    });
  });
}


module.exports = {
  getPort
};