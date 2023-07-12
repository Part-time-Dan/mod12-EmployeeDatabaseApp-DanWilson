-- show employee ids, first name, last name, job title, dept, salary, and reporting manager
SELECT
	employee.id AS ID,
	employee.first_name AS "First Name",
    employee.last_name AS "Last Name",
	role.title AS Title,
    department.name AS Department,
    role.salary,
	CONCAT (manager.first_name, " ", manager.last_name) As Manager
    
FROM employee

LEFT JOIN role
	ON employee.role_id = role.id
    
LEFT JOIN department
	ON department.id = role.department_id

LEFT JOIN employee manager 
	ON employee.manager_id = manager.id

ORDER BY
	manager;