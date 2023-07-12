
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
            "Exit"
        ]
    },
    
]

const addDepartment = [
    {
        type: 'input',
        name: 'departmentName',
        message: 'Please name the new department:',
    }
]

const addRole = [
    {
        type: 'input',
        name: 'roleTitle',
        message: 'What is the new title?'
    },
    {
        type: 'input',
        name: 'salaryAmount',
        message: 'Enter the salary amount as a number:'
    },
    {
        type: 'list',
        name: 'roleDepartment',
        choice: []
    }

]

const addEmployee = [
    {
        type: 'input',
        name: 'empFirstName',
        message: 'Please enter a first name:'
    },
    {
        type: 'input',
        name: 'empLastName',
        message: 'Please enter a last name:'
    },
    {
        type: 'list',
        name: 'empRole',
        message: 'Please enter the role:',
        choice: []
    },
    {
        type: 'input',
        name: 'empFirstName',
        message: 'Please enter the manager for this employee:'
    },
]

module.exports = { appPrompts,addDepartment,addRole }; 