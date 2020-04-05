require('json5/lib/register');
const minimist = require('minimist');
const testCafeRunner = require('./runner');
const config = require('./config.json5');

const runArgs = minimist(process.argv.slice(2), { default: config });

testCafeRunner(runArgs);