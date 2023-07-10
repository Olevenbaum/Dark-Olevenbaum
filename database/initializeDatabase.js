// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { Collection } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../configuration.json");

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

module.exports = async (sequelize) => {
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
    require("./initializeAssociations.js")(sequelize);

    // Creating array of promises for requests to database
    const promises = [];

    // Searching process arguments for force argument
    const force = process.argv.includes("-reset_database");

    // Synchronising database
    await sequelize
        .sync({ force })
        .then(async () => {
            // Checking if force argument was provided
            if (force) {
                // Printing information
                console.info(
                    "[INFORMATION]".padEnd(consoleSpace),
                    ":",
                    "Successfully deleted database"
                );
            }

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
            } else {
                // Printing information
                console.info(
                    "[INFORMATION]".padEnd(consoleSpace),
                    ":",
                    `No new constant data had to be added to database`
                );
            }
        })
        .catch((error) =>
            // Printing error
            console.error("[ERROR]".padEnd(consoleSpace), ":", error)
        );

    // Checking if any models were added or any requests were sent
    if (modelFiles.length > 0 || promises.length > 0) {
        // Printing information
        console.info(
            "[INFORMATION]".padEnd(consoleSpace),
            ":",
            "Successfully updated database"
        );
    } else {
        // Printing information
        console.info(
            "[INFORMATION]".padEnd(consoleSpace),
            ":",
            `No changes were found in database`
        );
    }
};
