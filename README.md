# Dark-Olevenbaum

[GitHub](https://github.com/Olevenbaum/Dark-Olevenbaum "GitHub repository for browsing code")

![The "Dark-Olevenbaum"](./resources/profilepicture.png)

To get your bot up and running, just add a `configuration.json` file in the main directory.
The file should be orientated at the following format:

    {
    "applications": [
        {
            "applicationId": "your-application-id",
            "publicKey": "your-public-key",
            "token": "your-token"
        }
    ],
    "consoleSpace": 18,
    "database": {}

}

Feel free to make changes whereever you want and modify this template to make it fit your bot application. If you want to publish an aplication based on this template, make sure to read the license. Please do not hesitate using this template nevertheless, thats what it is for. The license just makes sure that commercial applications based on this template cannot claim these scripts as theirs.
If there are any errors while executing the scripts, please contact me or create an issue and i will try to fix it. I always want this template to work best since i also have some applications based on it.

To control the database and the application commands manually you can use the scripts in the directory `management`. The script `resetCommands.js` will unregister all application commands to then register them again. The script `resetDatabase.js` will delete all data that have been written onto the database and will just reload the data saved in the `.json` files in the directory `database/constantTables`. Both of these scripts do not have to be used before every start of the application, all commands will be updated while starting. For deleting the database while starting you can simply provide the argument `-resetDatabase` while starting the process. This might be useful while testing your application.

There are four predefined scripts you can use to control your application:

-   `npm run commands`: This executes the file `resetCommands.js`.
-   `npm run database`: This executes the file `resetDatabase.js`.
-   `npm run start`: This executes the main file of the application, `application.js`.
-   `npm run test`: This also executes the main file `application.js`, but with the argument `-reset_database` to make testing and debugging easier.

You can provide multiple applications. To specify the application you want to start, simply provide the index of the application as an argument to start the process with `-application <applicationIndex>`. If none is provided, the application at index 0 will be chosen automatically. If the chosen token is invalid, the application will iterate over all application till the first valid token is found.

For further information about initializing a database visit [Sequelize](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor). All listed options at this webpage can be used in the `configuration.json` file aswell. If you do not want to use a database at all, just set the value of database to `false` (or anything other falsy like `null`).

Check out [bit-burger](https://github.com/bit-burger) and the [MoBot](https://github.com/bit-burger/MoBot) or [sarcasticPegasus](https://github.com/sarcasticPegasus) and [playboi](https://github.com/sarcasticPegasus/playboi) which both surely are great Discord bots from great contributers.
