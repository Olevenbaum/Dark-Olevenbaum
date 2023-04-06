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
            "tokens": [
                "your-application-token"
            ]
        },
        "consoleSpace": 18,
        "database": {}
    }

You can provide multiple tokens. To specify the application you want to start, simply give the index of the token as an argument to start the process with `-` for executing the file or `-- -` if you use predefined scripts (e.g. `npm run start -- -"token index"`). If none is provided, the token at index 0 will be chosen automaticly. If the chosen token is invalid, the next token will be chosen.

For further information about initializing a database visit [Sequelize](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor). All listed options at this webpage can be used in this .json file aswell. If you do not want to use a database at all, just set database to `false`.

There are three scripts predefined:

-   the start script: `npm run start`. This will start your bot application
-   the command registration script: `npm run commands`. This will register all commands in the directory "./application/slashCommands" at Discord
-   the database script: `npm run database`. This will reset your database and insert the data stored in the .json files in the directory "./database/constantTables".

Both the second and third script should not be used frequently. The bot automaticly refreshes all its commands and the database with every startup. Use these scripts if there are any errors at registering and refreshing the commands or refreshing the database with the start script. In such cases, please contact me and i will try to fix any problems.

Check out [bit-burger](https://github.com/bit-burger) and the [Mo-Bot](https://github.com/bit-burger/Mo-Bot) or [sarcasticPegasus](https://github.com/sarcasticPegasus) and [playboi](https://github.com/sarcasticPegasus/playboi).
