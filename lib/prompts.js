
const appPrompts = [
    {
        type: 'list',
        name: 'menu',
        message: 'Welcome to Employee Tracker!\nWhat would you like to do?',
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Update manager an employee reports to",
            "Exit"
        ]
    },
    
]

const addDepartment = [
    {
        type: 'input',
        name: 'departmentName',
        message: 'Please name the new department:'
    }
]


module.exports = { appPrompts,addDepartment }; 