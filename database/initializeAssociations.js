// Importing configuration data
const { consoleSpace } = require("../configuration.json");

// Creating One-To-One association
function oneToOne(
    source,
    target,
    options = {
        bothsided: true,
        commonOptions: {},
        sourceOptions: {},
        targetOptions: {},
    }
) {
    source.hasOne(target, {
        ...options.commonOptions,
        ...options.sourceOptions,
    });
    if (options.bothsided) {
        target.belongsTo(source, {
            ...options.commonOptions,
            ...options.targetOptions,
        });
    }
}

// Creating One-To-Many association
function oneToMany(
    source,
    target,
    options = {
        bothsided: true,
        commonOptions: {},
        sourceOptions: {},
        targetOptions: {},
    }
) {
    source.hasMany(target, {
        ...options.commonOptions,
        ...options.sourceOptions,
    });
    if (options.bothsided) {
        target.belongsTo(source, {
            ...options.commonOptions,
            ...options.targetOptions,
        });
    }
}

// Creating Many-To-Many association
function manyToMany(
    source,
    target,
    options = {
        connectionTable: null,
        commonOptions: {},
        sourceOptions: {},
        targetOptions: {},
    }
) {
    const through =
        options.connectionTable ??
        `${
            source.tableName
        }To${target.tableName[0].toUpperCase()}${target.tableName.slice(1)}`;
    options.sourceOptions.through = through;
    options.targetOptions.through = through;
    source.belongsToMany(target, {
        ...options.commonOptions,
        ...options.sourceOptions,
    });
    target.belongsToMany(source, {
        ...options.commonOptions,
        ...options.targetOptions,
    });
}

module.exports = async (sequelize) => {
    // Saving models
    const models = sequelize.models;

    // Associations

    console.info(
        "[INFORMATION]".padEnd(consoleSpace),
        ":",
        "All associatios have been created"
    );
};
