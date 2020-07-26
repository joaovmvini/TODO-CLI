var inquirer = require("inquirer");
//var optionsHandler = require("optionsHandler");

inquirer
  .prompt([
    {
      type: "checkbox",
      message: "Options",
      name: "toppings",
      choices: [
        new inquirer.Separator(""),
        {
          name: "Show your tasks",
        },
        {
          name: "Add new Task",
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
    handleOptions(answers);
    console.log(JSON.stringify(answers, null, "  "));
  });
