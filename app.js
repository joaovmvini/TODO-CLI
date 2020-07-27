var inquirer = require("inquirer");
var optionsHandler = require("./optionsHandler");

inquirer.displayOptions = function () {
  inquirer
    .prompt([
      {
        type: "checkbox",
        message: "Options",
        name: "toppings",
        choices: [
          {
            name: "Show your tasks",
          },
          {
            name: "Add new Task",
          },
          {
            name: "Delete a task",
          },
          {
            name: "Exit",
          },
        ],
        validate: function (answer) {
          if (answer.length > 1) {
            return "You must select just one option";
          }
          return true;
        },
      },
    ])
    .then((answers) => {
      optionsHandler(inquirer, answers.toppings[0]);
    });
};

inquirer.displayOptions();
