const fs = require("fs");
const dataPath = "./data.json";

function optionsHandler(inquirer, answer) {
  function dataHandler() {
    let userTasks;
    try {
      userTasks = JSON.parse(fs.readFileSync(dataPath, { encoding: "utf-8" }));
    } catch (e) {
      userTasks = { tasks: [] };
      fs.writeFileSync(dataPath, JSON.stringify(userTasks));
    } finally {
      return userTasks;
    }
  }
  function showTasks(type) {
    inquirer.currentState = "show";

    if (type === 2) {
      inquirer.currentState = "delete";
      userTasks.tasks.forEach((task) => (task.checked = false));
    }

    let defaultTask = { name: type === 2 ? "Delete" : "Return" };
    inquirer
      .prompt({
        type: "checkbox",
        message: type === 2 ? "Choose tasks to delete" : "Your tasks",
        name: "tasks",
        choices: [
          ...userTasks.tasks,
          new inquirer.Separator(""),
          defaultTask,
          new inquirer.Separator(""),
        ],
        validate: function (answer) {
          if (inquirer.currentState === "show" && !answer.includes("Return")) {
            return "You must select return to continue";
          } else if (
            inquirer.currentState === "delete" &&
            !answer.includes("Delete")
          ) {
            return "You must select delete to continue";
          }
          return true;
        },
      })
      .then((answers) => {
        userTasks.tasks.forEach((task, index) => {
          if (answers.tasks.includes(task.name)) {
            userTasks.tasks[index].checked = true;
          } else if (!answers.tasks.includes(task.name)) {
            userTasks.tasks[index].checked = false;
          }
        });

        if (type !== 2) fs.writeFileSync(dataPath, JSON.stringify(userTasks));
        else if (answers.tasks.includes("Delete")) {
          let uncheckeds = userTasks.tasks.filter((task) => !task.checked);
          delete require.cache[dataPath];
          let currentData = require(dataPath);
          currentData.tasks = currentData.tasks.filter((task) =>
            uncheckeds.map((task) => task.name).includes(task.name)
          );
          fs.writeFileSync(dataPath, JSON.stringify(currentData));
        }

        if (
          answers.tasks.includes("Return") ||
          answers.tasks.includes("Delete")
        ) {
          inquirer.displayOptions();
        }
      });
  }

  function addTask() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "Describe your task: ",
          name: "task",
          validate: function (value) {
            if (userTasks.tasks.map((task) => task.name).includes(value)) {
              return "This task already exists";
            } else if (value.length < 5) {
              return "Use at least five characters to describe your task";
            }
            return true;
          },
        },
      ])
      .then((answer) => {
        let taskDescription = answer.task;
        userTasks.tasks.push({
          name: taskDescription,
          checked: false,
        });

        fs.writeFileSync(dataPath, JSON.stringify(userTasks));

        inquirer.displayOptions();
      });
  }

  function deleteTask() {
    showTasks(2);
  }

  let userTasks = dataHandler();

  if (answer === "Show your tasks") {
    showTasks(1);
  } else if (answer === "Add new Task") {
    addTask();
  } else if (answer === "Delete a task") {
    deleteTask();
  } else if (answer === "Exit") {
    process.exit(0);
  }
}

module.exports = optionsHandler;
