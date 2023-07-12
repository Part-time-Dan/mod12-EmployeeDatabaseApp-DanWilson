-- get a list of departments to derive array that includes user created departments for roles
SELECT department.id, department.name -- role.salary AS salary

FROM employee

JOIN role ON
    employee.role_id = role.id

JOIN department ON
    department.id = role.department_id

GROUP BY department.id