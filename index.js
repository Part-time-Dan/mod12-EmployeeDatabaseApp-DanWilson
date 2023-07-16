// command-line application
const inquirer = require('inquirer')
const mysql = require('mysql2');
require('dotenv').config();
const { appPrompts,addDepartment } = require('./lib/prompts');
require('console.table');

const connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    port:3306,
    //   mysql password
    password: process.env.DB_PASSWORD,
    //   add database name from schema.sql
    database: 'business_db'
});

// connects to db and runs the app
connection.connect(function (err) {
  if(err) {
    console.log(err)
    throw err;
  }
  console.log(`Connected to the business_db database.`)
  init()
})
  
// response displays all departments
function displayDepartment() {
  console.log("Display all Departments")
  connection.query(`SELECT * FROM department;`, function (err, results) {
    if (err) {
      console.log(err)
      throw err;
    }
    console.table("\x1b[32m", '\nDEPARTMENTS\n', results);
    init();
  })
}

// response displays all roles
function displayRoles(){
  console.log("Display all roles")
  connection.query(
  `SELECT  role.title AS Title, 
    role.id AS Role_ID,
    department.name AS Department,
    role.salary AS Salary
  FROM role
  JOIN department ON
    department.id = role.department_id;`, 
  function (err,results) {
    if (err) {
      console.log(err)
      throw err;
    }
    console.table("\x1b[32m", '\nROLES & COMPENSATION\n', results);
    init();
  })
}

// response displays all employees with names of their managers listed
function displayEmployees(){
  console.log("Display all employees")
  connection.query(
    `SELECT employee.id AS ID, 
      employee.first_name AS 'First Name', 
      employee.last_name AS 'Last Name', 
      role.title AS Title, 
      department.name AS Department, 
      role.salary AS Salary, 
      CONCAT (manager.first_name, ' ', manager.last_name) As Manager 
    FROM employee 
    LEFT JOIN role ON 
      employee.role_id = role.id 
    LEFT JOIN department ON 
      department.id = role.department_id 
    LEFT JOIN employee manager ON 
      employee.manager_id = manager.id`, 
    function (err, results) {
    if (err) {
      console.log(err)
      throw err;
    }
    console.table("\x1b[32m", '\nEMPLOYEE INFORMATION\n', results);
    init();
  })
}

// runs the view by manager function in the app
function displayByManager() {
  byManagerQuery();
}

// generates an array of managers only by querying all employees but validating if the employee.id primary key matches value in the manager_id foreign key column
function byManagerQuery() {

  connection.query(
  `SELECT e.id,
  CONCAT(e.first_name, ' ', e.last_name) AS Employee,
  r.title AS Title,
  d.name AS Department

  FROM employee e

  LEFT JOIN role r ON e.role_id = r.id
  LEFT JOIN department d ON r.department_id = d.id
  WHERE e.id IN 

  (SELECT DISTINCT manager_id FROM employee WHERE manager_id IS NOT NULL);`,
  function (err, res) {
    if (err) throw err;

    let managerList = res.map(({id, Employee, Title, Department }) => ({value: id, employee: `${Employee}`, title: `${Title}`, department: `${Department}`}))

    console.log("\x1b[32m","\nDisplaying Managers")
    console.table("\x1b[32m", res);
  
    byManagerPrompt(managerList);
  });
}

// prompts for user to select from the managers array then outputs the query of all employees reporting to that manager
function byManagerPrompt(managerList) {
  inquirer
  .prompt([
    {
      type: 'list',
      name: 'managerId',
      message: 'Select a manager:',
      choices: managerList
      .map((manager) => ({
        value: manager.value,
        name: manager.employee
      }))
    }
  ])
  .then((answer) => {
    console.log(answer);

    const selectedManager = managerList.find(
      (manager) => manager.value === answer.managerId
    );

    connection.query(
    `SELECT employee.id,
    CONCAT(employee.first_name, ' ', employee.last_name) AS Employee,
    role.title AS Title,
    role.salary AS Salary,
    department.name AS Department
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    WHERE employee.manager_id = ?;`, 
    [
      answer.managerId
    ],
    function (err, res) {
      if (err) throw err;

      console.log("\x1b[32m","\nDisplaying Employees of " + "\x1b[33m", selectedManager.employee)
      console.table("\x1b[32m", res);

      init();
    })
  })
}

// response runs prompts to create a new department
function makeDeptartment() {
  inquirer
  .prompt(addDepartment)
  .then(({departmentName}) => {
    connection.query(`INSERT INTO department (name) VALUES (?);`, departmentName, 
    (err,results) =>{
      if (err) {
        console.log(err)
        throw err;
      }
      console.log("\x1b[32m",`\nDepartment \x1b[36m"${departmentName}"\x1b[32m Successfully Added! Select \x1b[37m"View all departments"\x1b[32m to confirm.\n`);
      init();
    } )
  })
}

function makeRole() {
  connection.query(`
  SELECT 
    department.id,
    department.name
  FROM employee
  JOIN role ON
      employee.role_id = role.id
  JOIN department ON
      department.id = role.id
  GROUP BY department.id, department.name`,
  function (err,res) { 
    if (err) throw err;

    const departmentList = res.map(({id, name}) => ({
      value: id, name: `${id} ${name}`
    }));

    console.log("Accessing departments");
    console.table(res);

    rolePrompt(departmentList);
  });
};

// response runs prompts to create a new role
function rolePrompt(departmentList) {
  inquirer
  .prompt([
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
      message: 'Assign role to a department',
      choices: departmentList
  }
  ])
  .then((answer) => {
    connection.query(`INSERT INTO role SET ?`, 
    {
      title: answer.roleTitle,
      salary: answer.salaryAmount,
      department_id: answer.roleDepartment
    }, 
    (err,results) =>{
      if (err) {
        console.log(err)
        throw err;
      }
      console.log("\x1b[32m",`\nNew title \x1b[36m"${answer.roleTitle}"\x1b[32m Successfully Added! Select \x1b[37m"View all roles"\x1b[32m to confirm.\n`);

      init();
    } )
  })
}

// queries role table to display as choice array for the prompt
function addEmployee() {
  connection.query(
    `SELECT role.id, role.title, role.salary
    FROM role`, 
  function (err,res) {
    if (err) throw err;

    const roleList = res.map(({id, title, salary}) => ({
      value: id,
      title: `${title}`,
      salary: `${salary}`
    }))

    console.log("Accessing roles");
    console.table("\x1b[32m", res);

    employeePrompt(roleList);
  })
}

// prompts take user inputs and creates object to add to employee table by schema
function employeePrompt(roleList) {
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Please enter first name:'
  },
  {
      type: 'input',
      name: 'lastName',
      message: 'Please enter last name:'
  },
  {
      type: 'list',
      name: 'empRole',
      message: 'Select a role ID:',
      choices: roleList
  },
  {
      type: 'input',
      name: 'managerId',
      message: "If new employee reports to a manager, enter the manager's employee ID number:",
  }
  ])
  .then((answer) => {
    connection.query(`INSERT INTO employee SET ?`,
    {
      first_name: answer.firstName,
      last_name: answer.lastName,
      role_id: answer.empRole,
      manager_id: answer.managerId
    },
    (err,results) =>{
      if (err) {
        console.log(err)
        throw err;
      }
      console.log("\x1b[32m",`\nNew employee \x1b[36m"${answer.firstName} ${answer.lastName}"\x1b[32m Successfully Added! Select \x1b[37m"View all employees"\x1b[32m to confirm.\n`);

      init();
    });
  });
}

// runs the employee updater 
function updateEmployee() {
  employeeQuery();
}

// queries employee table to help user choose and maps array for prompt choices
function employeeQuery() {
  connection.query(
    `SELECT employee.id, 
      employee.first_name, 
      employee.last_name, 
      role.title AS Title, 
      department.name AS Department, 
      role.salary AS Salary, 
      CONCAT (manager.first_name, ' ', manager.last_name) AS Manager 
    FROM employee 
    LEFT JOIN role ON 
      employee.role_id = role.id 
    LEFT JOIN department ON 
      department.id = role.department_id 
    LEFT JOIN employee manager ON 
      employee.manager_id = manager.id`, 
  function (err,res) {
    if (err) throw err;

    const employeeRoleUpdate = res.map(({id, first_name, last_name}) => ({
      value: id, name: `${first_name} ${last_name}`
    }));

    console.log("Dsiplaying Employees to Update");
    console.table("\x1b[32m", res);

    roleQuery(employeeRoleUpdate);
  });
}

// queries roles table and maps array to display for prompt choices
function roleQuery(employeeRoleUpdate) {

  let roles;

  connection.query(`SELECT role.id, role.title, role.salary FROM role`,
  function (err, res) {
    if (err) throw err;

    roles = res.map(({id, title, salary}) => ({value: id, title: `${title}`, salary: `${salary}`}))

    console.log("Preparing role Update")
    console.table("\x1b[32m", res);
  
    promptUpdateEmployee(employeeRoleUpdate, roles);
  });
}

// runs prompts for updating employee role and queries update to the table
function promptUpdateEmployee(employeeRoleUpdate, roles) {
  inquirer
  .prompt([
    {
      type: 'list',
      name: 'empId',
      message: 'Select employee for new role:',
      choices: employeeRoleUpdate
    },
    {
      type: 'list',
      name: 'roleId',
      message: 'Assign new role:',
      choices: roles
      .map((role) => ({
        value: role.value,
        name: role.title,
      }))
    }
  ])
  .then((answer) => {
    console.log(answer)
    connection.query(`UPDATE employee
    SET role_id = ? 
    WHERE id = ?`, 
    [
      answer.roleId,
      answer.empId
    ],
    function (err, res) {
      if (err) throw err;

      console.table("\x1b[32m", res);
      console.log(res.affectedRows)

      init();
    })
  })
}

// runs the queries and prompts to assign employees different managers
function updateManager() {
  managerQuery();
}

// sets up array of from query of employees and their managers to use to select an employee and then choose a manager for them in the prompt
function managerQuery() {

  let managers;

  connection.query(`SELECT employee.id,
  CONCAT (employee.first_name, ' ', employee.last_name) AS employee,
  role.title,
  CONCAT (manager.first_name, ' ', manager.last_name) AS manager
  FROM employee
  LEFT JOIN role ON
  employee.role_id = role.id
  LEFT JOIN employee manager ON 
  employee.manager_id = manager.id`,
  function (err, res) {
    if (err) throw err;

    managers = res.map(({id, employee, title, manager }) => ({value: id, employee: `${employee}`, title: `${title}`, manager: `${manager}`}))

    console.log("Preparing Manager Update")
    console.table("\x1b[32m", res);
  
    promptChangeManager(managers);
  });
}

// prompts user with the choices and uses the queried arrays to make input simpler and more user friendly
function promptChangeManager(managers) {
  inquirer
  .prompt([
    {
      type: 'list',
      name: 'empId',
      message: 'Select employee to reassign:',
      choices: managers.map((employee) => ({
        value: employee.value,
        name: employee.employee,
      })),
    },
    {
      type: 'list',
      name: 'managerId',
      message: 'Select new manager for chosen employee:',
      choices: managers.map((employee) => ({
        value: employee.value,
        name: employee.employee,
      })),
    }
  ])
  .then((answer) => {
    console.log(answer)
    connection.query(`UPDATE employee
    SET manager_id = ? 
    WHERE id = ?`, 
    [
      answer.managerId,
      answer.empId
    ],
    function (err, res) {
      if (err) throw err;

      console.table("\x1b[32m", res);

      init();
    })
  })
}

// maps user choices in app to the iniital prompt menu
function init() {
  inquirer
    .prompt(appPrompts)
    .then(({ menu }) => {
      switch (menu) {
        case "View all departments":
          displayDepartment();
          break;
        case "View all roles":
          displayRoles();
          break;
        case "View all employees":
          displayEmployees();
          break;
        case "View employees by manager":
          displayByManager();
          break;
        case "Add a department":
          makeDeptartment();
          break;
        case "Add a role":
          makeRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployee();
          break;
        case "Update manager an employee reports to":
          updateManager();
          break;
        default:
          connection.end()
          process.exit(0)
      }

    })
    .catch((err) => console.log(err));
};
