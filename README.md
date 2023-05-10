# Dark-Olevenbaum

[GitHub](https://github.com/Olevenbaum/Dark-Olevenbaum "GitHub repository for browsing code")

![The "Dark-Olevenbaum"](./resources/profilepicture.png)

To get your bot up and running, just add a `configuration.json` file in the main directory.
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

Feel free to make changes whereever you want and modify this template to make it fit your bot application.
If there are any errors while executing the scripts, please contact me or create an issue and i will try to fix it.

You can provide multiple tokens. To specify the application you want to start, simply give the index of the token as an argument to start the process with `-` for executing the file or `-- -` if you use predefined scripts (e.g. `npm run start -- -"token index"`). If none is provided, the token at index 0 will be chosen automaticly. If the chosen token is invalid, the application will iterate over all tokens till the first valid token is found.

For further information about initializing a database visit [Sequelize](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor). All listed options at this webpage can be used in the `configuration.json` file aswell. If you do not want to use a database at all, just set database to `false`.

Check out [bit-burger](https://github.com/bit-burger) and the [MoBot](https://github.com/bit-burger/MoBot) or [sarcasticPegasus](https://github.com/sarcasticPegasus) and [playboi](https://github.com/sarcasticPegasus/playboi) which both surely are great Discord bots from great contributers.
