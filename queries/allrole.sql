-- display job title, role_id, department of the role, and salary

SELECT  role.title AS Title, 
role.id AS Role_ID,
department.name AS Department,
role.salary AS Salary

FROM business_db.role

JOIN business_db.department
ON business_db.department.id = business_db.role.department_id;
