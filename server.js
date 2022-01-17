const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

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
                'Update An Employee Role',
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

                case 'Update An Employee Role':
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

// ========================== VIEW ALL ========================== //

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

// ========================== ADD TO THE DATABASE ========================== //

// add a new department into the database
function addDepartment() {
    inquirer
        .prompt([
            {
                name: 'new_department',
                type: 'input',
                message: 'What is the name of the new department you would like to add?'
            }
        ])
        // takes the user input and creates a new department_name in the departments table
        .then(answer => {
            var query = 'INSERT INTO departments SET ?';
            db.query(query,
                {
                    department_name: answer.new_department
                });

            console.log('Your new department has been added successfully!');
            promptSelections();
        });
};

// add a new role into the database
function addRole() {
    var query = 'SELECT * FROM departments';

    db.query(query, function(err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'role',
                    type: 'input',
                    message: 'What is the title of the new role you would like to add?'
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'What yearly salary does this role earn? (Number with no punctuation)'
                },
                {
                    name: 'department',
                    type: 'list',
                    choices: function() {
                        var departmentArray = [];
                        for (i = 0; i < res.length; i++) {
                            departmentArray.push(res[i].department_name);
                        }
                        return departmentArray;
                    }
                }
            ])
            .then(answer => {
                let department_id;
                for (i = 0; i < res.length; i++) {
                    if (res[i].department_name === answer.department) {
                        department_id = res[i].id;
                    }
                }
                var query = 'INSERT INTO roles SET ?';
                db.query(query,
                    {
                        title: answer.role,
                        salary: answer.salary,
                        department_id: department_id
                    });
                
                console.log('Your new role has been added successfully!');
                promptSelections();
            });
    })
};

// add a new employee into the database
function addEmployee() {
    var query = 'SELECT * FROM roles';

    db.query(query, function(err, res) {
        if(err) throw err;
        inquirer
            .prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: 'What is the first name of this employee?'
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'What is the last name of this employee?'
                },
                {
                    name: 'employee_role',
                    type: 'list',
                    choices: function() {
                        // create an array to display the role options
                        var roleArray = [];
                        for (i = 0; i < res.length; i++) {
                            roleArray.push(res[i].title);
                        }
                        // show all role options
                        return roleArray;
                    },
                    message: 'What role will this employee have?'
                },
                {
                    name: 'employee_manager',
                    type: 'input',
                    message: 'What is the manager id for this employee?'
                }
            ])
            .then(answer => {
                let role_id;
                for (i = 0; i < res.length; i++) {
                    // taking the role title response and turning it back into the role id for the table
                    if (res[i].title === answer.employee_role) {
                        role_id = res[i].id;
                    }
                }
                // insert the new employee into the table based on user input data
                var query = 'INSERT INTO employees SET ?'
                db.query(query, 
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    manager_id: answer.employee_manager,
                    role_id: role_id
                },
                function (err) {
                    if (err) throw err;
                    console.log('Your new employee has been added successfully!');
                    promptSelections();
                });
            })
    })
};

// ========================== UPDATE AN EMPLOYEE ========================== //

function updateEmployee() {
    var query = 'SELECT * FROM employees';

    db.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        inquirer
            .prompt([
                {
                    name: 'employee_id',
                    type: 'input',
                    message: 'What is the id number for the employee that needs to be updated?'
                },
                {
                    name: 'updated_role',
                    type: 'input',
                    message: 'What is the new role id going to be for this employee?'
                },
            ])
            .then(answer => {
                // insert the new employee into the table based on user input data
                var query = 'UPDATE employees SET role_id = ? WHERE id = ?'
                db.query(query, 
                [
                    answer.updated_role,
                    answer.employee_id
                ],
                function (err) {
                    if (err) throw err;
                    console.log('The role for this employee has been successfully updated!');
                    promptSelections();
                });
            })
    })
};

// ========================== DELETE AN EMPLOYEE ========================== //

function removeEmployee() {
    var query = 'SELECT * FROM employees';

    db.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        inquirer
            .prompt([
                {
                    name: 'delete',
                    type: 'input',
                    message: 'Please enter the id for the employee you would like to remove. (THIS CANNOT BE UNDONE!)'
                }
            ])
            .then(answer => {
                var query = 'DELETE FROM employees where ?';
                db.query(query, 
                {
                    id: answer.delete
                },
                function (err) {
                    if (err) throw err;
                    console.log('The employee has been successfully removed.');
                    promptSelections();
                });
            })
    })
};