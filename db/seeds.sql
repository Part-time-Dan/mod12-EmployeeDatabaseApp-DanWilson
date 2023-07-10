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
VALUES  ("Big", "Boss", 1, null),
        ("Second", "Person", 2, 1),
        ("Someone", "Else", 3, 2),
        ("Jane", "Doe", 5, null),
        ("Guy", "Smiley", 6, 4),
        ("Kind", "Stranger", 4, 1),
        ("Snake", "Eyes", 6, 4),
        ("Jill", "Valentine", 6, 4);
