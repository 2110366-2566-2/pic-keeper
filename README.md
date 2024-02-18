# pic-keeper

Because Every Memory Deserves the Perfect Photographer Your Match is Here. Parted of 2110336 Software Engineering II

---

---

## Handbook for Developers

Here is the summary for all the command needed for front-end developers to integrate with the existing back-end system.

For more information, please refer to the `./src/backend/README.md`.

---

### Prerequisite:

- Please visit the private repository `mekintown/pic-keeper-private` to retrieve all the configuration files and please put it in `./src/backend/internal/config` directory.

As these configuration files should be kept as a secret, we have `gitignore`d it. Hence, it is your responsibility to retrieve these files yourself and should the files have any update there will be an announcement in our project's discord group.

---

### Before running any command, please `cd` to the `./src/backend` directory.

First, please do initialise the databases. Simply run `make initdb` on the terminal, and wait for the scripts to magically make jobs done.!

After finishing the previous command, please run `make serve` to start up the server.

Now, the back-end server will be available at `localhost:8080/`.

You're good to go!

---

---

Despite the optionality of visiting the full version of the documentation at `./src/backend/README.md`, I strongly recommend you to take a look at it to have a deep understanding of how we, the back-end devs, work and able to solve some trivial problems that may occur.
