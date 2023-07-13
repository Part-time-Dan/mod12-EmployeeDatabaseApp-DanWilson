-- update an employee's role in the employee table
SELECT employee.id AS ID, 
      employee.first_name AS 'First Name', 
      employee.last_name AS 'Last Name', 
      role.title AS Title, 
      department.name AS Department, 
      role.salary AS Salary, 
      CONCAT (manager.first_name, ' ', manager.last_name) As Manager 
    FROM employee 
    LEFT JOIN role ON 
      employee.role_id = role.id 
    LEFT JOIN department ON 
      department.id = role.department_id 
    LEFT JOIN employee manager ON 
      employee.manager_id = manager.id;