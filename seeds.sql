
INSERT INTO department (department_name)
VALUES ("Sales & Marketing"), ("Finance"), ("Operations"), ("Human Resources"), ("Engineering");

INSERT INTO role (title, salary, department_id)
VALUES ("Director of Marketing", 100.000, 1), ("Director of Finance", 100.000, 2), ("Director of Operations", 100.000, 3), ("HR Director", 100.000, 4), ("CTO", 100.000, 5), ("Sales Manager", 75.000, 1), ("Account Manager", 75.000, 2), ("General Manager", 75.000, 3), ("Benefits Manager", 75.000, 4), ("Senior Developer", 75.000, 5), ("Sales Representative", 50.000, 1), ("Account Representative", 50.000, 2), ("Assistant Manager", 50.000, 3), ("Benefits Liason", 50.000, 4), ("Junior Developer", 50.000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jack", "Skellington", 1, null), ("Scott", "Pilgrim", 2, null), ("Ramona", "Flowers", 3, null), ("Knives", "Chau", 4, null), ("Wallace", "Wells", 5, null), ("Envy", "Adams", 6, 1), ("Julie", "Powers", 7, 2), ("Kim", "Pine", 8, 3), ("Gideon", "Graves", 9, 4), ("Stacey", "Pilgrim", 10, 5), ("Matthew", "Patel", 11, 1), ("Roxy", "Richter", 12, 2), ("Lucas", "Lee", 13, 3), ("Todd", "Ingram", 14, 4), ("Stephen", "Stills", 15, 5);


SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary,
manager.first_name AS manager_first, manager.last_name AS manager_last 
FROM employee 
LEFT JOIN role ON employee.role_id = role.id 
LEFT JOIN department ON role.department_id = department.id 
LEFT JOIN employee manager ON manager.id = employee.manager_id;
