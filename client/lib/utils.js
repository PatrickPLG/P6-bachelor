const fs = require('fs');
const path = require('path');

function writeToJsonFile(objectData, filePath = path.resolve('renderer/DisplayClient/instructions.json')) {

    // Convert JSON object to string with some formatting
    const jsonData = JSON.stringify(objectData, null, 2);
    console.log(jsonData);

    // Write to file with a specific standard.
    fs.writeFile(filePath, jsonData, 'utf8', (err) => {
        if (err) {
            console.log('An error occurred:', err);
            return;
        }
        console.log(`data.json has been updated`);
    });
}

module.exports = {writeToJsonFile}

/*
Testing the function

const testData = {
    name: "John Doe",
    age: 30
};

// Specify the exact path where the JSON file should be saved
writeToJsonFile(testData);
 */