INSERT INTO department (department_name)
    VALUES ("Sales"),
           ("Engineering"),
           ("Finance"),
           ("Legal");

INSERT INTO roles (title, salary, department_id)
    VALUES ("Sales Lead", 100000, 1),
           ("Salesperson", 80000, 1),
           ("Lead Engineer", 150000, 2),
           ("Software Engineer", 120000, 2),
           ("Account Manager", 160000, 3),
           ("Accountant", 125000, 3),
           ("Legal Team Lead", 250000, 4),
           ("Lawyer", 190000, 4);

INSERT INTO employee ( first_name, last_name, role_id, manager_id)
    VALUES ("John", "Smith", 1, null),
           ("Ben", "Thomas", 2, 1),
           ("Jenny", "Rothlin", 3, null),
           ("Mark", "Anthony", 4, 3),
           ("Ken", "Shelby", 5, null),
           ("Sam", "Williams", 6, 5),
           ("Natasha", "Vogel", 7, null),
           ("Robert", "Barnes", 8, 7);


