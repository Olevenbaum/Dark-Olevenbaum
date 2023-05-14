// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { Collection } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../configuration.json");

// Reading constant tables to be added to database
const constantTables = new Collection();
const constantTablesPath = path.join(__dirname, "./constantTables");
const constantTableFiles = fs
    .readdirSync(constantTablesPath)
    .filter((file) => file.endsWith(".json"));
for (const file of constantTableFiles) {
    const constantTable = require(path.join(constantTablesPath, file));
    constantTables.set(file.replace(".json", ""), constantTable);
}

module.exports = async (sequelize) => {
    // Checking connection with database
    await sequelize
        .authenticate()
        .then(
            console.info(
                "[INFORMATION]".padEnd(consoleSpace),
                ":",
                "Successfully connected to database"
            )
        )
        .catch((error) => {
            console.error("[ERROR]".padEnd(consoleSpace), ":", error);
        });

    // Adding models to database
    const modelsPath = path.join(__dirname, "../database/models");
    const modelFiles = fs
        .readdirSync(modelsPath)
        .filter((file) => file.endsWith(".js"));
    for (const file of modelFiles) {
        require(path.join(modelsPath, file))(sequelize);
        console.info(
            "[INFORMATION]".padEnd(consoleSpace),
            ":",
            `Successfully added model '${file.replace(".js", "")}'`
        );
    }

    if (modelFiles.length > 0) {
        console.info(
            "[INFORMATION]".padEnd(consoleSpace),
            ":",
            "Successfully added all models to database"
        );
    } else {
        console.info(
            "[INFORMATION]".padEnd(consoleSpace),
            ":",
            `No new models were found`
        );
    }

    // Creating associations
    require("./initializeAssociations.js")(sequelize);

    // Creating array for promises for inserting entities into database
    const promises = [];

    // Synchronising models
    await sequelize
        .sync({ force: process.argv.includes("-reset_database") })
        .then(async () => {
            // Reading data of constant tables
            constantTables.forEach((constantTable, constantTableName) => {
                const model = sequelize.models[constantTableName];
                constantTable.forEach((element) => {
                    promises.push(model.upsert(element));
                });
            });

            // Executing promises
            await Promise.all(promises).catch((error) =>
                console.error("[ERROR]".padEnd(consoleSpace), ":", error)
            );

            if (promises.length > 0) {
                console.info(
                    "[INFORMATION]".padEnd(consoleSpace),
                    ":",
                    "Successfully read all constant data"
                );
            } else {
                console.info(
                    "[INFORMATION]".padEnd(consoleSpace),
                    ":",
                    `No new constant data had to be added to database`
                );
            }
        })
        .catch((error) =>
            console.error("[ERROR]".padEnd(consoleSpace), ":", error)
        );

    if (modelFiles.length > 0 || promises.length > 0) {
        console.info(
            "[INFORMATION]".padEnd(consoleSpace),
            ":",
            "Successfully updated database"
        );
    } else {
        console.info(
            "[INFORMATION]".padEnd(consoleSpace),
            ":",
            `No changes were found in database`
        );
    }
};
