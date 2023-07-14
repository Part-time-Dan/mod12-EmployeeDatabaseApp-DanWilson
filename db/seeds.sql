-- Test data tables will go here
INSERT INTO department (name)
VALUES  ("Management"),
        ("Finance"),
        ("Human Resources"),
        ("Technology");

INSERT INTO role (title, salary, department_id)
VALUES  ("CEO", 150000.00, 1),
        ("Accountant", 95000.00, 2),
        ("Purchaser", 75000.00, 2),
        ("HR Generalist", 60000.00, 3),
        ("Software Engineer", 120000.00, 4),
        ("Developer", 80000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Albert", "Wesker", 1, null),
        ("Jill", "Valentine", 2, 1),
        ("Chris", "Boulderpunch", 3, 2),
        ("Leon", "Kennedy", 5, null),
        ("Claire", "Redfield", 6, 4),
        ("Sheva", "Alomar", 4, 1),
        ("Barry", "Burton", 6, 4),
        ("Rebecca", "Chambers", 6, 4);
