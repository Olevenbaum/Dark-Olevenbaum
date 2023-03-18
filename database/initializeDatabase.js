// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes
const { Collection } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../configuration.json");

// Reading constant tables to be added to database
const templates = new Collection();
const templatesPath = path.join(__dirname, "./constantTables");
const templateFiles = fs
    .readdirSync(templatesPath)
    .filter((file) => file.endsWith(".json"));
for (const file of templateFiles) {
    const template = require(path.join(templatesPath, file));
    templates.set(file.replace(".json", ""), template);
}

module.exports = async (sequelize) => {
    // Checking connection with database
    await sequelize
        .authenticate()
        .then(
            console.info(
                "[INFORMATION]".padEnd(consoleSpace),
                ":",
                "Connection with the database has been established successfully"
            )
        )
        .catch((error) => {
            console.error("[ERROR]".padEnd(consoleSpace), ":", error);
        });

    // Adding models to database
    const models = [];
    const modelsPath = path.join(__dirname, "../database/models");
    const modelFiles = fs
        .readdirSync(modelsPath)
        .filter((file) => file.endsWith(".js"));
    for (const file of modelFiles) {
        require(path.join(modelsPath, file))(sequelize);
        models.push(file.replace(".js", ""));
    }

    // Synchronising models and drop models that have been deleted
    await sequelize
        .sync()
        .then(async () => {
            for (const model in sequelize.models) {
                if (!models.includes(model)) {
                    await sequelize.models[model].drop();
                    console.info(
                        "[INFORMATION]".padEnd(consoleSpace),
                        ":",
                        `Successfully deleted table ${model.tableName} from database`
                    );
                }
            }
        })
        .then(
            // Creating and updating associations
            await require("./initializeAssociations.js")(sequelize)
        )
        .catch((error) =>
            console.error("[ERROR]".padEnd(consoleSpace), ":", error)
        );

    console.info(
        "[INFORMATION]".padEnd(consoleSpace),
        ":",
        "Successfully updated database"
    );
};
