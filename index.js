const inquirer = require('inquirer');
// const db = require('./config/connection')
const mysql = require('mysql2/promise')
const cTable = require('console.table');
const { existsSync } = require('fs');
const { exit } = require('process');

require('dotenv').config();

const questions = [
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
]

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
				console.log(`Connected to the employee_db database.`)
		);
		
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
			if (answers.option === 'Quit') {
				console.log('Quitting');
				exit();
			}
			if (answers.option === 'View All Employees') {
				const [rows] = await connection.execute('SELECT * FROM employee');
				console.table(rows);
			}
		connection.end();
	}
}

promptUser()