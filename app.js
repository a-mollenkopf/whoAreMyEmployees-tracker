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

        case "View all employees by department":
          viewAllDepartments();
          break;

        case "View all employees by role":
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
        case "EXIT":
          endApp();
          break;
        default:
          break;
      }
    });
}

function viewAllEmployees() {
  let query = connection.query(
    "SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.log(res.length + " employees found!");
    console.table("All Employees:", res);
    mainMenu();
  });
}

function viewAllDepartments() {
  let query = connection.query(
    "SELECT * FROM department", function (err, res) {
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
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;

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
          name: "role",
          choices: function () {
            var roleArray = [];
            for (let i = 0; i < res.length; i++) {
              roleArray.push(res[i].title);
            }
            return roleArray;
          },
          message: "What is this employee's role? ",
        },
      ])
      .then(
        function (answer) {
          let roleID;
          for (let i = 0; i < res.length; i++) {
            roleID = res[i].id;
            console.log(roleID);
          }
        },
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: roleID,
          },
          function (err) {
            if (err) throw err;
            console.log("Your employee has been added!");
            mainMenu();
          }
        )
      );
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
    .then(function (answer) {
      connection.query("INSERT INTO department SET ?", {
        name: answer.newDept,
      });
      const query = "SELECT * FROM department";
      connection.query(query, function (err, res) {
        if (err) throw err;
        console.table("All departments:", res);
        mainMenu();
      });
    });
}

function addRole() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "input",
          name: "newRole",
          message: "What is the title of the new role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of this position(Enter a number)",
        },
        {
          type: "rawlist",
          name: "deptChoice",
          choices: function () {
            var deptArray = [];
            for (let i = 0; i < res.length; i++) {
              deptArray.push(res[i].name);
            }
            return deptArray;
          },
        },
      ])
      .then(function (answer) {
        let deptID;
        for (let i = 0; i < res.length; i++) {
          if (res[i].name === answer.deptChoice) {
            deptID = res[i].id;
          }
        }

        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.newRole,
            salary: answer.salary,
            department_id: deptID,
          },
          function (err) {
            if (err) throw err;
            console.log("Your role has been added!");
            mainMenu();
          }
        );
      });
  });
}

function updateEmployeesRole() {}

function endApp() {
  connection.end();
}
