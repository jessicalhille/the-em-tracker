const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// connection to sql 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'SQLpassword1!',
    database: 'employee_tracker'
});

// start up of the sql server/database
db.connect(function (err) {
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

// prompts the user with a list of options to choose from
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
        // based on user selection, one of the functions is triggered
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
                    db.end();
                    break;
            }
        });
};

// displays all the departments in the database
function viewDepartments() {
    var query = `SELECT * FROM departments`;
    db.query(query, function(err, res) {
        if(err) throw err;
        console.log('\n');
        console.log('===========================');
        console.log('= VIEWING ALL DEPARTMENTS =');
        console.log('===========================');
        console.log('\n');
        // renders a table with the response from the .sql files
        console.table(res);
        // re-displays the original list of options
        promptSelections();
    });
};

//displays all the roles in the database
function viewRoles() {
    var query = `SELECT * FROM roles`;
    db.query(query, function(err, res) {
        if(err) throw err;
        console.log('\n');
        console.log('=====================');
        console.log('= VIEWING ALL ROLES =');
        console.log('=====================');
        console.log('\n');

        console.table(res);

        promptSelections();
    });
};

// displays all the employees in the database
function viewEmployees() {
    var query = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary, employees.manager_id
    FROM employees
    LEFT JOIN employees manager ON (manager.id = employees.manager_id)
    INNER JOIN roles ON (roles.id = employees.role_id)
    INNER JOIN departments ON (departments.id = roles.department_id)
    ORDER BY employees.id;`;
    db.query(query, function(err, res) {
        if(err) throw err;
        console.log('\n');
        console.log('=========================');
        console.log('= VIEWING ALL EMPLOYEES =');
        console.log('=========================');
        console.log('\n');

        console.table(res);

        promptSelections();
    });
};

