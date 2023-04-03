# Dark-Olevenbaum

[GitHub](https://github.com/Olevenbaum/Dark-Olevenbaum "GitHub repository for browsing code")

![The "Dark-Olevenbaum"](./resources/profilepicture.png)

To get your bot up and running, just add a configuration.json file in the main directory.
The file should be orientated at the following format:

    {
        {
        "application": {
            "applicationId": "your-application-id",
            "publicKey": "your-public-key",
            "token": "your-application-token"
        },
        "consoleSpace": 18,
        "database": {}
    }

For further information about initializing a database visit [Sequelize](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor). If you do not want to use a database at all, just set database to `false`.

There are three scripts predefined:

-   the start script: `npm run start`. This will start your bot application
-   the command registration script: `npm run commands`. This will register all commands in the directory "./application/slashCommands" at Discord
-   the database script: `npm run database`. This will reset your database and insert the data stored in the .json files in the directory "./database/constantTables".

Both the second and third script should not be used frequently. The bot automaticly refreshes all its commands and the database with every startup. Use these scripts if there are any errors at registering and refreshing the commands or refreshing the database with the start script. In such cases, please contact me and i will try to fix any problems.
