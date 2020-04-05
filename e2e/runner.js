require('json5/lib/register');
const fs = require('fs');
const createTestCafe = require('testcafe');
const glob = require('fast-glob');

module.exports = (runArgs) => {
    console.log('Configuring testCafe...');

    const {
        browser,
        concurrency,
        reportsFolder,
        testFolder,
        selectorTimeout,
        portalToTest,
        quarantineMode
    } = runArgs;

    const reportNameXML = `report.xml`;
    const reportNameHTML = `report.html`;

    process.env.TEST_ENV_URL = portalToTest;

    console.log(`Tests are going to be run in this URL ${process.env.TEST_ENV_URL} and this browser ${browser}`);

    if (!fs.existsSync(reportsFolder)) {
        fs.mkdirSync(reportsFolder);
    }

    const xmlstream = fs.createWriteStream(`${reportsFolder}/${reportNameXML}`);
    const htmlstream = fs.createWriteStream(`${reportsFolder}/${reportNameHTML}`);

    const testFiles = glob.sync(`${testFolder}**`);

    let testcafe = null;
    createTestCafe('localhost', 1237, 1238)
        .then((tc) => {
            testcafe = tc;
            console.log('All set, running testcafe ...');
            return (
                testcafe.createRunner()
                // list multiple test files
                    .src([testFiles])
                    .browsers(browser)
                    .concurrency(concurrency)
                    .reporter([{
                        name: 'xunit',
                        output: xmlstream
                    }, {
                        name: 'html',
                        output: htmlstream
                    }])
                    .screenshots(
                        `${reportsFolder}`,
                        true,
                        // eslint-disable-next-line no-template-curly-in-string
                        'screenshots/${DATE}_${TIME}/${FIXTURE}/${TEST}/test-${TEST_INDEX}.png'
                    )
                    .run({
                        skipJsErrors: true,
                        skipUncaughtErrors: true,
                        selectorTimeout,
                        quarantineMode
                    })
            );
        })
        .then((failedCount) => {
            xmlstream.end();
            htmlstream.end();
            testcafe.close();
            if (failedCount > 0) {
                console.log('##### ERROR ####');
                throw new Error(`Tests failed: ${failedCount}`);
            }
            console.log('All tests were run, bye...');
        });
};
