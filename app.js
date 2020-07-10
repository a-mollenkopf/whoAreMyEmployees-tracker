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

function updateEmployeesRole() {
    connection.query("SELECT * FROM employee", function (err, data) {
      const roleArray = data.map((data) => data.title);
      const arrayOfEmployees = data.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name} `,
        value: id,
      }));
      inquirer
        .prompt([
          {
            type: "list",
            name: "name",
            message: "Which employee would you like to update?",
            choices: arrayOfEmployees,
          },
          {
            type: "list",
            name: "updatedRole",
            message: "What is this employee's updated role?",
            choices: roleArray
          },
         
        ])
        .then((response) => {
          let employeeEl = {};
          for (let i = 0; i < data.length; i++) {
            if (data[i].id === response.updatedRole) {
              employeeEl = data[i].id;
            }
          }
          connection.query(
            `UPDATE employee SET ? WHERE id = ${employeeEl}`,
           
            {
              role: response.updatedRole,
            },
            function (err) {
              if (err) throw err;
              console.log("Employee successfully updated.");
              mainMenu();
            }
          );
        });
    });
  }

function endApp() {
  connection.end();
}
