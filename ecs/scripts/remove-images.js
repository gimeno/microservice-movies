const AWS = require('aws-sdk');

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_USERNAME = process.env.AWS_USERNAME;
const AWS_CONFIG_REGION = process.env.AWS_CONFIG_REGION;

const repos = [
    'microservicemovies/movies-db-review',
    'microservicemovies/movies-service-review',
    'microservicemovies/swagger-review',
    'microservicemovies/users-db-review',
    'microservicemovies/users-service-review',
    'microservicemovies/web-service-review'
];

AWS.config = new AWS.Config();
AWS.config.accessKeyId = AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = AWS_SECRET_ACCESS_KEY;
AWS.config.region = AWS_CONFIG_REGION;

const iam = new AWS.IAM();
const ecr = new AWS.ECR();


function ensureAuthenticated() {
    return new Promise((resolve, reject) => {
        const params = { UserName: AWS_USERNAME };
        iam.getUser(params, (err, data) => {
            if (err) { reject(err); }
            resolve(data);
        });
    });
}

function getImages(repositoryName) {
    return new Promise((resolve, reject) => {
        var params = {
            repositoryName
        };
        ecr.listImages(params, function (err, data) {
            if (err) { reject(err); }
            resolve(data);
        });
    });
}

function deleteImages({ imageIds, repositoryName }) {
    return new Promise((resolve, reject) => {
        var params = {
            imageIds,
            repositoryName
        };
        ecr.batchDeleteImage(params, function (err, data) {
            if (err) { reject(err); }
            resolve(data);
        });
    });
}

return ensureAuthenticated()
    .then((data) => {
        console.log(`Welcome ${data.User.UserName}!`);
        repos.forEach((repoName) => {
            getImages(repoName)
                .then((res) => {
                    if (res.imageIds.length > 0) {
                        deleteImages({imageIds: res.imageIds, repositoryName: repoName })
                    }
                })
                .catch((err) => { console.log(err); });
        });      
    })
    .catch((err) => { console.log(err); });
