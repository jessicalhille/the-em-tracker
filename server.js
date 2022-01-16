const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'SQLpassword1!',
    database: 'employee_tracker'
});

connection.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log(`
    ===============================================================
    
            THE 'EM' TRACKER: an employee management system

    ===============================================================
    `)
    promptSelections();
});

function promptSelections() {
    inquirer
        .prompt({
            type: 'list',
            name: 'welcome',
            message: 'What would you like to do today?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add A Department',
                'Add A Role',
                'Add An Employee',
                'Update An Employee',
                'Remove An Employee',
                'Exit'
            ]
        })
        .then(answer => {
            switch (answer.welcome) {
                case 'View All Departments':
                    viewDepartments();
                    break;

                case 'View All Roles':
                    viewRoles();
                    break;

                case 'View All Employees':
                    viewEmployees();
                    break;

                case 'Add A Department':
                    addDepartment();
                    break;

                case 'Add A Role':
                    addRole();
                    break;

                case 'Add An Employee':
                    addEmployee();
                    break;

                case 'Update An Employee':
                    updateEmployee();
                    break;

                case 'Remove An Employee':
                    removeEmployee();
                    break;

                case 'Exit':
                    connection.end();
                    break;
            }
        });
}



