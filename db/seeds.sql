INSERT INTO departments (department_name)
VALUES
('Sales'),
('Engineering'),
('Finance'),
('Human Resources');

INSERT INTO roles (title, salary, department_id)
VALUES
('Head of Sales', 90000, 1),
('Salesperson', 84000, 1),
('Lead Engineer', 108000, 2),
('Assistant Engineer', 95000, 2),
('Accountant', 88000, 3),
('HR Manager', 80000, 4),
('HR Representative', 72000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Jimmy', 'Choo', 1, null),
('Harold', 'Smith', 2, 1),
('Carson', 'Williams', 2, 1),
('Jennifer', 'Thomas', 4, null),
('Taylor', 'Jones', 5, 4),
('August', 'Harrison', 6, null),
('Tyquan', 'Grant', 7, null),
('Victoria', 'Rodriguez', 8, 7);