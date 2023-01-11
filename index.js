const inquirer = require('inquirer');
const db = require('./config/connection')



const questions = [
  {
    type: 'expand',
    name: 'menu',
    message: "What would you like to do?",
    choices: [
      'View All Employees', 
      'Add Employee', 
      'Update Employee Role',
      'View All Roles',
      'Add Role',
      'View All Departments',
      'Add Department',
      'Quit'
    ]
  }
]

// choose view all employees
// invoke select * from employees

inquirer.prompt(questions)