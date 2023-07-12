-- display job title, role_id, department of the role, and salary

SELECT  role.title AS Title, 
role.id AS Role_ID,
department.name AS Department,
role.salary AS Salary

FROM role

JOIN department
ON department.id = role.department_id;
