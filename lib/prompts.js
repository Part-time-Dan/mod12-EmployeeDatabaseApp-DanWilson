// create array of command-line prompts for inquirer package

const appPrompts = [
    {
        type: 'list',
        name: 'mainMenu',
        message: 'Welcome to Employee Tracker!\nWhat would you like to do?',
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add an employee",
            "Update an employee role"
        ]
      },
]

module.exports = appPrompts;