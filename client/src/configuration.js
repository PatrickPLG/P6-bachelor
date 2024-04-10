const path = require("path");
const fs = require("fs");
const axios = require("axios");


function checkForInternetConnection() {
    console.log('Checking for internet connection..');
    const interfaces = getNetworkInterfaces();
    for (let osInterface in interfaces) {
        for (let network in interfaces[osInterface]) {
            if (interfaces[osInterface][network].internal === false) {
                console.log('Internet connection available');
                return true;
            }
        }
    }
    console.log('No internet connection available');
    return false;
}

function getNetworkInterfaces() {
    return require('os').networkInterfaces();
}

async function validateConfiguration() {
    console.log('Validating configuration..');
    // Check if client has internet connection
    if (!checkForInternetConnection()) {
        return 'No internet connection available';
    }

    // Check if we have an APPLICATION_ID
    console.log('Checking for application ID..');
    const applicationId = await readCredentialsFromFile()
    if (!applicationId) {
        return 'No_application_ID_found';
    }
    console.log('Application ID found:', applicationId);


    // Add your other checks here
    // If any check fails, return a relevant error message

    // If all checks pass, return null (indicating no error)
    console.log('Configuration validated successfully');
    return null;
}


async function writeCredentialsToFile(credentials) {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'credentials.json');


    return new Promise((resolve, reject) => {


        fs.writeFile(filePath, JSON.stringify(credentials), (err) => {
            if (err) {
                reject(err);
            } else {
                console.log('Credentials written to file:', filePath);
                resolve();
            }
        });
    });

    /*fs.writeFileSync(filePath, JSON.stringify(credentials));
    console.log('Credentials written to file:', filePath);*/
}

async function readCredentialsFromFile() {

    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'credentials.json');

    // check if file exists before attempting to read
    if (!fs.existsSync(filePath)) {
        console.log('Credentials file not found.');
        return null;
    } else {

        const credentials = fs.readFileSync(filePath)
        return JSON.parse(credentials.toString());
    }

}


//TESTING
async function getCredentialsFromServer() {
    return new Promise((resolve, reject) => {
        console.log('Getting credentials from server..');
        const axios = require('axios');

        axios.get('http://localhost:3001/credentials')
            .then((response) => {
                console.log('Credentials received from server:', response.data);
                writeCredentialsToFile(response.data).then(() => {
                    resolve(response.data);
                });
            })
            .catch((error) => {
                reject(error);
            });
    });


}


module.exports = {
    validateConfiguration,
    checkForInternetConnection,
    getCredentialsFromServer,
}