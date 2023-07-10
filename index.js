// run command-line app here
const inquirer = require('inquirer')
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
    //   public mysql password
      password: process.env.DB_PASSWORD,
    //   add database name from schema.sql
      database: 'business_db'
    },
    console.log(`Connected to the business_db database.`)
);

const appPrompts = require('./lib/prompts');

function init() {
    inquirer
    .prompt(appPrompts)
    .then((data) => {
        console(data);
    })
};

init();