module.exports = async (sequelize) => {
    const models = sequelize.models;

    // Associations for characters
    models.characters.hasOne(models.players);

    models.characters.hasMany(models.features);

    // Associations for dice

    // Associations for features

    // Associations for player
    models.players.hasMany(models.characters);

    models.players.belongsTo(models.sessions);

    models.players.belongsToMany(models.sessions);

    // Association for sessions
    models.sessions.hasOne(models.players, { as: "dungeonmaster" });

    models.sessions.belongsToMany(models.players);

    console.info(
        "[INFORMATION]".padEnd(15),
        ": ",
        "All associatios have been created"
    );
};
