// Importing configuration data
const { consoleSpace } = require("../configuration.json");

// Defining funciton for creating an One-To-One association
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
    // Creating one side of the association
    source.hasOne(target, {
        ...options.commonOptions,
        ...options.sourceOptions,
    });

    // Checking if association should be accessible from both models
    if (options.bothsided) {
        // Creating other side of the association
        target.belongsTo(source, {
            ...options.commonOptions,
            ...options.targetOptions,
        });
    }

    // Printing information
    console.info(
        "[INFORMATION]".padEnd(consoleSpace),
        ":",
        `Successfully created a one-to-one association between the models ${source.tableName} and ${target.tableName}`
    );
}

// Defining function for creating an One-To-Many association
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
    // Creating one sid of the association
    source.hasMany(target, {
        ...options.commonOptions,
        ...options.sourceOptions,
    });

    // Checking if association should be accessible from both models
    if (options.bothsided) {
        // Creating other side of association
        target.belongsTo(source, {
            ...options.commonOptions,
            ...options.targetOptions,
        });
    }

    // Printing information
    console.info(
        "[INFORMATION]".padEnd(consoleSpace),
        ":",
        `Successfully created a one-to-many association between the models ${source.tableName} and ${target.tableName}`
    );
}

// Defining function for creating a Many-To-Many association
function manyToMany(
    source,
    target,
    options = {
        commonOptions: {},
        sourceOptions: {},
        targetOptions: {},
    }
) {
    // Setting empty object for common options if none provided
    options.commonOptions = options.commonOptions || {};

    // Checking if name for connection table was provided
    if (!options.commonOptions.through) {
        // Autogenerating name for connection table
        options.commonOptions.through = `${
            source.tableName
        }To${target.tableName[0].toUpperCase()}${target.tableName.slice(1)}`;
    }

    // Creating one side of association
    source.belongsToMany(target, {
        ...options.commonOptions,
        ...options.sourceOptions,
    });

    // Creating other side of association
    target.belongsToMany(source, {
        ...options.commonOptions,
        ...options.targetOptions,
    });

    // Printing information
    console.info(
        "[INFORMATION]".padEnd(consoleSpace),
        ":",
        `Successfully created a many-to-many association between the models ${source.tableName} and ${target.tableName}`
    );
}

module.exports = (sequelize) => {
    // Saving models
    const models = sequelize.models;

    // Creating associations

    // Printing information
    console.info(
        "[INFORMATION]".padEnd(consoleSpace),
        ":",
        "Successfully created all associations"
    );
};
