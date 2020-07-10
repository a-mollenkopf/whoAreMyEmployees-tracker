const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "6646023Ava!",
  database: "employeeDB",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  mainMenu();
});

function mainMenu() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "MAIN MENU",
      choices: [
        "View all employees",
        "View all departments",
        "View all roles",
        "Add employee",
        "Add department",
        "Add role",
        "Update employee role",
        "Exit",
      ],
    })
    .then((answer) => {
      // Switch case depending on user option
      switch (answer.action) {
        case "View all employees":
          viewAllEmployees();
          break;

        case "View all departments":
          viewAllDepartments();
          break;

        case "View all roles":
          viewAllRoles();
          break;

        case "Add employee":
          addEmployee();
          break;

        case "Add department":
          addDepartment();
          break;
        case "Add role":
          addRole();
          break;
        case "Update employee role":
          updateEmployeesRole();
          break;
        case "Exit":
          endApp();
          break;
        default:
          break;
      }
    });
}

function viewAllEmployees() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.log(res.length + " employees found!");
    console.table("All Employees:", res);
    mainMenu();
  });
}

function viewAllDepartments() {
  let query = connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table("All Departments:", res);
    mainMenu();
  });
}

function viewAllRoles() {
  let query = connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.table("All Roles:", res);
    mainMenu();
  });
}

function addEmployee() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary, manager.first_name AS manager_first, manager.last_name AS manager_last FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;", 
    function (err, data) {
    const roleArray = data.map((object) => object.title);
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "Employees first name:",
        },
        {
          type: "input",
          name: "last_name",
          message: "Employees last name:",
        },
        {
          type: "list",
          name: "title",
          message: "What is the employees title?",
          choices: roleArray,
        },
      ])
      .then(function (response) {
        let roleID = {};
        for (let i = 0; i < data.length; i++) {
          if (data[i].title === response.title) {
            roleID = data[i];
          }
        }
        const { first_name, last_name } = response;
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: first_name,
            last_name: last_name,
            role_id: roleID.id,
          },
          function (err) {
            if (err) throw err;
            console.log("Your employee has been added!");
            mainMenu();
          }
        );
      });
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDept",
        message: "What department would you like to add?",
      },
    ])
    .then((response) => {
      const { newDept } = response;
      connection.query(
        "INSERT INTO department SET ?",
        {
          department_name: newDept,
        },
        function (err) {
          if (err) throw err;
          mainMenu();
        }
      );
    });
}

function addRole() {
  inquirer
  .prompt([
    {
      type: "input",
      message: "What's the name of the role?",
      name: "roleName"
    },
    {
      type: "input",
      message: "What is the salary for this role?",
      name: "salaryTotal"
    },
    {
      type: "input",
      message: "What is the department id number?",
      name: "deptID"
    }
  ])
  .then(function(answer) {


    connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.roleName, answer.salaryTotal, answer.deptID], function(err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
    });
  });
}

function updateEmployeesRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Which employee would you like to update?",
        name: "eeUpdate"
      },

      {
        type: "input",
        message: "What do you want to update to?",
        name: "updateRole"
      }
    ])
    .then(function(answer) {
      // let query = `INSERT INTO department (name) VALUES ("${answer.deptName}")`
      //let query = `'UPDATE employee SET role_id=${answer.updateRole} WHERE first_name= ${answer.eeUpdate}`;
      //console.log(query);

      connection.query('UPDATE employee SET role_id=? WHERE first_name= ?',[answer.updateRole, answer.eeUpdate],function(err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
      });
    });
  }

function endApp() {
  connection.end();
}
