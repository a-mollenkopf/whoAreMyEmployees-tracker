DROP DATABASE IF EXISTS employeeDB;

CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE department (
    id INT auto_increment PRIMARY KEY NOT NULL,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT auto_increment PRIMARY KEY NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(9,2) NOT NULL,
    department_id INT NOT NULL
);

CREATE TABLE employee (
    id INT auto_increment PRIMARY KEY NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT NULL
);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("alexis", "mollenkopf", 1, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("abe", "mcleod", 2, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("carly", "mollenkopf", 3, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("gail", "mollenkopf", 4, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("keith", "mollenkopf", 5, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("chloe", "mcleod", 6, 6);