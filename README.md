# Dark-Olevenbaum

[GitHub](https://github.com/Olevenbaum/Dark-Olevenbaum "GitHub repository for browsing code")

![The "Dark-Olevenbaum"](./resources/profilepicture.png)

To get your bot up and running, just add a configuration.json file in the main directory.
The file should be orientated at the following format:

    {
        {
        "application": {
            "applicationID": "your-application-id",
            "publicKey": "your-public-key",
            "token": "your-application-token"
        },
        "consoleSpace": 18,
        "database": {
            "name": "",
            "password": "",
            "username": ""
        }
    }

There are three scripts predefined:

-   the start script: `npm run start`. This will start your bot application
-   the command registration script: `npm run commands`. This will register all commands in the directory "./application/slashCommands" at Discord
-   the database script: `npm run database`. This will reset your database and insert the data stored in the .json files in the directory "./database/constantTables".
