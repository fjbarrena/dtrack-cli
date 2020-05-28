#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs');
const figlet = require('figlet');
const axios = require('axios');

const apiKey = 'XYugbzOoWp8TOLrMytPoqWtlhR2mCXra';

const PROJECT_AUTO_CREATE = '--auto-create';
const PROJECT_NAME_FLAG = '--project-name';
const PROJECT_VERSION_FLAG = '--project-version';
const DEPENDENCY_TRACKER_SERVER_FLAG = '--server';
const BOM_PATH_FLAG = '--bom-path';
const API_KEY_FLAG = '--api-key';

const checkFlagsAndRun = async (args) => {
    let autoCreate      = getFlagValue(args, PROJECT_AUTO_CREATE, true);
    let projectName     = getFlagValue(args, PROJECT_NAME_FLAG, null);
    let projectVersion  = getFlagValue(args, PROJECT_VERSION_FLAG, null);
    let server          = getFlagValue(args, DEPENDENCY_TRACKER_SERVER_FLAG, null);
    let bomPath         = getFlagValue(args, BOM_PATH_FLAG, null);
    let apiKey          = getFlagValue(args, API_KEY_FLAG, null);

    if(projectName && projectVersion && server && bomPath && apiKey) {
        await run(server, bomPath, apiKey, projectName, projectVersion, autoCreate);
    }
    else {
        console.log(
            chalk.yellow(
                `usage: dtrack-cli [${DEPENDENCY_TRACKER_SERVER_FLAG} <serverBaseUrl>] [${BOM_PATH_FLAG} <bomPath>]\n` +
                `                  [${API_KEY_FLAG} <apiKey>] [${PROJECT_NAME_FLAG} <projectName>]\n` +
                `                  [${PROJECT_VERSION_FLAG} <projectVersion>] [${PROJECT_AUTO_CREATE} <true|false>]`
            )
        );

        console.log(
            chalk.cyanBright(
                `${DEPENDENCY_TRACKER_SERVER_FLAG} \n\t The Dependency Tracker server base url. Example: https://myserver.com \n` +
                `${BOM_PATH_FLAG} \n\t Relative path to the BOM file. This file can be generated by several tools, look here https://cyclonedx.org/. Example: ./bom.xml \n` +
                `${PROJECT_NAME_FLAG} \n\t Name of the project in Dependency Tracker. If not exists and ${PROJECT_AUTO_CREATE} it's setted to true, will be created automatically. Examples: name-without-spaces, "Name with spaces" \n` +
                `${PROJECT_VERSION_FLAG} \n\t Version of the project in Dependency Tracker. If not exists and ${PROJECT_AUTO_CREATE} it's setted to true, will be created automatically. Examples: 1.0, latest, "Rare version with spaces ¯\_(ツ)_/¯" \n` + 
                `${PROJECT_AUTO_CREATE} \n\t If setted to true, and ${PROJECT_NAME_FLAG} + ${PROJECT_VERSION_FLAG} don't exists, automatically create them. Default value is true. Examples: true, false" \n`
            )
        );
    }
   
};

function getFlagValue(args, flagKey, defaultValue) {
    let result = defaultValue;

    const index = args.indexOf(flagKey);

    if(index != -1) {
        result = args[index + 1];
    }

    return result;
}

const run = async (baseUrl, bomPath, apiKey, projectName, projectVersion, autoCreate) => {
    const headers = {
        headers: { 
            'X-Api-Key': apiKey,
            'Content-Type': 'application/json'
        }
    }

    const bom = fs.readFileSync(bomPath);
    const bomBuffer = Buffer.from(bom);
    const bomBase64 = bomBuffer.toString('base64');
        
    const data = {
        autoCreate: autoCreate,
        projectName: projectName,
        projectVersion: projectVersion,
        bom: bomBase64
    }

    try {
        await axios.put(baseUrl + '/api/v1/bom', data, headers);
        console.log(chalk.whiteBright('Done!'));
    }
    catch(ex) {
        console.log(chalk.bgRed('Error uploading bom', ex));
        console.log(chalk.redBright('Review your settings ;)'))
    }
};

console.log(
    chalk.yellow(
        figlet.textSync('dtrack BOM Uploader')
    )
);

console.log(
    chalk.blue(
        'Developed by @DogDeveloper. Show me your love here https://twitter.com/DogDeveloper'
    )
);

const myArgs = process.argv.slice(2);
checkFlagsAndRun(myArgs);


// run('https://zdmp-dtrack.iti.es/', 'bom.xml', 'XYugbzOoWp8TOLrMytPoqWtlhR2mCXra', 'Another Test', 'latest', true);
