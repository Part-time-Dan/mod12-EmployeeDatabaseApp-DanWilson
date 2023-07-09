// run node app here
const inquirer = require('inquirer')
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
    //   public mysql password
      password: '$3qualS3rv3r!',
    //   add database name from schema.sql
      database: ''
    },
    console.log(`Connected to the books_db database.`)
);
