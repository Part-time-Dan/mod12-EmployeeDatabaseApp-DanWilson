-- get a list of departments to derive array that includes user created departments for roles
  SELECT 
    department.id,
    department.name
  FROM employee
  JOIN role ON
      employee.role_id = role.id
  JOIN department ON
      department.id = role.id
  GROUP BY department.id, department.name;