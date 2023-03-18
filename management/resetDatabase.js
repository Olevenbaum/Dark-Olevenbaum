// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes
const { Collection } = require("discord.js");
const { Sequelize } = require("sequelize");

// Importing configuration data
const { database } = require("../configuration.json");

// Creating collection for constant tables
const templates = new Collection();
const templatesPath = path.join(__dirname, "../resources/templates");
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

// Checking connection with database
await sequelize
    .authenticate()
    .then(
        console.info(
            "[INFORMATION]".padEnd(15),
            ": ",
            "Connection with the database has been established successfully"
        )
    )
    .catch((error) => {
        console.error("[ERROR]".padEnd(15), ":", error);
    });

// Adding models to database
const modelsPath = path.join(__dirname, "../database/models");
const modelFiles = fs
    .readdirSync(modelsPath)
    .filter((file) => file.endsWith(".js"));
for (const file of modelFiles) {
    require(path.join(modelsPath, file))(sequelize);
}
console.info(
    "[INFORMATION]".padEnd(15),
    ": ",
    "Successfully added all models to database"
);

// Forcing syncronisation of database
await sequelize
    .sync({ force: true })
    .then(() => {
        let promises = [];

        // Reading data of constant tables
        templates.forEach((template, templateName) => {
            const model = sequelize.models[templateName];
            template.forEach((element) => {
                promises.push(model.upsert(element));
            });
        });

        // Executing promises
        Promise.all(promises)
            .then(
                console.info(
                    "[INFORMATION]".padEnd(15),
                    ": ",
                    "Constant tables have been initialized"
                )
            )
            .catch((error) => console.error("[ERROR]".padEnd(15), ":", error));
    })
    .catch((error) => {
        console.error("[ERROR]".padEnd(15), ":", error);
    });

// Creating associations
await require("../database/initializeAssociations.js")(sequelize);
