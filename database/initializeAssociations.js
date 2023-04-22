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
    console.info(
        "[INFORMATION]".padEnd(consoleSpace),
        ":",
        `Successfully created a one-to-one association between the models ${source.tableName} and ${target.tableName}`
    );
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
    console.info(
        "[INFORMATION]".padEnd(consoleSpace),
        ":",
        `Successfully created a one-to-many association between the models ${source.tableName} and ${target.tableName}`
    );
}

// Creating Many-To-Many association
function manyToMany(
    source,
    target,
    options = {
        commonOptions: {},
        sourceOptions: {},
        targetOptions: {},
    }
) {
    options.commonOptions = options.commonOptions || {};
    if (!options.commonOptions.through) {
        options.commonOptions.through = `${
            source.tableName
        }To${target.tableName[0].toUpperCase()}${target.tableName.slice(1)}`;
    }
    source.belongsToMany(target, {
        ...options.commonOptions,
        ...options.sourceOptions,
    });
    target.belongsToMany(source, {
        ...options.commonOptions,
        ...options.targetOptions,
    });
    console.info(
        "[INFORMATION]".padEnd(consoleSpace),
        ":",
        `Successfully created a many-to-many association between the models ${source.tableName} and ${target.tableName}`
    );
}

module.exports = (sequelize) => {
    // Saving models
    const models = sequelize.models;

    // Associations

    console.info(
        "[INFORMATION]".padEnd(consoleSpace),
        ":",
        "Successfully created all associations"
    );
};
