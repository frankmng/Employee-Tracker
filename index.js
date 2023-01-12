const inquirer = require('inquirer');
const mysql = require('mysql2/promise')
const cTable = require('console.table');
const { exit } = require('process');
require('dotenv').config();

async function promptUser() {
	while(true) {
		// create the connection
		const connection = await mysql.createConnection(
			{
				user: process.env.DB_USER,
				database: process.env.DB_DB,
				password:process.env.DB_PASS,
				host: process.env.DB_HOST,
			},
				console.log('Connected to the employee_db database')
		);
		// get the answers
		const answers = await inquirer.prompt([
			{
				type: 'list',
				name: 'option',
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
		]);
			// exit if use chooses to quit
			if (answers.option === 'Quit') {
				console.log('Quitting');
				exit();
			}
			// view all employees
			if (answers.option === 'View All Employees') {
				const [rows] = await connection.execute
					('with employeeData as (SELECT e.id as ID, e.first_name as FirstName, e.last_name as LastName, r.title as Title, d.department_name as Department, r.salary as Salary, e.manager_id from employee e join roles r on e.role_id = r.id join department d on r.department_id = d.id) SELECT ed.ID, ed.FirstName, ed.LastName, ed.Title, ed.Department, ed.Salary, e.first_name as Manager from employeeData ed left join employee e on ed.manager_id = e.id');
					console.table(rows);
			}
			// view all roles
			if (answers.option === 'View All Roles') {
				const [rows] = await connection.execute
					('SELECT r.id, r.title, d.department_name, r.salary FROM roles r join department d on r.department_id = d.id');
				console.table(rows);
			}
			// view all departments
			if (answers.option === 'View All Departments') {
				const [rows] = await connection.execute('SELECT * FROM department');
				console.table(rows);
			}
			// add new employee
			if (answers.option === 'Add Employee') {
				let emp = await promptEmployee()
				const [rows] = await connection.execute('SELECT * FROM department');
				console.table(rows);
			}

		connection.end();
	}
}

promptUser()