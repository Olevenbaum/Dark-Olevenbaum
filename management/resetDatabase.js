// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { Collection } = require("discord.js");
const { Sequelize } = require("sequelize");

// Importing configuration data
const { consoleSpace, database } = require("../configuration.json");

// Defining collection for constant data
const constantData = new Collection();

// Defining path of constant data
const constantDataPath = path.join(__dirname, "./constantData");

// Reading constant data filenames
const constantDataFiles = fs
    .readdirSync(constantDataPath)
    .filter((file) => file.endsWith(".json"));

// Iterating over constant data files
constantDataFiles.forEach((constantDataFile) => {
    // Reading constant data
    const constantData = require(path.join(constantDataPath, constantDataFile));

    // Adding constant data to its collection
    constantData.set(constantDataFile.replace(".json", ""), constantData);
});

// Initializing database
const sequelize = new Sequelize(database);

// Defining models path
const modelsPath = path.join(__dirname, "../database/models");

// Reading model filenames
const modelFiles = fs
    .readdirSync(modelsPath)
    .filter((file) => file.endsWith(".js"));

// Iterating over model files
modelFiles.forEach((modelFile) => {
    // Executing model script
    require(path.join(modelsPath, modelFile))(sequelize);

    // Printing information
    console.info(
        "[INFORMATION]".padEnd(consoleSpace),
        ":",
        `Successfully added model '${modelFile.replace(".js", "")}'`
    );
});

// Checking if any models were added
if (modelFiles.length > 0) {
    // Printing information
    console.info(
        "[INFORMATION]".padEnd(consoleSpace),
        ":",
        "Successfully added all models to database"
    );
}

// Executing association creation script
require("../database/initializeAssociations.js")(sequelize);

// Creating array of promises for requests to database
const promises = [];

// Forcing syncronisation of database
sequelize
    .sync({ force: true })
    .then(async () => {
        // Iterating over constant data
        constantData.forEach((constantData, constantDataName) => {
            // Searching database for model
            const model = sequelize.models[constantDataName];

            // Adding request to add constant data to model to promises
            constantData.forEach((element) => {
                promises.push(model.upsert(element));
            });
        });

        // Executing promises
        await Promise.all(promises).catch((error) =>
            // Printing error
            console.error("[ERROR]".padEnd(consoleSpace), ":", error)
        );

        // Checking if any requests were made
        if (promises.length > 0) {
            // Printing information
            console.info(
                "[INFORMATION]".padEnd(consoleSpace),
                ":",
                "Successfully read all constant data"
            );
        }
    })
    .catch((error) => {
        // Printing error
        console.error("[ERROR]".padEnd(consoleSpace), ":", error);
    });
