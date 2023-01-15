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
				'View Total Budget by Department',
				'View employees by manager',
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
					('with employeeData as (SELECT e.id as ID, e.first_name as FirstName, e.last_name as LastName, r.title as Title, d.department_name as Department, r.salary as Salary, e.manager_id from employee e join roles r on e.role_id = r.id join department d on r.department_id = d.id) SELECT ed.ID, ed.FirstName, ed.LastName, ed.Title, ed.Department, ed.Salary, CONCAT(e.first_name, " ", e.last_name) as Manager from employeeData ed left join employee e on ed.manager_id = e.id');
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
				let employeeData = await inquirer.prompt([
					{
						type: 'input',
						name: 'firstName',
						message: "What is the employee's first name?"
					  },
					  {
						type: 'input',
						name: 'lastName',
						message: "What is the employee's last name?"
					  },
					  {
						type: 'list',
						name: 'role',
						message: "What is the employee's role?",
						choices: 
						[
							'Sales lead', 
							'Salesperson', 
							'Lead Engineer',
							'Software Engineer',
							'Account Manager',
							'Accountant',
							'Legal Team Lead',
							'Lawyer',
							'Customer Service' 
						]
					  },
					  {
						type: 'list',
						name: 'manager',
						message: "Who is the employee's manager?",
						choices: 
						[
							'None', 
							'John Smith', 
							'Ben Thomas',
							'Jenny Rothlin',
							'Mark Anthony',
							'Ken Shelby',
							'Sam Williams',
							'Natasha Vogel',
							'Robert Barnes' 
						]
					  }
					])

					let empData = await employeeData;
					const {firstName, lastName, role, manager}  = empData
					const roleID = await connection.execute(`SELECT id from roles where title like '${role}'`) 
					const managerID = await connection.execute(`SELECT id from employee where CONCAT(first_name,' ',last_name) = '${manager}'`) 

					const role_id = roleID[0][0].id;
					const manager_id = managerID[0][0].id;
					  
					const addEmployee = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', '${role_id}', '${manager_id}')`;
					await connection.execute(addEmployee);
					console.log("Employee has been added to the database");
			}
			// Update employee role
			if (answers.option === 'Update Employee Role') {
				let updateEmployeeData = await inquirer.prompt([
					{
						type: 'list',
						name: 'name',
						message: "Which employee's role do you want to update?",
						choices: 
						[
							'John Smith', 
							'Ben Thomas',
							'Jenny Rothlin',
							'Mark Anthony',
							'Ken Shelby',
							'Sam Williams',
							'Natasha Vogel',
							'Robert Barnes' 
						]
					  },
					  {
						type: 'list',
						name: 'role',
						message: "Which role do you want to assign to the selected employee?",
						choices: 
						[
							'Sales lead', 
							'Salesperson', 
							'Lead Engineer',
							'Software Engineer',
							'Account Manager',
							'Accountant',
							'Legal Team Lead',
							'Lawyer',
							'Customer Service' 
						]
					  }
				])
				let empData = await updateEmployeeData;
				const {name, role}  = empData
				
				const empID = await connection.execute(`SELECT id from employee where CONCAT(first_name,' ',last_name) = '${name}'`) 
				const roleID = await connection.execute(`SELECT id from roles where title like '${role}'`) 

				const emp_id = empID[0][0].id;
				const role_id = roleID[0][0].id;

				const updateEmployee = `UPDATE employee SET role_id = '${role_id}' WHERE id = ${emp_id};`;
				await connection.execute(updateEmployee);
				console.log("Updated employee's role");
			}
			// Add department
			if (answers.option === 'Add Department') {
				let departmentData = await inquirer.prompt([
					{
						type: 'input',
						name: 'department',
						message: "What is the name of the department?"
					}
				])
				const {department} = departmentData
				const addDepartment = `INSERT INTO department (department_name) VALUES ('${department}')`;
				await connection.execute(addDepartment);
				console.log(`Added ${department} to the database`);
			}
			// Add role
			if (answers.option === 'Add Role') {
				let roleData = await inquirer.prompt([
					{
						type: 'input',
						name: 'role',
						message: "What is the name of the role?"
					},
					{
						type: 'input',
						name: 'salary',
						message: "What is the salary of the role?"
					},
					{
						type: 'list',
						name: 'department',
						message: "What department does this role belong to?",
						choices: 
						[
							'Sales', 
							'Engineering',
							'Finance',
							'Legal'
						]
					}
				])
				const {role, salary, department} = roleData
				const departmentID = await connection.execute(`SELECT id from department where department_name like '${department}'`) 
				const department_id = departmentID[0][0].id;

				const addRole= `INSERT INTO roles (title, salary, department_id) VALUES ('${role}', '${salary}', '${department_id}')`;
				await connection.execute(addRole);
				console.log(`Added ${role} to the database`);
			}

			// Bonus - View Total Budget by Department
			if (answers.option === 'View Total Budget by Department') {
				let totalBudget = await inquirer.prompt([
					{
						type: 'list',
						name: 'department',
						message: "Which department do you want to view the total budget for?",
						choices: 
						[
							'Sales', 
							'Engineering',
							'Finance',
							'Legal'
						]
					}
				])
				const {department} = totalBudget
				const departmentBudget = await connection.execute(`SELECT sum(salary) as budget from department d join roles r on d.id = r.department_id join employee e on e.role_id = r.id where department_name like '%${department}%'`)
				const department_budget = departmentBudget[0][0].budget;

				console.log(`The total budget utilized for the ${department} department is $${department_budget}`)
			}

			// Bonus - View all employees by anager
			if (answers.option === 'View employees by manager') {
				let employees_manager = await inquirer.prompt([
					{
						type: 'list',
						name: 'manager',
						message: "Which manager do you want to view the employees for?",
						choices: 
						[
							'John Smith', 
							'Jenny Rothlin',
							'Ken Shelby',
							'Natasha Vogel',
						]
					}
				])
				const {manager} = employees_manager
				const [rows] = await connection.execute(`with employeeData as (SELECT e.id as ID, e.first_name as FirstName, e.last_name as LastName, r.title as Title, d.department_name as Department, r.salary as Salary, e.manager_id from employee e join roles r on e.role_id = r.id join department d on r.department_id = d.id) SELECT ed.ID, ed.FirstName, ed.LastName, ed.Title, ed.Department, ed.Salary, CONCAT(e.first_name, " ", e.last_name) as Manager from employeeData ed left join employee e on ed.manager_id = e.id where CONCAT(e.first_name, " ", e.last_name) = '${manager}'`);
				console.table(rows);
			}
		connection.end();
	}
}

promptUser()
