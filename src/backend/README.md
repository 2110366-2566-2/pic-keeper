# Greetings, backend devs.

---

## Here is some guidance on how to contribute to our repository on GitHub.

Typically, developers will **not** push their code into the `main` branch in GitHub, as this particular branch should be the `ready-for-deployment` branch. When you working on a new feature, it is not yet tested and reviewed by your teammates. As a result, those code will typically are poorly structured and error prone. It is better to create a **new development branch**. </br></br>

In order to develop a function (user-story), you must first create an **issue** in GitHub. After the creation, your issue will be assigned with a number, let's say `#xx`. You can use this number to name your new branch with the command:

```
git checkout -b "$(NAME_OF_YOUR_BRANCH)"
```

I, personally, prefer the convention of naming your branch `(enh/bug)-xx/short-description`. `enh` is used when you develop an new function -- enhancement, while `bug` is used when you do bug fixes.

Therefore, if you are implementing a registration functionality, the name of your branch should be `"enh-xx/registration"`.

On the new branch you can `git add` and `git commit` as usual, and when you push to the remote repository you can simply use

```
git push origin $(NAME_OF_YOUR_BRANCH)
```

After finished, please open a PR (pull request) on GitHub, and ping me or Mek for code reviews.

## Let's move on to the development

## Here is where all the documentation reside, it might help you along the journey.

### Let's begin with all the CLIs (Command-Line Interfaces)

We introduced the functionalities of `MakeFile` to make possible for all the devs to solely focus on API development,
and automate all the infrasturcture processes.

To run `MakeFile` commands, you must be at the `backend` directory (where `MakeFile` resides).

Here are the usecase of each commands:

- `make initdb`: this command will automatically start a `PostgreSQL` container, and connects the application withit. However, please make sure that you have the `Docker` application running, prior to the call of this command. </br> **If this command, somehow, ran into an error, please try execute it again and contact me if the problem still persists.** </br></br>
- `make up`: this command will start the application with `live-reload`, i.e., if you made changes to your code, the application will automatically rebuild and you can seamlessly continue on testing your APIs! </br></br>
- `make clean`: I have configured the database to always **persist** the data, so that in case you need a break, or the application suddenly crashed, your will not lose your data in the database. Hence, the purpose of this command is to let you clear all the data rows **automatically**, in case you messed up and want to clear all the caches, because restarting the application or the database container will not remove any data. </br></br>
- `make new-sql`: This command is to create a new SQL script file to create new tables, alter some table, and etc. Please follow the instructions in command-line to successfully create those files.

### You are ready to go!

---

Next, let's take a look at the steps of how to develop an API:

- Firstly, you must initiate an _endpoint_, take a look at the examples existed in `./internal/cli/serve/serve.go` and append your endpoints right into this file. (we may have some refactor later on). </br></br>
- Next, after you have create an endpoint, you must write a `resolver/handler` to take care of the requests corresponding to that endpoint. These files reside in `./internal/controller/$(specific_folder_name)`. For instance, if you are developing the registration functionality of users, you can go straight into the `user` folder, and initiate a `register.go` file and write your functions there. You can refer to the existed functions to use them as prototypes, and modify them to serve your requirements. </br></br>
- Finally, after you have written the return information and HTTP status, it's time to realise the business logic. To access the database, you can use `r.$(**)UseCase.$(**)Repo` to dive down the layers (from _application_ -> _usecase_ -> _repository_) and access the interface functions that I have written, e.g., `AddOne`, `FindOneById`, etc.

### That's all, happy coding!
