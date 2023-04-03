// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { Collection } = require("discord.js");
const { Sequelize } = require("sequelize");

// Importing configuration data
const { consoleSpace, database } = require("../configuration.json");

// Creating collection for constant tables
const templates = new Collection();
const templatesPath = path.join(__dirname, "../database/constantTables");
const templateFiles = fs
    .readdirSync(templatesPath)
    .filter((file) => file.endsWith(".json"));
for (const file of templateFiles) {
    templates.set(
        file.replace(".json", ""),
        require(path.join(templatesPath, file))
    );
}

// Creating new sequelize object
const sequelize = new Sequelize(
    database.name,
    database.username,
    database.password,
    {
        dialect: "sqlite",
        storage: "database.sqlite",
    }
);

// Adding models to database
const modelsPath = path.join(__dirname, "../database/models");
const modelFiles = fs
    .readdirSync(modelsPath)
    .filter((file) => file.endsWith(".js"));
for (const file of modelFiles) {
    require(path.join(modelsPath, file))(sequelize);
}

console.info(
    "[INFORMATION]".padEnd(consoleSpace),
    ":",
    "Successfully added all models to database"
);

// Creating associations
require("../database/initializeAssociations.js")(sequelize);

// Forcing syncronisation of database
sequelize
    .sync({ force: true })
    .then(async () => {
        let promises = [];

        // Reading data of constant tables
        templates.forEach((template, templateName) => {
            const model = sequelize.models[templateName];
            template.forEach((element) => {
                promises.push(model.upsert(element));
            });
        });

        // Executing promises
        await Promise.all(promises).catch((error) =>
            console.error("[ERROR]".padEnd(consoleSpace), ":", error)
        );

        console.info(
            "[INFORMATION]".padEnd(consoleSpace),
            ":",
            "Constant tables have been initialized"
        );
    })
    .catch((error) => {
        console.error("[ERROR]".padEnd(consoleSpace), ":", error);
    });
