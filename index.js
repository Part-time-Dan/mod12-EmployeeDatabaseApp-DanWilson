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
      employee.manager_id = manager.id 
    ORDER BY manager;`, 
    function (err, results) {
    if (err) {
      console.log(err)
      throw err;
    }
    console.table("\x1b[32m", '\nEMPLOYEE INFORMATION\n', results);
    init();
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
      department.id = role.department_id
  GROUP BY department.id, department.name`,
  function (err,res) { 
    if (err) throw err;

    const departmentList = res.map(({id, name}) => ({
      value: id, name: `${id} ${name}`
    }));

    // console.table(res);
    console.log("Accessing departments");

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
    connection.query(`INSERT INTO role SET ?`, {
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
        case "Add a department":
          makeDeptartment();
          break;
        case "Add a role":
          makeRole();
          break;
        default:
          connection.end()
          process.exit(0)
      }

    })
    .catch((err) => console.log(err));
};
