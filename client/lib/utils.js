const fs = require('fs');

function writeToJsonFile(objectData, filePath = '../renderer/DisplayClient/instructions.json') {

    // Convert JSON object to string with some formatting
    const jsonData = JSON.stringify(objectData, null, 2);

    // Write to file with a specific standard.
    fs.writeFile(filePath, jsonData, 'utf8', (err) => {
        if (err) {
            console.log('An error occurred:', err);
            return;
        }
        console.log(`data.json has been updated`);
    });
}


/*
Testing the function

const testData = {
    name: "John Doe",
    age: 30
};

// Specify the exact path where the JSON file should be saved
writeToJsonFile(testData);
 */